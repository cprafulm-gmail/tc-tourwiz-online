//https://developers.google.com/places/web-service/autocomplete#place_types
import React from 'react';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng, } from 'react-places-autocomplete';
import FilterRange from "./filter-range";
import { Trans } from "../../helpers/translate";

class MapLocationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: this.props.locationName,
            lat: null,
            lng: null,
            minValue: this.props.minValue,
            maxValue: this.props.maxValue,
            cityLat: null,
            cityLng: null
        };
    }

    onChange = (name, value) => {
        if (name === "MapDistance")
            this.setState({
                minValue: value.minValue,
                maxValue: value.maxValue
            });
            if(this.props.name === "partner-offer-location")    {
                this.props.handleFilters(this.props.name, this.state.address, this.state.lat, this.state.lng)
            }
            else if (this.state.minValue !== null && this.state.maxValue !== null && this.state.lat !== null && this.state.lng !== null)
                this.props.handleFilters(this.props.name, {
                    "minMaxList": [
                        {
                            "minValue": this.state.lat,
                            "maxValue": this.state.lng,
                        }
                    ],
                    "MinValue": this.state.minValue,
                    "MaxValue": this.state.maxValue
                });
    };

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = (address, placeId) => {
        geocodeByPlaceId(placeId)
            .then(results => getLatLng(results[0]))
            .then(latLng =>
                this.setState({
                    lat: latLng.lat,
                    lng: latLng.lng,
                    address: address
                }, () => this.onChange(this.props.name, latLng))
            )
            .catch(error => console.error(error));
    };

    getLatLngFromAddress = () => {
        geocodeByAddress(this.props.locationName ? this.props.locationName : "Delhi")
            .then(results => getLatLng(results[0]))
            .then(latLng => this.setState({ cityLat: latLng.lat, cityLng: latLng.lng }))
            .catch(error => console.error('Error', error));
    };

    componentDidMount() {
        this.getLatLngFromAddress();
    }

    render() {
        if (!this.state.cityLat && !this.state.cityLng)
            return "";
        const google = window.google;
        //let bounds = new google.maps.LatLngBounds();
        //bounds.extend(new google.maps.LatLng(this.state.cityLat, this.state.cityLng));
        const searchOptions = {
            //bounds: { bounds },
            location: new google.maps.LatLng(this.state.cityLat, this.state.cityLng),
            radius: 20000
        }

        const name = this.props.name;
        if(name === "partner-offer-location")
            return(
                <div className={"form-group "}>
                    <label>Location Name</label>
                    <PlacesAutocomplete className="form-control"
                                        value={this.state.address}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}
                        highlightFirstSuggestion={true}
                        searchOptions={searchOptions}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <input
                                    {...getInputProps({
                                        placeholder: Trans("_searchPlaces"),
                                        className: 'location-search-input form-control',
                                    })}
                                />
                                {loading || (suggestions && suggestions.length > 0) &&
                                    <div className="autocomplete-dropdown-container border">
                                        {loading && <div>{Trans("_loadingText")}</div>}
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active mb-2 mt-2 pl-2 pr-2 bg-light'
                                                : 'suggestion-item rbt-menu m-2';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { cursor: 'pointer' }
                                                : { cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>}
                            </div>
                        )}
                    </PlacesAutocomplete>
                </div>
            )
        else 
        return (
            <React.Fragment>
                <div className="col-lg-12 col-sm-6 filter-price">
                    <div className="border-bottom mb-3">
                        <h3>{Trans("_filter" + name)}</h3>
                        <ul className="list-unstyled p-1 mt-3 mb-1">
                            <li>
                                <PlacesAutocomplete className="form-control"
                                    value={this.state.address}
                                    onChange={this.handleChange}
                                    onSelect={this.handleSelect}
                                    highlightFirstSuggestion={true}
                                    searchOptions={searchOptions}
                                >
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                        <div>
                                            <input
                                                {...getInputProps({
                                                    placeholder: Trans("_searchPlaces"),
                                                    className: 'location-search-input form-control',
                                                })}
                                            />
                                            {loading || (suggestions && suggestions.length > 0) &&
                                                <div className="autocomplete-dropdown-container border">
                                                    {loading && <div>{Trans("_loadingText")}</div>}
                                                    {suggestions.map(suggestion => {
                                                        const className = suggestion.active
                                                            ? 'suggestion-item--active mb-2 mt-2 pl-2 pr-2 bg-light'
                                                            : 'suggestion-item rbt-menu m-2';
                                                        // inline style for demonstration purpose
                                                        const style = suggestion.active
                                                            ? { cursor: 'pointer' }
                                                            : { cursor: 'pointer' };
                                                        return (
                                                            <div
                                                                {...getSuggestionItemProps(suggestion, {
                                                                    className,
                                                                    style,
                                                                })}
                                                            >
                                                                <span>{suggestion.description}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>}
                                        </div>
                                    )}
                                </PlacesAutocomplete>
                            </li>

                        </ul>
                    </div>
                </div>
                <FilterRange
                    type={"range"}
                    name={"MapDistance"}
                    minValue={this.props.minValue}
                    maxValue={this.props.maxValue}
                    handleFilters={this.onChange}
                    filterCurrencySymbol={this.props.filterCurrencySymbol}
                />
            </React.Fragment>
        );
    }
}

export default MapLocationSearchInput;


{/* <GoogleMap bootstrapURLKeys={{ key: "AIzaSyB-jWpAxpZA7EgI8BYsvgKQ9TqhUeqNGhk" }}></GoogleMap> */ }
{/* <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD4PiM-avU7B6Ez4eEnZgeZqg6L54xRfF8&libraries=places"></script> */ }
