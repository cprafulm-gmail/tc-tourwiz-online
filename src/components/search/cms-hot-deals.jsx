import React, { Component } from "react";
import { apiRequester } from "../../services/requester";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import { Link } from "react-router-dom";

class CMSHotDeals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }

  filterResults = item => {
    this.props.navigation.navigate("details", {
      itemId: 86,
      otherParam: "anything you want here"
    });
    // var reqURL = "api/v1/hotel/details";
    // //var reqOBJ = item;
    // var reqOBJ = {
    //     Request: {
    //         Token: "18c33011-a5d8-491d-ab6c-127e2aaf5bb7",
    //         Data: "46_en-US"
    //     },
    //     Flags: {}
    // }
    // apiRequester(
    //     reqURL,
    //     reqOBJ,
    //     function (data) {
    //         this.props.history.push(
    //             `/Details/hotel/${data.searchToken}/${item.searchInfo.config.find(x => x.key === "code").value}`
    //         );
    //     }.bind(this)
    // );
  };

  getResults = () => {
    let reqURL = "api/v1/cms/hotdeals";
    let body = {
      Info: {
        CultureCode: "en-US"
      },
      request: {
        FiltersIndex: [
          {
            Code: "default",
            Item: [
              {
                Type: "business",
                DefaultValue: "hotel"
              }
            ]
          }
        ]
      }
    };

    apiRequester(
      reqURL,
      body,
      function (data) {
        this.setState({
          results: data.response.data[0].item
        });
      }.bind(this)
    );
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getResults();
  }
  render() {
    const params = {
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      breakpoints: {
        1024: {
          slidesPerView: 4,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        }
      }
    };
    return this.state.results.length > 0 ? (
      <div className="details-photoslider-wrap">
        <Swiper {...params}>
          {this.state.results.map(item => {
            return (
              <div key={"1"}>
                <img
                  key={
                    item.searchInfo.config.find(x => x.key === "image").value
                  }
                  src={
                    item.searchInfo.config.find(x => x.key === "image").value
                  }
                  alt=""
                />

                <div key={"2"} className="col-lg-12 pt-3 pb-3">
                  <h5 key={"3"}>
                    <Link
                      key={
                        item.searchInfo.config.find(x => x.key === "name").value
                      }
                      onClick={() => this.filterResults(item)}
                    >
                      {item.searchInfo.config.find(x => x.key === "name").value}
                    </Link>
                  </h5>
                  <p key={"4"} className="text-justify">
                    {item.searchInfo.config
                      .find(x => x.key === "description")
                      .value.substring(0, 150)}
                  </p>
                </div>
              </div>
            );
          })}
        </Swiper>
      </div>
    ) : null;
  }
}

export default CMSHotDeals;
