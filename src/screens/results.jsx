import React from "react";
import ResultItem from "../components/results/result-item";
import ResultItemWithSupplierPrice from "../components/results/result-item-withsupplierprice";
import Filters from "../components/filters/filters";
import Sorting from "../components/sorting/sorting";
import TotalItems from "../components/results/result-total";
import ResultsLoading from "../components/results/result-loading";
import SearchWidget from "../components/search/search-widget";
import LazyLoading from "../components/pagination/lazyloading";
import ResultViews from "../components/results/result-views";
import { Trans } from "../helpers/translate";
import ResultBase from "../base/result-base";
import ResultItemAir from "../components/results/result-item-air";
import MapComponent from "../components/common/MapComponent";
import * as Global from "../helpers/global";
import ModelPopup from "../helpers/model";
import CartIcon from "../components/common/cart-icon";
import WishList from "../components/results/result-wishlist";
import EmailWishList from "./../components/results/result-wishlist-email";
import ActionModal from "../helpers/action-modal";
import { StickyContainer, Sticky } from "react-sticky";
import SortingDomestic from "../components/sorting/sorting-domestic";
import LazyLoadingDomestic from "../components/pagination/lazyloading-domestic";
import TotalItemsDomestic from "../components/results/result-total-domestic";
import ResultItemAirDomestic from "../components/results/result-item-air-domestic";
import FiltersDomestic from "../components/filters/filters-domestic";
import ResultItemAirDomesticSelected from "../components/results/result-item-air-domestic-selected";
import Config from "../config.json";
import SVGIcon from "../helpers/svg-icon";

class Results extends ResultBase {
  constructor(props) {
    super(props);
    this.state = {
      businessName: this.props.match.params.businessName,
      results: [],
      resultsForMap: [],
      isLoading: true,
      isDetailsResponseLoading: true,
      isFilterLoading: false,
      token: "",
      currentView: "listview",
      currentMapView: false,
      request: null,
      showQuickBook: false,
      details: "",
      isDetailsLoading: true,
      isBtnLoading: false,
      filterCurrencySymbol: Global.getEnvironmetKeyValue(
        "portalCurrencySymbol"
      ),
      wishList: [],
      wishListPopup: false,
      isSuccessPopup: false,
      selectedFlights: [],
      isShowResponsiveFilters: false,
    };
  }

  componentDidMount() {
    if (localStorage.getItem("IsFromDetailsPage") !== "")
      localStorage.removeItem("IsFromDetailsPage");
    let currentLang =
      localStorage.getItem("lang") === null
        ? "en-US"
        : localStorage.getItem("lang");
    var GoogleMapKey = "";
    if (
      Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand") !== null &&
      Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand") !== ""
    ) {
      GoogleMapKey = Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand");
    } else {
      GoogleMapKey = Config.GoogleMapKey;
    }
    if (currentLang !== "en-US") {
      const script = document.createElement("script");

      script.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        GoogleMapKey +
        "&libraries=places&language=" +
        currentLang.split("-")[0] +
        "&region=" +
        currentLang.split("-")[1] +
        "";
      script.async = true;

      document.body.appendChild(script);
    } else {
      const script = document.createElement("script");

      script.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        GoogleMapKey +
        "&libraries=places";
      script.async = true;

      document.body.appendChild(script);
    }
    window.scrollTo(0, 0);
    var requestObject = this.getRequestObject();
    this.setState({
      requestObjectString: JSON.stringify(this.props.match.params),
    });
    this.hideQuickBook();
    this.getResults(requestObject);
    this.props.history.listen((location, action) => {
      this.setState({
        callModifySearch: true,
      });
    });
  }

  componentDidUpdate() {
    if (this.state.callModifySearch) {
      this.setState({
        callModifySearch: false,
        isLoading: true,
      });
      this.getResults(this.getRequestObject());
    }
  }

  handleFlightSelect = (items, routeType) => {
    let selectedFlightsArr = [...this.state.selectedFlights];
    selectedFlightsArr.length === 0 && selectedFlightsArr.push({}, {});

    if (routeType === "departure") {
      selectedFlightsArr[0] = items;
    }
    if (routeType === "arrival") {
      selectedFlightsArr[1] = items;
    }

    this.setState({ selectedFlights: selectedFlightsArr });
  };

