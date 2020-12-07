import { useRef, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const MenuSection = (props) => {
  const { undoStepsLength, boardSize } = useSelector(
    (state) => ({
      undoStepsLength: state.tiles.undoSteps.length - 1,
      boardSize: state.board.boardSize,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const localState = useRef([undoStepsLength, boardSize]);

  useEffect(() => {
    localState.current = {
      undoStepsLength,
      boardSize,
    };
  }, [undoStepsLength, boardSize]);

  const restart = () => {
    dispatch({
      type: "INIT_GRIDS_Tiles",
      boardSize: localState.current.boardSize,
    });
    for (let index = 0; index < props.initalTiles; index++) {
      dispatch({
        type: "ADD_NEW_GRID_TILE",
        boardSize: localState.current.boardSize,
      });
      if (index + 1 === props.initalTiles) dispatch({ type: "ADD_UNDO_STEPS" });
    }
  };

  const undo = () => {
    dispatch({ type: "UNDO" });
  };

  return (
    <div className="menu-section">
      <button onClick={restart}>Restart</button>
      <button onClick={undo} disabled={undoStepsLength < 1}>
        Undo ({undoStepsLength})
      </button>
    </div>
  );
};

export default MenuSection;
