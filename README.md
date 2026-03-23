# ⚔️ Blade Cycle
An open-source endless runner, incorporating finite state machines, and enemy AI detection/avoidance to create a chase-scene in an industrial, sci-fi environment. The project was for a simple class assignment, which I went a overboard on and went all out on into a full experience, with enough structure and modularity to be further added onto.

## Technologies
- Phaser.js
- JavaScript
- Aseprite
- Musescore
- Reaper
- CSS
- HTML
- Git

## Features
The following is some game features in Blade Cycle:
- Slash & Drive: Drive around in a top-down environment, slashing at enemy bike soldiers & dodging their incoming bullets, or jump off of your bike.
- Stab & Jump: Jump off your bike, allowing your bike to steady itself as you attack the enemy hoverguards in the air. You can freely fall back onto your bike at anytime, going right back to slashing.
- Highscore: Your score is recorded during your current playthrough on the browser, and any losses register and acknowledge any improvements in score.
- Volume & Music: Ability to decrease the volume of sfx or music in the game with freedom.

## The Process
Initially, I started on the main Highway scene, with the goal of allowing for a dynamic shift in gameplay between a non-driving and driving state. For the purpose of the project, I resorted to two state machines, which are disabled at times depending on the current state of play. The bike gameplay would be inspired by Final Fantasy 7 (1997), while the non-bike gameplay was inspired by Hollow Knight (2017).

Game AI was a priority, having enemies which didn't blindly chase. Many reworks had to be made on the AI throughout development, due to the complexity of state machines, and keeping the system in some format modular. 

For the enemy soldier bikes, they were programmed to keep their distance in regard to sword length, but close enough to the bike to prevent the player from dodging attacks without major clumps of enemies in front or behind the player. Whenever a new wave is started, they are placed outside of the map, and upon entering the game canvas, are granted collision with the world borders to allow visual coheison in the experience. 

For the enemy hoverguard AI, they were programmed with a higher level of depth, more specifically to the state of the player. If the player was in the bike, they needed to chase the bike, making sure to be far to limit depth values and keep them roughly above the bike's level of field. When the player was not in the bike, they make sure to scatter and distance themselves from the player more strictly, unless the player lands ontop of them, in which they stop to allow other enemies an opportunity to strike. The dead stop, was chosen due to engine limitatons with collision, gravity, and momentum. 

The Main Menu was designed with the goal of avoiding visual clutter, disabling screens or popups when transitioning. 

In general, development was incredibly fast because of the stronger fundamentals and foundations I established during the start, having systems, functions, and files being modular and independent of one another. As time went on, I noticed I started to stray away from my fundamentals, which resulted in major issues in restructuring of code. Luckily, due to my documentation, I was able to go back through my code and understand it on the spot, as I often avoided using magic numbers, and clearly labels values for clarity and continuity.

## What I learned
Doing this project, I've learned important skills and better understanding of complex ideas, which improved my logical and analytical thinking. 

### Git
- Documentation: By noting the changes and improvements made in each commit, any major changes done to the code which led to faults, allowed me to revert changes to a more stable ground, preventing issues of confusion and any major loss in progression

### Automata
- Finite State Machines: Using state machines helped to help clean up code, optimize, and define pre-conditions to create more complicated goal-orientated behavior trees for AI. As for the bike and the player themself, state machines helped to clearly define limitations and patterns accessable at the time, and implement changes once rather than every single update loop.
- Game AI: Designing 2 different enemies with dynamic behaviors which consider the current player state and react in a realistic fashion rather than as a horde, challenged me greatly. For specifically, making sure every variable I could customize existed to allow for quick balancing and playtesting, and having minimal magic numbers helped greatly.

## Overall Growth:
Each part of this project helped me understand Game AI, state machines, managing any number of complex AI, and improving user experience. 

# How can it be improved?
- Add more enemies
- Add movement of AI while on the player is on top
- Add collision avoidance with other AI, not just the player
- Add animations for walking, and in-air jumping
- Improve the modularity, especially as time went on modularity slowly was ingored.
- Improve some of the settings modifications, as not every sound was affected by the volume settings control

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
