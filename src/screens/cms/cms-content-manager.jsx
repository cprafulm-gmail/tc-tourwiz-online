import React, { Component } from "react";
import { apiRequesterCMS } from "../../services/requester-cms";
import CMSPageTitle from "../../components/cms/cms-page-title";
import Loader from "../../components/common/loader";
import { cmsConfig } from "../../helpers/cms-config";
import { Link } from "react-router-dom";
import ImageSlider from "../../components/details/image-slider";
import HtmlParser from "../../helpers/html-parser";
import SVGIcon from "../../helpers/svg-icon";
import { decode } from "html-entities";
import Config from "../../config.json";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ActionModal from "../../helpers/action-modal";
import onlineBooking from "../../assets/images/customer-portal/template-images/DeleteSVG.svg";
import { fromAddress } from "react-geocode";
import LocationList from "../../screens/location-list";
import LocationForm from "../../screens/location-form";
import HotDealsList from "../../screens/hotdeals-list";
import HotDealForm from "../../screens/hotdeals-form";
import CMSTextHTMLModule from "./cms-texthtml-module";
import CMSCompanyDetails from "./cms-company-details";
import CMSInspireMe from "./cms-inspireme";
import PackageList from "../package-list";
import PackageForm from "../package-form";

class CMSContentManager extends Component {
  state = {
    ...cmsConfig,
    result: "",
    isLoading: false,
    isShowForm: false,
    idForEdit: 0,
    mode: "add",
    tabs: [
      "Header",
      "Text Content",
      "Locations",
      "Hot Deals",
      "Special Packages",
      "Banner Image"
    ],
    activeTab: "Header",
  };
  scrollRef = React.createRef();

