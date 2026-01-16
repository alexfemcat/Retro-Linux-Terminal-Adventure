# 📟 Retro Linux Terminal Adventure (Intermediate Edition)

Welcome to the **Intermediate Edition** of the Retro Linux Terminal Adventure! This version significantly ramps up the challenge, moving beyond simple file searches into a multi-staged digital investigation.

## 🚀 What's New in the Intermediate Version?

This release introduces deeper mechanical variability and a multi-layered discovery system to ensure no two hacking sessions feel the same.

### 🔍 Advanced Investigation Mechanics
The hunt is no longer a straight line. Every mission is a multi-layered digital investigation:
1.  **The Cold Start**: You won't always find a note. You'll need to investigate system configurations, communication logs, and process traces to find your first lead.
2.  **Breadcrumb Trails**: Lead artifacts are scattered across the system, often requiring root access or keen eyes for hidden files to uncover.
3.  **Thematic Logic**: Objective locations are described thematically, requiring you to understand the system's "logical" layout rather than just following absolute paths.

### 🔐 Secure Connections & Enhanced Features
Beyond the core investigation, this edition introduces new ways to interact with the system and uncover secrets:
- **SSH Access**: Discover and utilize secure shell protocols to navigate and interact with remote parts of the virtual file system, unlocking new pathways and challenges.
- **Unforeseen Capabilities**: Unearth additional system features and tools that can aid in your investigation, providing novel approaches to solving complex puzzles.
- **Network Scanning**: Employ advanced network reconnaissance techniques to map out the digital landscape, identify active services, and uncover hidden vulnerabilities within the simulated network.

### 🛠️ Mechanical Variability
Every session is procedurally generated with high mechanical entropy:
- **Starter Archetypes**: You might be tracing shell history, reading internal mail, or even diagnosing a crashed system daemon.
- **Security Challenges**: Gaining root access is no longer a simple search. You may need to use advanced terminal tools to sift through logs, combine fragmented data, or decrypt locked security hints.

---

## 🛠️ Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🕵️‍♂️ Investigator's Field Guide

Navigating the network requires more than just knowing command syntax; it requires a hacker's intuition.

### 1. The Cold Start
Every session begins on your local workstation. Your first task is to discover the network topology. Check `/etc/hosts` for known systems, scan the network with `nmap`, and identify your targets. The mission briefing in `~/MISSION.txt` will guide your objective.

### 2. Social Engineering & Forensics
Root passwords aren't found in plain text. They are constructed from personal details scattered across the file system.
*   **The Blueprint**: Check the environment variables (`env`) to find the `PWD_HINT`. It will tell you the structure (e.g., "Pet Name + Year").
*   **The Evidence**: Scour the `Documents` directory. Photo metadata, birth certificates, and travel tickets contain the raw data you need.

### 3. The Golden Rule of Lateral Movement
Here is the secret to traversing the network: **The credentials for a remote system are often hidden on the machine you are currently accessing.**
If you find clues (like a city name or color) that don't fit the local password pattern, *do not discard them*. They are likely the keys to the next server in the chain.

### 4. Closing the Net
Once you have the target IP (from logs or history) and the constructed password, use `ssh root@<ip>` to breach the next node. Repeat the cycle: Recon, Loot, Move. Your final objective lies at the end of this breadcrumb trail.

---

*This project is built with React, TypeScript, and Vite. Designed for a premium, retro-hacking aesthetic.*

<img width="1336" height="1018" alt="intermediate" src="https://github.com/user-attachments/assets/38113137-dd3c-4609-8675-3ab76ed5cc26" />
