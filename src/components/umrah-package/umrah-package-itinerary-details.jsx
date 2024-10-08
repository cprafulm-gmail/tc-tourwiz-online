import React, { Component } from "react";
import UmrahPackageDetailsItems from "./umrah-package-details-items";
import Amount from "../../helpers/amount";
import ActionModal from "../../helpers/action-modal";
import SVGIcon from "../../helpers/svg-icon";
import moment from "moment";

class UmrahPackageItineraryDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteItem: "",
      isDeleteConfirmPopup: false,
    };
  }

  handleItemDelete = (item) => {
    this.setState({ deleteItem: item, isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
  };

  handleConfirmDelete = (isConfirmDelete) => {
    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.props.handleItemDelete(this.state.deleteItem);
  };

  getDayNumber = (businessName, item, day) => {
    if (businessName === "hotel") {
      var umrahPackageDetails = JSON.parse(localStorage.getItem("umrahPackageDetails"));
      let dayStart = moment(item.offlineItem.startDate).diff(moment(umrahPackageDetails.startDate), "days") + 1;
      let dayEnd = dayStart + moment(item.offlineItem.endDate).diff(moment(item.offlineItem.startDate), "days");
      if (day >= dayStart && day <= dayEnd)
        return day;
      day++;
      return day;
    }
    else
      return Number(item.offlineItem.day);
  }
  render() {
    const { isDeleteConfirmPopup } = this.state;
    const { items, duration } = this.props;
    const count = duration && Math.ceil(duration);
    const totalDays = [...Array(count).keys()];
    let totalPrice = 0;
    items.map(
      (item) =>
        item.offlineItem && (totalPrice = Number(totalPrice) + Number(item.offlineItem.sellPrice))
    );
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

    return (
      <div className="quotation-details border shadow-sm mt-3">
        <div className="border-bottom bg-light d-flex p-3">
          <div className="mr-auto d-flex align-items-center">
            <SVGIcon
              name={"file-text"}
              className="mr-2 d-flex align-items-center"
              width="24"
              type="fill"
            ></SVGIcon>
            <h6 className="font-weight-bold m-0 p-0">Day Wise Urmah Package Details</h6>
          </div>
        </div>

        {this.props.type == "umrah-package" && items.map(
          (item, key) =>
            item.offlineItem && (
              <React.Fragment key={key}>
                {item.offlineItem.business === "groundservice" &&
                  <UmrahPackageDetailsItems
                    handleItemDelete={this.handleItemDelete}
                    item={item}
                  />
                }
              </React.Fragment>
            ))}

        {this.props.type == "umrah-package" && items.map(
          (item, key) =>
            item.offlineItem && (
              <React.Fragment key={key}>
                {item.offlineItem.business === "transportation" &&
                  <UmrahPackageDetailsItems
                    handleItemDelete={this.handleItemDelete}
                    item={item}
                  />
                }
              </React.Fragment>
            ))}
        <div className="dayview pt-4 pl-3 pr-3">
          <ul className="list-unstyled dayview-days">
            {totalDays.map((day, key) => (
              <li className="dayview-day position-relative" key={key}>
                <div className="d-flex align-items-center">
                  <h4>{day + 1}</h4>
                  <h5>Day {day + 1} - {moment(this.props.startDate).add(day, 'days').format("dddd, DD MMMM YYYY")}</h5>
                </div>

                <div className="dayview-items">
                  {items.map(
                    (item, key) =>
                      item.offlineItem && (
                        <React.Fragment key={key}>
                          {item.offlineItem.business === "air" &&
                            Number(day + 1) === Number(items && item.offlineItem.day) && (
                              <UmrahPackageDetailsItems
                                handleItemDelete={this.handleItemDelete}
                                item={item}
                                departFlight={false}
                                returnFlight={false}
                              />
                            )}

                          {item.offlineItem.business === "air" &&
                            item.offlineItem.isRoundTrip &&
                            Number(day + 1) === Number(items && item.offlineItem.day) && (
                              <UmrahPackageDetailsItems
                                handleItemDelete={this.handleItemDelete}
                                item={item}
                                departFlight={false}
                                returnFlight={false}
                              />
                            )}

                          {item.offlineItem.business !== "air" && this.props.type == "umrah-package" && item.offlineItem.business !== "transportation" && item.offlineItem.business !== "groundservice" &&
                            Number(day + 1) === this.getDayNumber(item.offlineItem.business, item, day + 1) && (
                              <UmrahPackageDetailsItems
                                handleItemDelete={this.handleItemDelete}
                                item={item}
                              />
                            )}
                        </React.Fragment>
                      )
                  )}
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
            ))}

            <li className="dayview-day dayview-day-total">
              <div>
                <div className="d-flex align-items-center">
                  <h4></h4>
                </div>
              </div>
            </li>
          </ul>

          <div className="dayview-day-total-price text-right">
            <div className="bg-light d-inline-block border">
              Total Price:{" "}
              <b className="text-primary ml-1">
                <Amount amount={totalPrice} />
              </b>
            </div>
          </div>
        </div>

        { isDeleteConfirmPopup && (
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

export default UmrahPackageItineraryDetails;
