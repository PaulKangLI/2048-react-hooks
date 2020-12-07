import { useState, useEffect, useRef } from "react";
import "./App.scss";
import Score from "./components/Score";
import Configuration from "./components/Configuration";
import MenuSection from "./components/MenuSection";
import GameEnd from "./components/GameEnd";
import Game from "./components/Game";
const LOG = window._env_.LOG;

const App = () => {
  const [width, setWidth] = useState(500);
  const [initalTiles] = useState(2);

  const container = useRef();

  const gameRef = useRef();

  useEffect(() => {
    LOG && console.log(container.current.clientWidth, "container");
    setWidth(container.current.clientWidth);
  }, [container]);

  const handleClick = () => {
    gameRef.current.addKeyboard();
  };

  return (
    <div className="App">
      <div className="container" ref={container}>
        <div className="header">
          <div>
            <h1>2048</h1>
            <Score width={width} />
          </div>
          <Configuration initalTiles={initalTiles} />
          <MenuSection initalTiles={initalTiles} />
        </div>
        <div className="game-view">
          <GameEnd handleClick={handleClick} initalTiles={initalTiles} />
          <Game ref={gameRef} width={width} initalTiles={initalTiles} />
        </div>
      </div>
    </div>
  );
};

export default App;
