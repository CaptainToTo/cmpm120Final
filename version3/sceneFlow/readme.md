# ChronoCart Scene Flow Prototype
- [x]  4+ Scene Types:
    1. Title
    2. Credits
    3. Gameplay
    4. Pause Screen
    5. Settings Menu

- [x] Communication between Scenes:
    * Settings menu uses scene data to return to correct scene on close

- [x] Reachability:
    * Title
        * Shown on launch
        * Reachable from Pause Screen
    * Credits
        * Reachable from Title
    * Core Gameplay
        * Reachable from Title
    * Pause Screen
        * Reachable from Gameplay
    * Settings Menu
        * Reachable from Title
        * Reachable from Pause Screen

- [x] Transitions:
    * Title scene left paused while settings menu is up, resumed on return
    * Gameplay scene left paused while pause menu is up, resumed on return
    