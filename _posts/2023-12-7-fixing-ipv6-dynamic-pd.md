---
layout: post
title: "Hacking My Way Around IPv6 Dynamic PD"
date: 2023-12-27 13:27:11 +0530
categories: [Network, IPv6]
tags: [ipv6, internet, network, prefix, pd, BSNL, Jio, dynamic-pd, isp, AS9829]
image:
  path: /assets/img/headers/fixing-ipv6-dynamic-pd/ipv6.webp
  lqip: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAYACgMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP4lvCOreBYPCcUGteDtT1HUY4r5pdSsfFLaYJ5JnVbBWspNH1CFLeyhaTzUidJ7q5EEpuYoI5rS5+ghh82qU51cJmeHw+HapKOGq5bHEckIxbq2rRxVGbqVZqFnJShTp+0j7OU5QqU/J/tLhGhKjh814YzHH4+DxTqZjhOInl6rVKso/U1LBzyvG0o4fC0nVdSnSnTrYjELD1HiKdGnWw+I8RcfO/IHzNx5aHHJ4rGWspP+8/zJi7Rive0il8Xl6H//2Q==
---

Before delving into the issue at hand, let's talk about IPv6 and Dynamic PD. Imagine the internet as a giant city where every home, store, and office has a unique address. This address is like an IP address, which is how devices on the internet are identified and can communicate with each other.

In the past, the city used IPv4 addresses. These addresses were like street addresses, and they worked well for a while. As the city expanded, the scarcity of these addresses weren't enough to go around. This made it difficult for new devices to get connected to the internet.

## IPv6: A Next-Level Addressing Revolution

IPv6 is like a new addressing system for the city on steroids. It's like using a combination of street addresses, postal codes, and GPS coordinates to make sure that every every device has a unique and identifiable address.

While IPv4 had a limited number of 4.3 billion addresses (4,294,967,296, to be exact), IPv6 is practically limitless. It's like expanding from a quaint village to an intergalactic empire, ensuring every toaster, smartphone, and interstellar spaceship gets its unique code.

## Dynamic PD: The Shape-Shifting Sidekick

Dynamic PD is like the magical real estate agent of the digial world. When you move to a new house, you don't have to get a new street address. Instead, you just tell the postal service your new address, and they will start delivering your mail there. Dynamic PD works the same way. It allows devices to get new IP addresses without having to go through a lot of hassle.

Now let's break down how IPv6 works from both the perspective of an home nework and of an Internet Service Provider:

### IPv6 from the Home Network Side:

1. Router Configuration:

   - The home router receives an IPv6 prefix from the ISP through the Dynamic Prefix Delegation process.

   - The router is configured to handle the dynamic assignment of IPv6 addresses to devices within home network.<br><br>

2. Device Configuration:

   - Devices within the home network, such as computers, smartphones, and IoT appliances, uses Stateless Address Autoconfiguration (SLAAC) or DHCPv6 to obtain IPv6 addresses.

   - SLAAC allows devices to generate their IPv6 addresses by combining the network prefix received in RA messages with locally derived Interface Identifier, typically created from the device's MAC address or through Privacy Extensions.

### IPv6 from the ISP Side:

1. Address Allocation:

   - The ISP is assigned blocks of IPv6 addresses by a regional Internet registry (RIR).
   - These addresses are then distributed to customers based on their needs and the types of service plan they have.

2. Prefix Delegation (PD):

   - ISPs use Prefix Delegation (PD) to assign prefixes to customer premises equipment (CPE).

## Why Is Dynamic PD BAD?

Within the Indian ISP scene, opinions on the normalcy, standardization, and security of a constantly changing delegated IPv6 prefix vary. My ISP (BSNL - AS9829) resets PPP every 24 hours, causing the delegated IPv6 prefix to change accordingly. While this may seem normal, it leads to issues where devices in your home network prefer old IPv6 addresses, resulting in broken IPv6 connectivity.

You can read more about that in here:

