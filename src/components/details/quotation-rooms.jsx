import React from "react";
import { Trans } from "../../helpers/translate";
import ModelPopup from "../../helpers/model";
import ImageSlider from "../../components/details/image-slider";
import QuotationRoom from "../details/quotation-room";
import HtmlParser from "../../helpers/html-parser";

class QuotationRooms extends React.Component {
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
    } else this.props.handleCart(groupid, roomId, this.props.items[0].item[0]);
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
            <ImageSlider noofimage={1} isForRoom={true} {...room} />
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
        <div className="rooms">
          <h4 className="font-weight-bold d-inline-block">{Trans("_titleRoomsAndRates")}</h4>
          {arr_roomGroups[0].flags["isGroupedRooms"] === undefined ||
          arr_roomGroups[0].flags["isGroupedRooms"] === false ? (
            this.props.isBtnLoading ? (
              <button
                className="btn btn-sm btn-primary pull-right mt-1 mr-2"
                onClick={() => this.dropdownBookNow(this.state.selectedRooms, null)}
              >
                {/* <span className="spinner-border spinner-border-sm mr-2"></span> */}
                Add to {this.props.type}
              </button>
            ) : (
              <button
                className="btn btn-sm btn-primary pull-right mt-1 mr-2"
                onClick={() => this.dropdownBookNow(this.state.selectedRooms, null)}
              >
                Add to {this.props.type}
              </button>
            )
          ) : null}
        </div>
        {arr_roomGroups[0].flags["isGroupedRooms"] === undefined ||
        arr_roomGroups[0].flags["isGroupedRooms"] === false ? (
          <React.Fragment>
            <h5 className="bg-light p-2 m-0 font-weight-bold">{Trans("_titleSelectedRooms")}</h5>
            <div className="rooms row">
              <div className="col-12">
                <div className="bg-white">
                  {this.state.selectedRooms.map((item, key) => {
                    return (
                      <React.Fragment key={key}>
                        <QuotationRoom
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
                          type={this.props.type}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}

        <div className="rooms row">
          <div className="col-12">
            {arr_roomGroups.map((rooms, key) => {
              return (
                <React.Fragment key={key}>
                  {(arr_roomGroups[0].flags["isGroupedRooms"] === undefined ||
                    arr_roomGroups[0].flags["isGroupedRooms"] === false) && (
                    <h5
                      className={"border-top bg-light p-2 m-0 font-weight-bold change-rooms" + key}
                    >
                      {Trans("_changeRoom")} {key + 1}
                    </h5>
                  )}
                  <div className="border-bottom bg-white change-rooms">
                    {rooms.item.map((room, key) => {
                      return (
                        <QuotationRoom
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
                          type={this.props.type}
                        />
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

export default QuotationRooms;
