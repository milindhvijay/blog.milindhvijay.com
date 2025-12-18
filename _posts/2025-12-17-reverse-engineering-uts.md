---
layout: post
title: "Reverse Engineering the UTS App: When Over-Engineering Security Breaks UX"
date: 2025-12-17 10:30:00 +0530
categories: [AppDev, Engineering, UX]
tags: [UTS, GPS, Geofencing, Android, CRIS, IndianRailways, KalmanFilter]
image:
  path: /assets/img/headers/reverse-engineering-uts/UTS.webp
  lqip: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAYACgMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APzk/Zw/bh+Jvhn4Q6XoWsDSpfhtcz6v4cP9naDptx40fURZabr90S909p4et9LXSNYvtGtntbJL9re48q5aSe2g1IfK8SZrmWFhmGAwGInDM3gqmI+tT+rrC0aM3VwsZYelUwmLtiYVIOrH2kJ0XKznGcLUYbcM8NZfifq+PzOrUnlsKvsaGHoU5PFzxkVh8RN4qrHF4WE8I6DlTVNfvOaVk461Z/k5421KfXPGfi7Wo9e1Sxj1jxPr+qJZQaTpqQ2aahqt3drawot4FWK3WYRRqoCqiAAACvRwOeY2OCwcatChiascLh41MRWqJVq9RUoKdaqqGFo0VUqyvOao0aVJSk/Z0qcLRXLi+FeHpYvFSjLM6cZYitJU6dSjyU06kmoQ9p7SpyRXux56lSdkuacpXk//2Q==
---

##### Note: The discussion here is based on a [recent tweet by @spinesurgeon](https://x.com/spinesurgeon/status/1988978129701142835){:target="_blank"}.

So I stumbled across this screenshot making the rounds on Twitter (yeah, still calling it Twitter). Someone was attempting to book an unreserved ticket through the UTS app (that's the railway ticketing system we've got here in India), and instead of a ticket, he got hit with possibly the most absurd error message I've seen in a while:

<div align="center">
<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">Your device GPS accuracy is 7 meters. Kindly stand 7 meter away from the railway station/track.</p>&mdash; Spine Surgeon (@spinesurgeon) <a href="https://twitter.com/spinesurgeon/status/1988978129701142835?ref_src=twsrc%5Etfw">November 19, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Here's what it said, word for word:
> *"Your device GPS accuracy is 7 meters. Kindly stand 7 meter away from the railway station/track."*

Posted by **Guru Bruno (@spinesurgeon)**, this tweet absolutely exploded (over 370k views) and clearly struck a nerve with anyone who's ever dealt with Indian Railways' digital infrastructure.

**Naturally, I had to dig into what's actually going on here.** After pulling apart the UTS Android app and reverse-engineering it, I found something that honestly surprised me: this isn't just sloppy development work. It's actually a case of **over-engineering**, where the developers forgot the most important part of the equation: real people trying to catch trains.

## Why Geofencing Exists

Look, credit where it's due: the reasoning behind this GPS feature isn't malicious. Indian Railways rolled out geofencing to tackle a genuine problem: passengers who'd board trains without tickets and only whip out their phones to book one after they spotted a TTE (Travelling Ticket Examiner).

The underlying concept makes sense on paper: **If you're already standing on the platform, you've missed your window to book.**

Thing is, the actual execution is where everything goes sideways.
1.  **The "Platform Ticket" Debate**: As the original poster mentioned in the thread, technically you only need a ticket if you're on the *platform* itself, not just anywhere within station boundaries. Based on the error messages and behaviour, the geofence appears to cover a much larger radius than just the platform area, likely using a station center-point with a generous radius that inadvertently includes parking areas and booking halls. (This is inferred from behaviour; I couldn't confirm the exact geofence boundaries from client-side code alone.)
2.  **The "Monkey Problem"**: Rather than addressing the root verification issue, the system penalises 99% of legitimate passengers to maybe catch 1% of rule-breakers. It literally forces honest commuters to exit the station premises, walk 50-100 meters away (sometimes into pouring rain or traffic), complete their booking, and then walk all the way back.

