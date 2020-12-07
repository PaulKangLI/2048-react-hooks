const LOG = window._env_.LOG;

const initState = {
  winTileValue: 2048,
  boardSize: [4, 4], //row, column
};

const boardReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_WIN_TILE_VALUE":
      return {
        ...state,
        winTileValue: action.winTileValue,
      };
    case "SET_ROW":
      state.boardSize.splice(0, 1, action.playload);
      return {
        ...state,
      };
    case "SET_COLUMN":
      state.boardSize.splice(1, 1, action.playload);
      return {
        ...state,
      };
    case "SET_GOAL":
      LOG && console.log(state.winTileValue, "winTileValue");
      return {
        ...state,
        winTileValue: action.playload,
      };
    default:
      return state;
  }
};

export default boardReducer;
