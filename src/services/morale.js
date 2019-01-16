export const defaultMoraleBoost = facts => {
  console.log("USING DEFAULT MORALE BOOST");

  if (facts.isWin) {
    return 1;
  } else if (facts.isLoss) {
    return -1;
  }

  return 0;
};
