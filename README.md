# Code with Ania Kubow - 01 - Tetris

## [Tutorial video on Youtube](https://www.youtube.com/watch?v=w1JJfK09ujQ)

## [Deployed on GitHub Pages](https://arpadgbondor.github.io/Code_with_Ania_Kubow-01-Tetris/)

### Notes:

- I tried to solve a few problems myself, so there are differences between the tutorial code and my project.
  - Fixed issues:
    - Added two missing tetrominoes.
    - New tetrominoes start from the top of the play area.
    - Rotating tetrominoes no longer wrap over the the next/previous lines at the edge of the play area. They get shifted away from the edge when it is necessery.
    - Rotating tetrominoes is blocked when it would cause conflict with already taken squares.
    - Added new game option after the first game is over.
    - New tetrominoes always start with a random rotation.
    - I'm using the same function to generate the "theTetrominoes" array and the "theDisplayTetrominoes" array which contains the tetromino coordinates for the main area and the display area for all rotation.
      - I didn't follow the video for generating new tetrominoes, and displaying the next tetromino, so those problems are solved differently than the tutorial project.
    - Score points are generated similarly to the original game.
      - Single line: 40 points
      - Double lines: 100 points
      - Triple lines: 300 points
      - Tetris: 1200 points
