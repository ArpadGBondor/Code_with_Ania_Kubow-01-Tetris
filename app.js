document.addEventListener('DOMContentLoaded', () => {
  const gridEl = document.querySelector('.grid');
  const logoGridEl = document.querySelector('.logo');
  const miniGridEl = document.querySelector('.mini-grid');
  const scoreEl = document.getElementById('score');
  const startBtnEl = document.getElementById('start-button');
  const gameOverEL = document.querySelector('.game-over');
  const width = 10;
  const displayWidth = 4;
  const logoWidth = 21;
  const displayIndex = 0;
  const colors = ['orange', 'red', 'magenta', 'green', 'midnightblue', 'maroon', 'dodgerblue'];

  let squares = [];
  let displaySquares = [];
  let logoSquares = [];
  let currentPosition = 4;
  let displayTetromino;
  let displayRotation;
  let currentTetromino;
  let currentRotation;
  let displayCurrent;
  let current;
  let timerId;
  let score = 0;
  let gameOver = true;

  gameOverEL.style.visibility = 'hidden';
  scoreEl.innerText = score;

  //logo
  for (let i = 0; i < 21*5; i++) {
    const newDiv = document.createElement('div');
    logoGridEl.appendChild(newDiv);
    logoSquares.push(newDiv);
  }
  // play area
  for (let i = 0; i < 200; i++) {
    const newDiv = document.createElement('div');
    gridEl.appendChild(newDiv);
    squares.push(newDiv);
  }
  // extra row at bottom - not visible because .grid is shorter
  for (let i = 0; i < 10; i++) {
    const newDiv = document.createElement('div');
    newDiv.classList.add('taken');
    gridEl.appendChild(newDiv);
    squares.push(newDiv);
  }
  // 4x4 mini grid showing the next Tetromino
  for (let i = 0; i < 16; i++) {
    const newDiv = document.createElement('div');
    miniGridEl.appendChild(newDiv);
    displaySquares.push(newDiv);
  }
  
  const createLogo = () => {
    let characters = [];
    let characterPosition = 0;
    // T
    characters.push([
      characterPosition + 0,
      characterPosition + 1,
      characterPosition + 2,
      characterPosition + 1 + logoWidth,
      characterPosition + 1 + logoWidth + 2,
      characterPosition + 1 + logoWidth * 3,
      characterPosition + 1 + logoWidth * 4,      
    ])
    characterPosition += 4;
    
    //E
    characters.push([
      characterPosition + 0,
      characterPosition + 1,
      characterPosition + 2,
      characterPosition + 0 + logoWidth,
      characterPosition + 0 + logoWidth + 2,
      characterPosition + 1 + logoWidth + 2,
      characterPosition + 2 + logoWidth + 2,
      characterPosition + 0 + logoWidth * 3,
      characterPosition + 0 + logoWidth * 4,      
      characterPosition + 1 + logoWidth * 4,      
      characterPosition + 2 + logoWidth * 4,      
    ])
    characterPosition += 4;
    
    // T
    characters.push([
      characterPosition + 0,
      characterPosition + 1,
      characterPosition + 2,
      characterPosition + 1 + logoWidth,
      characterPosition + 1 + logoWidth + 2,
      characterPosition + 1 + logoWidth * 3,
      characterPosition + 1 + logoWidth * 4,      
    ])
    characterPosition += 4;

    // R
    characters.push([
      characterPosition + 0,
      characterPosition + 1,
      characterPosition + 0 + logoWidth,
      characterPosition + 2 + logoWidth,
      characterPosition + 0 + logoWidth + 2,
      characterPosition + 1 + logoWidth + 2,
      characterPosition + 0 + logoWidth * 3,
      characterPosition + 2 + logoWidth * 3,
      characterPosition + 0 + logoWidth * 4,      
      characterPosition + 2 + logoWidth * 4,      
    ])
    characterPosition += 4;

    // I
    characters.push([
      characterPosition + 0,
      characterPosition + 0 + logoWidth,
      characterPosition + 0 + logoWidth + 2,
      characterPosition + 0 + logoWidth * 3,
      characterPosition + 0 + logoWidth * 4,      
    ])
    characterPosition += 2;
    
    // S
    characters.push([
      characterPosition + 1,
      characterPosition + 2,
      characterPosition + 0 + logoWidth,
      characterPosition + 0 + logoWidth + 2,
      characterPosition + 1 + logoWidth + 2,
      characterPosition + 2 + logoWidth + 2,
      characterPosition + 2 + logoWidth * 3,
      characterPosition + 1 + logoWidth * 4,      
      characterPosition + 2 + logoWidth * 4,      
    ])
    characterPosition += 4;
    
    characters.forEach((char,index)=>{
      addLogoChar(char,colors[index]);
    })
  }

  const addLogoChar = (charIndexes,charColor) => {
    charIndexes.forEach(index=>{
      logoSquares[index].classList.add('tetromino');
      logoSquares[index].classList.add(charColor);
    })
  }
  
  createLogo();
  console.log(logoSquares);

  const createTetrominoes = (width) => {
    // The Tetrominoes
    const lTetromino = [
      [0, 1, width + 1, width * 2 + 1],
      [width, width + 1, width + 2, width * 2],
      [1, width + 1, width * 2 + 1, width * 2 + 2],
      [width + 2, width * 2, width * 2 + 1, width * 2 + 2],
    ];

    const jTetromino = [
      [1, width + 1, width * 2 + 1, 2],
      [width, width + 1, width + 2, width * 2 + 2],
      [1, width + 1, width * 2, width * 2 + 1],
      [width, width * 2, width * 2 + 1, width * 2 + 2],
    ];

    const zTetromino = [
      [width + 1, width + 2, width * 2, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
    ];

    const sTetromino = [
      [width, width + 1, width * 2 + 1, width * 2 + 2],
      [1, width, width + 1, width * 2],
      [width, width + 1, width * 2 + 1, width * 2 + 2],
      [1, width, width + 1, width * 2],
    ];

    const tTetromino = [
      [1, width, width + 1, width + 2],
      [1, width + 1, width + 2, width * 2 + 1],
      [width, width + 1, width + 2, width * 2 + 1],
      [1, width, width + 1, width * 2 + 1],
    ];

    const oTetromino = [
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
    ];

    const iTetromino = [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
    ];

    return [lTetromino, jTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino];
  };

  const theTetrominoes = createTetrominoes(width);
  const theDisplayTetrominoes = createTetrominoes(displayWidth);

  const displayDraw = () => {
    displayCurrent.forEach((index) => {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].classList.add(colors[displayTetromino]);
    });
  };
  const displayUndraw = () => {
    displayCurrent.forEach((index) => {
      displaySquares[displayIndex + index].classList.remove('tetromino');
      displaySquares[displayIndex + index].classList.remove(colors[displayTetromino]);
    });
  };

  // randomly select a Tetromino and it's first rotation
  const randomTetromino = () => {
    if (displayCurrent) {
      displayUndraw();
      currentTetromino = displayTetromino;
      currentRotation = displayRotation;
    } else {
      currentTetromino = Math.floor(Math.random() * theTetrominoes.length);
      currentRotation = Math.floor(Math.random() * 4);
    }
    displayTetromino = Math.floor(Math.random() * theTetrominoes.length);
    displayRotation = Math.floor(Math.random() * 4);
    displayCurrent = theDisplayTetrominoes[displayTetromino][displayRotation];
    current = theTetrominoes[currentTetromino][currentRotation];
    currentPosition = 4;
    // start from negative position if the first lines of the new tetromino are empty
    // always place the next tetromino to the top of the play area
    while (Math.min(...current) + currentPosition >= width) {
      currentPosition -= width;
    }
    displayDraw();
  };

  //draw the tetromino
  const draw = () => {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].classList.add(colors[currentTetromino]);
    });
  };
  const undraw = () => {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].classList.remove(colors[currentTetromino]);
    });
  };

  //move bottom
  const moveBottom = () => {
    undraw();
    while (current.every((index) => !squares[currentPosition + width + index].classList.contains('taken'))) {
      currentPosition += width;
    }
    draw();
    freeze();
  };

  //move down function
  const moveDown = () => {
    // only move down if we didn't create a new tetromino
    if (!freeze()) {
      undraw();
      currentPosition += width;
      draw();
    }
  };

  // freeze function
  const freeze = () => {
    if (current.some((index) => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach((index) => squares[currentPosition + index].classList.add('taken'));
      addScore();
      // start a new tetromino falling
      randomTetromino();
      draw();
      resetTimer();
      checkGameOver();
      return true;
    }
    return false;
  };

  //move the tetromino left, unless is at the edge or there is a blockage
  const moveLeft = () => {
    undraw();
    const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);

    if (!isAtLeftEdge) currentPosition -= 1;

    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) currentPosition += 1;

    draw();
  };

  //move the tetromino left, unless is at the edge or there is a blockage
  const moveRight = () => {
    undraw();
    const isAtRightEdge = current.some((index) => (currentPosition + index + 1) % width === 0);

    if (!isAtRightEdge) currentPosition += 1;

    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) currentPosition -= 1;

    draw();
  };

  const rotate = () => {
    undraw();
    const oldRotation = currentRotation;
    const oldPosition = currentPosition;
    currentRotation++;
    if (currentRotation >= theTetrominoes[currentTetromino].length) {
      currentRotation -= theTetrominoes[currentTetromino].length;
    }

    current = theTetrominoes[currentTetromino][currentRotation];

    // if the new rotation goes above the top of the play area, we need to move it down a line
    while (current.some((index) => currentPosition + index < 0)) {
      currentPosition += width;
    }

    // check if the new rotation wraps over to the next line
    const tetrominoLengthIndexes = current.map((index) => index % width);
    const tetrominoStartIndex = Math.min(...tetrominoLengthIndexes);
    const tetrominoEndIndex = Math.max(...tetrominoLengthIndexes);
    // if the first and last index of the tetromino are not in the same line
    if (
      Math.floor((currentPosition + tetrominoStartIndex) / width) !==
      Math.floor((currentPosition + tetrominoEndIndex) / width)
    ) {
      // there are 3 possible cases.

      // if the first position of the tetromino goes over the left edge
      // of the play area, move the position to the right
      if ((currentPosition + tetrominoStartIndex) % width === width - 1) currentPosition += 1;

      // if the last position of the tetromino goes over the right edge
      // of the play area, move the position to the left
      if ((currentPosition + tetrominoEndIndex) % width === 0) currentPosition -= 1;

      // if the last position of the tetromino goes over the right edge
      // of the play area with two squares, move the position to the left with two squares
      if ((currentPosition + tetrominoEndIndex) % width === 1) currentPosition -= 2;
    }
    // if the new rotation of tetromino can't fit in the play area
    // we have to reverse the rotation and the position movement
    if (
      current.some(
        (index) =>
          // if the rotation goes under the bottom line
          currentPosition + index >= squares.length ||
          // if the rotation has a conflict with spaces already taken.
          squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      //reverse the rotation (should we try the next possible shape instead?)
      currentRotation = oldRotation;
      current = theTetrominoes[currentTetromino][currentRotation];
      currentPosition = oldPosition;
    }

    draw();
  };

  // assign functions to KeyCodes
  const control = (event) => {
    // don't control the game if it's paused
    if (timerId) {
      if (event.keyCode === 17) {
        moveBottom();
      }
      if (event.keyCode === 37) {
        moveLeft();
      }
      if (event.keyCode === 38) {
        rotate();
      }
      if (event.keyCode === 39) {
        moveRight();
      }
      if (event.keyCode === 40) {
        moveDown();
      }
    }
  };
  document.addEventListener('keyup', control);

  const resetTimer = () => {
    clearInterval(timerId);
    timerId = setInterval(moveDown, 1000);
  };

  startBtnEl.addEventListener('click', () => {
    if (gameOver) {
      currentPosition = 4;
      displayTetromino = null;
      displayRotation = null;
      currentTetromino = null;
      currentRotation = null;
      displayCurrent = null;
      current = null;
      timerId = null;
      score = 0;
      gameOver = false;
      gameOverEL.style.visibility = 'hidden';
      squares.forEach((square, index) => {
        if (index < squares.length - width) {
          square.classList.remove('taken');
          square.classList.remove('tetromino');
          colors.forEach((color) => square.classList.remove(color));
        }
      });
      console.log(displaySquares);
      displaySquares.forEach((square) => {
        square.classList.remove('taken');
        square.classList.remove('tetromino');
        colors.forEach((color) => square.classList.remove(color));
      });
    }
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      startBtnEl.innerText = 'Start';
    } else {
      if (!current) {
        randomTetromino();
        draw();
      }
      timerId = setInterval(moveDown, 1000);
      startBtnEl.innerText = 'Pause';
    }
  });

  const addScore = () => {
    let scorePoints = [0, 40, 100, 300, 1200];
    let numberOfRows = 0;
    for (let i = 0; i < 200; i += width) {
      let rowIndexes = [];
      for (let j = 0; j < width; j++) {
        rowIndexes.push(i + j);
      }
      if (rowIndexes.every((index) => squares[index].classList.contains('taken'))) {
        ++numberOfRows;
        rowIndexes.forEach((index) => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          colors.forEach((color) => squares[index].classList.remove(color));
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => gridEl.appendChild(cell));
      }
    }
    score += scorePoints[numberOfRows];
    scoreEl.innerText = score;
  };

  //game over
  function checkGameOver() {
    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
      gameOverEL.style.visibility = 'visible';
      gameOver = true;
      clearInterval(timerId);
      startBtnEl.innerText = 'New game';
      timerId = null;
    }
  }
});