[Is your ISP constantly changing the delegated IPv6 prefix on your CPE/router?](https://www.6connect.com/blog/is-your-isp-constantly-changing-the-delegated-ipv6-prefix-on-your-cpe-router/){:target="_blank"}

[ISPs: Simplifying customer IPv6 addressing (Part 1)](https://blog.apnic.net/2017/07/07/isps-simplifying-customer-ipv6-addressing-part-1/){:target="_blank"}

Most users won't notice this as applications often fall back to IPv4. This lack of awareness allows ISPs in India to persist with suboptimal IPv6 configurations.

## What Action Did I Take?

Well, like any normal user I contacted my ISP and I wasn't surprised when these "experts" couldn't understand the issue here. I tried explaining to them why Dynamic PD is bad and how an ISP as big as BSNL should adhere to standards and best practices. It seemed like we both were talking different languages.

I put a halt on pursuing my ISP to fix it and try to find a [Jugaad](https://en.wikipedia.org/wiki/Jugaad){:target="_blank"} to stop IPv6 from breaking every 24-hours. Disabling IPv6 was never an option as I had to fight for months to get it enabled, and that's worth an entire blog post of itself.

1. #### Hack #1 : Using DHCPv6 IA_NA

DHCPv6 is the IPv6 version of DHCP (well, sort of). Within DHCPv6, the Information Request (IA_NA) option serves a specific purpose in the process of obtaining IPv6 addresses for devices.

#### IA_NA (Identity Association for Non-Temporary Addresses):

IA_NA is a key option within DHCPv6 used for obtaining non-temporary(i.e., stable) IPv6 addresses for a device. While SLAAC is stateless and provide temporary addresses, DHCPv6 IA_NA offers a stateful mechanism for obtaining stable addresses. Unlike temporary addresses generated by SLAAC, DHCPv6 IA_NA does not keep and use stale IPv6 addresses after ISP dynamically change IPv6 prefix.<br>

This solution comes with a caveat; [Android devices don't support DHCPv6.](https://issuetracker.google.com/issues/36949085){:target="_blank"}<br>

2. #### Hack #2 : Changing Router Advertisement Timers

The reason why I call changing RA Timers a "Juagaad" is because it works but I am probably breaking a bunch of RFCs doing it. <br>

My pfSense firewall comes with these default values:<br>

```
  Valid Lifetime : 86400 seconds
  Preferred Lifetime : 14400 seconds
```

The current setup that works for me now is:

```
  Valid Lifetime : 7200 seconds
  Preferred Lifetime : 60 seconds
```

<br>This is the least pfSense will let me go down on RA Timers. This approach, though effective, generates network noise and may impact device battery life.

Presently, if my ISP changes the PD, my devices will adopt new addresses, and the old ones will be deprecated.

![ifconfig en0](/assets/img/posts/fixing-ipv6-dynamic-pd/ifconfig.webp)_ifconfig en0_

Despite my efforts, convincing my ISP (AS9829) to follow [BCOP-690](https://www.ripe.net/publications/docs/ripe-690){:target="_blank"} and provide a /56 static PD for residential users has proven challenging. State-owned ISPs often prioritize policy-based engineering over engineering-based policies, a topic for another blog post.

As of now, no major telcos or ISPs in India implement static PD to my knowledge. If and when it happenss, I predict Jio (AS55836) to likely be the first.

## Conclusion

Transitioning to IPv6 and dealing with Dynamic PD nuances has become a key part of the experience. As seen, the advantages of more addresses and smoother connectivity come with their share of challenges, especially when ISPs don't adhere to standards and best practices.

The hacks discussed here are a result of struggles with ISP configuartions, showcasing the everyday user's need for stability. While pushing for industry standards like BCOP-690 is an ideal vision today, the reality, especially when state-owned ISPs, tend to follow policies over practicality.

As we tread through the unexplored areas of IPv6 in India, the hope is that awareness grows, and companies like Jio lead the way in adopting reliable IPV6 practices.
