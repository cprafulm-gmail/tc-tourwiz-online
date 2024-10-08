import React from "react";
import ImageNotFoundHotel from "../../assets/images/ImageNotFound-HotelRoom.gif";
import { Trans } from "../../helpers/translate";
import HtmlParser from "../../helpers/html-parser";
import PaxIcons from "../common/pax-icons";
import { Link } from "react-scroll";
import Date from "../../helpers/date";
import * as Global from "../../helpers/global";
import SVGIcon from "../../helpers/svg-icon";
import moment from "moment";

class UmrahPackageRoom extends React.Component {
  render() {
    return (
      <ul
        className={
          this.props.rooms.flags["isGroupedRooms"] === undefined ||
            this.props.rooms.flags["isGroupedRooms"] === false
            ? "row list-unstyled m-0 no-gutters border-top"
            : "row list-unstyled m-0 no-gutters"
        }
      >
        <li className="col-lg-1">
          <img
            className="img-fluid"
            style={{ maxHeight: "148px" }}
            src={
              this.props.data.images.length > 0 ? this.props.data.images[0].url : ImageNotFoundHotel
            }
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = ImageNotFoundHotel.toString();
            }}
          />
          {this.props.data.images.length > 0 ||
            this.props.data.amenities.length > 3 ||
            this.props.data.description !== "" ? (
              <button
                className="btn btn-link p-0 m-1"
                onClick={() => this.props.ShowRoomDetails(this.props.data)}
              >
                <small>{Trans("_showDetails")}</small>
              </button>
            ) : (
              <span className="mt-1">&nbsp;</span> //To maintain space
            )}
        </li>

        <li className={"col-lg-4 p-2 align-items-center"}>
          <b className="text-primary">
            <HtmlParser text={this.props.data.name} />
          </b>

          <div className="mt-2">
            {this.props.checkInOutTime.startTime &&
              <small className="mr-2">
                <SVGIcon name="clock" className="mr-1"></SVGIcon>
                {Trans("_checkIn")} :{" "}
                {Date({
                  date: "1901-01-01T" + this.props.checkInOutTime.startTime,
                  format: "LT",
                }) !== "Invalid date" ?
                  <Date
                    date={"1901-01-01T" + this.props.checkInOutTime.startTime}
                    format={"LT"}
                  />
                  : this.props.checkInOutTime.startTime}
              </small>
            }
            {this.props.checkInOutTime.endTime &&
              <small className="mr-2">
                <SVGIcon name="clock" className="mr-1"></SVGIcon>
                {Trans("_checkOut")} :{" "}
                {Date({
                  date: "1901-01-01T" + this.props.checkInOutTime.endTime,
                  format: "LT",
                }) !== "Invalid date" ?
                  <Date
                    date={"1901-01-01T" + this.props.checkInOutTime.endTime}
                    format={"LT"}
                  />
                  : this.props.checkInOutTime.endTime}
              </small>
            }
          </div>
          <div className="mt-2" >
            {this.props.data.amenities !== undefined && this.props.data.amenities.length > 0 && (
              <React.Fragment>
                <small className="mr-2">{Trans("_amenities")} :</small>
                {this.props.data.amenities !== undefined
                  ? this.props.data.amenities.slice(0, 4).map(
                    function (amenities, key) {
                      return key === 3 ? (
                        <span
                          key={key}
                          onClick={() => this.props.ShowRoomDetails(this.props.data)}
                          className={
                            "badge badge-light border mr-2 mb-2 font-weight-normal pt-1 pb-1 pl-2 pr-2 btn"
                          }
                        >
                          ...
                        </span>
                      ) : (
                          <span
                            key={key}
                            className={
                              "badge badge-light border mr-2 mb-2 font-weight-normal pt-1 pb-1 pl-2 pr-2"
                            }
                          >
                            <HtmlParser text={amenities.name} />
                          </span>
                        );
                    }.bind(this)
                  )
                  : ""}
              </React.Fragment>
            )}
          </div>

        </li>

