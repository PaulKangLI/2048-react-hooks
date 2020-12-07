import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import boardReducer from "./boardReducer";
import tilesReducer from "./tilesReducer";
import { combineReducers } from "redux";

const appReducer = combineReducers({
  board: boardReducer,
  tiles: tilesReducer,
});
const store = createStore(appReducer, applyMiddleware(thunk));

export default store;
