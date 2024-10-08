import $ from "jquery";

//let url = "https://quotationmail.000webhostapp.com/";
let url = "http://localhost/email-sender/";

export function ajaxRequester(reqUrl, reqOBJ, callback) {
  $.ajax({
    url: url + reqUrl,
    type: "POST",
    data: JSON.stringify(reqOBJ),
    dataType: "JSON",
  }).done(function (data) {
    callback(data.response);
  });
}
