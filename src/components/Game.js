import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import Board from "./Board";
import Tile from "./Tile";
import addSwipeListenner from "../utils/swipe.js";
// const LOG = window._env_.LOG;

const Game = forwardRef((props, ref) => {
  const {
    tiles,
    grids,
    isCollided,
    keepGoing,
    winTileValue,
    boardSize,
  } = useSelector((state) => ({
    tiles: state.tiles.tiles,
    grids: state.tiles.grids,
    isCollided: state.tiles.isCollided,
    keepGoing: state.tiles.status.keepGoing,
    winTileValue: state.board.winTileValue,
    boardSize: state.board.boardSize,
  }));

  const game = useRef();
  const localState = useRef([
    tiles,
    grids,
    isCollided,
    keepGoing,
    winTileValue,
    boardSize,
  ]);

  useEffect(() => {
    localState.current = {
      tiles,
      grids,
      isCollided,
      keepGoing,
      winTileValue,
      boardSize,
    };
  }, [tiles, grids, isCollided, keepGoing, winTileValue, boardSize]);

  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    addSwipeListenner(game.current, move);
    if (tiles.length === 0) {
      dispatch({ type: "INIT_GRIDS_Tiles", boardSize: boardSize });
      // Every turn, two new tiles randomly appear in an empty spot on the board
      // with a value of either 2 or 4.
      for (let index = 0; index < props.initalTiles; index++) {
        dispatch({ type: "ADD_NEW_GRID_TILE", boardSize: boardSize });
        if (index + 1 === props.initalTiles)
          dispatch({ type: "ADD_UNDO_STEPS" });
      }
    }
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    addKeyboard() {
      document.addEventListener("keydown", onKeyDown);
    },
  }));

  const onKeyDown = (evt) => {
    let keyCode = { 38: "↑", 40: "↓", 37: "←", 39: "→" };
    let direction = keyCode[evt.keyCode];
    if (!direction) return;
    move(evt.key);
    evt.preventDefault();
  };
  const isGameOver = () => {
    return !(
      canTilesSlideUp() ||
      canTilesSlideDown() ||
      canTilesSlideLeft() ||
      canTilesSlideRight()
    );
  };
  const isWin = () => {
    if (!localState.current.keepGoing) {
      const [row, column] = localState.current.boardSize;
      let grids = [...localState.current.grids];
      let maxValue = 0;
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
          window.console.log(grids[i][j], i, j);
          if (maxValue < grids[i][j]) {
            maxValue = grids[i][j];
          }
        }
      }
      return maxValue === winTileValue;
    }
  };
  const canTilesSlideUp = () => {
    window.console.log(localState.current, "localState");
    const [row, column] = localState.current.boardSize;
    let grids = [...localState.current.grids];
    window.console.log(grids, "grids");
    for (let i = 0; i < column; i++) {
      for (let j = 0; j < row - 1; j++) {
        // LOG && window.console.log(j, i, "grid");
        // LOG && window.console.log(grids[j + 1][i], j, i, "grid");
        // The tile itself is not 0, it is the same as its down neighbor
        // [0][0]
        // [1][0]
        if (grids[j][i] > 0 && grids[j][i] === grids[j + 1][i]) return true;
        // The tile itself is 0, its down neighbor is not 0
        if (grids[j][i] === 0 && grids[j + 1][i] > 0) return true;
      }
    }
    return false;
  };
  const canTilesSlideDown = () => {
    const [row, column] = localState.current.boardSize;
    let grids = [...localState.current.grids];
    // window.console.log(grids, "grids");
    for (let i = 0; i < column; i++) {
      for (let j = 0; j < row - 1; j++) {
        // window.console.log(grids[j + 1][i], j, i, "grid");
        // window.console.log(grids[j][i], j, i, "grid");
        //The tile itself is not 0, it is the same as its up neighbor
        if (grids[j + 1][i] > 0 && grids[j + 1][i] === grids[j][i]) return true;
        // The tile itself is 0, its up neighbor is not 0
        if (grids[j + 1][i] === 0 && grids[j][i] > 0) return true;
      }
    }
    return false;
  };
  const canTilesSlideLeft = () => {
    const [row, column] = localState.current.boardSize;
    let grids = [...localState.current.grids];
    // window.console.log(grids, "grids");
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column - 1; j++) {
        // window.console.log(grids[i][j + 1], i, j, "grid");
        // window.console.log(grids[i][j], i, j, "grid");
        // The tile itself is 0, its right neighbor is not 0
        if (grids[i][j] === 0 && grids[i][j + 1] > 0) return true;
        //The tile itself is not 0, it is the same as its right neighbor
        if (grids[i][j] > 0 && grids[i][j] === grids[i][j + 1]) return true;
      }
    }
    return false;
  };
  const canTilesSlideRight = () => {
    const [row, column] = localState.current.boardSize;
    let grids = [...localState.current.grids];
    window.console.log(grids, "grids");
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column - 1; j++) {
        // window.console.log(grids[i][j], i, j, "grid");
        // window.console.log(grids[i][j + 1], i, j, "grid");
        // The tile itself is 0, its left neighbor is not 0
        if (grids[i][j + 1] === 0 && grids[i][j] > 0) return true;
        //The tile itself is not 0, it is the same as its left neighbor
        if (grids[i][j + 1] > 0 && grids[i][j + 1] === grids[i][j]) return true;
      }
    }
    return false;
  };
  const generateOneRandomTile = () => {
    console.log(localState.current.isCollided, "isCollided");
    if (!localState.current.isCollided)
      dispatch({
        type: "ADD_NEW_GRID_TILE",
        boardSize: localState.current.boardSize,
      });
  };
  const move = (direction) => {
    console.log(direction, "direction");
    switch (direction) {
      case "ArrowUp": {
        if (canTilesSlideUp()) {
          dispatch({
            type: "TILES_SLIDE_UP",
            boardSize: localState.current.boardSize,
          });
          dispatch({
            type: "MERGE_COLLIDED_TILES_UP_MOVE",
            boardSize: localState.current.boardSize,
          });
          dispatch({
            type: "TILES_SLIDE_UP",
            boardSize: localState.current.boardSize,
          });
          generateOneRandomTile();
          dispatch({ type: "ADD_UNDO_STEPS" });
        }
        break;
      }
      case "ArrowDown": {
        window.console.log("ArrowDown");
        if (canTilesSlideDown()) {
          dispatch({
            type: "TILES_SLIDE_DOWN",
            boardSize: localState.current.boardSize,
          });
          dispatch({
            type: "MERGE_COLLIDED_TILES_DOWN_MOVE",
            boardSize: localState.current.boardSize,
          });
          dispatch({
            type: "TILES_SLIDE_DOWN",
            boardSize: localState.current.boardSize,
          });
          generateOneRandomTile();
          dispatch({ type: "ADD_UNDO_STEPS" });
        }
        break;
      }
      case "ArrowLeft": {
        window.console.log("ArrowLeft");
        if (canTilesSlideLeft()) {
          dispatch({
            type: "TILES_SLIDE_LEFT",
            boardSize: localState.current.boardSize,
          });
          dispatch({
            type: "MERGE_COLLIDED_TILES_LEFT_MOVE",
            boardSize: localState.current.boardSize,
          });
          dispatch({
            type: "TILES_SLIDE_LEFT",
            boardSize: localState.current.boardSize,
          });
          generateOneRandomTile();
          dispatch({ type: "ADD_UNDO_STEPS" });
        }
        break;
      }
      case "ArrowRight": {
        window.console.log("ArrowRight");
        if (canTilesSlideRight()) {
          dispatch({
            type: "TILES_SLIDE_RIGHT",
            boardSize: localState.current.boardSize,
          });
          dispatch({
            type: "MERGE_COLLIDED_TILES_RIGHT_MOVE",
            boardSize: localState.current.boardSize,
          });
          dispatch({
            type: "TILES_SLIDE_RIGHT",
            boardSize: localState.current.boardSize,
          });
          generateOneRandomTile();
          dispatch({ type: "ADD_UNDO_STEPS" });
        }
        break;
      }
      default:
        window.console.log("Something went wrong!");
    }
    if (isGameOver()) {
      document.removeEventListener("keydown", onKeyDown);
      dispatch({ type: "GAME_OVER" });
    }
    if (isWin()) {
      document.removeEventListener("keydown", onKeyDown);
      dispatch({ type: "WIN" });
    }
  };

  const gameViewStyle = () => {
    window.console.log(tiles, "tiles");
    window.console.log(grids, "grids");
    return {
      width: props.width - 20 + "px",
      height: props.width - 20 + "px",
    };
  };

  return (
    <div className="game-board" style={gameViewStyle()} ref={game}>
      <Board />
      {tiles.map((tile, index) => {
        return <Tile key={index} tile={tile} />;
      })}
    </div>
  );
});

export default Game;