  handleResponsiveSearchFilters = (type) => {
    if (type === "filters" || type === "search") {
      !this.state.isShowResponsiveFilters && window.scrollTo(0, 0);
    }

    if (type === "filters") {
      this.setState({
        isShowResponsiveFilters: !this.state.isShowResponsiveFilters,
      });
    }

    if (type === "search") {
      this.setState({
        isShowResponsiveSearch: !this.state.isShowResponsiveSearch,
      });
    }
  };

  render() {
    const {
      results,
      resultsForMap,
      isLoading,
      currentView,
      currentMapView,
      businessName,
      showQuickBook,
      details,
      wishListPopup,
      isShowResponsiveFilters,
      isShowResponsiveSearch,
    } = this.state;
    let t1 = performance.now();

    let isWishList =
      Global.getEnvironmetKeyValue("EnableWishList", "cobrand") === "true"
        ? true
        : false;

    let ShowSupplierWisePrice =
      Global.getEnvironmetKeyValue("ShowSupplierWisePrice", "cobrand") ===
        "true"
        ? true
        : false;

    const isDomesticRoundTrip = !isLoading
      ? results.data !== undefined &&
        (results.data.find((x) => x.code === "departure") ||
          results.data.find((x) => x.code === "arrival"))
        ? true
        : false
      : false;

    return (
      <React.Fragment>
        {!isDomesticRoundTrip && (
          <StickyContainer>
            {Global.getEnvironmetKeyValue("isCart") !== null &&
              Global.getEnvironmetKeyValue("isCart") && (
                <CartIcon isDisplay={1} {...this.props} />
              )}

            <Sticky>
              {({ style }) => (
                <div
                  className={
                    "hight-z-index mod-search-area" +
                    (isShowResponsiveSearch ? " mod-search-area-show" : "")
                  }
                  style={{ ...style, transform: "inherit" }}
                >
                  <SearchWidget
                    history={this.props.history}
                    match={this.props.match}
                    getResults={this.getResults}
                    location={this.props.location}
                    mode={"modify"}
                  />
                </div>
              )}
            </Sticky>

            {isLoading ? (
              <ResultsLoading />
            ) : (
              <div className="container">
                {results === undefined ||
                  results.length === 0 ||
                  results.data.find((x) => x.code === "default") === undefined ? (
                  <div className="row mb-4 no-gutters align-items-center ">
                    <div className="col-lg-6 pt-4 pb-3">
                      <h5>{Trans("_no" + businessName + "Found")}</h5>
                    </div>
                  </div>
                ) : (
                  <React.Fragment>
                    <div className="row border-bottom mb-4 no-gutters align-items-center">
                      <div className="col-lg-5 col-sm-12 pt-4 pb-3">
                        <TotalItems {...results} businessName={businessName} />
                      </div>
                      <div className="col-lg-7 col-sm-12 text-right pt-3 pb-3">
                        <Sorting
                          {...results}
                          handleSorting={this.filterResults}
                        />
                        {businessName !== "vehicle" && (
                          <ResultViews
                            {...results}
                            currentView={currentView}
                            currentMapView={currentMapView}
                            handleViews={this.changeView}
                            businessName={businessName}
                          />
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="d-none responsive-results-btns">
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            this.handleResponsiveSearchFilters("filters")
                          }
                        >
                          <SVGIcon
                            name="filter"
                            width="16"
                            height="16"
                            className="mr-2"
                            type="fill"
                          ></SVGIcon>
                          {isShowResponsiveFilters && "Hide "}Filters
                        </button>

                        <button
                          className="btn btn-primary ml-2"
                          onClick={() =>
                            this.handleResponsiveSearchFilters("search")
                          }
                        >
                          <SVGIcon
                            name="search"
                            width="16"
                            height="16"
                            className="mr-2"
                            type="fill"
                          ></SVGIcon>
                          {isShowResponsiveSearch && "Hide "}Change Search
                        </button>
                      </div>

                      <div
                        className={
                          "col-lg-3 result-filter-area" +
                          (isShowResponsiveFilters
                            ? " result-filter-area-show"
                            : "")
                        }
                      >
                        <Filters
                          {...results}
                          handleFilter={this.filterResults}
                          key={this.state.filterToken}
                          filterCurrencySymbol={this.state.filterCurrencySymbol}
                          businessName={businessName}
                          locationName={
                            businessName === "hotel"
                              ? this.props.match.params.locationName
                              : ""
                          }
                        />

                        {isWishList && (
                          <WishList
                            wishList={this.state.wishList}
                            clearWishList={this.clearWishList}
                            handleWishListPopup={this.handleWishListPopup}
                          />
                        )}

                        {wishListPopup && (
                          <EmailWishList
                            wishList={this.state.wishList}
                            handleWishListPopup={this.handleWishListPopup}
                            sendWishList={this.sendWishList}
                          />
                        )}
                      </div>
                      <div className="col-lg-9">
                        {this.state.businessName === "hotel" &&
                          this.state.currentMapView &&
                          this.getMapData(resultsForMap.data).length > 0 &&
                          this.state.currentMapView && (
                            <MapComponent
                              places={this.getMapData(
                                this.state.currentMapViewItem === null
                                  ? resultsForMap.data
                                  : this.state.currentMapViewItem.item
                              )}
                              getInfoWindowString={this.getMapInfoWindowString}
                              cityName={
                                this.state.currentMapViewItem === null
                                  ? this.props.match.params.locationName
                                  : this.state.currentMapViewItem.item
                                    .locationName
                              }
                              defaultCenterLatLong={
                                this.state.currentMapViewItem !== null && {
                                  lat: this.state.currentMapViewItem.item
                                    .locationInfo.fromLocation.latitude,
                                  lng: this.state.currentMapViewItem.item
                                    .locationInfo.fromLocation.longitude,
                                }
                              }
                              businessName={this.state.businessName}
                              page="list"
                              history={this.props.history}
                            />
                          )}
                        {(businessName === "transportation" ||
                          businessName === "groundservice") && (
                            <div className="row no-gutters border shadow-sm mb-3 p-3">
                              {Trans("_listtransportationMessage")}
                            </div>
                          )}
                        {ShowSupplierWisePrice && (
                          <ResultItemWithSupplierPrice
                            {...results}
                            businessName={businessName}
                            currentView={currentView}
                            redirectToDetail={this.redirectToDetail}
                            redirectToDetailWithSupplierOverride={
                              this.redirectToDetailWithSupplierOverride
                            }
                            showmoredetailspopup={this.showmoredetailspopup}
                            showRentalConditions={this.showRentalConditions}
                            showVehicletermsCondition={
                              this.showVehicletermsCondition
                            }
                            urlPath={this.props.match.url}
                            searchParam={this.props.match}
                            t1={t1}
                            handleQuickBook={this.handleQuickBook}
                            hideQuickBook={this.hideQuickBook}
                            showQuickBook={showQuickBook}
                            details={details}
                            isDetailsResponseLoading={
                              !this.state.isDetailsResponseLoading
                            }
                            mapByItem={this.mapByItem}
                            handleCart={this.redirectToCart}
                            isBtnLoading={this.state.isBtnLoading}
                            handleShowPolicyPopup={this.handleShowPolicyPopup}
                            showPriceFarebreakup={this.showPriceFarebreakup}
                            showRoomTerms={this.showRoomTerms}
                            requestObject={this.getRequestObject}
                            getAminitiesLength={this.GetAminitiesLength}
                            addToWishList={this.addToWishList}
                            wishList={this.state.wishList}
                          />
                        )}
                        {!ShowSupplierWisePrice &&
                          (businessName !== "air" ? (
                            <ResultItem
                              {...results}
                              businessName={businessName}
                              currentView={currentView}
                              redirectToDetail={this.redirectToDetail}
                              showmoredetailspopup={this.showmoredetailspopup}
                              showRentalConditions={this.showRentalConditions}
                              showVehicletermsCondition={
                                this.showVehicletermsCondition
                              }
                              urlPath={this.props.match.url}
                              searchParam={this.props.match}
                              t1={t1}
                              handleQuickBook={this.handleQuickBook}
                              hideQuickBook={this.hideQuickBook}
                              showQuickBook={showQuickBook}
                              details={details}
                              isDetailsResponseLoading={
                                !this.state.isDetailsResponseLoading
                              }
                              mapByItem={this.mapByItem}
                              handleCart={this.redirectToCart}
                              isBtnLoading={this.state.isBtnLoading}
                              handleShowPolicyPopup={this.handleShowPolicyPopup}
                              showPriceFarebreakup={this.showPriceFarebreakup}
                              showRoomTerms={this.showRoomTerms}
                              requestObject={this.getRequestObject}
                              getAminitiesLength={this.GetAminitiesLength}
                              addToWishList={this.addToWishList}
                              wishList={this.state.wishList}
                            />
                          ) : (
                            <ResultItemAir
                              {...results}
                              handleCart={this.redirectToCart}
                              handleFareRules={this.getFareRules}
                              fareRules={this.state.fareRules}
                              searchToken={this.state.token}
                              isBtnLoading={this.state.isBtnLoading}
                              addToWishList={this.addToWishList}
                              wishList={this.state.wishList}
                            />
                          ))}
                        <div className="row">
                          <div className="col-lg-12">
                            <LazyLoading
                              {...results}
                              handlePaginationResults={this.paginationResults}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}

            {this.state.showPopup && (
              <ModelPopup
                header={this.state.popupHeader}
                content={this.state.popupContent}
                handleHide={this.handleHidePopup}
              />
            )}

            {this.state.isSuccessPopup && (
              <ActionModal
                title={Trans("_emailWishList")}
                message={Trans("_emailWishListMessage")}
                positiveButtonText={Trans("_ok")}
                onPositiveButton={this.handleSuccessPopup}
                handleHide={this.handleSuccessPopup}
              />
            )}
          </StickyContainer>
        )}

        {isDomesticRoundTrip && (
          <React.Fragment>
            {Global.getEnvironmetKeyValue("isCart") !== null &&
              Global.getEnvironmetKeyValue("isCart") && (
                <CartIcon isDisplay={1} {...this.props} />
              )}

            <SearchWidget
              history={this.props.history}
              match={this.props.match}
              getResults={this.getResults}
              location={this.props.location}
              mode={"modify"}
            />

            {!isLoading && (
              <div className="container">
                {results === undefined || results.length === 0 ? (
                  <div className="row mb-4 no-gutters align-items-center ">
                    <div className="col-lg-6 pt-4 pb-3">
                      <h5>{Trans("_no" + businessName + "Found")}</h5>
                    </div>
                  </div>
                ) : (
                  <React.Fragment>
                    <div className="mb-4"></div>

                    <div className="row">
                      <div className="col-lg-3">
                        <FiltersDomestic
                          {...results}
                          handleFilter={this.filterResultsDomesticDepart}
                          handleFilterDepart={this.filterResultsDomesticDepart}
                          handleFilterReturn={this.filterResultsDomesticReturn}
                          key={this.state.filterToken}
                          filterCurrencySymbol={this.state.filterCurrencySymbol}
                          businessName={businessName}
                          locationName={
                            businessName === "hotel"
                              ? this.props.match.params.locationName
                              : ""
                          }
                        />
                      </div>

                      <div className="col-lg-9">
                        <div className="row no-gutters">
                          <div className="col-lg-6 pr-1">
                            <TotalItemsDomestic
                              {...results}
                              businessName={businessName}
                              routeType="departure"
                            />

                            <div className="mt-3">
                              <SortingDomestic
                                {...results}
                                handleSorting={this.filterResultsDomesticDepart}
                                routeType="departure"
                              />
                            </div>

                            <div className="mt-3">
                              <ResultItemAirDomestic
                                {...results}
                                routeType="departure"
                                handleFlightSelect={this.handleFlightSelect}
                              />
                            </div>

                            <div className="mt-2">
                              <LazyLoadingDomestic
                                {...results}
                                handlePaginationResults={
                                  this.paginationResultsDomestic
                                }
                                routeType="departure"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 pl-1">
                            <TotalItemsDomestic
                              {...results}
                              businessName={businessName}
                              routeType="arrival"
                            />

                            <div className="mt-3">
                              <SortingDomestic
                                {...results}
                                handleSorting={this.filterResultsDomesticReturn}
                                routeType="arrival"
                              />
                            </div>

                            <div className="mt-3">
                              <ResultItemAirDomestic
                                {...results}
                                routeType="arrival"
                                handleFlightSelect={this.handleFlightSelect}
                              />
                            </div>

                            <div className="mt-2">
                              <LazyLoadingDomestic
                                {...results}
                                handlePaginationResults={
                                  this.paginationResultsDomestic
                                }
                                routeType="arrival"
                              />
                            </div>
                          </div>
                        </div>

                        {this.state.selectedFlights.length > 0 && (
                          <div style={{ minHeight: "60px" }}>
                            <ResultItemAirDomesticSelected
                              selectedFlights={this.state.selectedFlights}
                              handleCart={this.redirectToCartDomestic}
                              handleFareRules={this.getFareRules}
                              fareRules={this.state.fareRules}
                              searchToken={this.state.token}
                              isBtnLoading={this.state.isBtnLoading}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}

            {isLoading && <ResultsLoading />}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Results;
