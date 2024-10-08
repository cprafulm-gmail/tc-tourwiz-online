import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import Datecomp from "../../helpers/date";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";

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
      <div className="rooms row mb-4">
        <div className="col-12">
          <h4 className="font-weight-bold mb-3">
            {Trans("_titleScheduleAndRates")}
          </h4>
          {this.state.schedules.item.map((schedule, key) => {
            return (
              <div className="border shadow-sm mb-3" key={key}>
                <ul key={key} className="row list-unstyled m-0">
                  <li className="col-lg-5 d-flex align-items-center border-right">
                    <h5>{schedule.data.name}</h5>
                  </li>
                  <li className="col-lg-3 d-flex justify-content-center align-items-center">
                    <select
                      className="form-control"
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
                    </select>
                  </li>

                  <li className="col-lg-2 d-flex justify-content-center align-items-center">
                    <h5 className="text-primary font-weight-bold">
                      <b
                        className={
                          Global.getEnvironmetKeyValue("portalType").toLowerCase() !==
                            "b2c"
                            ? "text-primary font-weight-bold btn btn-link "
                            : "text-primary font-weight-bold"
                        }
                        onClick={
                          Global.getEnvironmetKeyValue("portalType").toLowerCase() !==
                          "b2c" &&
                          (() =>
                            this.props.showPriceFarebreakup(
                              false,
                              schedule.data,
                              this.props.itemid
                            ))
                        }
                      >
                        {schedule.data.displayAmount}
                      </b>
                    </h5>
                  </li>

                  <li className="col-lg-2 pt-3 pb-2 text-center bg-light border-left">
                    {this.props.isBtnLoading !== null &&
                      this.props.isBtnLoading !== false ? (
                        <button className="btn btn-primary">
                          {this.props.isBtnLoading === schedule.data.code ? (
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                          ) : null}
                          {Trans("_addToCart")}
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => this.handleBookNow(schedule.data.code)}
                        >
                          {Trans("_addToCart")}
                        </button>
                      )}
                    <button
                      onClick={() =>
                        this.props.showRoomTerms(null, null, schedule)
                      }
                      className="btn btn-link p-0 text-secondary w-100 text-center mt-1"
                    >
                      <SVGIcon
                        name="info-circle"
                        type="fill"
                        className="mr-1"
                      ></SVGIcon>
                      <small>{Trans("_scheduleTerms")}</small>
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
