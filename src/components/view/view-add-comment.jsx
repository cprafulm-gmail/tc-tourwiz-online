import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";

class ViewAddComment extends Form {
  constructor(props) {
    super(props);
    this.state = {
      isBtnLoading: false,
      data: {
        comment: ""
      },
      errors: {}
    };
  }

  handleSubmit = () => {
    const errors = {};
    const { data } = this.state;
    if (!this.validateFormData(data.comment, "require"))
      errors.comment = Trans("_error_comment_require");
    this.setState({ errors: errors || {} });
    if (Object.keys(errors).length > 0)
      return;
    this.setState({ isBtnLoading: true }, () => this.props.handleAddComment(escape(this.state.data.comment), this.props.itineraryID, this.props.bookingID));
  };

  render() {
    return (
      <div className="card shadow-sm mb-3">
        <div className="card-header">
          <h5 className="m-0 p-0">{Trans("_addComment")}</h5>
        </div>
        <div className="card-body">
          <ul className="list-unstyled p-0 m-0">
            <li className="row">
              <b className="col-lg-12">
                {this.renderTextarea("comment", "")}
              </b>
              {!this.state.isBtnLoading ?
                <button
                  className="btn btn-primary ml-3"
                  onClick={this.handleSubmit}
                >
                  {Trans("_addComment")}
                </button>
                :
                <button className="btn btn-primary ml-3">
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                  {Trans("_addComment")}
                </button>}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ViewAddComment;