import React, { Component } from "react";
import ResultBase from "./../../base/result-base";
import LazyLoading from "../pagination/lazyloading";
import ModelPopup from "../../helpers/model";
import QuotationResultsItem from "./quotation-results-item";
import QuotationResultsLoading from "./quotation-results-loading";
import QuotationResultsTotal from "./quotation-results-total";
import Filters from "../filters/filters";
import Sorting from "../sorting/sorting";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";
import QuotationResultItemAir from "../../components/results/quotation-result-item-air";
import { Trans } from "../../helpers/translate";
import FiltersDomestic from "../../components/filters/filters-domestic";
import SortingDomestic from "../../components/sorting/sorting-domestic";
import LazyLoadingDomestic from "../../components/pagination/lazyloading-domestic";
import TotalItemsDomestic from "../../components/results/result-total-domestic";
import ResultItemAirDomestic from "../../components/results/result-item-air-domestic";
import ResultItemAirDomesticSelected from "../../components/results/result-item-air-domestic-selected";

class QuotationResults extends ResultBase {
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
      selectedFlights: [],
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
    this.showhideResults();
    this.hideQuickBook();
    //this.redirectToCart(itemId, itemCode, quickBookKey, true);
    this.props.addItem(item);
  };

  showFilters = () => {
    this.setState({
      isFilters: !this.state.isFilters,
    });
  };

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

    const isDomesticRoundTrip = !isLoading
      ? results.data !== undefined &&
        (results.data.find((x) => x.code === "departure") ||
          results.data.find((x) => x.code === "arrival"))
        ? true
        : false
      : false;
    return (
      <div className="border shadow-sm mt-4">
        {isLoading && (
          <QuotationResultsLoading businessName={businessName} type={this.props.type} />
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
              <QuotationResultsTotal
                {...results}
                businessName={businessName}
                searchRequest={searchRequest}
                isShowResults={isShowResults}
                showhideResults={this.showhideResults}
                deleteResults={this.props.deleteResults}
                isDomesticRoundTrip={isDomesticRoundTrip}
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
                    <Sorting {...results} handleSorting={this.filterResults} isfromTourwiz={true} />
                  </div>

                  <div className="row no-gutters">
                    {isFilters && (
                      <div className="col-lg-3 quotation-filters">
                        {isDomesticRoundTrip &&
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
                            isfromTourwiz={true}
                          />
                        }
                        {!isDomesticRoundTrip &&
                          <Filters
                            {...results}
                            handleFilter={this.filterResults}
                            key={this.state.filterToken}
                            businessName={businessName}
                            isfromTourwiz={true}
                          />
                        }
                      </div>
                    )}

                    <div className={isFilters ? "col-lg-9" : "col-lg-12"}>
                      {(businessName === "hotel" ||
                        businessName === "activity" ||
                        businessName === "transfers") && (
                        <QuotationResultsItem
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

                      {businessName === "air" && !isDomesticRoundTrip && (
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

                      {businessName === "air" && isDomesticRoundTrip && (
                        <React.Fragment>
                          
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
                                isfromTourwiz={true}
                              />
                            </div>

                            <div className="mt-3">
                              <ResultItemAirDomestic
                                {...results}
                                routeType="departure"
                                handleFlightSelect={this.handleFlightSelect}
                                isfromTourwiz={true}
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
                                isfromTourwiz={true}
                              />
                            </div>

                            <div className="mt-3">
                              <ResultItemAirDomestic
                                {...results}
                                routeType="arrival"
                                handleFlightSelect={this.handleFlightSelect}
                                isfromTourwiz={true}
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
                        {this.state.selectedFlights.length > 0 && 
                          <div style={{ minHeight: "60px" }}>
                            <ResultItemAirDomesticSelected
                              selectedFlights={this.state.selectedFlights}
                              handleCart={this.addItem}
                              handleFareRules={this.getFareRules}
                              fareRules={this.state.fareRules}
                              searchToken={this.state.token}
                              isBtnLoading={this.state.isBtnLoading}
                              isfromTourwiz={true}
                              type={this.props.type}
                            />
                          </div>
                        }
                        </React.Fragment>
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

export default QuotationResults;
