const MaxRound = props => {
  const { turn, max, children, fallback } = props;
  if (turn.get("round") <= max) {
    return children;
  }
  return fallback || null;
};

export default MaxRound;
