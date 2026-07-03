---
layout: post
title: "Phasing Out pfSense: Building a Smarter Multi-WAN Failover for MikroTik"
description: "Replacing a noisy pfSense x86 Mini-PC with a smart Python-based failover system on MikroTik RB5009UG+S+IN using weighted jury monitoring."
date: 2026-02-14 23:00:00 +0530
categories: [Homelab, Networking, Engineering]
tags: [MikroTik, pfSense, Python, Automation, RouterOS, Multi-WAN, Failover, Network-Monitoring, IPv6, AsyncIO, BGP, Homelab]
image:
  path: /assets/img/headers/mikrotik-multi-wan-failover/pfvsmt.webp
  lqip: data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAABwBACdASoUAAsAPm0skkWkIqGYBABABsS2AE6ZQjuAFJ10o2vM9ZLvgAeIGAD+8X2E7EUsCSmB3E0aJR1iSuXFwU42I2Td/+APvRgfaxT7v+XgfX2kuIAqV1Lbk91hw12cjB3jk2vzRcCcvDGl3yG24R5mV/QQWgAAAA==
---

I was sitting at my desk trying to focus, and the fan noise finally got to me.

It had been there for years: the x86 mini PC running pfSense, sitting in my office, whining away at that specific frequency that drills into your skull after a few hours. It was pulling significant power, generating enough heat to warm the room on its own, and the constant fan drone had become the background soundtrack to my working life.

Sitting right underneath this noisy space heater was my MikroTik RB5009UG+S+IN: a perfectly capable quad-core ARM router that could handle my internet connections without breaking a sweat (or a fan bearing). Silent. Fanless. $200.

For the last few years, my home network was a robust but power-hungry stack: the MikroTik handled the WAN VLAN tagging, PPPoE, NAT, traffic shaping, while the pfSense box on top of it owned the routing decisions, VPN tunnels, DNS filtering, and multi-WAN failover logic.

**It worked. But it was absurd.**

So why did I keep the loud, hot x86 box running for so long?

**Laziness.**

I simply didn't want to learn RouterOS. I knew pfSense back-to-front. I could set up complex multi-WAN failover groups, policy-based routing, and HAProxy in my sleep. Porting all that logic over to MikroTik's "unique" syntax felt like a homework assignment I kept putting off.

But last weekend, I'd had enough. The power draw was wasteful, the heat was unnecessary, and the noise was actively making my office worse. I decided to kill the x86 box. I flattened the topology. I moved everything to the RB5009UG+S+IN. And in the process, I discovered *why* I had been subconsciously avoiding this: MikroTik's native failover mechanisms are... well, primitive.

So I engineered my own.

**Naturally, I had to dig into what RouterOS actually offers and why it falls short.** After spending a week migrating everything, what I found surprised me: the problem isn't that MikroTik is incapable. It's that their failover logic stops at "can I ping the gateway?", which is like checking if your car starts to determine whether the highway is clear.

## The Old "Double Hardware" Architecture

My previous setup was designed for raw power, not efficiency.

The RB5009UG+S+IN has an SFP+ port, and I had an SFP ONT plugged directly into it, taking in fibre from my local cable operator (LCO). Both my ISPs, AS9829 (BSNL) and AS138754 (Kerala Vision), come in over the same physical fibre. The MikroTik tagged the VLANs, dialled PPPoE, handled NAT (Netmap and EIM), shaped traffic with CAKE queues, managed IPv6 prefix delegation, and ran about fifteen scheduled scripts that kept dynamic PPPoE addresses in sync with firewall and NAT rules. Not exactly idle.

But the routing decisions, VPN tunnels, DNS filtering, and failover logic? Those went to the pfSense box. Each ISP's traffic got policy-routed via mangle marks out a dedicated ethernet port to pfSense, which handled the multi-WAN balancing with sixteen different gateway groups (each network segment had its own failover policy), monitored gateway health, ran WireGuard and OpenVPN tunnels, filtered DNS queries through pfBlockerNG, and served DHCP to all the VLANs. The MikroTik did all the heavy lifting on the packet processing side, but pfSense owned the routing table, the failover logic, and the network services layer.


**The Problem?**
1.  **The Noise:** The constant whine of small cooling fans doesn’t exactly help when you’re trying to focus on work.
2.  **The Heat:** In a hot country like India, adding a dedicated space heater to your office is the last thing you need.
3.  **The Energy Use:** Running an x86 CPU just to route packets is inefficient when an ARM chip can do it for 1/10th the wattage.

