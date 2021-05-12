document.addEventListener('DOMContentLoaded', () => {
  const gridEl = document.querySelector('.grid');
  const miniGridEl = document.querySelector('.mini-grid');
  const scoreEl = document.getElementById('score');
  const startBtnEl = document.getElementById('start-button');
  let squares = [];
  const width = 10;
  for (let i = 0; i < 200; i++) {
    const newDiv = document.createElement('div');
    gridEl.appendChild(newDiv);
    squares.push(newDiv);
  }
  for (let i = 0; i < 10; i++) {
    const newDiv = document.createElement('div');
    newDiv.classList.add('taken');
    gridEl.appendChild(newDiv);
    squares.push(newDiv);
  }
  for (let i = 0; i < 16; i++) {
    const newDiv = document.createElement('div');
    miniGridEl.appendChild(newDiv);
  }
  scoreEl.innerText = 0;
  startBtnEl.addEventListener('click', () => {});

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
    [width , width + 1, width * 2 + 1, width * 2 + 2],
    [1, width, width + 1, width * 2],
    [width , width + 1, width * 2 + 1, width * 2 + 2],
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

  const theTetrominoes = [lTetromino, jTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let displayTetromino;
  let displayRotation;
  let currentTetromino;
  let currentRotation;
  let displayCurrent;
  let current;

  // randomly select a Tetromino and it's first rotation
  const randomTetromino = () => {
    displayUndraw();
    currentTetromino = displayTetromino;
    currentRotation = displayRotation;
    displayTetromino = Math.floor(Math.random() * theTetrominoes.length);
    displayRotation = Math.floor(Math.random() * 4);
    displayCurrent = theTetrominoes[displayTetromino][displayRotation];
    current = theTetrominoes[currentTetromino][currentRotation];
    currentPosition = 4;
    if (Math.min(current) >= width) { 
      currentPosition -= width;
    }
    displayDraw();
  };
  randomTetromino();

  //draw the tetromino
  const draw = () => {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetromino');
    });
  };
  const undraw = () => {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetromino');
    });
  };
  draw();
  
  //move down function
  const moveDown = () => {
    if (!freeze()) {
      undraw();
      currentPosition += width;
      draw();
    }
  };

  // make the tetromino move down every second
  const timerId = setInterval(moveDown, 1000);

  // freeze function
  const freeze = () => {
    if (current.some((index) => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach((index) => squares[currentPosition + index].classList.add('taken'));
      // start a new tetromino falling
      randomTetromino();
      draw();
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
    currentRotation++;
    if (currentRotation >= theTetrominoes[currentTetromino].length) {
      currentRotation -= theTetrominoes[currentTetromino].length;
    }

    current = theTetrominoes[currentTetromino][currentRotation];

    const tetrominoLengthIndexes = current.map((index) => index % width);

    if (
      // if the new shape wraps over to the next line
      Math.floor((currentPosition + Math.min(...tetrominoLengthIndexes)) / width) !==
        Math.floor((currentPosition + Math.max(...tetrominoLengthIndexes)) / width) ||
      current.some(
        (index) =>
          // if the new shape goes under the bottom line
          currentPosition + index >= squares.length ||
          // if the new shape has a conflict with spaces already taken.
          squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      //reverse the rotation (should we try the next possible shape instead?)
      currentRotation = oldRotation;
      current = theTetrominoes[currentTetromino][currentRotation];
    }

    draw();
  };

  // assign functions to KeyCodes
  const control = (event) => {
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
  };
  document.addEventListener('keyup', control);
  
  // show up-next tetrimino in mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  let displayIndez = 0;
  
  const displayDraw = () => {
    displayCurrent.forEach((index) => {
      displaySquares[displayIndez + index].classList.add('tetromino');
    });
  };
  const displayUndraw = () => {
    displayCurrent.forEach((index) => {
      displaySquares[displayIndez + index].classList.remove('tetromino');
    });
  };
});
