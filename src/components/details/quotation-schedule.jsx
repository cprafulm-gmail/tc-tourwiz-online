import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import Datecomp from "../../helpers/date";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";
import HtmlParser from "../../helpers/html-parser";

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = { schedules: this.schedules };
  }
  schedules = this.props.items
    .flatMap((x) => x.item)
    .reduce(
      (res, current) => {
        if (
          res.item.find((x) => x.scheduleCode === current.code) !== undefined
        ) {
          res.item
            .find((x) => x.scheduleCode === current.code)
            .dates.push([current.dateInfo.startDate, current.id]);
        } else {
          res.item.push({
            scheduleCode: current.code,
            dates: [[current.dateInfo.startDate, current.id]],
            data: current,
            selectedDate: current.id,
          });
        }
        return res;
      },
      {
        item: [],
      }
    );

  setOptionSelection = (scheduleid, e) => {
    var schedules = this.state.schedules;
    schedules.item.find((x) => x.scheduleCode === scheduleid).selectedDate =
      e.target.value;
    this.setState({
      schedules: schedules,
    });
  };

  handleBookNow = (ScheduleCode) => {
    this.props.handleCart(
      this.state.schedules.item.find((x) => x.scheduleCode === ScheduleCode)
        .selectedDate,
      ScheduleCode
    );
  };

  render() {
    return (
      <div className="rooms row">
        <div className="col-12">
          <h4 className="font-weight-bold mb-3">
            {Trans("_titleScheduleAndRates")}
          </h4>
          {this.state.schedules.item.map((schedule, key) => {
            return (
              <div className="border-bottom" key={key}>
                <ul key={key} className="row list-unstyled m-0">
                  <li className="col-lg-6 p-2 d-flex align-items-center">
                    <b className="text-primary">
                      <HtmlParser text={schedule.data.name} />
                    </b>
                  </li>
                  <li className="col-lg-2 p-2 d-flex align-items-center justify-content-center">
                    {/* <select
                      className="form-control form-control-sm"
                      onChange={(e) =>
                        this.setOptionSelection(schedule.scheduleCode, e)
                      }
                    >
                      {schedule.dates.map((item, key) => {
                        return (
                          <option
                            key={item[1]}
                            value={item[1]}
                            defaultValue={schedule.selectedDate === item[0]}
                          >
                            {Datecomp({ date: item[0] })}
                          </option>
                        );
                      })}
                    </select> */}
                  </li>

                  <li className="col-lg-2 text-center d-flex align-items-center justify-content-center">
                    <div className="d-none">
                      <b
                        className={
                          Global.getEnvironmetKeyValue(
                            "portalType"
                          ).toLowerCase() !== "b2c"
                            ? "text-primary font-weight-bold"
                            : "text-primary font-weight-bold"
                        }
                      >
                        {schedule.data.displayAmount}
                      </b>
                    </div>
                  </li>

                  <li className="col-lg-2 p-2 d-flex align-items-center justify-content-end">
                    {this.props.isBtnLoading !== null &&
                      this.props.isBtnLoading !== false ? (
                      <button
                        className="btn btn-sm btn-light m-0 text-primary d-flex border text-nowrap"
                        onClick={() =>
                          this.handleBookNow(schedule.data.code, schedule)
                        }
                      >
                        <SVGIcon
                          name="plus"
                          width="12"
                          type="fill"
                          height="12"
                          className="mr-2"
                        ></SVGIcon>
                        Add to {this.props.type === "Quotation"
                          ? Trans("_quotationReplaceKey")
                          : this.props.type === "Quotation_Master"
                            ? "Master " + Trans("_quotationReplaceKey")
                            : this.props.type === "Itinerary_Master"
                              ? "Master Itinerary" : this.props.type}
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-light m-0 text-primary d-flex border text-nowrap"
                        onClick={() =>
                          this.handleBookNow(schedule.data.code, schedule)
                        }
                      >
                        <SVGIcon
                          name="plus"
                          width="12"
                          type="fill"
                          height="12"
                          className="mr-2"
                        ></SVGIcon>
                        Add to {this.props.type === "Quotation"
                          ? Trans("_quotationReplaceKey")
                          : this.props.type === "Quotation_Master"
                            ? "Master " + Trans("_quotationReplaceKey")
                            : this.props.type === "Itinerary_Master"
                              ? "Master Itinerary" : this.props.type}
                      </button>
                    )}
                    <button
                      onClick={() =>
                        this.props.showRoomTerms(null, null, schedule)
                      }
                      className="btn btn-sm border d-flex m-0 p-0 justify-content-center align-items-center ml-2"
                    >
                      <SVGIcon
                        name="info"
                        width="12"
                        type="fill"
                        height="12"
                        className="ml-2"
                      ></SVGIcon>
                    </button>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Schedule;
