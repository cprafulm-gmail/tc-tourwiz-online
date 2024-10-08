// Refer to https://github.com/google-map-react/google-map-react#use-google-maps-api
import React, { Component } from "react";
import Geocode from "react-geocode";
import PropTypes from "prop-types";
import GoogleMap from "../common/map";
import SVGIcon from "../../helpers/svg-icon";
import Config from "../../config.json"
import * as Global from "../../helpers/global";

// InfoWindow component
const InfoWindow = props => {
  const { place } = props;
  const infoWindowStyle = {
    position: "relative",
    bottom: 215,
    left: "-175px",
    width: 430,
    maxheight: 200,
    backgroundColor: "white",
    boxShadow: "0 2px 7px 1px rgba(0, 0, 0, 0.3)",
    padding: 10,
    fontSize: 14,
    zIndex: 100
  };

  return props.getInfoWindowString(place, props.businessName, infoWindowStyle);
};

// Marker component
const Marker = props => {
  return (
    <React.Fragment>
      <div
        style={{
          color: "white",
          padding: "0px 0px",
          display: "inline-flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "100%",
          transform: "translate(-47%, -95%)",
          cursor: "pointer"
        }}
      >
        {/* <div style={markerStyle} /> */}
        <SVGIcon
          name="map-marker-google"
          className={props.show ? "hight-z-index map-pin-animation" : "hight-z-index"}
          height={props.show ? "36" : "24"}
          type="fill"
          fill="red"
          width={props.show ? "36" : "24"}
        ></SVGIcon>
      </div>
      {props.show && (
        <InfoWindow
          place={props.place}
          getInfoWindowString={props.getInfoWindowString}
          businessName={props.businessName}
        />
      )}
    </React.Fragment>
  );
};

class MapComponent extends Component {
  constructor(props) {
    super(props);
    Geocode.setApiKey(Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand") ? Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand") : Config.GoogleMapKey);
    Geocode.setLanguage("en");
    this.state = {
      places: [],
      lat: null,
      lng: null
    };
  }

  getLatLngFromAddress = () => {
    Geocode.fromAddress(this.props.cityName).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({ lat: lat, lng: lng });
      },
      error => {
        console.error(error);
      }
    );
  };

  componentDidMount = () => {
    if (this.props.page === "list") {
      if (this.props.defaultCenterLatLong) {
        this.setState({
          lat: this.props.defaultCenterLatLong.lat,
          lng: this.props.defaultCenterLatLong.lng,
          places: this.props.places
        });
      } else {
        this.getLatLngFromAddress();
        this.setState({ places: this.props.places });
      }
    } else {
      this.setState({
        lat: this.props.places[0].lat,
        lng: this.props.places[0].lng,
        places: this.props.places
      });
    }
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (this.props.places !== prevProps.places)
      this.setState({ places: this.props.places });
  };

  onChildMouseHoverCallback = key => {
    this.setState(state => {
      const index = state.places.findIndex(e => e.id.toString() === key);
      state.places[index].showPopup = !state.places[index].showPopup;
      return { places: state.places };
    });
  };

  onChildClickCallback = key => {
    if (this.props.history) {
      const index = this.state.places.findIndex(e => e.id.toString() === key);
      this.props.history.push(this.state.places[index].detailLink);
    }
  };

  _distanceToMouse = (markerPos, mousePos, markerProps) => {
    const x = markerPos.x;
    // because of marker non symmetric,
    // we transform it central point to measure distance from marker circle center
    // you can change distance function to any other distance measure
    const y = markerPos.y - 10 - 30 / 2;

    // and i want that hover probability on markers with text === 'A' be greater than others
    // so i tweak distance function (for example it's more likely to me that user click on 'A' marker)
    // another way is to decrease distance for 'A' marker
    // this is really visible on small zoom values or if there are a lot of markers on the map
    const distanceKoef = markerProps.text !== 'A' ? 1.5 : 1;

    // it's just a simple example, you can tweak distance function as you wish
    return distanceKoef * Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y));
  }

  render() {
    return (
      <div
        className="map-control position-relative mb-4"
        style={{ minHeight: "400px" }}
      >
        {this.state.places.length > 0 && this.state.lat !== null && (
          <GoogleMap
            defaultZoom={this.props.defaultZoom !== undefined && this.props.defaultZoom !== null ? this.state.places.length > 1 ? 30 : this.props.defaultZoom : 10}
            center={
              this.props.defaultCenterLatLong
                ? [
                  this.props.defaultCenterLatLong.lat,
                  this.props.defaultCenterLatLong.lng
                ]
                : [this.state.lat, this.state.lng]
            }
            bootstrapURLKeys={{
              key: Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand") ? Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand") : Config.GoogleMapKey
            }}
            onChildClick={this.onChildClickCallback}
            onChildMouseEnter={this.onChildMouseHoverCallback}
            onChildMouseLeave={this.onChildMouseHoverCallback}
            hoverDistance={30 / 2}
            distanceToMouse={this._distanceToMouse}
          >
            {/* <Marker
              key={0}
              lat={25.1924}
              lng={55.2672}
              show={false}
              place={{
                id: 0,
                lat: 25.1924,
                lng: 55.2672,
                image:
                  "http://inventory.travelcarma.com/Hotelextranet/Upload/Hotel_96/20147743243_4.jpg",
                name: "Holiday Inn Express CRS",
                address: "UMM RAMOOL Dubai United Arab Emirates",
                rating: 5,
                description:
                  "If what you&apos;re looking for is a conveniently located hotel in Dubai, look no further than Holiday Inn Express Hotel. From here, guests can enjoy easy access to all that the lively city has to offer. Visitors to the hotel can take pleasure in touring the city&apos;s top attractions: Emirates Golf club, Meydan Racecourse, Dubailand. This is a historic building.",
                detailLink:
                  "/Details/hotel/Dubai, United Arab Emirates - Location/AE2/_Location_AE/2020-03-18/2020-03-20/noofrooms=1|room1noOfAdults=2|room1noOfChild=0|room1childage=|totalNoOfAdult=2|totalNoOfChild=0/96_en-US/ACTLHotel",
                showPopup: false
              }}
              getInfoWindowString={this.props.getInfoWindowString}
              businessName={this.props.businessName}
            /> */}
            {this.state.places.map(place => (
              <Marker
                key={place.id}
                lat={place.lat}
                lng={place.lng}
                show={place.showPopup}
                place={place}
                getInfoWindowString={this.props.getInfoWindowString}
                businessName={this.props.businessName}
              />
            ))}
          </GoogleMap>
        )}
      </div>
    );
  }
}

InfoWindow.propTypes = {
  place: PropTypes.shape({
    name: PropTypes.string,
    formatted_address: PropTypes.string,
    rating: PropTypes.number,
    types: PropTypes.array,
    price_level: PropTypes.number,
    opening_hours: PropTypes.object
  }).isRequired
};

Marker.propTypes = {
  show: PropTypes.bool.isRequired,
  place: PropTypes.shape({
    name: PropTypes.string,
    formatted_address: PropTypes.string,
    rating: PropTypes.number,
    types: PropTypes.array,
    price_level: PropTypes.number,
    opening_hours: PropTypes.object
  }).isRequired
};

export default MapComponent;