## Inside the Decompiled Code

I went ahead and reverse-engineered the UTS Android APK (`com.cris.utsmobile`) to understand what's happening under the hood. Turns out the implementation is more sophisticated than I initially expected, yet still fundamentally broken.

### GPS Accuracy Bounds

The application employs multiple location-gathering strategies with **pretty rigid accuracy checks**:

**File:** `HelpToGetRealLocation.java`
```java
public static final double FINE_ACCURACY_MAX = 75.0d;  // Maximum acceptable
public static final double FINE_ACCURACY_MIN = 2.0d;   // Minimum acceptable

public static boolean isAccuracyFine(double d, Context context) {
    return d <= 75.0d && d > 2.0d;
}
```

**So the app demands GPS accuracy between 2 and 75 meters.** Step outside that window:
- **≤ 2 meters**: Gets flagged as a likely **mock/spoofed location** (suspiciously perfect). *Note: This threshold may be overly aggressive for modern dual-frequency GPS devices (most flagship phones since 2018), which can routinely achieve 1-2m accuracy with L5 band support.*
- **> 75 meters**: Tossed out as unreliable

That "7 meters" message from the tweet? Based on the error wording ("stand 7 meter away"), the server appears to be using the GPS accuracy value directly as the required buffer distance. In other words, the buffer equals your reported accuracy, so with 7m accuracy, you need to be at least 7m from the geofence boundary. The app takes your GPS accuracy reading to their backend, which then runs its own distance calculations using this value as a dynamic buffer.

### Multi-Layer Location Validation

Before the app will even consider accepting your location, it runs through:

1. **Accuracy Range Check**: Has to sit between 2-75m
2. **Multiple Samples**: Needs at least **3 separate location readings**
3. **Coordinate Variation Analysis**: Flags identical or suspiciously static coordinates (anti-spoofing measure)
4. **Pattern Detection**: Examines whether accuracy values follow consistent patterns

**File:** `GetCurrentLocation.java`
```java
if (HelpToGetRealLocation.isAccuracyFine((double) this.mCurrentLocation.getAccuracy(), 
    this.mContext) && this.mCountLocation > 2 && 
    !HelpToGetRealLocation.isAnyLastThreeCoordinatesSame(this.mLocationList)) {
    // Accept location
}
```

This is completely opposite of lazy coding. It's actually an **over-engineered anti-spoofing mechanism** that ends up punishing real users who happen to have noisy GPS signals in urban environments.

### Where the Logic Breaks Down

Here's the thing about GPS: it's fundamentally a probability distribution, not some perfect pinpoint. When your phone gets a GPS fix, it's essentially reporting what's called a CEP (Circular Error Probable), which is a confidence radius. Android reports this as the 68% confidence radius, meaning there's roughly a 2-in-3 chance you're actually within that distance of the reported coordinates.

From what I can piece together from the client-side code and error messages, the server-side logic appears to work something like this:

```java
// Actual Client-Side Validation
float gpsAccuracy = location.getAccuracy(); // e.g., 7.0 meters

// Step 1: Client rejects if outside 2-75m range
if (gpsAccuracy <= 2.0 || gpsAccuracy > 75.0) {
    throw new AccuracyException("GPS accuracy invalid");
}

// Step 2: Send to server with booking payload
bookingPayload.append(latitude).append("#")
              .append(longitude).append("#")
              .append(gpsAccuracy).append("#");

// Step 3: Server-side distance check (presumed based on error message wording)
// NOTE: This is inferred from error messages, not confirmed server code
float distanceToStation = calculateDistance(latitude, longitude, stationLocation);
float bufferDistance = gpsAccuracy; // Uses accuracy as safety margin

if (distanceToStation < bufferDistance) {
    throw new GeofenceException("Your device GPS accuracy is " + gpsAccuracy + 
                                " meters. Kindly stand " + gpsAccuracy + 
                                " meter away...");
}
```

**Here's where it breaks down:**

