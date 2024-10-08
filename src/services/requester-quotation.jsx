import { getLocalhostUrlFromEndPoints } from "./get-localhost-url-from-end-points";

var appPath = process.env.REACT_APP_QUOTATION_API_ENDPOINT + "/";

// API Requester for Outside of Middleware Services
export function apiRequester_quotation_api(reqURL, reqOBJ, callback, reqMethod) {
  let userToken = localStorage.getItem("userToken");
  var xhttp;
  xhttp = new XMLHttpRequest();

  if (process.env.NODE_ENV === "development" && process.env.REACT_APP_IS_USE_LOCAL_ENDPOINT === "true") {
    appPath = getLocalhostUrlFromEndPoints(reqURL);
    if (reqURL.startsWith('/'))
      reqURL = reqURL.substring(1);
    //appPath = "http://localhost:5005/";
    reqURL = reqURL.replace("tw/", "");
  }

  xhttp.open(reqMethod === undefined ? "POST" : reqMethod, appPath + reqURL, true);
  xhttp.setRequestHeader("Authorization", "Bearer " + userToken);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(reqOBJ));
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(this.responseText ? JSON.parse(this.responseText) : null);
    }
    else if (this.status === 401) {
      logOut();
    }
  };
}

function logOut() {
  window.location.href = window.location.origin + "/expired";
}