  getDetails = () => {
    const { id, module } = this.state;
    const { cmsSettings } = this.props;

    let reqOBJ = {};
    let reqURL =
      "cms/" +
      (module !== "locations" ? "specialpromotiondetails" : "locationdetails") +
      "?portalid=" +
      cmsSettings.portalID +
      "&itemid=" +
      id;
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({
          result: data?.response || "",
          isLoading: false,
        });
      },
      "GET"
    );
  };

  handleTabs = (activeTab) => {
    // this.setState({ activeTab, isShowForm: false, mode: "add" }, () =>
    //   this.scrollRef.current.scrollIntoView({ behavior: "smooth" })
    // );
    this.setState({ activeTab, isShowForm: false, mode: "add" });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getLocationDetails(46270);
    // this.setState(
    //   {
    //     id: this.props.match.params.id,
    //     module: this.props.match.params.module,
    //   },
    //   () => this.getLocationDetails(46270)
    // );
  }
  handleMenuClick = (req, redirect) => {
    if (redirect) {
      if (redirect === "back-office")
        this.props.history.push(`/Backoffice/${req}`);
      else {
        this.props.history.push(`/Reports`);
      }
      window.location.reload();
    } else {
      this.props.history.push(`${req}`);
    }
  };
  getLocationDetails = (id) => {
    this.setState({ isLoading: true });
    const reqOBJ = {};
    let reqURL = "cms/toplocations?" + cmsConfig.siteurl + "&culturecode=en-US";
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {

      this.setState({ results: resonsedata.response, isLoading: false });
    }.bind(this), "GET");
  }
  RedirectToList = () => {
    this.props.history.push(`/Locationlist`);
  };
  deleteLocation = (id) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~packages-manage-package")) { ///LocationList~packages-delete-package
      this.setState({
        deleteItem: id,
        isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup,
        currentPage: 0,
      });
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };

  handleConfirmDeleteLocation = () => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~packages-manage-package")) { //LocationList~packages-delete-package
      this.setState({ isLoading: true });
      const reqOBJ = {
        request: {
          LocationID: this.state.deleteItem
        },
      };
      let reqURL = "cms/location/delete";
      apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
        this.getLocationDetails();
      }.bind(this), "POST");
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };
  handleConfirmDelete = (isConfirmDelete) => {
    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.handleConfirmDeleteLocation();
  };

  confirmDeleteLocation = () => {
    let deleteItem = this.state.deleteItem;
    deleteItem.id = deleteItem.specialPromotionID;
    deleteItem.status = "deleted";
    this.setState({ results: [] });

    var reqURL = "cms/package/delete";
    var reqOBJ = deleteItem;
    apiRequester_unified_api(reqURL, reqOBJ, () => {
      this.getLocationDetails();
    });
  };

  handleCreateEditLocation = (state, id) => {

    this.setState({ isShowForm: true, idForEdit: id, mode: id > 0 ? "edit" : "add" });
  }

  handleShowHideForm = (flag) => {
    this.setState({ isShowForm: flag });
  }

  render() {
    const { id, result, results, isLoading, activeTab, module, tabs,
      isDeleteConfirmPopup, isShowForm, idForEdit, mode } = this.state;
    const { cmsSettings } = this.props;

    const details = result.details ? result.details[0] : "";
    const title = (details && details?.shortdescription) || "Details";
    const defaultImg = (details && details?.imagepath) ? details?.imagepath.indexOf(".s3.") > 0 ? details?.imagepath :
      process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
      cmsSettings?.portalID +
      "/SpecialsPromotions/images/" +
      details?.imagepath : "";

    const defaultImgLoc =
      process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
      cmsSettings?.portalID +
      "/LocationsGuide/images/" +
      details?.locationImage;

    let images = [];
    result?.tabs?.photoGallery &&
      result?.tabs?.photoGallery.map((x) =>
        images.push({
          url: x.imagepath.indexOf(".s3.") > 0 ? x.imagepath :
            process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
            cmsSettings?.portalID +
            "/SpecialsPromotions/" +
            x.imagepath,
        })
      );

    let starItems = [];
    for (var i = 0; i < details?.rating; i++) {
      starItems.push(<SVGIcon
        name="star"
        key={i}
        type="fill"
        width="14"
        height="14"
        className="text-primary"
      ></SVGIcon>);
    }
    return (
      <div className="text-left">
        {/* <CMSPageTitle title={title} icon="map-marker" /> */}
        {!isLoading && module !== "locations" && (
          <div
            style={{ minHeight: "calc(100vh - 284px)" }}
            className="container mt-4 mb-5"
          >

            <div ref={this.scrollRef} />

            <div className="row mt-4">
              <div className="col-lg-12 p-0">
                <ul className="nav nav-tabs">
                  {tabs &&
                    tabs.map(
                      (x, i) => (
                        <li className="nav-item mr-2">
                          <button
                            class={
                              "nav-link p-2 rounded-0 text-capitalize" +
                              (activeTab === x ? " active" : "")
                            }
                            onClick={() => this.handleTabs(x)}
                          >
                            {x}
                          </button>
                        </li>
                      ))}
                </ul>

                <div className="mt-4">
                  {tabs &&
                    tabs.map(
                      (x) =>
                        activeTab === x && (
                          <div className={"cms-details-" + x}>
                            {x === "Banner Image" && (
                              <div>
                                <CMSInspireMe  {...this.state} {...this.props} isFromContentManager={true} />
                              </div>
                            )}
                            {activeTab === "Header" && (
                              <div>
                                <CMSCompanyDetails  {...this.state} {...this.props} isFromContentManager={true} />
                              </div>
                            )}
                            {x === "Text Content" && (
                              <div>
                                <CMSTextHTMLModule  {...this.state} {...this.props} isFromContentManager={true} />
                              </div>
                            )}
                            {x === "Locations" && (
                              <div>
                                {!isShowForm ? <LocationList {...this.state} {...this.props} isFromContentManager={true}
                                  handleCreateEditLocation={this.handleCreateEditLocation}
                                  handleShowHideForm={this.handleShowHideForm} /> : <span></span>}
                                {isShowForm ? <LocationForm {...this.state} {...this.props} isFromContentManager={true}
                                  mode={mode} id={idForEdit}
                                  handleShowHideForm={this.handleShowHideForm} /> : <span></span>}
                              </div>
                            )
                            }
                            {x === "Hot Deals" && (
                              <div>
                                {!isShowForm ? <PackageList {...this.state} {...this.props} isFromContentManager={true} dealsType={1}
                                  handleCreateEditLocation={this.handleCreateEditLocation}
                                  handleShowHideForm={this.handleShowHideForm} /> : <span></span>}
                                {isShowForm ? <PackageForm {...this.state} {...this.props} isFromContentManager={true} dealsType={1}
                                  mode={mode} id={idForEdit}
                                  handleShowHideForm={this.handleShowHideForm} /> : <span></span>}
                              </div>
                            )
                            }
                            {x === "Special Packages" && (
                              <div>
                                {!isShowForm ? <PackageList {...this.state} {...this.props} isFromContentManager={true} dealsType={3}
                                  handleCreateEditLocation={this.handleCreateEditLocation}
                                  handleShowHideForm={this.handleShowHideForm} /> : <span></span>}
                                {isShowForm ? <PackageForm {...this.state} {...this.props} isFromContentManager={true} dealsType={3}
                                  mode={mode} id={idForEdit}
                                  handleShowHideForm={this.handleShowHideForm} /> : <span></span>}
                              </div>
                            )}
                            {x === "termsConditions" && (
                              <div>a dasd asd asdasd asdas</div>
                            )}

                            {(x === "inclusion" || x === "exclusion") && (
                              <ul>
                                {tabs.map((y) => (
                                  <li>{y}</li>
                                ))}
                              </ul>
                            )}

                            {x === "photoGallery" && (
                              <div className="row">
                                <div className="col-lg-2"></div>
                                <div className="col-lg-8">
                                  {/* <ImageSlider
                                    images={images}
                                    businessName={"hotel"}
                                    noofimage={1}
                                  /> */}
                                  <div>a dasd asd asdasd asdas</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && module === "locations" && (
          <div
            style={{ minHeight: "calc(100vh - 284px)" }}
            className="container mt-4 mb-5"
          >
            <div className="row">
              <div className="col-lg-2">
                <img
                  class="img-fluid"
                  src={defaultImgLoc}
                  alt={details?.shortdescription}
                />
              </div>
              <div className="col-lg-10">
                <h5 className="font-weight-bold">{details?.locationTitle}</h5>
                <p className="text-secondary"><HtmlParser text={decode(details?.summarydescription)} /></p>
                {result?.tabs && (
                  <div
                    className="text-secondary"
                    style={{ overflow: "hidden", maxHeight: "120px" }}
                  >
                    {result?.tabs[0]?.tabDetails && (
                      <HtmlParser text={decode(result?.tabs[0]?.tabDetails)} />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div ref={this.scrollRef} />

            <div className="row mt-4">
              <div className="col-lg-12">
                <ul className="nav nav-tabs">
                  {result?.tabs &&
                    result?.tabs.map((x) => (
                      <li>
                        <button
                          class={
                            "nav-link p-2 rounded-0 text-capitalize" +
                            (activeTab === x?.tabTitle ? " active" : "")
                          }
                          onClick={() => this.handleTabs(x?.tabTitle)}
                        >
                          {x?.tabTitle}
                        </button>
                      </li>
                    ))}
                </ul>

                <div className="mt-4">
                  {result?.tabs &&
                    result?.tabs.map(
                      (x) =>
                        activeTab === x?.tabTitle && (
                          <div className={"cms-details-" + x}>
                            <HtmlParser text={decode(x?.tabDetails)} />
                          </div>
                        )
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "calc(100vh - 228px)", opacity: ".5" }}
          >
            <Loader />
          </div>
        )}
      </div>
    );
  }
}

export default CMSContentManager;
