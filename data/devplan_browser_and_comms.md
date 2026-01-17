# 🌐 Dev Plan: Browser System & Communications

This plan details the implementation of an in-game "Retro Browser" that hosts a Dark Web Forum for public jobs and a private Email System for direct communications.

## 🖥️ Core Browser Infrastructure
- [ ] **The `browser` Command**:
    - [ ] Implement `browser` command in `CommandRegistry.ts`.
    - [ ] Usage: `browser` (opens landing page) or `browser [url]` (direct navigation).
    - [ ] UI: Launches a full-screen or overlay "Retro Browser" interface with a URL bar and navigation buttons.
- [ ] **Web Engine & Landing Page**:
    - [ ] Create a `Browser.tsx` component.
    - [ ] **New Tab / Landing Page**:
        - [ ] Implement a default "Home" page with a grid of **Retro-Styled ASCII/Pixel Icons**.
        - [ ] Visual Style: 8-bit style icons with neon glows, scanline overlays, and hover "glitch" effects.
        - [ ] Icons:
            - 🧅 `Onion Forum` (Public Jobs)
            - ✉️ `Homebase Mail` (Private Comms)
            - 🛒 `Marketplace` (Web Mirror)
            - 📰 `Global News Network` (Breaking News & Hack Reports)
    - [ ] Implement a simple "Router" within the browser to handle internal URLs (e.g., `tor://onion-forum`, `mail://homebase`, `web://gnn-news`).

## 📰 Global News Network (GNN)
- [ ] **News Interface**:
    - [ ] Design a "News Portal" UI for `web://gnn-news`.
    - [ ] Sections:
        - **Breaking News**: Real-time updates on world events (solar flares, market crashes).
        - **Cyber-Security Reports**: Detailed articles about recent high-profile hacks (including player actions).
        - **Op-Eds**: Flavor text about the state of the digital world.
- [ ] **Dynamic Content**:
    - [ ] Link news articles to `WorldEvent` history.
    - [ ] If a player leaks data or encrypts a major target, a specific article is generated: "ZENITH TOWER UNDER SIEGE: Mysterious hacker 'Ghost' claims responsibility for data wipe."

## 🏴‍☠️ Onion Forum (Public Jobs)
- [ ] **Forum Interface**:
    - [ ] Design a "Thread-based" UI for `tor://onion-forum`.
    - [ ] Procedurally generate forum posts using `MissionGenerator.ts`.
- [ ] **Job Posting Logic**:
    - [ ] Replace the current `jobs` command output with forum threads.
    - [ ] Thread Content:
        - Title: "Need help with a small task", "OmniCorp must pay", etc.
        - Body: "I'm looking for someone to [Mission Description]. Reward is [Credits]. Interested?"
        - Button: [Accept Contract]
- [ ] **Thematic Variety**:
    - [ ] Include "Distraction" threads (flavor text, world-building, hacker drama).
    - [ ] Placeholder for **Faction Specific** boards (e.g., `tor://anarchy-net`, `tor://corp-leaks`).

## 📧 Private Email System (Direct Jobs & Ransom)
- [ ] **Email Client**:
    - [ ] Accessible via `mail://homebase` in the browser or the `mail` CLI command.
    - [ ] Features: Inbox, Sent, Trash.
- [ ] **Direct Job Offers**:
    - [ ] High-tier or faction-specific jobs are sent directly to the player.
    - [ ] Writing Style: "We've been watching your work, [PlayerName]. We have a specific target that requires your expertise..."
- [ ] **Ransom & Negotiation**:
    - [ ] When ransomware is deployed, the victim's response appears here.
    - [ ] Implement back-and-forth negotiation threads.
- [ ] **Faction Placeholders**:
    - [ ] Leave hooks in the `Email` interface for `factionId` and `reputationModifier`.

## 🤝 Integration & Migration
- [ ] **Deprecate `jobs` CLI**:
    - [ ] Update `jobs` command to simply output: "Use browser to view available contracts."
- [ ] **State Management**:
    - [ ] Add `browserHistory: string[]` and `unreadEmails: number` to `PlayerState`.
