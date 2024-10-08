import React, { Component } from "react";
import QuotationMenu from "../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import Loader from "../components/common/loader";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import ActionModal from "../helpers/action-modal";
import SVGIcon from "../helpers/svg-icon";
import onlineBooking from "../assets/images/customer-portal/template-images/DeleteSVG.svg";
import { cmsConfig } from "../helpers/cms-config";

class LocationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isDeleteConfirmPopup: false,
    };
  }
  componentDidMount() {
    this.getLocationDetails(46270);
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
    let reqURL = "cms/toplocations?" + (this.props.isFromContentManager ? ("siteurl=" + this.props.portalURL.replace("http://", "").replace("https://", "").replace("/cms", "") + "/cms") : cmsConfig.siteurl) + "&culturecode=en-US";
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

  handleCreateEditLocation = (id) => {
    let state = this.state;
    this.props.handleCreateEditLocation(state, id);
  }

  handleShowHideForm = (flag) => {
    this.props.handleShowHideForm(flag);
  }

  render() {
    const { results,
      isDeleteConfirmPopup, isLoading } = this.state;
    const { userInfo, isFromContentManager } = this.props;
    return (
      <div className="quotation quotation-list">
        <div className={isFromContentManager ? "border-bottom pt-1 pb-1 mb-3" : "title-bg pt-3 pb-3 mb-3"}>
          <div className="container">
            <h1 className={isFromContentManager ? "text-dark text-left m-0 p-0 f30" : "text-white m-0 p-0 f30"}>
              {!isFromContentManager && <SVGIcon
                name="file-text"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>}
              Manage Locations
              <AuthorizeComponent title="dashboard-menu~packages-create-package" type="button" rolepermissions={userInfo.rolePermissions}>
                <button
                  className="btn btn-sm btn-primary pull-right mr-2"
                  onClick={() => this.props.isFromContentManager ? this.handleCreateEditLocation(0) : AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~packages-create-package") ? this.props.history.push(`/location/add`) : this.setState({ isshowauthorizepopup: true })}
                >
                  Create Location
                </button>
              </AuthorizeComponent>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className={isFromContentManager ? "d-none" : "col-lg-3 hideMenu"}>
              <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
            </div>
            <div className={isFromContentManager ? "col-lg-12 mt-3 p-0" : "col-lg-9 mt-3"}>
              {isLoading && (
                <div className="container ">
                  <Loader />
                </div>
              )}
              {!isLoading && results && results.length > 0 && results.map((x, index) => {
                return (
                  <div className="col-lg-4 pull-left">
                    <div className="mb-4 card tw-offers-card shadow border-0" key={index}>
                      <a href="#" onClick={() => this.props.isFromContentManager ? this.handleCreateEditLocation(x.locationID) : this.props.history.push(`/Location/Edit/` + x.locationID)}>
                        <img className="w-100" style={{ height: "200px" }} src={(x?.locationImage.indexOf(".s3.") > 0 || x?.locationImage.indexOf("/cms/") > 0) ? x?.locationImage : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + x?.portalID + "/LocationsGuide/images/" + x?.locationImage} />
                      </a>
                      <button
                        className="btn btn-primary tw-offers-card-btn"
                        onClick={() => this.props.isFromContentManager ? this.handleCreateEditLocation(x.locationID) : this.props.history.push(`/Location/Edit/` + x.locationID)}
                      >
                        {x.locationTitle}
                      </button>
                      <button
                        className="btn btn-sm position-absolute text-nowrap p-0" style={{ right: "-10px", top: "-10px" }}
                        onClick={() => this.deleteLocation(x.locationID)}
                      >
                        <img style={{ width: "22px" }} src={onlineBooking} alt="" />
                      </button>
                    </div>
                  </div>
                )
              })
              }
              {isDeleteConfirmPopup && (
                <ActionModal
                  title="Confirm Delete"
                  message="Are you sure you want to delete this item?"
                  positiveButtonText="Confirm"
                  onPositiveButton={() => this.handleConfirmDelete(true)}
                  handleHide={() => this.handleConfirmDelete(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default LocationList;
