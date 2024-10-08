var appPath = "https://pixabay.com/api/?key=18872431-a70ed61d87c4eeb3181b7308c";

// API Requester for Getting Location Image
export function apiRequester_LocationImage(reqURL, callback) {
  callback({
    "total": 1353252,
    "totalHits": 500,
    "hits": [
      {
        "id": 7517864,
        "pageURL": "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/travel-banner.jpg",
        "type": "photo",
        "tags": "photo",
        "previewURL": "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/travel-banner.jpg",
        "previewWidth": 100,
        "previewHeight": 150,
        "webformatURL": "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/travel-banner.jpg",
        "webformatWidth": 427,
        "webformatHeight": 640,
        "largeImageURL": "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/travel-banner.jpg",
        "imageWidth": 4480,
        "imageHeight": 6720,
        "imageSize": 7891287,
        "userImageURL": "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/travel-banner.jpg"
      }
    ]
  });
  /* 
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.open("POST", appPath + "&q=" + reqURL + "&image_type=photo&pretty=true", true);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(this.responseText ? JSON.parse(this.responseText) : null);
    }
  }; */
}