## The Decision to Simplify

I decided to move the "Brain" back to the MikroTik RB5009UG+S+IN. It *should* be able to accept two WAN connections and failover between them, right?

Well, yes. But also, no.

### The Problem with Traditional RouterOS Failover

MikroTik’s native way of handling failover is `check-gateway=ping`. It pings the ISP's gateway. If it answers, the route is active.

This is naive for two reasons:
1.  **The "Gateway is Fine, Internet is Dead" Scenario:** PPPoE is established, you have gateway IPs, the local link looks healthy, but the actual internet is dead. The ISP's local infrastructure is working fine, but their upstream routing is broken. The gateway answers your pings, but Google won't load.
2.  **Recursive Routing is Binary:** You can set up recursive routing (pinging 8.8.8.8 through the gateway), but it’s a strict UP/DOWN switch. It doesn't understand "packet loss is 25%" or "latency just spiked to 500ms".

*Technical note: You might be thinking "just use Netwatch." Netwatch is better than `check-gateway`, since it can ping arbitrary hosts and trigger scripts. But it's still polling a single target with a simple up/down result. If your one Netwatch target happens to be down for maintenance, congratulations: you just failed over your entire network because Cloudflare went down.*

I didn't want a "backup" connection. I wanted **performance-based routing**. If AS9829 starts dropping 30% of packets, I want to switch to AS138754 *now*, not wait for the connection to fully time out.

## Designing a "Smart Jury" Health Monitor

Since I couldn't rely on RouterOS's internal logic alone, I built an external brain. I kept the router simple (data plane) and moved the decision logic (control plane) to two Alpine Linux LXC containers running on my Proxmox node.

Each ISP gets its own dedicated container: `monitor-bsnl` watches AS9829, `monitor-kv` watches AS138754. Crucially, each container's traffic is pinned to its respective ISP via a no-failover routing rule with a blackhole fallback. If AS9829 goes down, the AS9829 monitor's traffic doesn't silently reroute through AS138754. It just stops. This is by design: you can't accurately measure a link if your measurement traffic is taking a different path.

Each container runs a Python script that acts as a health monitor. But unlike a simple ping-and-pray script, these use a **weighted jury system**.

**The idea is borrowed from distributed consensus systems.** Instead of trusting a single health signal, you poll a quorum of independent witnesses and let them vote. If the majority says the line is dead, it's dead. If one outlier disagrees, it gets outvoted.

### How It Works

Instead of pinging one IP (like 8.8.8.8) and trusting it blindly, the monitor checks **28 IPv4 and 28 IPv6 targets** every 2 seconds. These aren't just random IPs; they are carefully grouped into four "cohorts," each with a specific weight reflecting its reliability and proximity:

