import React, { Component } from "react";
import Loader from "../common/loader";
import QuotationRooms from "../details/quotation-rooms";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import Schedule from "../details/quotation-schedule";
import QuotationDetailsPopup from "../quotation/quotation-details-popup";

class QuotationQuickBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "availability",
      isBtnLoading: false,
      data:
        this.props.businessName === "transportation"
          ? this.transportationgetJsonData(this.props.details)
          : null,
      isErrorMessage: false,
    };
  }

  handleCart = (id, code, room) => {
    let item = { itemDtl: this.props.details, roomDtl: room, roomId: id, roomCode: code };
    
    if(this.props.businessName === "transfers"){
      item.itemDtl.locationInfo.fromLocation = this.props.requestObject().Request.CriteriaInfo[0].LocationInfo.FromLocation;
      item.itemDtl.locationInfo.toLocation = this.props.requestObject().Request.CriteriaInfo[1].LocationInfo.FromLocation;
      item.itemDtl.pickupTime = (this.props.requestObject().Request.CriteriaInfo[0].DateInfo.StartTime+":"+this.props.requestObject().Request.CriteriaInfo[0].DateInfo.EndTime);
      item.itemDtl.fromLocation = this.props.requestObject().Request.CriteriaInfo[0].LocationInfo.FromLocation.Name;
      item.itemDtl.toLocation = this.props.requestObject().Request.CriteriaInfo[1].LocationInfo.FromLocation.Name;
    }
    
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
                    {businessName === "hotel" && (
                      <QuotationRooms
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
          <QuotationDetailsPopup
            details={details}
            businessName={businessName}
            hideQuickBook={this.hideQuickBook}
          />
        )}
      </React.Fragment>
    );
  }
}

export default QuotationQuickBook;
