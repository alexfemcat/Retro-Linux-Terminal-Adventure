# 🌍 Dev Plan: World State & Dynamic Events

This plan focuses on the "Breaking News" system, the in-game calendar, and dynamic difficulty scaling.

## 📅 In-Game Time & Calendar
- [ ] **Date System Revamp**:
    - [ ] Replace real-world time with an in-game `currentDate` in `GameState`.
    - [ ] Implement a "Time Advance" mechanic (time moves when missions are completed or when the player `sleeps`).
- [ ] **Time-Sensitive Events**:
    - [ ] Define "Holiday" or "Event" windows in `gameData.ts` (e.g., "Steam Winter Sale Hack", "Election Day DDoS").
    - [ ] Missions during these windows have 2x rewards but 2x trace speed.

## 📺 Advanced News Ticker
- [ ] **Player-Driven News**:
    - [ ] When a high-difficulty mission is completed or a major ransom is paid, generate a `Breaking News` event.
    - [ ] Example: "BREAKING: OmniCorp Mainframe Encrypted by Unknown Entity. Stock Plummets."
- [ ] **Dynamic Modifiers**:
    - [ ] Expand `WorldEvent` to include more complex modifiers (e.g., "Police Crackdown: All SSH ports now use 4096-bit encryption").
- [ ] **Anti-Softlock Logic**:
    - [ ] Implement "Safety Valves" for the "System Update" event (+2 difficulty).
    - [ ] If player reputation/hardware is too low, the event is deferred or replaced with a "Vulnerability Found" event (-1 difficulty) to help them catch up.

## 📢 Global Announcements
- [ ] **Blackmail/Ransom Announcements**:
    - [ ] If a player "Leaks" sensitive data (refuses ransom), a news event triggers: "SENSITIVE DATA LEAKED: [Company Name] secrets exposed on the dark web."
    - [ ] Increases Reputation significantly but permanently increases "Heat" (trace speed) for future missions against that faction.
