import { shallowEqual, useSelector } from "react-redux";
import Tile from "./Tile";

const Board = () => {
  const { row, column } = useSelector(
    (state) => ({
      row: state.board.boardSize[0],
      column: state.board.boardSize[1],
    }),
    shallowEqual
  );

  return (
    <div className="board">
      {[...Array(row).keys()].map((rowSize, rowIndex) => {
        return (
          <div key={rowIndex}>
            {[...Array(column).keys()].map((columnSize, columnIndex) => {
              return (
                <Tile
                  key={(rowIndex, columnIndex)}
                  tile={{
                    row: rowSize,
                    column: columnSize,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
