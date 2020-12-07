import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";

const Score = (props) => {
  const { currentScore, bestScore } = useSelector(
    (state) => ({
      currentScore: state.tiles.stats.currentScore,
      bestScore: state.tiles.stats.bestScore,
    }),
    shallowEqual
  );
  useEffect(() => {});

  const scoreStyle = () => {
    return { width: props.width / 5 + "px" };
  };

  return (
    <div className="scores">
      <div className="score current-score" style={scoreStyle()}>
        <div className="name">SCORE</div>
        <div className="value">{currentScore}</div>
      </div>
      <div className="score" style={scoreStyle()}>
        <div className="name">BEST SCORE</div>
        <div className="value">{bestScore}</div>
      </div>
    </div>
  );
};

export default Score;
