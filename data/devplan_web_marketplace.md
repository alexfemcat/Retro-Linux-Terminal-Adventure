# 🛒 Dev Plan: Web-Based Marketplace (PC Store)

This plan details the migration of the marketplace from the terminal to a dedicated web-based store within the Retro Browser.

## 🏪 Store Infrastructure
- [x] **Web Portal**:
    - [x] Implement `web://macro-electronics` in `Browser.tsx`.
    - [x] Design a "Retro E-Commerce" UI (think early 90s web stores).
- [x] **Navigation & Sections**:
    - [x] Create a sidebar or top-nav for categories:
        - **Hardware**: CPU, RAM, Storage, Cooling, Network.
        - **Software**: Utilities, Exploits, Sniffing tools.
        - **Ransomware**: The new 10-tier ransomware suite.
        - **Consumables**: Wordlists, one-time use tools.

## 🛠️ Hardware Section (The PC Builder)
- [x] **Visual PC Specs**:
    - [x] Display current hardware levels with progress bars.
    - [x] Show "Next Upgrade" stats clearly (e.g., "RAM v2 -> v3: +4GB Capacity").
- [x] **Purchase Logic**:
    - [x] Integrate `buyItem` logic into the web UI buttons.
    - [x] Implement a "Checkout" animation (retro credit card processing or wire transfer).

## 💾 Software & Ransomware Section
- [x] **Catalog Display**:
    - [x] Use a grid or list view with icons for each software package.
    - [x] Include detailed descriptions, system requirements (CPU/RAM), and tier info.
- [x] **Ownership Tracking**:
    - [x] Clearly mark items as "INSTALLED" or "OWNED" to prevent double purchases.
    - [x] Placeholder for "Software Updates" (upgrading existing tools).

## 🤝 Integration & Migration
- [x] **Deprecate `market` CLI**:
    - [x] Update `market` command to output: "Terminal market access disabled. Please use 'browser web://macro-electronics' for all asset acquisitions."
- [x] **Real-time Balance**:
    - [x] Ensure the browser UI reflects the player's credits in real-time.
- [x] **Web Mirroring**:
    - [x] Ensure `WorldEvent` modifiers (e.g., "Market Crash") are reflected in the web store prices.
