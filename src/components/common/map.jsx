import React from "react";
import PropTypes from "prop-types";
//import styled from "styled-components";
import GoogleMapReact from "google-map-react";

const mapStyles = {
  map: {
    //position: "absolute",
    width: "100%",
    height: "200px"
  }
};

const GoogleMap = ({ children, ...props }) => (
  <GoogleMapReact style={mapStyles} {...props}>
    {children}
  </GoogleMapReact>
);

GoogleMap.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

GoogleMap.defaultProps = {
  children: null
};

export default GoogleMap;
