const advance = turn => {
  if (turn.get("round") === 30) {
    return turn.update("season", s => s + 1).set("round", 1);
  }
  return turn.update("round", r => r + 1);
};

export default {
  advance
};
