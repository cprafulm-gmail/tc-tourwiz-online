import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import UmrahPackageAddOffline from "./umrah-package-add-offline";
import { UmrahPackageGetItem } from "../umrah-package/umrah-package-get-cart-item";

class UmrahPackageItineraryAddOffline extends Component {
  constructor(props) {
    super(props);
    this.state = { isShow: true };
  }

  handleOffline = (item) => {
    this.props.handleOffline(item);
    this.setState({ isShow: false });
  };

  render() {
    const { type } = this.props;
    const cartItem = this.props.importItem && UmrahPackageGetItem(this.props.importItem);
    return (
      this.state.isShow && (
        <div>
          <div className="quotation-add-items border shadow-sm mt-4">
            <div className="d-flex border-bottom p-2 pl-3 pr-3 m-0 bg-light">
              <div className="mr-auto d-flex align-items-center">
                <SVGIcon
                  className="mr-2 d-flex align-items-center"
                  name={cartItem.business + "new"}
                  width="24"
                  type="fill"
                ></SVGIcon>
                <h6 className="font-weight-bold m-0 p-0">Edit Details</h6>
              </div>
            </div>

            <UmrahPackageAddOffline
              type={type}
              business={cartItem.business}
              importItem={cartItem}
              handleOffline={this.handleOffline}
              handleDateChange={this.props.setDate}
            />
          </div>
        </div>
      )
    );
  }
}

export default UmrahPackageItineraryAddOffline;