In environments like railway stations (think "urban canyon" scenarios with overhead power lines, metal structures everywhere, concrete blocking signals), multipath interference wreaks havoc on GPS. Your signal bounces around. The app's strict 2-75m client-side filter combined with what appears to be an accuracy-based server-side buffer creates a **compounding penalty**:

1. **Client-side**: Throws out perfectly viable locations with >75m accuracy (common in station environments)
2. **Server-side**: Users with 20m accuracy radius? Move 20m away. Got 50m accuracy? Better walk 50m away from the station.

By tying booking permission directly to raw GPS accuracy numbers, the system essentially asks users to **physically compensate for signal interference**, forcing them to walk further away to satisfy an arbitrary technical metric instead of actually solving the fraud prevention problem they originally set out to address.

## Proper Engineering Fixes

So how do we actually fix this mess? We don't need people walking across highways. We need **signal processing**. The goal here is converting a noisy stream of GPS coordinates into something stable and usable.

### Kalman Filtering for Noise Reduction

**Good News:** The app *already* gathers **3+ location samples** before making any decisions (as evidenced in `GetCurrentLocation.java`).

**Bad News:** Instead of leveraging those samples to **reduce noise**, it only uses them for anti-spoofing validation (checking whether coordinates are suspiciously identical or accuracy patterns look fishy).

The industry-standard approach for smoothing noisy sensor data? The **Kalman Filter**. It's a recursive estimation algorithm that figures out your actual location from incomplete, noisy GPS measurements.

**How It Should Work:**

1.  **Prediction Step**: Based on where you were and how fast you were moving, predict where you ought to be at time `t+1`.
2.  **Update Step**: New GPS reading arrives with its accuracy radius (say, 7m).
3.  **Correction Step**: Fuse the prediction with the actual measurement.
    *   High GPS accuracy (low noise) → Weight the new measurement more heavily
    *   Low GPS accuracy (high noise, like 50m) → Trust your prediction more

**Simplified 1D Conceptual Example:**

The following is a pedagogical example showing the core Kalman Filter concept. For actual GPS tracking, you would need at minimum a 2D filter (latitude/longitude) or ideally a 4D state vector tracking position and velocity.

```java
public class LocationFilter {
    private double estimate = 0.0;
    private double errorCovariance = 1.0;
    private static final double PROCESS_NOISE = 0.1;  // System uncertainty

    public double update(double measurement, double measurementNoise) {
        // Prediction
        double priorEstimate = estimate;
        double priorError = errorCovariance + PROCESS_NOISE;

        // Kalman Gain (trust ratio)
        double K = priorError / (priorError + measurementNoise);

        // Correction
        estimate = priorEstimate + K * (measurement - priorEstimate);
        errorCovariance = (1 - K) * priorError;
        
        return estimate;
    }
}
```

**Impact:** A GPS signal that's jumping erratically between 5m and 50m accuracy would smooth out into a stable trajectory. The server wouldn't see wild fluctuations triggering geofence violations; it would receive statistically smoothed position estimates instead.

*Technical note: Kalman filtering has diminishing returns as error covariance converges. This differs from image stacking, where noise reduces proportionally to √n.*

**Where Current Implementation Falls Short:** The app collects the necessary data but doesn't actually process it meaningfully. It just picks the **single most accurate reading** from the batch:

```java
// From GetCurrentLocation.java
float f = Float.MAX_VALUE;
for (Location next : locationResult.getLocations()) {
    float accuracy = next.getAccuracy();
    if (accuracy < f) {
        location = next;  // Only keeps best single reading
        f = accuracy;
    }
}
```

It's like taking 10 photos in dim lighting and only keeping the sharpest one instead of stacking them to reduce noise. Wasteful.

#### Extended Kalman Filter for Non-Linear Systems

The simplified Kalman Filter I showed above works great for **linear systems** (think: estimating position along a single dimension). But GPS tracking in practice is inherently **non-linear**:

- **We're on a sphere**: Latitude/longitude don't translate linearly to actual distance
- **Velocity matters**: Where you'll be next depends on your current speed and heading
- **Acceleration is a factor**: Someone standing still versus someone walking versus someone in a moving vehicle all have different motion characteristics

