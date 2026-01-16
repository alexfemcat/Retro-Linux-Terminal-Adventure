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

## 🎮 How to Play

1.  **Initial Scan**: Look at your starting environment. Is there a note? New mail? A weird alias?
2.  **Follow the Trail**: Use standard Linux commands (`ls`, `cd`, `cat`, `grep`, `pwd`) to navigate the VFS.
3.  **Escalate Privileges**: Find the password components to use `sudo` and access restricted areas.
4.  **Decrypt the Prize**: If the target ends in `.crypt`, find the decoder and extract the payload.
5.  **Achieve Objective**: Locate and `cat` the target file to complete the mission.

---

*This project is built with React, TypeScript, and Vite. Designed for a premium, retro-hacking aesthetic.*
