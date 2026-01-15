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

### 🟢 [Version 1.0: Simple Edition WITH Gemini Tutor](https://github.com/alexfemcat/Retro-Linux-Terminal-Adventure/releases/tag/v1.0-simple)
**Recommended for beginners.**
The core experience. Focused purely on terminal navigation and file-based puzzles. Lightweight, stable, and perfect for learning basic Linux commands.
*   *Status: Complete & Archived*

### ⚪ [Simple - Retro Linux Terminal Adventure (NO AI)](https://github.com/alexfemcat/Retro-Linux-Terminal-Adventure/tree/v1-simple-withoutAI)
**For those who want a pure terminal experience without any AI assistance.**
Same exact game as the simple edition, but with the AI copilot removed entirely. Just you and the terminal.
*   *Status: Complete*

### 🟡 [Main / Development Branch](https://github.com/alexfemcat/Retro-Linux-Terminal-Adventure/tree/main)
**For those who want to for whatever reason see what I'm currently working on.**
This is where the current development is happening and finished versions will be published to their own releases. NOTE: this main branch is literally only current development, and will probably not be a working version. Refer to stable releases for working versions.
*   *Status: Active Development*

---

## 🕹️ Core Mechanics

- **Procedural VFS**: No two hacking runs are the same.
- **Authentic Commands**: Support for `ls`, `cd`, `cat`, `grep`, `pwd`, and more.
- **AI-Driven Narrative**: Missions and hints generated on-the-fly by Google Gemini in some versions, check the releases for more information.
- **CRT Visuals**: High-fidelity retro-futuristic interface with scanline hardware emulation.

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