Enter the **Extended Kalman Filter (EKF)**. It handles these non-linearities by **linearising** the system at each timestep using **Jacobian matrices** (essentially partial derivatives of your state transition function).

**How EKF Differs:**

Instead of just tracking position, EKF maintains a **state vector** containing both position AND velocity:
```
state = [latitude, longitude, velocity_x, velocity_y]
```

**The Process:**

1. **Predict Step**: Use velocity to forecast where you'll be next (involves non-linear physics). The prediction accounts for the actual time delta between readings. If 2 seconds pass and you're moving at 1 m/s, the prediction adjusts accordingly.
   - Walking north at 1 m/s with a 2-second gap? Predict you'll be 2 meters north
   - Standing still? Velocity decays toward zero over time

2. **Linearisation Step** (the "Extended" part): Calculate a Jacobian matrix to convert the non-linear motion model into a locally linear approximation
   - This lets you apply standard Kalman Filter math to a non-linear system

3. **Update Step**: New GPS reading comes in, fuse it with your prediction based on measurement noise

**Why This Matters for UTS:**

If the app properly implemented EKF:
- **Stationary users** would show rock-solid positions even with 20-50m GPS noise
- **Walking users** would have smooth trajectories instead of jittery coordinates
- **Vehicle detection** would actually work (high sustained velocity = user is on a moving train)
- **Geofence boundaries** could be confidently set at 50m rather than forcing users 100m away

**Current UTS Implementation:**
```java
// What they do: Pick best single reading
location = selectMostAccurate(readings);

// What they should do: Fuse all readings over time
location = ekf.predict();
ekf.update(newReading, reading.getAccuracy());
```

**Reality Check:** Google's Fused Location Provider **already does sophisticated filtering internally**, likely using an Unscented Kalman Filter (UKF) or particle filter, which handle non-linearities even better than EKF without requiring Jacobian computation. The UTS app receives these smoothed location estimates from Android's location stack but then **discards the temporal information** by only examining single snapshots. It's like buying a Ferrari and never shifting out of first gear.

### Hysteresis to Prevent Boundary Flickering

From what I can tell, the current implementation uses a **hard boundary**: a single distance comparison at the exact moment of booking. This causes "flickering" behaviour where users near the geofence edge get randomly blocked or unblocked as GPS drifts naturally.

**Solution:** Implement **Hysteresis** (borrowing from electronics, think Schmitt Trigger circuits) with dual boundaries:

1.  **Outer Boundary (Safe Zone)**: e.g., 100 meters from station center
2.  **Inner Boundary (Danger Zone)**: e.g., 50 meters from station center

**State Machine Logic:**

```java
enum State { UNKNOWN, ALLOWED, BLOCKED }
State currentState = State.UNKNOWN;  // Start in unknown state until first reliable reading

void onLocationUpdate(Location loc) {
    float distance = loc.distanceTo(stationCenter);
    
    // Initialize state on first reliable reading
    if (currentState == State.UNKNOWN) {
        currentState = (distance > 75.0) ? State.ALLOWED : State.BLOCKED;
        return;
    }

    if (currentState == State.BLOCKED) {
        // Must move significantly away to unlock
        if (distance > 100.0) {
            currentState = State.ALLOWED;
        }
    } else {
        // Must move significantly close to lock
        if (distance < 50.0) {
            currentState = State.BLOCKED;
        }
    }
}
```

**Benefits:**
- **50-meter buffer zone** absorbs typical GPS drift (way larger than the usual 5-20m wander)
- Someone standing 75m away doesn't get blocked just because GPS momentarily drifts to 45m
- State only transitions with **sustained** position changes, not momentary noise spikes
- **Unknown initial state** prevents incorrectly blocking users before getting reliable location data

**Current Problem:** The app appears to use GPS accuracy itself as the buffer distance:
```java
// Presumed server logic (inferred from error messages)
if (distanceToStation < gpsAccuracy) { block(); }
```

