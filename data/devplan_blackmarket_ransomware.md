# 🏴‍☠️ Dev Plan: Black Market & Ransomware

This plan covers the expansion of the mission reward system, the introduction of "embarrassing/sensitive" content, and the ransomware mechanics.

## 💰 Stolen Goods & Market Integration
- [ ] **Mission Reward Refactor**:
    - [ ] Modify `Mission` type to include `targetFileMetadata` (value, category: 'sensitive', 'financial', 'personal').
    - [ ] Update `MissionGenerator.ts` to generate files with specific "embarrassing" or "sensitive" names based on scenario.
    - [ ] Implement `sell` command in `CommandRegistry.ts` to allow players to sell items from `inventory` for credits.
- [ ] **Content Expansion**:
    - [ ] Add a pool of "Sensitive Content" filenames/descriptions to `gameData.ts` (e.g., `private_photos.zip`, `tax_evasion_2025.pdf`, `ceo_nudes_leak.enc`).
    - [ ] Implement "Folder Objectives": Missions where the target is a directory containing multiple files, requiring the player to `tar` or `zip` them (new commands).

## ☣️ Ransomware Mechanics
- [ ] **Ransomware Software**:
    - [ ] Add `Ransomware` category to `MARKET_CATALOG` in `marketData.ts`.
    - [ ] Tiers of Ransomware (10-Tier Progression):
        - **Tier 1: "Script Kiddie Cryptor"** (Cost: 150c | 10% Success | 0.4x Payout). Unstable, high detection.
        - **Tier 2: "Basic-Batch-Locker"** (Cost: 500c | 15% Success | 0.6x Payout). Simple script-based encryption.
        - **Tier 3: "Onion-Locker Lite"** (Cost: 1,500c | 25% Success | 0.8x Payout). Standard TOR-based callback.
        - **Tier 4: "AES-256 Home Edition"** (Cost: 5,000c | 35% Success | 1.0x Payout). Solid encryption, standard payout.
        - **Tier 5: "Bit-Locker Pro"** (Cost: 12,000c | 43% Success | 1.2x Payout). Professional grade, harder to decrypt.
        - **Tier 6: "REvil-Clone v2"** (Cost: 25,000c | 55% Success | 1.5x Payout). Advanced obfuscation and persistence.
        - **Tier 7: "Dark-Side Enterprise"** (Cost: 50,000c | 65% Success | 1.8x Payout). Includes automated negotiation bots.
        - **Tier 8: "Conti-Elite Suite"** (Cost: 100,000c | 75% Success | 2.2x Payout). Multi-threaded encryption, anti-VM checks.
        - **Tier 9: "LockBit 3.0 Platinum"** (Cost: 250,000c | 85% Success | 3.0x Payout). Extremely fast, bypasses most EDR.
        - **Tier 10: "State-Sponsored Zero-Day"** (Cost: 750,000c | 90% Success | 5.0x Payout). The ultimate weapon. Untraceable.
- [ ] **Encryption Workflow**:
    - [ ] Create `encrypt` command: Requires ransomware software. Targets a directory/file on a remote node.
    - [ ] Success/Failure Logic:
        - [ ] Implement a dynamic success formula: `FinalSuccess% = (SoftwareBaseSuccess - (MissionDifficulty * 10)) + (PlayerReputation / 1000)`.
        - [ ] High-tier ransomware on low-difficulty missions is nearly guaranteed, but using Tier 1 ransomware on a Difficulty 5 mission is almost certain to fail/softlock.
    - [ ] Payout Trigger: Encrypting a target file generates a "Ransom Note" in the player's email system (see Email Plan).

## ⚖️ Blackmail & Extortion
- [ ] **Extortion Logic**:
    - [ ] Stolen files with the 'sensitive' tag can be "uploaded" to a blackmail contact via the email system.
    - [ ] Variable Payouts: Negotiate with victims (chance of higher payout vs. chance of them calling the feds/increasing trace speed).
