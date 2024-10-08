import React from "react";
import { Trans } from "../../helpers/translate";
import ModelPopup from "../../helpers/model";
import ImageSlider from "../../components/details/image-slider";
import Room from "../details/room";
import HtmlParser from "../../helpers/html-parser";

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    var selectedRooms = [];
    props.items.map((item, key) => {
      var group_item = { groupid: item.id, roomCode: item.item[0].code };
      selectedRooms.push(group_item);
      return true;
    });
    this.state = {
      selectedRooms: selectedRooms,
      showPopup: false,
      popupTitle: "",
      popupContent: null,
      isBtnLoading: false,
    };
  }

  dropdownBookNow = (groupid, roomId) => {
    if (groupid.find((x) => x.roomCode === "") !== undefined) {
      this.setState({
        showPopup: true,
        popupTitle: Trans("_ooops"),
        popupContent: <span>{Trans("_ooopsPleaseSelectRoom")}</span>,
      });
    } else this.props.handleCart(groupid, roomId);
  };

  selectRoom = (groupid, roomId) => {
    var selectedRooms = this.state.selectedRooms;
    selectedRooms.find((x) => x.groupid === groupid).roomCode = roomId;
    this.setState({
      selectedRooms: selectedRooms,
    });
  };

  handleHidePopup = () => {
    this.setState({
      showPopup: false,
    });
  };

  ShowRoomDetails = (room) => {
    const popupContent = (
      <div>
        <div className="col-12 row mb-4">
          <HtmlParser text={room.description} />
        </div>
        {room.amenities.length > 0 && (
          <div className="amenities col-12 row mb-4">
            <h6 className="font-weight-bold">{Trans("_titleRoomFacilities")}</h6>
            <ul className="row list-unstyled">
              {room.amenities.map((amenity) => {
                return (
                  <li className="col-6" key={amenity.name}>
                    {amenity.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {room.images.length > 0 && (
          <div>
            <h6 className="font-weight-bold">{Trans("_roomImages")}</h6>
            <ImageSlider noofimage={1} isForRoom={true} {...room} businessName="hotel" />
          </div>
        )}
      </div>
    );
    this.setState({
      showPopup: true,
      popupTitle: room.name,
      popupContent: popupContent,
    });
  };

  render() {
    const arr_roomGroups = this.props.items !== undefined ? this.props.items : [];
    return (
      <React.Fragment>
        <div className="rooms mb-2">
          <h4 className="font-weight-bold d-inline-block">{Trans("_titleRoomsAndRates")}</h4>
          {(arr_roomGroups[0].flags["isGroupedRooms"] === undefined ||
            arr_roomGroups[0].flags["isGroupedRooms"] === false) && localStorage.getItem("ssotoken") === null ? (
              this.props.isBtnLoading ? (
                <button className="btn btn-primary pull-right">
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                  {Trans("_bookNow")}
                </button>
              ) : (
                  <button
                    className="btn btn-primary pull-right"
                    onClick={() => this.dropdownBookNow(this.state.selectedRooms, null)}
                  >
                    {Trans("_bookNow")}
                  </button>
                )
            ) : null}
        </div>
        {arr_roomGroups[0].flags["isGroupedRooms"] === undefined ||
          arr_roomGroups[0].flags["isGroupedRooms"] === false ? (
            <React.Fragment>
              <h5 className="text-primary font-weight-bold">{Trans("_titleSelectedRooms")}</h5>
              <div className="rooms row">
                <div className="col-12">
                  <div className="border bg-white shadow-sm mb-2">
                    {this.state.selectedRooms.map((item, key) => {
                      return (
                        <React.Fragment key={key}>
                          <Room
                            roomIndex={key}
                            rooms={this.props.items.find((x) => x.id === item.groupid)}
                            data={this.props.items
                              .find((x) => x.id === item.groupid)
                              .item.find((y) => y.code === item.roomCode)}
                            ShowRoomDetails={this.ShowRoomDetails}
                            handleCart={this.props.handleCart}
                            showRoomTerms={this.props.showRoomTerms}
                            showPriceFarebreakup={this.props.showPriceFarebreakup}
                            selectRoom={this.selectRoom}
                            selectedRooms={this.state.selectedRooms}
                            IsForSelectedSection={true}
                            isBtnLoading={this.props.isBtnLoading}
                            checkInOutTime={this.props.dateInfo}
                            itemid={this.props.itemid}
                          ></Room>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ) : null}
        {/* <h5 className="change-rooms">Change Room(s)</h5> */}
        <div className="rooms row mb-4">
          <div className="col-12">
            {arr_roomGroups.map((rooms, key) => {
              return (
                <React.Fragment key={key}>
                  {(arr_roomGroups[0].flags["isGroupedRooms"] === undefined ||
                    arr_roomGroups[0].flags["isGroupedRooms"] === false) && (
                      <h5 className={"change-rooms" + key + " text-primary font-weight-bold mt-4"}>
                        {Trans("_changeRoom")} {key + 1}
                      </h5>
                    )}
                  <div className="border bg-white shadow-sm mb-2 change-rooms">
                    {rooms.item.map((room, key) => {
                      return (
                        <Room
                          key={key}
                          rooms={rooms}
                          data={room}
                          ShowRoomDetails={this.ShowRoomDetails}
                          handleCart={this.props.handleCart}
                          showRoomTerms={this.props.showRoomTerms}
                          showPriceFarebreakup={this.props.showPriceFarebreakup}
                          selectRoom={this.selectRoom}
                          selectedRooms={this.state.selectedRooms}
                          IsForSelectedSection={false}
                          isBtnLoading={this.props.isBtnLoading}
                          checkInOutTime={this.props.dateInfo}
                          itemid={this.props.itemid}
                        ></Room>
                      );
                    })}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          {this.state.showPopup ? (
            <ModelPopup
              header={this.state.popupTitle}
              content={this.state.popupContent}
              handleHide={this.handleHidePopup}
            />
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default Rooms;