This creates a **dynamic** buffer (7m accuracy = 7m buffer, 50m accuracy = 50m buffer), which paradoxically punishes users with degraded signals by making them stand even further away. Backwards logic.

### Using Android's GeofencingClient

The app does correctly use Google's **Fused Location Provider** (`GetCurrentLocation.java`), which intelligently combines GPS, Wi-Fi, and cellular tower data. However:

**Current Implementation:**
- Requests location updates every **1 second** with **HIGH_ACCURACY priority**
- Collects multiple readings
- Selects the **single most accurate** reading
- Ships raw accuracy value to server

**Better Implementation:**
- Use Android's native **GeofencingClient API** for entry/exit event detection
- Configure geofence with appropriate **buffer radius** (say, 50m)
- Let the OS handle state transitions (it already performs internal smoothing)
- Don't expose raw accuracy to end users; reserve it for backend fraud detection only

**Actual App Configuration:**
```java
// From GetCurrentLocation.java
private static final long UPDATE_INTERVAL_IN_MILLISECONDS = 1000;      // 1 sec
private static final long FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS = 2500; // 2.5 sec
// NOTE: These values appear inverted; typically FASTEST_UPDATE should be shorter than UPDATE_INTERVAL.
// This could be a bug in the app or the variable names may be misleading.

mLocationRequest = new LocationRequest.Builder(1000)
    .setPriority(100)  // PRIORITY_HIGH_ACCURACY
    .build();  // (simplified, full method shown below)
```

**Several code quality issues stand out here:**

1. **Inverted Variable Names**: `FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS = 2500` is actually *longer* than `UPDATE_INTERVAL_IN_MILLISECONDS = 1000`. In standard usage, the "fastest" interval should be the *shortest* one. This naming is backwards.

2. **Dead Code**: Looking at the actual `createLocationRequest()` method:
   ```java
   private void createLocationRequest() {
       if (this.runTime == 1) {
           this.mLocationRequest = new LocationRequest.Builder(1000).setIntervalMillis(1000)
               .setMinUpdateIntervalMillis(FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS).setPriority(100).build();
       } else {
           this.mLocationRequest = new LocationRequest.Builder(1000).setIntervalMillis(1000)
               .setMinUpdateIntervalMillis(FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS).setPriority(100).build();
       }
   }
   ```
   Both branches of the `if/else` are **completely identical**, rendering the conditional statement pointless.

3. **Unused Constants**: Despite defining `UPDATE_INTERVAL_IN_MILLISECONDS = 1000`, the code **hardcodes `1000` directly** in the `LocationRequest.Builder()` constructor and `setIntervalMillis(1000)` calls instead of actually using the constant.

These aren't showstopper bugs, but they suggest code that was either hastily written, poorly refactored, or cargo-culted from somewhere without full understanding.

The app has all the infrastructure for continuous location monitoring, but it only actually uses location data at **booking time**, not as an ongoing geofence. This explains the error messages: the app doesn't maintain any location state awareness; it only performs a spot-check at the critical moment when you try to complete a booking.

**Recommendation:** Implement **passive geofence monitoring**. The app should continuously detect when you enter or exit the station area, not just check at booking time. Android's GeofencingClient handles this with minimal battery drain.

## The Anti-Spoofing System

Reverse engineering revealed that whoever built this implemented a **pretty comprehensive security system** to prevent location spoofing. Understanding their approach helps explain why user experience took such a hit.

### Detection Methods

**1. Perfect Accuracy Detection**
```java
// From HelpToGetRealLocation.java
if (location.getAccuracy() <= 2.0f) {
    return true;  // Flagged as potential mock location
}
```
This threshold assumes real GPS hardware rarely achieves sub-2-meter accuracy. While this was true for older single-frequency GPS, modern dual-frequency devices with L5 band support can routinely achieve 1-2m accuracy in good conditions. This check may produce false positives on newer flagship devices.

**2. Coordinate Stasis Detection**
The app rejects static or identical coordinates across multiple samples:
```java
!HelpToGetRealLocation.isAnyLastThreeCoordinatesSame(this.mLocationList)
```
If your reported location doesn't vary at least slightly between readings, it's probably spoofed.

