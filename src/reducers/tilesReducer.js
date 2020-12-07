const initState = {
  tiles: [],
  grids: [],
  isCollided: false,
  stats: {
    currentScore: 0,
    bestScore: 0,
  },
  status: {
    gameEnd: false,
    win: false,
    gameOver: false,
    keepGoing: false,
  },
  undoSteps: [],
  maxUndoStepsAmount: 1,
};

// randomly generate a value of either 2 or 4.
const random2_4 = () => {
  return Math.round(Math.random()) * 2 + 2;
};

// get all Tiles which their value are not zero
const getFilledTiles = (state, boardSize) => {
  const [row, column] = boardSize;
  const grids = state.grids;
  let filledTiles = [];
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      if (grids[i][j] > 0) {
        filledTiles.push({
          row: i,
          column: j,
          value: grids[i][j],
        });
      }
    }
  }
  return filledTiles;
};

// two dimension array to one dimension array
const transferGridsToTiles = ({ row, column }, grids) => {
  let tiles = [];
  for (let x = 0; x < row; x++) {
    for (let y = 0; y < column; y++) {
      if (grids[x][y] !== 0)
        tiles.push({
          row: x,
          column: y,
          value: grids[x][y],
        });
    }
  }
  return tiles;
};

// The user's score starts at zero,
// and is increased whenever two tiles combine, by the value of the new tile.
const increaseScore = (state, value) => {
  state.stats.currentScore += value;
  if (state.stats.currentScore > state.stats.bestScore)
    state.stats.bestScore = state.stats.currentScore;
};

