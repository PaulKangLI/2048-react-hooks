import { useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const GameEnd = (props) => {
  const { status } = useSelector(
    (state) => ({
      status: state.tiles.status,
    }),
    shallowEqual
  );

  const { boardSize } = useSelector((state) => ({
    boardSize: state.board.boardSize,
  }));

  const localState = useRef(boardSize);

  useEffect(() => {
    localState.current = {
      boardSize,
    };
  }, [boardSize]);

  const dispatch = useDispatch();

  const tryAgain = () => {
    props.handleClick();
    dispatch({
      type: "INIT_GRIDS_Tiles",
      boardSize: localState.current.boardSize,
    });
    // Every turn, two new tiles randomly appear in an empty spot on the board
    // with a value of either 2 or 4.
    for (let index = 0; index < props.initalTiles; index++) {
      dispatch({
        type: "ADD_NEW_GRID_TILE",
        boardSize: localState.current.boardSize,
      });
      if (index + 1 === props.initalTiles) dispatch({ type: "ADD_UNDO_STEPS" });
    }
  };

  const keepGoing = () => {
    props.handleClick();
    dispatch({ type: "kEEP_GOING" });
  };

  if (status.gameEnd) {
    return (
      <div
        className={
          "game-end " +
          Object.keys(status)
            .filter((k) => status[k])
            .join(" ")
        }
      >
        {status.gameOver ? (
          <div className="text">Game over!</div>
        ) : (
          <div className="text">You win!</div>
        )}
        <div className="buttons">
          <button onClick={tryAgain}>Try again</button>
          {status.win && <button onClick={keepGoing}>Keep going</button>}
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default GameEnd;
