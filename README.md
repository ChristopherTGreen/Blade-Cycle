# ⚔️ Blade Cycle

Blade Cycle is a 2D action game built using JavaScript and Phaser, focused on player and vehicle state transitions, enemy AI behavior, and modular gameplay systems.

## Overview

This project demonstrates system-level gameplay engineering, including player-bike state switching, enemy AI behavior, and reusable combat systems.

## Key Systems Built

### Player ↔ Bike State System
- Designed a dual-entity system where control dynamically transfers between player and vehicle
Managed visibility, physics, and input handling across multiple states
### Enemy AI (State-Based)
- Implemented AI behavior using structured states (chase, fire, death)
Designed positioning logic to maintain optimal combat distance
Built adaptive targeting (bike vs player depending on state)
### Combat System
- Reusable projectile (bullet) system shared across multiple enemy types
Timer-based firing logic with positional calculations
### Physics Handling Solution
- Solved collision issues between player and enemies by dynamically toggling immovability
Prevented physics conflicts while maintaining gameplay functionality

## Technical Highlights
- State machine-driven behavior for player, bike, and enemies
- Reusable systems across multiple entities
- Real-time physics problem solving and constraint handling

# Running the Project
To run the project in your local environment, follow either these two steps:
Quick Method:
  1) Access the github pages for Blade Cycle
  2) Click and run the link for the page

Longer Method:
  1) Clone the repository to your local machine.
  2) Run VScode.
  3) Download the live server extension.
  4) Run the live server on your local machine.