**3. Accuracy Pattern Analysis**
```java
public static int isAccuracyDifferenceSame(ArrayList<Location> arrayList) {
    // Checks if accuracy variations follow suspicious patterns
    // Real GPS has random accuracy fluctuations
    // Fake GPS may have artificial consistency
}
```

**4. Multi-Strategy Fallback**
The app employs three different location providers with **varying accuracy requirements**:
- **FusedLocationProvider** (Google Play Services): 2-75m range
- **GPS Provider** (Direct): 2-75m range  
- **Network Provider** (WiFi/Cell): Only requires >2m (more lenient)

This ensures the app works even on devices without Google Play Services, but it also creates additional validation checkpoints that can fail.

### Server Payload

Every single booking request includes:
```java
// From BookJrnySinglePageActivity.java
StringBuilder payload = new StringBuilder();
payload.append(latitude).append("#")
       .append(longitude).append("#")
       .append(gpsAccuracy).append("#")  // The problematic field
       .append(speed).append("#")
       // ... more fields
```

The server receives:
- **Exact coordinates** (latitude/longitude)
- **GPS accuracy** (e.g., 7.0 meters)
- **Speed** (for detecting users in moving vehicles)
- **Device info** (IMEI, Android version, etc.)

This data enables sophisticated server-side fraud detection, but it also generates the problematic "stand X meters away" error when `gpsAccuracy` doesn't satisfy whatever server-side thresholds they've configured.

### Timing Configuration

**Timeouts:**
```java
public static final int G_API_TIME_OUT = 45000;         // 45 seconds
public static final int ONLY_GPS_TIME_OUT = 10000;      // 10 seconds
```

**Location Update Intervals** (as discussed earlier):
```java
private static final long UPDATE_INTERVAL_IN_MILLISECONDS = 1000;      // 1 sec
private static final long FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS = 2500; // 2.5 sec
```

The app aggressively polls for location updates (every 1-2.5 seconds) during the booking flow, which likely contributes to battery drain during extended use. On the flip side, it shows they're genuinely trying to get the best possible reading.

### Collateral Damage

The anti-spoofing measures are **technically sound** from a security perspective, but they cause serious collateral damage:

1. **Too Strict**: 75m upper limit rejects perfectly legitimate readings in urban canyon environments
2. **Wrong Error Messages**: Users see "GPS accuracy is 7 meters" instead of something actionable like "Too close to station boundary"
3. **No Feedback Loop**: The app doesn't guide users on how to improve their signal quality
4. **Single Point in Time**: Only checks at booking moment, not continuously

The developers built Fort Knox to stop ticket fraud, but they forgot to install a usable front door for legitimate customers.

## A Better Design

After digging through the decompiled code, it's obvious the developers built a **genuinely sophisticated anti-spoofing system** featuring:
- Multi-layer validation (accuracy range checks, coordinate analysis, pattern detection)
- Multiple location strategies (GPS, Network, Fused Provider)
- Defense-in-depth architecture

However, all this technical sophistication **completely misses the point**. That tweet wasn't complaining about technical inadequacy but was highlighting **user experience failure**.

### The Core Problem

The app treats **every single user as a potential evader** and dumps raw technical limitations (GPS accuracy metrics) directly into user-facing error messages. Instead of guiding users through the booking process, it just blocks them with messages about "7 meters."

### Visual Indicators Instead of Hard Blocks

Instead of hard-blocking users, **flag suspicious bookings** and let TTEs use their judgment:

1.  **Color-Coded Tickets** (with accessibility considerations; use patterns or icons alongside colors for colorblind users):
    *   **< 2 mins ago**: Red background with warning icon (TTE immediately knows you just booked)
    *   **2-10 mins ago**: Yellow background with caution icon
    *   **> 10 mins ago**: Green background with checkmark icon
2.  **Prominent Booking Time**: Display "Booked At" timestamp in large, bold text
3.  **Booking Location**: Show distance between booking location and current station

