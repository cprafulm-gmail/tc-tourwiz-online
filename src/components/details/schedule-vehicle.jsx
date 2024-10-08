import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import Datecomp from "../../helpers/date";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";
import HtmlParser from "../../helpers/html-parser";
import Date from "../../helpers/date";

class Schedulevehicle extends Component {
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
            selected: false,
            quantity: "1",
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
    schedules.item.find((x) => x.scheduleCode === scheduleid).quantity =
      e.target.value;
    this.setState({
      schedules: schedules,
    });
  };

  setExtarasSelection = (scheduleid) => {
    var schedules = this.state.schedules;
    if(schedules.item.find((x) => x.scheduleCode === scheduleid).selected === "true"){
      schedules.item.find((x) => x.scheduleCode === scheduleid).selected =
        false;
    }
    else{
      schedules.item.find((x) => x.scheduleCode === scheduleid).selected =
        true;
    }
    this.setState({
      schedules: schedules,
    });
    
  };

  handleBookNow = (ScheduleCode,Extrasschedules) => {
    this.props.handleCart(
      ScheduleCode,
      Extrasschedules
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="rooms row mb-4">
          <div className="col-12">
            <h2 className="font-weight-bold mb-3">
              {Trans("Extras")}
            </h2>
            {/* {this.state.schedules.item.length > 0 &&
              <h6 className="mb-3">
                {" (" + Trans("ExtrasvehicleMsg") + ")"}
              </h6>
            } */}
            {this.state.schedules.item.length == 0 &&
              <div className="card-body font-weight-bold" style={{ color: "red", }}>
                <span>{Trans("NoExtrasvehicleMsg")}</span>
              </div>
            }
            {this.state.schedules.item.length > 0 &&
              <div className="card">
                <div className="card-header">
                  <div className="container">
                    <div className="row">
                      <div className="col-3">
                        <h6>{Trans("ItemDescriptionLabel")}</h6>
                      </div>
                      <div className="col-2">
                        <h6>{Trans("_lblPrice")}</h6>
                      </div>
                      <div className="col-3">
                        <h6>{Trans("Quantity")}</h6>
                      </div>
                      <div className="col-3 pull-right">
                        <h6>{Trans("Addlabel")}</h6>
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.schedules.item.map((schedule, key) => {
                  return (
                    <div className="card-body" key={key}>
                      <div className="container">
                        <div className="row">
                          <div className="col-3 p-0">
                            <span className="d-block">
                              <h5>{schedule.data.name}</h5>
                            </span>
                            <span className="d-block">
                              {schedule.data.description}
                            </span>
                          </div>
                          <div className="col-2">
                            <h5 className="text-primary font-weight-bold">
                              <b className="text-primary font-weight-bold">
                                {schedule.data.displayAmount}
                              </b>
                            </h5>
                          </div>
                          <div className="col-2">
                            <select
                              className="form-control"
                              onChange={(e) =>
                                this.setOptionSelection(schedule.scheduleCode, e)
                              }
                            >
                              {[
                                ...Array(schedule.data.quantity).keys(),
                              ].map((item) => {
                                return <option key={item} value={item + 1}>{item + 1}</option>;
                              })}
                            </select>
                          </div>
                          <div className="col-2">
                            <input
                              className="form-control"
                              type="checkbox"
                              id={"extra" + schedule.data.code}
                              value={"extra" + schedule.data.code}
                              name={"extra" + schedule.data.code}
                              onChange={() => this.setExtarasSelection(schedule.data.code)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
            <div class="card-body">
              {this.state.schedules.item.length > 0 &&
                <span>{Trans("ExtrasvehicleMsg")}</span>
              }
              <div className="col-3 pull-right">
                {this.props.isBtnLoading !== null &&
                  this.props.isBtnLoading !== false ? (
                    <button className="btn btn-primary">
                      {this.props.isBtnLoading === this.props.token ? (
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                      ) : null}
                      {Trans("_bookNow")}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => this.handleBookNow(this.props.token,this.state.schedules)}
                    >
                      {Trans("_bookNow")}
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Schedulevehicle;