        <li className="col-lg-3 p-2 d-flex align-items-center justify-content-center">
          <div className="text-center room-pax-icons text-secondary">
            <div>
              <small className="text-secondary mr-2">{Trans("_occupancy")} : </small>
              <span style={{ opacity: ".7" }} className="text-nowrap">
                <PaxIcons
                  type="adult"
                  {...[this.props.data.tpExtension.find((x) => x.key === "adults").value]}
                />
                <span className="room-child-paxicon">
                  <PaxIcons
                    type="child"
                    {...[this.props.data.tpExtension.find((x) => x.key === "children").value]}
                  />
                </span>
              </span>
            </div>
            <div className="mt-2">
              {this.props.data.boardTypes !== undefined && this.props.data.boardTypes.length > 0 && (
                <React.Fragment>
                  <small className="mr-2">{Trans("_boardTypes")} : </small>
                  {this.props.data.boardTypes !== undefined
                    ? this.props.data.boardTypes.map(function (boardTypes, key) {
                      return (
                        <span
                          key={key}
                          className="badge badge-light border font-weight-normal pt-1 pb-1 pl-2 pr-2 mr-2"
                        >
                          <HtmlParser text={boardTypes.type} />
                        </span>
                      );
                    })
                    : ""}
                </React.Fragment>
              )}
            </div>
          </div>
        </li>
        {this.props.rooms.flags["isGroupedRooms"] === undefined ||
          this.props.rooms.flags["isGroupedRooms"] === false ? (
            <></>
          ) : (this.props.rooms.flags["isGroupedRooms"] !== undefined &&
            this.props.rooms.flags["isGroupedRooms"] === true &&
            this.props.rooms.item.indexOf(this.props.data)) === 0 ? (
              <li className="col-lg-2 text-center d-flex align-items-center justify-content-center">
                <b
                  className={
                    Global.getEnvironmetKeyValue("portalType").toLowerCase() !== "b2c"
                      ? "btn btn-link text-primary font-weight-bold"
                      : "btn btn-link text-primary font-weight-bold"
                  }
                  onClick={
                    Global.getEnvironmetKeyValue("portalType").toLowerCase() === "b2c" &&
                    (() =>
                      this.props.showPriceFarebreakup(
                        this.props.rooms.flags["isGroupedRooms"],
                        this.props.rooms,
                        this.props.itemid
                      ))
                  }
                >
                  {this.props.rooms.displayAmount}
                </b>
                <small className="text-secondary d-inline-block ml-2">
                  {moment(this.props.checkInOutTime.endDate).diff(
                    this.props.checkInOutTime.startDate,
                    "days"
                  )}
                  {" " + Trans("_nights")}
                </small>
                <div>
                  <div className="mt-2" >
                    {this.props.data.features !== undefined && this.props.data.features.length > 0 && (
                      <React.Fragment>
                        <small className="mr-2">{Trans("_inclusions")} :</small>
                        {this.props.data.features !== undefined
                          ? this.props.data.features.map(function (features, key) {
                            return (
                              <span
                                key={key}
                                className="badge badge-light border border-primary font-weight-normal pt-1 pb-1 pl-2 pr-2 mr-2"
                              >
                                <HtmlParser text={features.name} />
                              </span>
                            );
                          })
                          : ""}
                      </React.Fragment>
                    )}
                  </div>
                  <div className="mt-2" >
                    {this.props.data.tpExtension.find((x) => x.key === "promotionName").value !== "" && (
                      <small className="mr-2 text-primary">
                        <SVGIcon name="tags" type="fill" className="mr-2"></SVGIcon>
                        {this.props.data.tpExtension.find((x) => x.key === "promotionName").value}
                      </small>
                    )}
                  </div>
                </div>
              </li>
            ) : (
              <li className="col-lg-2 text-center mt-3"></li>
            )}

