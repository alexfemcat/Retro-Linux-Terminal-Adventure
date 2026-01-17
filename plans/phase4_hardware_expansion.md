# Subplan: Phase 4 - Hardware Simulation & Bottlenecks (Expanded)

This subplan expands upon Phase 4 of the [Retro-Linux-Terminal-Adventure v2.0 Development Plan](../retrolinux-dev-plans/Retro-Linux-Terminal-Adventure%20v2.0%20Development%20Plan.md). It focuses on making hardware choices impactful through deep simulation of CPU, RAM, and Thermal systems.

## 🎯 Objectives
- Make hardware upgrades feel necessary for high-level missions.
- Introduce risk/reward mechanics via overclocking and voltage management.
- Implement strict resource management (RAM) and multitasking limits.

---

## 🏗️ Technical Specifications

### 1. CPU: Computational Throughput
- **Logic**: All time-consuming commands (`nmap`, `crack`, `download`) must use a unified delay calculation.
- **Formula**: `effectiveSpeed = clockSpeed * cores * overclockMultiplier`
- **Throttling**: If `systemHeat > 80%`, `effectiveSpeed` is halved to prevent hardware damage.
- **Implementation**: Create `HardwareService.ts` with `calculateProcessDelay(baseTime, playerState, globalState)`.

### 2. RAM: The Multitasking & Swapping System
- **Process Slots & Memory Usage**:
    - Each active hacking command (background processes) consumes physical RAM.
    - `nmap`: 1GB, `hydra`: 2GB, `download`: 0.5GB.
- **RAM Thrashing**:
    - If total RAM usage exceeds `hardware.ram.capacity`, the system enters "Swap Mode."
    - All system processes (including terminal input/output) slow down by 80%.
- **Command**: `memstat` or `top` to view active RAM allocation.
- **Command**: `kill <pid>` to manually terminate processes and free RAM.

### 3. Cooling & Advanced Overclocking 2.0
- **Heat Mechanics**:
    - `currentHeat`: 0% to 100%.
    - `passiveHeat`: +0.2%/s per active process.
    - `overclockHeat`: +2.5%/s (while Overclock is ON).
    - `dissipation`: -[coolingLevel * 0.75]%/s.
- **Voltage Control**:
    - `overclock set <voltage>` (1.0v to 1.5v).
    - Higher voltage = higher `overclockMultiplier` but exponential heat growth.
- **Failure States**:
    - `80% Heat`: "THERMAL THROTTLING ACTIVE" (Yellow alert).
    - `95% Heat`: "CRITICAL TEMPERATURE" (Red blinking alert).
    - `100% Heat`: System Crash. 50% chance of "Component Degradation" (random hardware component loses 1 level permanently until repaired).

### 4. UI/UX Requirements
- **Status Bar Updates**:
    - Add `TEMP: [||||||....] 45°C`
    - Add `RAM: [||||........] 4/8 GB`
- **Audio/Visual**:
    - Overclocking should trigger a "fan whirring" ASCII animation or CSS pulse effect.
    - Crashing triggers a Blue Screen of Death (BSOD) TUI.

---

## 📝 Implementation Todo List

### Phase 4.1: Core Simulation Engine
- [ ] Create `services/HardwareService.ts` to centralize all hardware-based calculations.
- [ ] Update `PlayerState` in `types.ts` to include `systemHeat` and currently used `ram`.
- [ ] Implement a global heartbeat in `App.tsx` to handle heat dissipation and process resource tracking.

### Phase 4.2: Command Refactoring
- [ ] Refactor time-based commands to use `HardwareService` for delay.
- [ ] Implement `overclock` and `voltage` commands in `Terminal.tsx`.
- [ ] Implement `memstat` and update `ps`/`kill` logic to interact with RAM.

### Phase 4.3: Failure & Maintenance
- [ ] Implement the "System Crash" sequence (BSOD effect).
- [ ] Implement hardware degradation logic (stat reduction on overheat).
- [ ] Add "Repair" option to `market` command for degraded components.

### Phase 4.4: UI Integration
- [ ] Update `Terminal` Status Bar to show Heat and RAM usage.
- [ ] Add visual "glitch" intensity based on system heat.
