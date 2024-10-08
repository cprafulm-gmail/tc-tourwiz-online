import React, { Component } from "react";
import mapping from "../common/iconMapping";
import ModelPopup from "../../helpers/model";
import { Trans } from "../../helpers/translate";

/**
 * This control will map all amenities in to pre-defined array declared in iconMapping.js file
 * and return amenities icon's UI horizontally
 * @param {amenities array} amenities
 */
class Amenities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canClick: false,
      showPopup: false
    };
    this.loadMoreAmenities = this.loadMoreAmenities.bind(this);
  }

  handleShow = () => {
    this.setState({
      showPopup: true
    });
  };

  handleHide = () => {
    this.setState({
      showPopup: false
    });
  };

  render() {
    var countList = [];
    let amenities = this.props.amenities;
    //Get all amenities in variable for future use
    const getAllAmenities = (
      <div className="row">
        {amenities.map((amenity, key) => {
          if (!amenity.name)
            return;
          var newIcon = mapping[amenity.name.toLowerCase()]
            ? mapping[amenity.name.toLowerCase()]
            : null;
          if (newIcon === null || newIcon === "undefined") return false;

          return (
            <React.Fragment key={key}>
              <div className="col-lg-4 col-sm-4 col-6 text-center">
                <img src={newIcon.default ?? newIcon} style={{ width: 30, height: 30 }} alt="" title={amenity.name} />
                <div />
                <small className="text-muted">{amenity.name}</small>
                <div style={{ marginBottom: 20 }} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );

    return (
      <div className="result-amenities">
        {amenities.map((amenity, key) => {
          if (!amenity.name)
            return;
          var svgIcon = mapping[amenity.name.toLowerCase()]
            ? mapping[amenity.name.toLowerCase()]
            : null;
          if (svgIcon === null || svgIcon === "undefined") return false;

          //Push all amenities icon to array for checking number of amenities show in list
          countList.push(svgIcon);

          /**
           * Make last 6th amenity icon to static icon "More" on which click open Modal dialog
           */
          if (countList.length >= 6) {
            svgIcon = require("../../assets/images/svg/more_horiz.svg");
          }
          //After showing 6 amenity icon do not render more amenities icon as we are
          //showing remaining amenities icon in Modal dialog
          if (countList.length > 6) return false;

          return (
            <span
              className="badge badge-light border p-1 pl-2 pr-2 mr-2 mb-2 font-weight-normal"
              key={key}
              style={{
                cursor: countList.length === 6 ? "pointer" : "default"
              }}
            >
              {
                <img
                  alt=""
                  title={
                    countList.length === 6
                      ? Trans("_filterShowMore")
                      : amenity.name
                  }
                  src={svgIcon.default ?? svgIcon}
                  style={{ width: 25, height: 25 }}
                  onClick={
                    countList.length === 6 ? this.loadMoreAmenities : null
                  }
                />
              }
            </span>
          );
        })}

        {this.state.showPopup ? (
          <ModelPopup
            header={Trans("_additionalFacilitiesHeader")}
            content={getAllAmenities}
            handleHide={this.handleHide}
          />
        ) : null}
      </div>
    );
  }
  /**
   * Method to show Modal dialog showing all amenities
   */
  loadMoreAmenities = () => {
    this.setState({
      showPopup: true
    });
  };
}

export default Amenities;
