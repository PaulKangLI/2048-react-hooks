import { useState, useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SelectBox from "./SelectBox";
const LOG = window._env_.LOG;

const Configuration = (props) => {
  const {
    row,
    column,
    winTileValue,
    maxUndoStepsAmount,
    boardSize,
  } = useSelector(
    (state) => ({
      row: state.board.boardSize[0],
      column: state.board.boardSize[1],
      winTileValue: state.board.winTileValue,
      maxUndoStepsAmount: state.tiles.maxUndoStepsAmount,
      boardSize: state.board.boardSize,
    }),
    shallowEqual
  );

  const localState = useRef(boardSize);

  useEffect(() => {
    localState.current = {
      boardSize,
    };
  }, [boardSize]);

  const dispatch = useDispatch();

  const [rowSize, setRowSize] = useState(row);
  const [columnSize, setColumnSize] = useState(column);
  const [goal, setGoal] = useState(winTileValue);
  const [maxUndoStepsAmountSize, setmaxUndoStepsAmount] = useState(
    maxUndoStepsAmount
  );

  const restartGame = () => {
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

  const onChangeRow = (event) => {
    const row = parseInt(event.target.value);
    LOG && window.console.log(row);
    setRowSize(row);
    dispatch({ type: "SET_ROW", playload: row });
    restartGame();
  };

  const onChangeColumn = (event) => {
    const column = parseInt(event.target.value);
    LOG && window.console.log(column);
    setColumnSize(column);
    dispatch({ type: "SET_COLUMN", playload: column });
    restartGame();
  };

  const onChangeGoal = (event) => {
    const goal = parseInt(event.target.value);
    LOG && window.console.log(goal);
    setGoal(goal);
    dispatch({ type: "SET_GOAL", playload: goal });
    restartGame();
  };

  const onChangeUndoSteps = (event) => {
    const maxUndoStepsAmount = parseInt(event.target.value);
    LOG && window.console.log(maxUndoStepsAmount);
    setmaxUndoStepsAmount(maxUndoStepsAmount);
    dispatch({
      type: "SET_MAX_UNDO_STEPS_AMOUNT",
      playload: maxUndoStepsAmount,
    });
    restartGame();
  };

  return (
    <div className="configuration">
      <SelectBox
        value={rowSize}
        label="Row"
        info="Please select row amount"
        minValue={3}
        maxValue={6}
        onChange={onChangeRow}
      />
      <SelectBox
        value={columnSize}
        label="Column"
        info="Please select column amount"
        minValue={3}
        maxValue={6}
        onChange={onChangeColumn}
      />
      <SelectBox
        value={goal}
        label="Goal"
        info="Please select goal"
        minValue={3}
        maxValue={12}
        onChange={onChangeGoal}
      />
      <SelectBox
        value={maxUndoStepsAmountSize}
        label="Undo Steps"
        info="Please select undo steps amount"
        minValue={1}
        maxValue={4}
        onChange={onChangeUndoSteps}
      />
    </div>
  );
};

export default Configuration;
