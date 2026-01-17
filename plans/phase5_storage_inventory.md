# 🛠️ PROMPT: The "Omnipotence" Developer Sandbox & Debugging Suite

**Objective:** Create a dedicated, high-privilege testing environment (`isDevMode`) that functions as a standalone sandbox. This system must isolate dev-progress from the player's primary save and provide absolute control over every animation, visual effect, and system state in the project.

---

### 1. Architectural Foundation (State & Persistence)
- **Isolated Sandbox Save**: Create a separate `dev_save_slot` in `PersistenceService`.
- **Session Bridge**: Implement `isDevMode` logic in the Global State.
    - **Logic**: When `isDevMode` is active, all writes target `dev_save_slot`. When deactivated, the system reloads the `user_save_slot`.
- **New Files Required**:
    - `/src/systems/DevSystem.ts`: Core state-switching and authentication logic.
    - `/src/components/terminal/DevCommands.ts`: The high-privilege command registry.
- **Visual Identity**: Change the terminal prompt to `root@dev-sandbox:~#` in **Bold Purple/Red** with a unique "Dev Mode" header when active.

### 2. Access & Authentication
- **Login**: `sudo login dev` -> **Password**: `6969`.
- **Logout**: `logout` -> Instantly restores the regular user session and reloads the primary save.

### 3. The "Visual Trigger" Audit (Comprehensive Debugging)
**Instruction to Assistant:** Scan the entire project for every `useEffect`, `framer-motion` sequence, and CSS animation. Map them all to the `debug-anim` command:
- `debug-anim bios`: Trigger the full POST/Boot sequence.
- `debug-anim panic`: Trigger the Kernel Panic hex-dump and forced reboot.
- `debug-anim glitch --intensity [1-10]`: Manually drive the CSS noise/jitter/scrambling.
- `debug-anim mission-start`: Trigger the "Connection Established" sequence.
- `debug-anim disconnect`: Trigger the "Lost Connection" or "Trace Detected" visual warnings.
- `debug-anim login-success`: Trigger the Title Screen to Terminal transition.

### 4. The "God-Mode" Command Suite (`devhelp`)
Provide a detailed manual via `devhelp` for the following:

#### **A. State Injection (`spawn`)**
- `spawn software [id]`: Instantly unlock specific commands in the `installedSoftware` array.
- `spawn hardware [id]`: Instant hot-swap of CPU, RAM, or SSD components.
- `spawn item [id] [amount]`: Push wordlists or loot files into the weighted inventory.
- `spawn credits [amount]`: Set any arbitrary credit balance.
- `spawn rep [amount]`: Set reputation to bypass market or mission gates.

#### **B. Real-time System Control**
- `dev-set-load --cpu [0-100] --ram [0-100]`: Manually force the **Task Manager** (htop) to show specific loads to test performance thresholds and "Glitch/Panic" triggers.
- `dev-fill-disk`: Instantly fills the weighted storage to 99% to test "Disk Full" errors.

#### **C. Mission Operations**
- `dev-mission [tier 1-6]`: Force-generate a mission using `PuzzleGenerator.ts`.
- `dev-reveal`: Bypasses `nmap` logic by uncovering the entire network tree and all hidden files/credentials instantly.

---

### 🤖 Implementation Constraints
1. **Full Audit**: The assistant MUST search for all UI/UX feedback loops (progress bars, terminal flickers, color shifts) and ensure they are triggerable.
2. **Encapsulation**: Dev-only code must not be importable or visible to the `StandardUser` session.
3. **Sandbox Reset**: Include `dev-reset` to wipe the `dev_save_slot` without touching the user's progress.