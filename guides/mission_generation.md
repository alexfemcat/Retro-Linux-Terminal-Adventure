# 🕵️ Mission Generation Guide

This guide explains the procedural generation logic for missions in the **Retro Linux Terminal Adventure**.

## 📊 Difficulty Tiers & Reputation
Missions are generated in 5 tiers based on the player's current **Reputation**. The system allows for slight variance (20% chance for ±1 tier) to keep the job board interesting.

| Tier | Rep Required | Network Scale | Complexity |
| :--- | :--- | :--- | :--- |
| **1** | 0+ | 2 Nodes | Basic Infiltration |
| **2** | 101+ | 2-3 Nodes | Standard Recon |
| **3** | 501+ | 2-5 Nodes | Advanced Objectives |
| **4** | 1501+ | 2-5 Nodes | High Security |
| **5** | 4001+ | 2-5 Nodes | Elite Operations |

---

## 🎯 Objective Types
Objectives are assigned based on the mission tier. Higher tiers unlock more destructive or complex win conditions.

### 1. Data Retrieval (`file_found`)
*   **Availability**: All Tiers.
*   **Goal**: Locate and download a specific sensitive file (e.g., `SECRET_1234.dat`).
*   **Mechanic**: Requires navigating the VFS and using `download`.

### 2. System Compromise (`root_access`)
*   **Availability**: All Tiers.
*   **Goal**: Gain root privileges on the target node.
*   **Mechanic**: Requires finding the root password (via `sqlmap`, `john`, or clues) and using `sudo`.

### 3. Process Sabotage (`process_killed`)
*   **Availability**: Tier 3+.
*   **Goal**: Terminate a specific running process on the target.
*   **Mechanic**: Requires using `ps` to find the PID and `kill` (often requires root).

### 4. System Defacement (`file_modified`)
*   **Availability**: Tier 3+.
*   **Goal**: Overwrite a specific file with target content.
*   **Mechanic**: Requires using `echo "content" > file`.

---

## 💰 Economy & Rewards
Rewards are scaled by tier and defined in [`data/gameConfig.ts`](../data/gameConfig.ts).

### Credit Payouts
*   **Tier 1**: 200 - 250c
*   **Tier 2**: 600 - 800c
*   **Tier 3**: 2,500 - 3,500c
*   **Tier 4**: 10,000 - 14,000c
*   **Tier 5**: 45,000 - 60,000c

### Reputation Gains
Reputation is earned through actions, not just completion:
*   **Sell Normal File**: +10 XP
*   **Sell Sensitive File**: +50 XP
*   **Successful Ransom**: +100 XP
*   **Refused Ransom**: +20 XP

---

## 🛠️ Technical Generation Flow
1.  **Scenario Selection**: A random theme is picked from `scenarios` (e.g., Corporate, Government).
2.  **Difficulty Calculation**: Based on player reputation + random variance.
3.  **Network Mapping**:
    *   `numNodes` is determined by tier.
    *   Nodes are chained: Node N contains the credentials for Node N+1.
4.  **Vector Assignment**: A random attack vector is suggested in the description (e.g., SSH Exploit, SQL Injection).
5.  **Win Condition**: A random objective is picked from the tier-appropriate pool.
6.  **VFS Generation**: The `puzzleGenerator` builds a nested file system with clues, distractions, and the objective target.

---
*Note: All values are configurable in `GAME_CONFIG` for balancing.*
