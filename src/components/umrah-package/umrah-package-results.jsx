import React, { Component } from "react";
import ResultBase from "./../../base/result-base";
import LazyLoading from "../pagination/lazyloading";
import ModelPopup from "../../helpers/model";
import UmrahPackageResultsItem from "./umrah-package-results-item";
import UmrahPackageResultsLoading from "./umrah-package-results-loading";
import UmrahPackageResultsTotal from "./umrah-package-results-total";
import Filters from "../filters/filters";
import Sorting from "../sorting/sorting";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";
import QuotationResultItemAir from "../../components/results/quotation-result-item-air";
import { Trans } from "../../helpers/translate";
import MapComponent from "../common/MapComponent";

class UmrahPackageResults extends ResultBase {
  constructor(props) {
    super(props);
    this.state = {
      businessName: this.props.businessName,
      results: [],
      resultsForMap: [],
      isLoading: true,
      isDetailsResponseLoading: true,
      isFilterLoading: false,
      token: "",
      request: null,
      showQuickBook: false,
      details: "",
      isDetailsLoading: true,
      isBtnLoading: false,
      filterCurrencySymbol: Global.getEnvironmetKeyValue("portalCurrencySymbol"),
      isSuccessPopup: false,
      isShowResults: true,
      searchRequest: "",
      itemId: "",
      isFilters: false,
      isRouteMode: true,
      currentMapView: null,
      currentMapViewItem: null
    };
  }

  showhideResults = () => {
    this.setState({
      isShowResults: !this.state.isShowResults,
    });
  };

  addItem = (itemId, itemCode, quickBookKey, item) => {
    this.setState({
      itemId: "",
    });
    //this.showhideResults();
    //this.hideQuickBook();

    if (this.props.type === "umrah-package") {
      this.redirectToCart(itemId, itemCode, quickBookKey, true, this.props.addItem, JSON.stringify(item));
    }
    else
      this.props.addItem(item);
  };

  showFilters = () => {
    this.setState({
      isFilters: !this.state.isFilters,
    });
  };

  componentDidMount() {
    const { searchRequest } = this.props;
    this.setState({
      searchRequest,
    });
    this.getResults(this.getRequestObjectByRequest(searchRequest));
  }

  render() {
    const {
      isShowResults,
      isLoading,
      results,
      details,
      showQuickBook,
      isDetailsResponseLoading,
      businessName,
      searchRequest,
      isFilters,
    } = this.state;
    return (
      <div className="border shadow-sm mt-4">
        {isLoading && (
          <UmrahPackageResultsLoading businessName={businessName} type={this.props.type} />
        )}

        {!this.state.isLoading &&
          (results === undefined || results.length === 0 ? (
            <React.Fragment>
              <h5 className="text-center p-4 text-primary text-capitalize">
                {Trans("_no" + businessName + "Found")}! Please Add Manually
              </h5>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <UmrahPackageResultsTotal
                {...results}
                businessName={businessName}
                searchRequest={searchRequest}
                isShowResults={isShowResults}
                showhideResults={this.showhideResults}
                deleteResults={this.props.deleteResults}
              />

              {isShowResults && (
                <React.Fragment>
                  <div className="quotation-sort border-top p-3 d-flex">
                    <button
                      className="mr-auto btn btn-outline-secondary border text-primary"
                      onClick={this.showFilters}
                    >
                      <SVGIcon
                        name="filter"
                        width="16"
                        type="fill"
                        height="16"
                        className="mr-2"
                      ></SVGIcon>
                      <b className="mr-2">{isFilters ? "Hide Filters" : "Show Filters"}</b>
                    </button>
                    <Sorting {...results} handleSorting={this.filterResults} />
                    {this.state.businessName === "hotel" &&
                      <button
                        title={Trans("_mapView")}
                        className={
                          this.state.currentMapView ? "btn btn-primary" : "btn btn-light border"
                        }
                        onClick={() => this.changeView("mapview")}
                      >
                        <SVGIcon name="map-marker" width="16" height="16"></SVGIcon>
                      </button>
                    }
                  </div>

                  {this.state.businessName === "hotel" &&
                    this.state.currentMapView &&
                    this.getMapData(this.state.resultsForMap.data).length > 0 &&
                    this.state.currentMapView && (
                      <MapComponent
                        places={this.getMapData(
                          this.state.currentMapViewItem === null
                            ? this.state.resultsForMap.data
                            : this.state.currentMapViewItem.item
                        )}
                        getInfoWindowString={this.getMapInfoWindowString}
                        cityName={searchRequest.fromLocation.name}
                        defaultCenterLatLong={
                          this.state.currentMapViewItem !== null && {
                            lat: this.state.currentMapViewItem.item.locationInfo.fromLocation
                              .latitude,
                            lng: this.state.currentMapViewItem.item.locationInfo.fromLocation
                              .longitude,
                          }
                        }
                        businessName={this.state.businessName}
                        page="list"
                        history={this.props.history}
                      />
                    )}

                  <div className="row no-gutters">
                    {isFilters && (
                      <div className="col-lg-3 quotation-filters">
                        <Filters
                          {...results}
                          handleFilter={this.filterResults}
                          key={this.state.filterToken}
                          filterCurrencySymbol={this.state.filterCurrencySymbol}
                          businessName={businessName}
                        />
                      </div>
                    )}

                    <div className={isFilters ? "col-lg-9" : "col-lg-12"}>
                      {(businessName === "hotel" ||
                        businessName === "activity" ||
                        businessName === "transfers" ||
                        businessName === "transportation" ||
                        businessName === "groundservice") && (
                          <UmrahPackageResultsItem
                            {...results}
                            businessName={businessName}
                            details={details}
                            handleQuickBook={this.handleQuickBook}
                            hideQuickBook={this.hideQuickBook}
                            showQuickBook={showQuickBook}
                            isDetailsResponseLoading={!isDetailsResponseLoading}
                            isBtnLoading={this.state.isBtnLoading}
                            handleShowPolicyPopup={this.handleShowPolicyPopup}
                            showPriceFarebreakup={this.showPriceFarebreakup}
                            showRoomTerms={this.showRoomTerms}
                            getAminitiesLength={this.GetAminitiesLength}
                            redirectToDetail={this.redirectToDetail}
                            handleCart={this.addItem}
                            requestObject={() => this.getRequestObjectByRequest(searchRequest)}
                            type={this.props.type}
                          />
                        )}

                      {businessName === "air" && (
                        <QuotationResultItemAir
                          {...results}
                          handleCart={this.addItem}
                          handleFareRules={this.getFareRules}
                          fareRules={this.state.fareRules}
                          searchToken={this.state.token}
                          isBtnLoading={this.state.isBtnLoading}
                          addToWishList={this.addToWishList}
                          wishList={this.state.wishList}
                          type={this.props.type}
                        />
                      )}

                      <div className="mt-3">
                        <LazyLoading
                          {...results}
                          handlePaginationResults={this.paginationResults}
                        />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          ))}

        {this.state.showPopup && (
          <ModelPopup
            header={this.state.popupHeader}
            content={this.state.popupContent}
            handleHide={this.handleHidePopup}
          />
        )}
      </div>
    );
  }
}

export default UmrahPackageResults;
