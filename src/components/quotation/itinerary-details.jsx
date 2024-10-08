import React, { Component } from "react";
import QuotationDetailsItems from "./quotation-details-items";
import Amount from "../../helpers/amount";
import ActionModal from "../../helpers/action-modal";
import SVGIcon from "../../helpers/svg-icon";
import moment from "moment";
import Date from "../../helpers/date";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import GetItineraryItemByDay from "./get-itinerary-Items-by-day";
class ItineraryDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteItem: "",
      isDeleteConfirmPopup: false,
    };
  }

  handleItemDelete = (item) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.props.type === "Quotation" ? "QuotationDetails~quotation-delete-item" : "ItineraryDetails~itineraries-delete-item"))) {
      this.setState({ deleteItem: item, isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    }
    else {
      this.props.handleItemDelete(item);
    }
  };

  handleConfirmDelete = (isConfirmDelete) => {
    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.props.handleItemDelete(this.state.deleteItem);
  };

  render() {
    const css = `.dayview-items {
      padding: 0px 0px 4px 38px;
      margin: 8px 0px -8px 0px;
    }`;
    const { isDeleteConfirmPopup } = this.state;
    const { items, duration, startDate, userInfo, type } = this.props;
    let count = duration && !isNaN(Number(duration)) ? Math.ceil(duration) : 4;
    let day = moment(this.props.endDate).diff(moment(startDate), "days") + 1;
    if (count < day) {
      count += 1;
    }
    const totalDays = [...Array(count).keys()];
    let totalPrice = 0;
    items.map(
      (item) =>
        item.offlineItem && (totalPrice = Number(totalPrice) +
          (Number(item.offlineItem.totalAmount) > 0 ? Number(item.offlineItem.totalAmount) : Number(item.offlineItem.sellPrice))
        ))
    let dayArr = [];
    totalDays.map((day) => {
      dayArr.push({ day: day + 1, isHotel: [] });
      items.map(
        (item) =>
          item.offlineItem &&
          day + 1 === Number(items && item.offlineItem.day) &&
          item.offlineItem.business === "hotel" &&
          dayArr[day].isHotel.push(item.offlineItem.business)
      );
    });
    let tmpTypeConcate = type.includes('Master') ? "master-" : '';
    return (
      <div className="quotation-details border shadow-sm mt-3">
        <style>{css}</style>
        <div className="border-bottom bg-light d-flex p-3">
          <div className="mr-auto d-flex align-items-center">
            <SVGIcon
              name={"file-text"}
              className="mr-2 d-flex align-items-center"
              width="24"
              type="fill"
            ></SVGIcon>
            <h6 className="font-weight-bold m-0 p-0">Itinerary Details</h6>
          </div>
          <AuthorizeComponent
            title={"ItineraryDetails~" + tmpTypeConcate + "itinerary-terms-and-conditions"}
            type="button"
            rolepermissions={this.props.userInfo.rolePermissions}
          >

            <button
              className="btn btn-sm btn-outline-primary ml-2 mr-2 pull-right"
              onClick={() => this.props.savetermsconditions()}
            >
              Terms & Conditions
            </button>
          </AuthorizeComponent>
        </div>

        <div className="dayview pt-4 pl-3 pr-3">
          <ul className="list-unstyled dayview-days">
            {totalDays.map((day, key) => {
              var itineraryItems = GetItineraryItemByDay(day, items, this.props.type, userInfo, this.handleItemDelete, this.props.handleItemEdit, this.props.isRemovePriceAndActionButton);
              return (<li className="dayview-day position-relative" key={key}>
                {(itineraryItems.length > 0 || items.length === 0 || this.props.packagePricingData) &&
                  <div className="d-flex align-items-center">
                    <h4>{day + 1}</h4>
                    <h5>
                      Day {day + 1}
                      <small className="ml-1 text-secondary">
                        - {<Date date={moment(startDate).add(day, "days").format("MM/DD/YYYY")} />}
                      </small>
                    </h5>
                  </div>}
                <div className="dayview-items">
                  {itineraryItems}
                </div>

                {dayArr[day].isHotel.length > 1 && (
                  <div
                    className="d-flex position-absolute align-itmes-center alert alert-danger"
                    style={{ top: "0px", right: "0px", padding: "4px 8px" }}
                  >
                    <SVGIcon
                      name={"info-circle"}
                      className="mr-1 d-flex align-items-center"
                      width="22"
                      type="fill"
                    ></SVGIcon>
                    <small className="d-flex align-items-center">
                      You have added another hotel on the same day.
                    </small>
                  </div>
                )}
              </li>
              )
            }
            )}
            <li className="dayview-day dayview-day-total">
              <div>
                <div className="d-flex align-items-center">
                  <h4></h4>
                </div>
              </div>
            </li>
          </ul>

          <div className="dayview-day-total-price text-center">
            <div className="bg-light d-inline-block border">
              Total Price:{" "}
              <b className="text-primary ml-1">
                <Amount amount={totalPrice} />
              </b>
            </div>
          </div>
        </div>

        {isDeleteConfirmPopup && (
          <ActionModal
            title="Confirm Delete"
            message="Are you sure you want to delete this item?"
            positiveButtonText="Confirm"
            onPositiveButton={() => this.handleConfirmDelete(true)}
            handleHide={() => this.handleConfirmDelete(false)}
          />
        )}
      </div>
    );
  }
}

export default ItineraryDetails;
