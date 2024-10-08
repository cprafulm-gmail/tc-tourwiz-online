import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";

class HotelSpecialRequest extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        specialRequest: this.props.specialRequestvalue
      },
      errors: {}
    };
  }
  handleHidePopup = () => {
    this.props.handleHidePopup(
      this.state.data.specialRequest,
      this.props.cartItemID
    );
  };

  render() {
    return (
      <div>
        {this.renderTextarea("specialRequest", Trans("_haveSpecialRequest"))}

        <button
          className="btn btn-primary pull-right"
          onClick={this.handleHidePopup}
        >
          {Trans("_save")}
        </button>
      </div>
    );
  }
}

export default HotelSpecialRequest;
