# 📟 Retro Linux Terminal Adventure

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat&logo=google-gemini&logoColor=white)](https://ai.google.dev/)

> "The mainframe is a maze. The commands are your map."

Retro Linux Terminal Adventure is an immersive, "hacking" simulation. Using a procedurally generated Virtual File System (VFS), players must navigate complex directory structures using real Linux commands to uncover secrets, recover data, and avoid detection.

---

## 🚦 Select Your Experience

This project is evolving. Depending on your interest, you may want to download a specific version from our **[Releases](https://github.com/alexfemcat/Retro-Linux-Terminal-Adventure/releases)** page:

### 🟡 [Intermediate Edition](https://github.com/alexfemcat/Retro-Linux-Terminal-Adventure/releases/tag/v0.8-intermediate)
**For players who want a deeper, more unpredictable hacking experience.**
Adds the **Enhanced Difficulty** system: multi-stage digital investigations, variable system-based starting leads, and advanced security challenges (Log analysis, SSH, Data reconstruction).
*   *Status: in development*

### 🟢 [Beginner Edition WITH AI Tutor](https://github.com/alexfemcat/Retro-Linux-Terminal-Adventure/releases/tag/v1.0-simple)
**Recommended for beginners.**
The core experience. Focused purely on terminal navigation and file-based puzzles. Lightweight, stable, and perfect for learning basic Linux commands.
*   *Status: Complete*

### ⚪ [Beginner Edition WITHOUT AI tutor](https://github.com/alexfemcat/Retro-Linux-Terminal-Adventure/releases/tag/v1.0-simple-no-AI)
**For those who want a pure terminal experience without any AI assistance.**
Same exact game as the simple edition, but with the AI copilot removed entirely. Just you and the terminal.
*   *Status: Complete*

### 🟡 [Main / Development Branch](https://github.com/alexfemcat/Retro-Linux-Terminal-Adventure/tree/main)
**For those who want to see what I'm currently working on.**
Refer to stable releases for finalized versions.
*   *Status: Active Development*

---

## 🕹️ Core Mechanics (Intermediate)

- **Multi-Node Network**: Navigate between interconnected systems using SSH, discovering new nodes through network reconnaissance.
- **Social Engineering Puzzles**: Crack root passwords by piecing together clues scattered across file systems—no brute force, just detective work.
- **Network Reconnaissance**: Use `ping`, `nmap`, and `ip` commands to discover and analyze remote systems.
- **Procedural VFS**: Each node has a fully randomized Linux-style file system with unique configurations.
- **Authentic Commands**: Support for `ls -a`, `cd`, `cat`, `grep`, `sudo`, `pwd`, `ps aux`, `env`, `ssh`, `ping`, `nmap`, `ip a`, and more.
- **CRT Visuals**: Immersive retro-futuristic interface with scanlines, glowing terminal text, and node-specific color themes.

---

## 🕵️‍♂️ Investigator's Field Guide (Intermediate Edition)

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

## 📜 Repository Guidelines

- **Looking for a specific version?** Check the [Releases](https://github.com/alexfemcat/Retro-Linux-Terminal-Adventure/releases) section.
- **Want to contribute?** Feel free to fork the `main` branch and submit a Pull Request.

---
*Built for hackers, by hackers. Stay in the shadows.* 🕶️
