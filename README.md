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
*   *Status: Released*

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

## 🕵️‍♂️ Investigator's Field Guide

Navigating the network requires more than just knowing command syntax; it requires a hacker's intuition.

### 1. The Cold Start
Every session begins on your local workstation. Your first task is to discover the network topology. Check `/etc/hosts` for known systems, scan the network with `nmap`, and identify your targets. The mission briefing in `~/MISSION.txt` will guide your objective.

### 2. Network Reconnaissance
Use `ping` to verify hosts are online, `nmap` to scan for open ports and services, and `ip a` to understand your current network position. Each discovered node may hold clues to access others. SSH is your gateway—but you'll need credentials.

### 3. Social Engineering
Root passwords aren't found in plain text. They're constructed from personal details scattered across the file system. Read emails, photo metadata, certificates, and diary entries. The `PWD_HINT` environment variable will tell you how to combine the pieces—but finding them is your job.

### 4. Gaining Access
Once you've pieced together a password, use `ssh root@<ip>` to infiltrate remote systems or `sudo` to elevate privileges locally. Each node has its own security, its own secrets. Your final objective might be buried deep in a database server or hidden in a corporate web server's logs.

---

## 🛠️ Quick Start (Development Version)

1. **Clone & Enter**
   ```bash
   git clone https://github.com/alexfemcat/Retro-Linux-Terminal-Adventure.git
   cd Retro-Linux-Terminal-Adventure
   ```

2. **Configure Credentials**
   Create a `.env` file and add your [Gemini API Key](https://aistudio.google.com/app/apikey):
   ```env
   API_KEY=YOUR_GEMINI_API_KEY
   ```

3. **Deploy**
   ```bash
   npm install && npm run dev
   ```

---

## 📜 Repository Guidelines

- **Looking for a specific version?** Check the [Releases](https://github.com/alexfemcat/Retro-Linux-Terminal-Adventure/releases) section.
- **Want to contribute?** Feel free to fork the `main` branch and submit a Pull Request.

---
*Built for hackers, by hackers. Stay in the shadows.* 🕶️
