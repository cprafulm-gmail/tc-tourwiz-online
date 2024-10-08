import React, { Component } from "react";
import HotelPaxWidget from "../../components/search/hotel-pax-widget";
import HotelPaxWidgetUmrah from "../../components/search/hotel-pax-widget-umrah";
import ActivityPaxWidget from "../../components/search/activity-pax-widget";
import TransfersPaxWidget from "../../components/search/transfers-pax-widget";
import DateRangePicker from "../../components/common/date-range";
import { Trans } from "../../helpers/translate";

class ChangeDatesOccupancy extends Component {
  constructor(props) {
    super(props);
    this.state = { isShow: true };
  }

  changeStatus = () => {
    this.setState({ isShow: !this.state.isShow });
  };
  render() {
    return (
      <div className="availability row mb-4 m-0">
        <h4 className="font-weight-bold d-inline-block">
          {Trans("_titleAvailability")}
        </h4>

        {this.state.isShow && (
          <div className="col-12 row border m-0 p-3">
            <div className="col-12">
              {/* <h4 className="font-weight-bold">
            {Trans("_lblChangeDatesandOccupancy")}
          </h4> */}
            </div>
            <div className="col-5 search-widget">
              <DateRangePicker
                isValid={this.props.dateIsValid}
                cutOfDays={1}
                stayInDays={2}
                minDays={localStorage.getItem("isUmrahPortal") ? 5 : 1}
                maxDays={localStorage.getItem("isUmrahPortal") ? 30 : 5}
                isSingleDateRangePicker={this.props.businessName === "transfers"
                  ? !this.props.isTripDirectionRoundtrip : false}
                handleDateChange={this.props.handleDateChange}
                dates={this.props.dates}
                business={this.props.businessName}
                isTripDirectionRoundtrip={this.props.businessName === "transfers"
                  ? this.props.isTripDirectionRoundtrip : true}
              />
            </div>
            <div className="col-4">
              {this.props.businessName === "hotel" && localStorage.getItem("isUmrahPortal") ? (
                <HotelPaxWidgetUmrah
                  handlePax={this.props.handlePax}
                  isValid={this.props.paxIsValid}
                  roomDetails={this.props.paxInfo}
                  totalNoOfAdult="0"
                  totalNoOfChild="0"
                />
              ) : this.props.businessName === "hotel" ? (
                < HotelPaxWidget
                  handlePax={this.props.handlePax}
                  isValid={this.props.paxIsValid}
                  roomDetails={this.props.paxInfo}
                  totalNoOfAdult={this.props.totalNoOfAdult}
                  totalNoOfChild={this.props.totalNoOfChild}
                ></HotelPaxWidget>
              ) : this.props.businessName === "activity" ||
                this.props.businessName === "package" ? (
                <ActivityPaxWidget
                  handlePax={this.props.handlePax}
                  isValid={this.props.paxIsValid}
                  paxDetails={this.props.paxInfo}
                  ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                  isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                  businessName={this.props.businessName}
                />
              ) : this.props.businessName === "transfers" ? (
                <TransfersPaxWidget
                  handlePax={this.props.handlePax}
                  isValid={this.props.paxIsValid}
                  paxDetails={this.props.paxInfo}
                  ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                  isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                />
              ) : null}
            </div>
            <div className="col-3">
              <div className="form-group">
                <label>&nbsp;</label>
                <div className="bg-white  rounded-sm room-selector">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => this.props.changeDatesAndPaxAction()}
                  >
                    {Trans("_availability")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
        }
      </div>
    );
  }
}

export default ChangeDatesOccupancy;
