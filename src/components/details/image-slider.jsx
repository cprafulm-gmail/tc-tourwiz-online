import React, { Component } from "react";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import ImageNotFoundHotel from "../../assets/images/ImageNotFound-Hotel.gif";
import ImageNotFoundActivity from "../../assets/images/ImageNotFound-Activity.gif";
import ImageNotFoundPackage from "../../assets/images/ImageNotFound-Package.gif";
import * as Global from "../../helpers/global";

class ImageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getOnErrorImageURL = () => {
    if (this.props.businessName === "hotel")
      return ImageNotFoundHotel.toString();
    else if (this.props.businessName === "activity") {
      return ImageNotFoundActivity.toString();
    } else if (this.props.businessName === "package") {
      return ImageNotFoundPackage.toString();
    }
  };

  getBrealPoints = () => {
    const isCRSRoomSelectionFlowEnable = Global.getEnvironmetKeyValue("IsCRSRoomSelectionFlowEnable", "cobrand") ? true : false;
    if (this.props.noofimage === undefined) {
      return {
        1199: {
          slidesPerView: this.props.images.length > 3 ? (isCRSRoomSelectionFlowEnable && this.props.businessName === "package" ? 2 : 4) : this.props.images.length,
          spaceBetween: 0,
        },
        992: {
          slidesPerView: this.props.images.length > 2 ? 3 : this.props.images.length,
          spaceBetween: 0,
        },
        759: {
          slidesPerView: this.props.images.length > 1 ? 2 : this.props.images.length,
          spaceBetween: 0,
        },
        553: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
      };
    } else {
      return {
        1199: {
          slidesPerView: this.props.noofimage,
          spaceBetween: 0,
        },
      };
    }
  };

  render() {
    const params = {
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: this.getBrealPoints(),
    };
    const OnErrorImageURL = this.getOnErrorImageURL();
    const isCRSRoomSelectionFlowEnable = Global.getEnvironmetKeyValue("IsCRSRoomSelectionFlowEnable", "cobrand") ? true : false;
    return (
      <div className={"details-photoslider details-photoslider-" + this.props.businessName}>
        {this.props.images.length > (this.props.noofimage ? this.props.noofimage : (isCRSRoomSelectionFlowEnable && this.props.businessName === "package" ? 2 : 4)) ? (
          <Swiper {...params}>
            {this.props.images.map(function (item, key) {
              return (
                <div key={key}>
                  <img
                    src={item.url}
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = OnErrorImageURL;
                    }}
                  />
                </div>
              );
            })}
          </Swiper>
        ) : (
          <div className="text-center">
            {this.props.images.map(function (item, key) {
              return (
                <img
                  style={{ width: "325px", height: "356px" }}
                  key={key}
                  src={item.url}
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = OnErrorImageURL;
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default ImageSlider;
