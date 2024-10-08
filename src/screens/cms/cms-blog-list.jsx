import React, { Component } from "react";
import { apiRequesterCMS } from "../../services/requester-cms";
import HomePageBlog from "../../components/landing-pages/home-page-blog";
import CMSPageTitle from "../../components/cms/cms-page-title";
import Loader from "../../components/common/loader";
import $ from "jquery";
import moment from "moment";
import { cmsConfig } from "../../helpers/cms-config";
import { Link } from "react-router-dom";
import ImageSlider from "../../components/details/image-slider";
import HtmlParser from "../../helpers/html-parser";
import { decode } from "html-entities";
import SVGIcon from "../../helpers/svg-icon";

class CMSBlogList extends Component {
  state = {
    blogPosts: [],
    items: [],
    isLoading: true,
  };
  ajaxRequesterBlog = () => {
    $.ajax({
      url: "https://www.tourwizonline.com/blog/wp-json/wp/v2/posts",
      type: "GET",
      data: {},
      dataType: "JSON",
    }).done((data) => {
      this.setState({
        blogPosts: data,
        isLoading: false
      });
    });
  };


  componentDidMount() {
    window.scrollTo(0, 0);
    this.ajaxRequesterBlog();
  }

  render() {
    const { items, isLoading, blogPosts } = this.state;
    const { cmsSettings } = this.props;
    let imageURL =
      process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + (this.props.match.params.module === "locations" ? "/LocationsGuide/images/" : "/SpecialsPromotions/images/");
    return (
      <div>
        <div className="cp-home-deals pt-0">
          <div className="container">

            <div className="mt-3 mb-3 pb-2">
              <h3
                className="mt-3 mb-3 text-uppercase text-dark font-weight-bold border-3 border-warning pb-3"
                style={{ color: "#f18247", fontSize: "24px", borderBottom: "3px solid #dee2e6" }}
              >
                Recent blogs
              </h3>
            </div>
            <div className="row">

              <div className="tw-reasons pb-5">
                <div className="container">
                  <div className="row">
                    {blogPosts.map((item, key) => {
                      return (
                        <div className="col-lg-4 mb-3" id={key} key={key} style={{ display: "flex" }}>
                          <div className="tw-reasons-box p-0" style={{ backgroundColor: "#fff", alignItems: "inherit" }}>
                            <img style={{ width: "100%", margin: "0px", height: "auto" }}
                              src={item.jetpack_featured_media_url}
                              alt={item.title["rendered"]}
                            />
                            <div className="pt-2"><a href={item.link} className="p-1" style={{ color: "#000", textDecoration: "none" }} target="_blank">
                              <h3 className="blog-title m-0 pl-2 pr-2"><HtmlParser text={item.title["rendered"]} /></h3>
                            </a>
                            </div>
                            <div className="p-2">{moment(item.date_gmt).format('ll')}</div>
                            <div className="pl-2 pr-2 pb-4 blogContent">
                              <HtmlParser text={item.excerpt["rendered"]} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {isLoading && (
                <div
                  className="d-flex align-items-center justify-content-center w-100"
                  style={{ minHeight: "calc(100vh - 228px)", opacity: ".5" }}
                >
                  <Loader />
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default CMSBlogList;
