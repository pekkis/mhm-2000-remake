import PropTypes from "prop-types";

const Season = props => {
  const { index, long } = props;

  if (!long) {
    return index + 1998;
  }

  return `${index + 1997}-${index + 1998}`;
};

Season.propTypes = {
  index: PropTypes.number.isRequired,
  long: PropTypes.bool.isRequired
};

Season.defaultProps = {
  long: false
};

export default Season;
