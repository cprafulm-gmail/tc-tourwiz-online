
import Config from "../config";

var appPathCMS = window.location.host.indexOf("preprod-") !== 0 &&
  window.location.host.indexOf("demopreprod-") !== 0 &&
  window.location.host.indexOf("d3ok2kske8karg") !== 0 &&
  window.location.host.indexOf("patamarketplace") !== 0 &&
  window.location.host.indexOf("tafimarketplace") !== 0 &&
  window.location.host.indexOf("taaimarketplace") !== 0 &&
  window.location.host.indexOf("localhost:3000") !== 0 &&
  window.location.host.indexOf("preprod.") !== 0 ?
  "https://unified-api.dev.tourwizonline.com/" :
  "https://preprod-unifiedapi.dev.tourwizonline.com/";
//var appPathCMS = Config.apiUrl;
// API Requester for CMS
export function apiRequesterCMS(reqURL, reqOBJ, callback, reqMethod) {
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.open(
    reqMethod === undefined ? "POST" : reqMethod,
    appPathCMS + reqURL,
    true
  );
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(reqOBJ));
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      window.scrollTo(0, 0);
      callback(this.responseText ? JSON.parse(this.responseText) : null);
    }
  };
}