1.  **Priority Services** (google.com via ISP-specific CDN edge): **Weight 2.0**. Since I use Google services most heavily - Gmail, Google Meet, Search - the google.com edge IP for each ISP gets the highest weight.
2.  **Anycast DNS & Root Servers** (Google, Cloudflare, Quad9, K/F/L Root Servers): **Weight 1.5**. Multi-PoP anycast infrastructure with Indian PoPs. These rarely go down, and if they start failing alongside everything else, the problem is definitely your link.
3.  **Regional Servers** (AWS, Linode, Vultr, AS55836/AS9498 Ookla Servers): **Weight 1.2**. These test actual regional connectivity and upstream routing.
4.  **ISP Infrastructure** (ISP's DNS Servers and Ookla Servers): **Weight 0.8**. If these fail, the physical link is likely dead. However, ISP infrastructure can be flaky, so this has lower weight to prevent unnecessary failovers when the actual internet (Google, Cloudflare) is still accessible.

Each target also has a custom latency threshold based on its expected performance. The thresholds are calculated dynamically using a helper that applies cohort-specific rounding: under 10ms rounds to next 10; priority/anycast cohorts round to next 10; regional/isp round to next 5. The ping timeout is then threshold × 2.0. This means adding a new target only requires its measured latency and cohort, the threshold auto-calculates.

The logic isn't a simple "if X is down, failover." It's a weighted election.

#### The "Smart Jury" System
For a cohort to be considered "healthy," more than **50% of its targets must pass**. If not, the entire cohort is marked as failing.

But here's where it gets interesting: **Noisy Endpoint Quarantine**.
If a specific target fails **3 times in a row**, it gets **quarantined for 90 seconds**. While in timeout, its vote weight drops to **25%**. This prevents a single flaky server from triggering a false failover.

However (and this took me a while to figure out), if more than half of all targets get quarantined, the system assumes the problem is *local* (not the targets) and resets all quarantines. Without this safety valve, a genuine outage could gradually quarantine every target one by one, leaving the monitor blind to a real problem while it smugly reports "all healthy" because it's ignoring everyone who's actually failing.

#### The Failover Trigger
Failover is instantaneous, but only if two strict conditions are met:
1.  The global weighted health score drops below **0.58**.
2.  **At least 2 out of 4 cohorts** are marked as failing.

This dual-condition check is the magic sauce. If just AWS Mumbai goes down (Regional cohort fails), but the ISP gateway, Google, and Cloudflare are fine? No failover. 

#### Fast Recheck & Hysteresis
Before pulling the trigger on a failover, the script performs a **Fast Recheck**: it randomly selects 5 targets and pings them 3 times each. If 60% pass, it assumes the previous failure was a glitch and aborts the failover.

If the failover proceeds, I use **Hysteresis** to prevent flapping.
- **Failover:** Immediate (once confirmed).
- **Recovery:** Requires **2 consecutive stable readings**, followed by a **30-second hold-down timer**. 

This means even if the line comes back up perfectly, the script first needs to see two healthy check cycles in a row, and *then* starts a 30-second countdown before moving traffic back.

### Controlling MikroTik via API

When the script decides a line is degraded, it logs into the router via the RouterOS API and physically modifies the routing table distance.

```python
def update_route(api, comment: str, is_healthy: bool, metrics: Tuple[float, float],
                 recovery_start_times: dict) -> Tuple[bool, bool]:
    try:
        resource = api.get_resource('/ipv6/route' if ' v6 ' in comment or 'v6 Primary' in comment else '/ip/route')

        routes = resource.get(comment=comment)
        if not routes:
            log(f"CRITICAL: Route '{comment}' not found!")
            return False, False

        if len(routes) > 1:
            log(f"WARNING: Multiple routes match '{comment}', using first")

        route_id = routes[0]['id']
        current_dist = int(routes[0]['distance'])
        loss, lat = metrics

        target_dist = NORMAL_DISTANCE if is_healthy else FAILOVER_DISTANCE

        if current_dist != target_dist:
            if is_healthy:
                # Recovery hold-down prevents flapping back too quickly
                if comment not in recovery_start_times:
                    recovery_start_times[comment] = time.time()
                    log(f"RECOVERY PENDING [{comment}]: Waiting {RECOVERY_HOLD_SECONDS}s hold-down...")
                    return False, False
                elif time.time() - recovery_start_times[comment] < RECOVERY_HOLD_SECONDS:
                    return False, False
                else:
                    log(f"RECOVERY [{comment}]: Loss={loss:.1f}%, Latency={lat:.2f}ms -> Dist {target_dist}")
                    resource.set(id=route_id, distance=str(target_dist))
                    del recovery_start_times[comment]
                    return True, False
            else:
                log(f"FAILOVER [{comment}]: Loss={loss:.1f}%, Latency={lat:.2f}ms -> Dist {target_dist}")
                resource.set(id=route_id, distance=str(target_dist))
                if comment in recovery_start_times:
                    del recovery_start_times[comment]
                return True, True
        else:
            if comment in recovery_start_times:
                del recovery_start_times[comment]

        return False, False

    except Exception as e:
        log(f"API Error updating {comment}: {e}")
        return False, False
```

This direct API control lets me bypass MikroTik's limited `check-gateway` logic for the smart stuff. But here's the important bit: MikroTik's native `check-gateway=ping` failover is still active underneath as a baseline. Each routing table has the other ISP configured as a distance=2 fallback with `check-gateway=ping`. If the PPPoE interface goes down entirely (fibre cut, OLT reboot), MikroTik handles that failover natively within seconds, no Python required. The scripts also check `is_interface_up()` before each cycle and skip gracefully when the interface is down, letting RouterOS do its thing.

*Reality Check: The monitoring containers are still a potential failure point. If both LXC containers die, the router freezes on whatever routing distances were last set. In practice, this is fine; "last known good state" is a reasonable default, and the native check-gateway failover still catches complete link failures. The Python layer only matters for the subtle stuff: partial degradation, upstream routing issues, latency spikes. The kind of problems where the gateway still responds but the internet is effectively dead.*

## The New Config: Clean & Policy Driven

With the "external brain" handling failover, the RouterOS config became incredibly clean. No complex recursive routes, no Netwatch scripts. Just simple routes and policies.

I rely heavily on **Routing Rules** to direct traffic. Each subnet gets pinned to a specific WAN table. My media server always uses AS138754 because that's where my port forwards are set up. My WiFi network default to AS9829, but they'll failover automatically when the script changes the route distance.

Pinning each monitor to a non-failover route keeps the measurement plane isolated from the data plane. The Python layer decides when to failover user traffic, but it can't accidentally migrate its own traffic away from the ISP it's supposed to be watching.

This gives me the best of both worlds: automatic failover for general traffic when an ISP degrades, but forced routing for anything that depends on specific WAN properties (port forwards, static IPs, or the monitors themselves).

## Lessons Learned

### 1. Simple > Clever
My old pfSense setup was "clever". It could do fancy things. But it was fragile. The new setup is "simple". The router routes. The script monitors. If the script crashes? The router keeps routing using the last known good state. If the router crashes? It boots in 15 seconds.

### 2. The AsyncIO Advantage
Writing the monitor in Python with `asyncio` allowed me to ping 56 targets simultaneously every 2 seconds with negligible CPU usage. Each container checks 28 IPv4 and 28 IPv6 targets. A synchronous version would accumulate per-target timeouts, significantly increasing total cycle duration under packet loss conditions. The async version completes in the time of the single slowest response. It's the difference between asking 56 people a question one at a time and shouting it into a room.

### 3. Failover Needs Hysteresis
You cannot just switch on a single bad reading. My script waits for **2 consecutive failure cycles** before switching, and requires **30 seconds of stable health** before switching back (hold-down timer). This is borrowed from how BGP route dampening works in ISP networks: punish flapping routes with exponentially increasing suppression timers. My implementation is simpler, but the principle is identical: **trust takes longer to rebuild than it takes to break.**

### 4. Separation of Concerns Isn't Just a Software Pattern
Keeping the data plane (RouterOS) completely separate from the control plane (Python scripts) means each component is independently debuggable, restartable, and replaceable. I could swap the Python monitor for a Go binary tomorrow without touching a single firewall rule.

## What I'd Do Differently

This isn't a humble-brag post, so here's what's still janky:

1. **Centralised logging**: Right now the scripts log to stdout, which the LXC container captures. I'd love a proper time-series database tracking health scores over time with a Grafana dashboard showing historical failover events overlaid with per-ISP latency graphs. That's a weekend project I haven't gotten to.
2. **External configuration**: The 56 monitoring targets are baked into the Python scripts. If I wanted to add or remove targets, I'd need to edit code and restart the container. A config file or even a simple YAML would be better.
3. **Cross-ISP consensus**: The monitors run in complete isolation. If both AS9829 and AS138754 simultaneously start failing 8.8.8.8, that's probably a target problem, not a link problem. Right now each monitor quarantines the target locally, but if they could talk to each other, they could detect "both ISPs see this failing" and weight it down more aggressively or at least correlate failures to distinguish "the internet is broken" from "my ISP is broken."

## Final Thoughts

I miss the pretty pfSense dashboard. I miss the detailed traffic analysis of ntopng.

But you know what I don't miss? The annoying fan noise. The heat it was dumping.

The network is now an appliance, not a project. The router routes. The scripts watch. The failover is invisible. And that, ironically, is the ultimate goal of a homelab: **building infrastructure so reliable that you forget it exists.**

The Python monitoring scripts can be found on my [GitHub](https://github.com/milindhvijay/mikrotik-smart-jury-failover).

## Acknowledgements

Thanks to [Anurag Bhatia](https://anuragbhatia.com/) for the conversations that shaped this system. If you want to read about his network automations:
- [Event driven automation with Prometheus](https://anuragbhatia.com/post/2025/01/event-driven-automation-with-prometheus/)
- [Distributed latency monitoring](https://anuragbhatia.com/post/2023/07/distributed-latency-monitoring/)

---

*This post covers my specific dual-WAN setup with AS9829 (BSNL) and AS138754 (Kerala Vision) in Kerala, India. Your ISP topology, latency characteristics, and failover requirements will differ. The monitoring thresholds (0.58 health score, 2-cycle confirmation, 30s hold-down) were tuned through trial and error over real-world use, and they're not universal constants. The config assumes RouterOS 7.x.*