If a TTE encounters someone without a ticket who then hurriedly books one on the spot, that **RED background** is an unmistakable signal. The TTE can then decide whether to issue a fine or exercise discretion based on circumstances.

### Why This Works Better

1. **No false positives**: Honest commuters with noisy GPS signals aren't arbitrarily blocked
2. **Visible deterrent**: Would-be evaders know they'll get caught with a bright red ticket
3. **Human discretion**: TTEs can assess context (elderly passenger, genuine technical issues, etc.)
4. **Better UX**: Users understand time-based restrictions way better than GPS accuracy metrics

**The app already collects all this data** (booking timestamp, location, accuracy); it just needs to **display it visually** instead of using it as a hard blocking mechanism.

Sometimes, the best engineering solution isn't writing more code but rethinking the design. The UTS developers built an impressive technical system for fundamentally the wrong problem.

## Takeaways

The UTS app's GPS implementation is a textbook example of a pattern I see constantly in government software: **over-engineering security at the direct expense of usability**.

### What Works

1. **Defense-in-depth**: Multiple validation layers (accuracy range, coordinate analysis, pattern detection)
2. **Anti-spoofing**: Sophisticated detection mechanisms for fake GPS apps (≤2m accuracy flagging, coordinate stasis checks)
3. **Fallback strategies**: Multiple location providers ensure compatibility across different devices
4. **Data collection**: Comprehensive logging for fraud analysis

### What Doesn't

1. **User-facing error messages**: Exposing technical constraints ("GPS accuracy is 7 meters") instead of actionable guidance
2. **Static thresholds**: 2-75m accuracy range is way too strict for urban environments (and 2m threshold may flag legitimate readings on modern dual-frequency GPS devices)
3. **No signal smoothing**: Collecting 3+ samples but only using the single best reading, not averaging or filtering
4. **Hard blocking**: Preventing bookings entirely rather than flagging suspicious ones for review
5. **Wrong problem definition**: Treating honest users as potential criminals by default

### The Bigger Problem

That tweet wasn't really about bad code but about **bad product thinking**. 

The developers prioritised:
- Preventing location spoofing
- Reducing ticket fraud

But neglected:
- Helping users book tickets quickly

The result? A system that makes it **harder for honest users** to book tickets than it is for determined fraudsters to bypass. While the app does check for mock locations and likely sends device attestation data (SafetyNet/Play Integrity), sufficiently motivated bad actors with rooted devices and sophisticated spoofing tools can still circumvent many of these protections, making the strict blocking of legitimate users even more frustrating.

### Lessons

1. **Security without usability is just security theater**: If your anti-fraud system blocks more legitimate users than actual fraudsters, you've failed
2. **Don't dump technical limitations on users**: GPS accuracy is an implementation detail, not something users should have to deal with
3. **Validate your assumptions with real users**: Railway stations are noisy RF environments; you need to test there, not in your air-conditioned office
4. **Consider the full user journey**: A passenger standing in rain trying to catch a train has different needs than your QA tester sitting at a desk
5. **Human-in-the-loop systems work better**: Visual indicators for TTEs to investigate (red tickets) > hard blocks for everyone

### Final Thought

The UTS app serves as a case study in **competent engineering applied to the wrong problem**. The developers built a sophisticated security system that technically functions but practically fails its users.

The fix isn't more complex code but fundamentally rethinking the problem:
- Instead of "How do we prevent all fraud?" ask "How do we help honest users while making fraud visible?"
- Instead of "How accurate is the GPS?" ask "How confident are we about the user's actual location?"
- Instead of "Block suspicious behaviour" try "Flag suspicious behaviour for human review"

**The best technical solution is often no solution at all but just better product design.**

---

*This analysis is based on reverse engineering the UTS Android app (com.cris.utsmobile). The iOS app may have different implementation details. All code snippets are from decompiled sources and are shared for educational/analytical purposes. Server-side behaviour is inferred from client-side code and error messages; actual server implementation may differ.*

*Special thanks to [@spinesurgeon](https://x.com/spinesurgeon) for the original tweet that inspired this investigation.*

