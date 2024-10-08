import React, { Component } from "react";
import Loader from "../common/loader";
import UmrahPackageRooms from "../details/umrah-package-rooms";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import Schedule from "../details/quotation-schedule";
import UmrahPackageDetailsPopup from "../umrah-package/umrah-package-details-popup";
import UmrahPackageQuickbookTransportation from "../details/umrah-package-quickbook-transportation"
import UmrahPackageQuickbookGroundService from "../details/umrah-package-quickbook-groundservice"

class UmrahPackageQuickBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "availability",
      isBtnLoading: false,
      data:
        this.props.businessName === "transportation"
          ? this.transportationgetJsonData(this.props.details)
          : this.props.businessName === "groundservice"
            ? this.groundservicegetJsonData(this.props.details)
            : null,
      isErrorMessage: false,
    };
  }

  groundservicegetJsonData = (details) => {
    let jsonData = details.items[0].item.map((item) => {
      return {
        id: item.id,
        code: item.code,
        specialRequests: !item.specialRequests
          ? []
          : item.specialRequests
            .find((x) => x.categoryName === "additionalServices")
            .specialRequestItems.map((sp) => {
              return {
                id: sp.id,
                amount: sp.displayCharges.find((x) => x.purpose === "10")
                  .amount,
                currencyCode: sp.displayCharges.find((x) => x.purpose === "10")
                  .currencyCode,
                name: sp.name,
                duration: sp.duration
              };
            }),
      };
    });
    return jsonData;
  };

  //Transportation Method
  transportationgetJsonData = (details) => {
    let jsonData = details.items[0].item.map((item) => {
      return {
        id: item.id,
        code: item.code,
        vehicle: 0,
        pax: 0,
        amount:
          item.displayRateInfo.find((x) => x.purpose === "10").amount
        ,
        specialRequests: !item.specialRequests
          ? []
          : item.specialRequests
            .find((x) => x.categoryName === "additionalServices")
            .specialRequestItems.map((sp) => {
              return {
                id: sp.id,
                amount: sp.displayCharges.find((x) => x.purpose === "10")
                  .amount,
                isSelected: false,
              };
            }),
      };
    });
    return jsonData;
  };

  handleCart = (id, code, room) => {
    let item = { itemDtl: this.props.businessName === "transportation" || this.props.businessName === "groundservice" ? this.props : this.props.details, roomDtl: room, roomId: id, roomCode: code };
    if (this.props.businessName === "hotel")
      item.itemDtl.locationInfo.fromLocation.Id = this.props.requestObject().Request.CriteriaInfo[0].LocationInfo.FromLocation.ID.split('_')[0];

    if (this.props.businessName === "transportation") {
      var data = this.state.data.reduce(
        (sum, item) =>
        (sum = {
          vehicle: sum.vehicle + parseInt(item.vehicle),
          pax: sum.pax + (parseInt(item.vehicle) > 0 ? parseInt(item.pax) : 0),
        }),
        { vehicle: 0, pax: 0 }
      );
      let nofpax = parseInt(this.props.requestObject().Request.PaxInfo[0].Item[0].Quantity);
      let nofvehicle = parseInt(
        this.props.requestObject().Request.Filters.filter((x) => x.Column === "quantity")[0].Query
      );
      if (data.vehicle !== nofvehicle || data.pax !== nofpax) {
        this.setState({ isErrorMessage: true });
        return;
      } else this.setState({ isErrorMessage: false });
      this.props.handleCart(
        code,
        this.state.data.filter((x) => x.vehicle > 0 && x.pax > 0),
        this.props.details.token,
        item
      );
    } else this.props.handleCart(id, code, this.props.details.id, item);
  };

  hideQuickBook = () => {
    this.props.hideQuickBook();
  };

  render() {
    const { businessName, details, detailPopup } = this.props;
    return (
      <React.Fragment>
        {!detailPopup && (
          <React.Fragment>
            {details !== "" && (
              <div className="col-lg-12 border mt-3">
                <div className="quick-book-cont">
                  <div className="quick-book">
                    {businessName === "transportation" && (
                      <UmrahPackageQuickbookTransportation
                        handleCart={this.handleCart}
                        isBtnLoading={this.props.isBtnLoading}
                        data={this.state.data}
                        details={this.props.details}
                        showPriceFarebreakup={this.props.showPriceFarebreakup}
                        requestObject={this.props.requestObject}
                        isErrorMessage={this.state.isErrorMessage}
                      />
                    )}
                    {businessName === "groundservice" && (
                      <UmrahPackageQuickbookGroundService
                        handleCart={this.handleCart}
                        isBtnLoading={this.props.isBtnLoading}
                        data={this.state.data}
                        details={this.props.details}
                        showPriceFarebreakup={this.props.showPriceFarebreakup}
                      />
                    )}
                    {businessName === "hotel" && (
                      <UmrahPackageRooms
                        {...details}
                        handleCart={this.handleCart}
                        showRoomTerms={this.props.showRoomTerms}
                        showPriceFarebreakup={this.props.showPriceFarebreakup}
                        handleShowPolicyPopup={this.props.handleShowPolicyPopup}
                        isBtnLoading={this.props.isBtnLoading}
                        handleShowPolicyPopup={this.props.handleShowPolicyPopup}
                        itemid={this.props.itemid}
                        type={this.props.type}
                      />
                    )}

                    {(businessName === "activity" || businessName === "transfers") && (
                      <Schedule
                        {...details}
                        handleCart={this.handleCart}
                        showRoomTerms={this.props.showRoomTerms}
                        showPriceFarebreakup={this.props.showPriceFarebreakup}
                        handleShowPolicyPopup={this.props.handleShowPolicyPopup}
                        isBtnLoading={this.props.isBtnLoading}
                        handleShowPolicyPopup={this.props.handleShowPolicyPopup}
                        itemid={this.props.itemid}
                        type={this.props.type}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {details === "" && (
              <div
                className="col-lg-12 border mt-3 d-flex align-items-center justify-content-center"
                style={{ minHeight: "160px" }}
              >
                {this.props.isDetailsResponseLoading && (
                  <React.Fragment>
                    <span
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        top: "10px",
                        right: "25px",
                      }}
                      onClick={() => this.hideQuickBook()}
                    >
                      <SVGIcon name="times"></SVGIcon>
                    </span>
                    <h5>{Trans("_detail" + businessName + "NotAvailable")}</h5>
                  </React.Fragment>
                )}

                {!this.props.isDetailsResponseLoading && <Loader />}
              </div>
            )}
          </React.Fragment>
        )}

        {detailPopup && (
          <UmrahPackageDetailsPopup
            details={details}
            businessName={businessName}
            hideQuickBook={this.hideQuickBook}
          />
        )}
      </React.Fragment>
    );
  }
}

export default UmrahPackageQuickBook;