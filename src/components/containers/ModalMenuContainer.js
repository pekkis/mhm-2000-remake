import { connect } from "react-redux";
import ModalMenu from "../ModalMenu";
import { closeMenu } from "../../ducks/ui";
export default connect(
  undefined,
  { closeMenu }
)(ModalMenu);