const tilesReducer = (state = initState, action) => {
  switch (action.type) {
    case "INIT_GRIDS_Tiles": {
      const [row, column] = action.boardSize;
      return {
        ...state,
        // generate a two dimensions array
        grids: Array(row)
          .fill(0)
          .map(() => Array(column).fill(0)),
        tiles: [],
        status: {
          gameEnd: false,
          win: false,
          gameOver: false,
          keepGoing: false,
        },
        undoSteps: [],
        stats: {
          ...state.stats,
          currentScore: 0,
        },
      };
    }
    case "ADD_NEW_GRID_TILE": {
      console.log("ADD_NEW_GRID_TILE");
      const [row, column] = action.boardSize;
      let emptyTiles = [];
      for (let x = 0; x < row; x++) {
        for (let y = 0; y < column; y++) {
          //  find empty spots on the board
          if (state.grids[x][y] === 0)
            emptyTiles.push({
              x,
              y,
            });
        }
      }
      console.log(emptyTiles, "emptyTiles");
      if (emptyTiles.length > 0) {
        const randomTile =
          emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        console.log(randomTile, "randomTile");
        const randomValue = random2_4();
        console.log(randomValue, "randomValue");
        state.grids[randomTile.x][randomTile.y] = randomValue;
        state.tiles.push({
          row: randomTile.x,
          column: randomTile.y,
          value: randomValue,
        });
        return {
          ...state,
          tiles: state.tiles,
          grids: state.grids,
        };
      } else {
        return { ...state };
      }
    }
    case "TILES_SLIDE_UP": {
      const [row, column] = action.boardSize;
      const filledTiles = getFilledTiles(state, action.boardSize);
      let grids = state.grids;
      let lineFilledTiles = [];
      for (let i = 0; i < column; i++) {
        lineFilledTiles = filledTiles.filter(function (item) {
          return item.column === i;
        });
        for (let j = 0; j < lineFilledTiles.length; j++) {
          grids[lineFilledTiles[j].row][lineFilledTiles[j].column] = 0;
          grids[j][i] = lineFilledTiles[j].value;
        }
      }
      return {
        ...state,
        grids: grids,
        tiles: transferGridsToTiles({ row, column }, grids),
      };
    }
    case "TILES_SLIDE_DOWN": {
      const [row, column] = action.boardSize;
      const filledTiles = getFilledTiles(state, action.boardSize);
      let grids = state.grids;
      let lineFilledTiles = [];
      // [0,    [0,
      //  2, ->  0,
      //  0,     2,
      //  4],    4]
      for (let i = 0; i < column; i++) {
        lineFilledTiles = filledTiles
          .filter(function (item) {
            return item.column === i;
          })
          .reverse();
        for (let j = 0; j < lineFilledTiles.length; j++) {
          grids[lineFilledTiles[j].row][lineFilledTiles[j].column] = 0;
          // [3][0];
          // [2][0];
          grids[row - 1 - j][i] = lineFilledTiles[j].value;
        }
      }
      // LOG && window.console.log(state.grids, "grids");
      return {
        ...state,
        grids: grids,
        tiles: transferGridsToTiles({ row, column }, grids),
      };
    }
    case "TILES_SLIDE_LEFT": {
      const [row, column] = action.boardSize;
      const filledTiles = getFilledTiles(state, action.boardSize);
      let grids = state.grids;
      let lineFilledTiles = [];
      for (let i = 0; i < row; i++) {
        // for example: the first row is [0, 2, 0, 4], find the tiles is not 0
        lineFilledTiles = filledTiles.filter(function (item) {
          return item.row === i;
        });
        // {row: 0, column: 1, value: 2}
        // {row: 0, column: 3, value: 4}
        for (let j = 0; j < lineFilledTiles.length; j++) {
          // [0, 0, 0, 0];
          grids[lineFilledTiles[j].row][lineFilledTiles[j].column] = 0;
          // [2, 4, 0, 0];
          grids[i][j] = lineFilledTiles[j].value;
        }
      }
      // LOG && window.console.log(state.grids, "grids");
      return {
        ...state,
        grids: grids,
        tiles: transferGridsToTiles({ row, column }, grids),
      };
    }
    case "TILES_SLIDE_RIGHT": {
      const [row, column] = action.boardSize;
      const filledTiles = getFilledTiles(state, action.boardSize);
      let grids = state.grids;
      let lineFilledTiles = [];
      for (let i = 0; i < row; i++) {
        // for example: the first row is [0, 2, 0, 4], find the tiles is not 0
        lineFilledTiles = filledTiles
          .filter(function (item) {
            return item.row === i;
          })
          .reverse();
        // {row: 0, column: 3, value: 4}
        // {row: 0, column: 1, value: 2}
        for (let j = 0; j < lineFilledTiles.length; j++) {
          // [0, 0, 0, 0];
          grids[lineFilledTiles[j].row][lineFilledTiles[j].column] = 0;
          // [0, 0, 2, 4];
          grids[i][column - 1 - j] = lineFilledTiles[j].value;
        }
      }
      // LOG && window.console.log(state.grids, "grids");
      return {
        ...state,
        grids: grids,
        tiles: transferGridsToTiles({ row, column }, grids),
      };
    }
    // If two tiles of the same number collide while moving,
    // they will merge into a tile with the total value of the two tiles that collided.
    // The resulting tile cannot merge with another tile again in the same move
    // [4, 2, 2, 0] -> [4, 4, 0, 0]
    // If a move causes three consecutive tiles of the same value to slide together,
    // only the two tiles farthest along the direction of motion will combine.
    // [2, 2, 2, 0] -> [4, 0, 2, 0]
    // If all four spaces in a row or column are filled with tiles of the same value,
    // a move parallel to that row/column will combine the first two and last two.
    // [2, 2, 2, 2] -> [4, 0, 4, 0]
    case "MERGE_COLLIDED_TILES_UP_MOVE": {
      state.isCollided = false;
      const [row, column] = action.boardSize;
      let grids = state.grids;
      for (let i = 0; i < column; i++) {
        top: for (let j = 0; j < row - 1; j++) {
          // if a tile is not zero and it is the same as the down neighbor, this tile multiple 2
          // increase current score here
          // the right neighbor becomes zero then
          // [2,     [4,
          //  2,  ->  0,
          //  4,      4,
          //  0]      0]
          // [0][0]
          // [1][0]
          if (grids[j][i] > 0 && grids[j][i] === grids[j + 1][i]) {
            state.isCollided = true;
            grids[j][i] *= 2;
            increaseScore(state, grids[j][i]);
            grids[j + 1][i] = 0;
            break top;
          }
        }
      }
      return { ...state };
    }
    case "MERGE_COLLIDED_TILES_DOWN_MOVE": {
      state.isCollided = false;
      const [row, column] = action.boardSize;
      let grids = state.grids;
      for (let i = 0; i < column; i++) {
        top: for (let j = row - 1; j > 0; j--) {
          // if a tile is not zero and it is the same as the up neighbor, this tile multiple 2
          // increase current score here
          // the right neighbor becomes zero then
          // [2,     [0,
          //  2,  ->  4,
          //  4,      4,
          //  0]      0]
          // [3][0]
          // [2][0]
          // [1][0]
          if (grids[j][i] > 0 && grids[j][i] === grids[j - 1][i]) {
            state.isCollided = true;
            grids[j][i] *= 2;
            increaseScore(state, grids[j][i]);
            grids[j - 1][i] = 0;
            break top;
          }
        }
      }
      return {
        ...state,
      };
    }
    case "MERGE_COLLIDED_TILES_LEFT_MOVE": {
      state.isCollided = false;
      const [row, column] = action.boardSize;
      let grids = state.grids;
      for (let i = 0; i < row; i++) {
        top: for (let j = 0; j < column - 1; j++) {
          // if a tile is not zero and it is the same as the right neighbor, this tile multiple 2
          // increase current score here
          // the right neighbor becomes zero then
          // [2, 2, 4, 0] -> [4, 0, 4, 0]
          if (grids[i][j] > 0 && grids[i][j] === grids[i][j + 1]) {
            state.isCollided = true;
            grids[i][j] *= 2;
            increaseScore(state, grids[i][j]);
            grids[i][j + 1] = 0;
            break top;
          }
        }
      }
      return {
        ...state,
      };
    }
    case "MERGE_COLLIDED_TILES_RIGHT_MOVE": {
      state.isCollided = false;
      const [row, column] = action.boardSize;
      let grids = state.grids;
      for (let i = 0; i < row; i++) {
        top: for (let j = column - 1; j > 0; j--) {
          // if a tile is not zero and it is the same as the right neighbor, this tile multiple 2
          // increase current score here
          // the right neighbor becomes zero then
          // [2, 2, 4, 0] -> [4, 0, 4, 0]
          // [0][3]
          // [0][2]
          // [0][1]
          if (grids[i][j] > 0 && grids[i][j] === grids[i][j - 1]) {
            state.isCollided = true;
            grids[i][j] *= 2;
            increaseScore(state, grids[i][j]);
            grids[i][j - 1] = 0;
            break top;
          }
        }
      }
      return {
        ...state,
      };
    }
    case "WIN":
      return {
        ...state,
        status: {
          gameEnd: true,
          win: true,
          gameOver: false,
          keepGoing: false,
        },
      };
    case "GAME_OVER":
      return {
        ...state,
        status: {
          gameEnd: true,
          win: false,
          gameOver: true,
          keepGoing: false,
        },
      };
    case "kEEP_GOING":
      return {
        ...state,
        status: {
          gameEnd: false,
          win: false,
          gameOver: false,
          keepGoing: true,
        },
      };
    case "SET_MAX_UNDO_STEPS_AMOUNT":
      return {
        ...state,
        maxUndoStepsAmount: action.playload,
      };
    case "ADD_UNDO_STEPS":
      let clonedState = JSON.parse(JSON.stringify(state));
      state.undoSteps.push({
        tiles: clonedState.tiles,
        grids: clonedState.grids,
        stats: clonedState.stats,
        isCollided: clonedState.isCollided,
        status: clonedState.status,
      });
      if (state.undoSteps.length - 1 > state.maxUndoStepsAmount)
        state.undoSteps.shift();
      return {
        ...state,
      };
    case "UNDO":
      state.undoSteps.splice(-1, 1);
      const clonedUndoStep = JSON.parse(
        JSON.stringify(state.undoSteps[state.undoSteps.length - 1])
      );
      state.tiles = clonedUndoStep.tiles;
      state.grids = clonedUndoStep.grids;
      state.stats = clonedUndoStep.stats;
      state.isCollided = clonedUndoStep.isCollided;
      state.status = clonedUndoStep.status;
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default tilesReducer;
