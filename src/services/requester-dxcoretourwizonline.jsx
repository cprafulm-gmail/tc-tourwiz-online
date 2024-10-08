import { getLocalhostUrlFromEndPoints } from "./get-localhost-url-from-end-points";

var appPath = "https://dxcore.tourwizonline.com/";

// API Requester for Outside of Middleware Services
export function apiRequester_dxcoretourwizonline_api(reqURL, reqOBJ, callback, reqMethod) {
  let userToken = localStorage.getItem("userToken");

  if (process.env.NODE_ENV === "development" && process.env.REACT_APP_IS_USE_LOCAL_ENDPOINT === "true") {
    appPath = getLocalhostUrlFromEndPoints(reqURL);
    if (reqURL.startsWith('/'))
      reqURL = reqURL.substring(1);
    //appPath = "http://localhost:5000/";
    reqURL = reqURL.replace("tw/", "");
  }

  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.open(reqMethod === undefined ? "POST" : reqMethod, appPath + reqURL, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.setRequestHeader("Authorization", "Bearer " + userToken);
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