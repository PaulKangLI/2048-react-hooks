import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";

export const Tile = (props) => {
  const { boardSize } = useSelector(
    (state) => ({
      boardSize: state.board.boardSize,
    }),
    shallowEqual
  );

  useEffect(() => {
    console.log(props.tile.value, "props");
  }, [props]);

  const tileClass = () => {
    const { value } = props.tile;
    return "tile-" + (value > 16384 ? "higher" : value);
  };

  const tileStyle = () => {
    const [rowSize, columSzie] = boardSize;
    const { row, column } = props.tile;
    return {
      width: 100 / columSzie + "%",
      height: 100 / rowSize + "%",
      transform: `translate3d(${column * 100}%,${row * 100}%,0)`,
    };
  };

  if (props.tile.value) {
    return (
      <div className="tile-item">
        <div className={"tile " + tileClass()} style={tileStyle()}>
          <div className="value">{props.tile.value ?? props.tile.value}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="tile-item">
        <div className="tile" style={tileStyle()}>
          <div className="value"></div>
        </div>
      </div>
    );
  }
};

export default Tile;