        {this.props.rooms.flags["isGroupedRooms"] !== undefined &&
          this.props.rooms.flags["isGroupedRooms"] === true ? (
            <React.Fragment>
              {this.props.rooms.item.indexOf(this.props.data) === 0 ? (
                <li className="col-lg-2 p-2 d-flex align-items-center justify-content-end">
                  {this.props.isBtnLoading !== null && this.props.isBtnLoading !== false ? (
                    <button
                      className="btn btn-sm btn-light m-0 text-primary d-flex border text-nowrap"
                      onClick={() =>
                        this.props.handleCart(
                          this.props.rooms.id,
                          this.props.data.code,
                          this.props.data
                        )
                      }
                    >
                      {this.props.isBtnLoading === this.props.rooms.id + this.props.data.code ? (
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                      ) : <SVGIcon
                        name="plus"
                        width="12"
                        type="fill"
                        height="12"
                        className="mr-2"
                      ></SVGIcon>
                      }

                    Add to {this.props.type}
                    </button>
                  ) : (
                      <button
                        className="btn btn-sm btn-light m-0 text-primary d-flex border text-nowrap"
                        onClick={() =>
                          this.props.handleCart(
                            this.props.rooms.id,
                            this.props.data.code,
                            this.props.data
                          )
                        }
                      >
                        <SVGIcon
                          name="plus"
                          width="12"
                          type="fill"
                          height="12"
                          className="mr-2"
                        ></SVGIcon>
                    Add to {this.props.type}
                      </button>
                    )}
                  <button
                    className="btn btn-sm border d-flex m-0 p-0 justify-content-center align-items-center ml-2"
                    onClick={() =>
                      this.props.showRoomTerms(
                        this.props.rooms.flags["isGroupedRooms"],
                        this.props.rooms.id,
                        this.props.rooms
                      )
                    }
                    title={Trans("_roomTerms")}
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
              ) : (
                  <li className="col-lg-2 p-2 d-flex align-items-center justify-content-end"></li>
                )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <li className="col-lg-2 p-2 d-flex align-items-center justify-content-end">
                <b
                  className={
                    Global.getEnvironmetKeyValue("portalType").toLowerCase() !== "b2c"
                      ? "text-primary font-weight-bold"
                      : "text-primary font-weight-bold"
                  }
                  onClick={
                    Global.getEnvironmetKeyValue("portalType").toLowerCase() === "b2c" &&
                    (() =>
                      this.props.showPriceFarebreakup(
                        this.props.rooms.flags["isGroupedRooms"],
                        this.props.data,
                        this.props.itemid
                      ))
                  }
                >
                  {this.props.data.displayAmount}
                </b>

                <small className="text-secondary d-inline-block ml-2">
                  {moment(this.props.checkInOutTime.endDate).diff(
                    this.props.checkInOutTime.startDate,
                    "days"
                  )}

                  {" " + Trans("_nights")}
                </small>
              </li>

              <li className="col-lg-2 p-2 d-flex align-items-center justify-content-end">
                {!this.props.IsForSelectedSection && (
                  <div
                    className="custom-control custom-switch"
                    onClick={() => this.props.selectRoom(this.props.rooms.id, this.props.data.code)}
                  >
                    <input
                      id={this.props.data.code}
                      type="checkbox"
                      className="custom-control-input"
                      checked={
                        this.props.selectedRooms.find(
                          (x) =>
                            x.groupid === this.props.rooms.id && x.roomCode === this.props.data.code
                        ) !== undefined
                          ? true
                          : false
                      }
                      onChange={() =>
                        this.props.selectRoom(this.props.rooms.id, this.props.data.code)
                      }
                    />
                    <label className="custom-control-label" htmlFor="customSwitch1"></label>
                  </div>
                )}

                {this.props.IsForSelectedSection && (
                  <Link
                    activeClass="active"
                    className="btn btn-sm btn-light border text-nowrap"
                    href="#"
                    to={"change-rooms" + this.props.roomIndex}
                    spy={true}
                    smooth={true}
                    offset={0}
                    duration={500}
                  >
                    {Trans("_changeRoom")}
                  </Link>
                )}

                <button
                  className="btn btn-sm border d-flex m-0 p-0 justify-content-center align-items-center ml-2"
                  onClick={() =>
                    this.props.showRoomTerms(
                      this.props.rooms.flags["isGroupedRooms"],
                      this.props.data.id,
                      this.props.data
                    )
                  }
                  title={Trans("_roomTerms")}
                >
                  <SVGIcon name="info" width="12" type="fill" height="12" className="ml-2"></SVGIcon>
                </button>
              </li>
            </React.Fragment>
          )}
      </ul>
    );
  }
}

export default UmrahPackageRoom;
