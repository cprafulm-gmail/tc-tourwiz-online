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

class Room extends React.Component {
  render() {
    return (
      <ul className="row list-unstyled m-0 no-gutters group-rooms">
        <li className="col-lg-2">
          <img
            className="img-fluid"
            src={
              this.props.data.images.length > 0 ? this.props.data.images[0].url : ImageNotFoundHotel
            }
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = ImageNotFoundHotel.toString();
            }}
          />
          {(this.props.data.images.length > 0 ||
            this.props.data.amenities.length > 3 ||
            this.props.data.description !== "") && (
            <button
              className="btn btn-sm btn-primary rooms-show-moredetails-btn"
              onClick={() => this.props.ShowRoomDetails(this.props.data)}
            >
              {Trans("_showDetails")}
            </button>
          )}
        </li>
        <li
          className={
            this.props.rooms.flags["isGroupedRooms"] === undefined ||
            this.props.rooms.flags["isGroupedRooms"] === false
              ? "col-lg-7 p-3"
              : "col-lg-5 p-3"
          }
        >
          <h5>
            <HtmlParser text={this.props.data.name} />
          </h5>
          <div className="mt-2">
            {this.props.checkInOutTime.startTime &&
              Date({
                date: "1901-01-01T" + this.props.checkInOutTime.startTime,
                format: "LT",
              }) !== "Invalid date" && (
                <small className="mr-2">
                  <SVGIcon name="clock" className="mr-1"></SVGIcon>
                  {Trans("_checkIn")} :{" "}
                  <Date date={"1901-01-01T" + this.props.checkInOutTime.startTime} format={"LT"} />
                </small>
              )}
            {this.props.checkInOutTime.endTime &&
              Date({
                date: "1901-01-01T" + this.props.checkInOutTime.endTime,
                format: "LT",
              }) !== "Invalid date" && (
                <small className="mr-2">
                  <SVGIcon name="clock" className="mr-1"></SVGIcon>
                  {Trans("_checkOut")} :{" "}
                  <Date date={"1901-01-01T" + this.props.checkInOutTime.endTime} format={"LT"} />
                </small>
              )}
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
          <div className="mt-2">
            {this.props.data.tpExtension.find((x) => x.key === "promotionName").value !== "" && (
              <small className="mr-2 text-primary">
                <SVGIcon name="tags" type="fill" className="mr-2"></SVGIcon>
                {this.props.data.tpExtension.find((x) => x.key === "promotionName").value}
              </small>
            )}
          </div>
          <div className="mt-2">
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
          <div className="mt-2">
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
        <li className="col-lg-1 text-center pt-3 pr-3">
          <div className="text-center room-pax-icons text-secondary">
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
            <small className="text-secondary d-block">{Trans("_occupancy")}</small>
          </div>
        </li>
        {this.props.rooms.flags["isGroupedRooms"] === undefined ||
        this.props.rooms.flags["isGroupedRooms"] === false ? (
          <></>
        ) : (this.props.rooms.flags["isGroupedRooms"] !== undefined &&
            this.props.rooms.flags["isGroupedRooms"] === true &&
            this.props.rooms.item.indexOf(this.props.data)) === 0 ? (
          <li className="col-lg-2 text-center mt-3">
            <b
              className={
                Global.getEnvironmetKeyValue("portalType").toLowerCase() !== "b2c"
                  ? "text-primary font-weight-bold btn btn-link "
                  : "text-primary font-weight-bold"
              }
              onClick={
                Global.getEnvironmetKeyValue("portalType").toLowerCase() !== "b2c" &&
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
            <small className="text-secondary d-block">
              {moment(this.props.checkInOutTime.endDate).diff(
                this.props.checkInOutTime.startDate,
                "days"
              )}
              {" " + Trans("_nights")}
            </small>
          </li>
        ) : (
          <li className="col-lg-2 text-center mt-3"></li>
        )}

        {(this.props.rooms.flags["isGroupedRooms"] !== undefined &&
        this.props.rooms.flags["isGroupedRooms"] === true) ? (
          <React.Fragment>
            {this.props.rooms.item.indexOf(this.props.data) === 0 ? (
              <li className="col-lg-2 text-center p-3 border-left bg-light">
                {localStorage.getItem("ssotoken") === null &&
                  (this.props.isBtnLoading !== null && this.props.isBtnLoading !== false ? (
                    <button className="btn btn-primary">
                      {this.props.isBtnLoading === this.props.rooms.id + this.props.data.code ? (
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                      ) : null}

                      {Trans("_addToCart")}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => this.props.handleCart(this.props.rooms.id, this.props.data.code)}
                    >
                      {Trans("_addToCart")}
                    </button>
                  )
                  )
                }
                <br />
                <button
                  className="btn btn-link text-secondary p-0"
                  onClick={() =>
                    this.props.showRoomTerms(
                      this.props.rooms.flags["isGroupedRooms"],
                      this.props.rooms.id,
                      this.props.rooms
                    )
                  }
                >
                  {Trans("_roomTerms")}
                </button>
              </li>
            ) : (
              <li className="col-lg-2 text-center p-3 border-left bg-light"></li>
            )}
          </React.Fragment>
        ) : (
          <li className="col-lg-2 text-center p-3 border-left border-bottom bg-light group-rooms-radiomode">
            <b
              className={
                Global.getEnvironmetKeyValue("portalType").toLowerCase() !== "b2c"
                  ? "text-primary font-weight-bold btn btn-link p-0"
                  : "text-primary font-weight-bold p-0"
              }
              onClick={
                Global.getEnvironmetKeyValue("portalType").toLowerCase() !== "b2c" &&
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

            <small class="text-secondary d-block">
              {moment(this.props.checkInOutTime.endDate).diff(
                this.props.checkInOutTime.startDate,
                "days"
              )}
              {" " + Trans("_nights")}
            </small>

            {!this.props.IsForSelectedSection  && localStorage.getItem("ssotoken") === null && (
              <div
                className="custom-control custom-switch mt-3"
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
                  onChange={() => this.props.selectRoom(this.props.rooms.id, this.props.data.code)}
                />
                <label className="custom-control-label" htmlFor="customSwitch1"></label>
              </div>
            )}
            {this.props.IsForSelectedSection && (
              <Link
                activeClass="active"
                className="btn btn-sm btn-outline-primary mt-3"
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
              className="btn btn-link text-secondary p-0 mt-2"
              onClick={() =>
                this.props.showRoomTerms(
                  this.props.rooms.flags["isGroupedRooms"],
                  this.props.data.id,
                  this.props.data
                )
              }
            >
              {Trans("_roomTerms")}
            </button>
          </li>
        )}
      </ul>
    );
  }
}

export default Room;
