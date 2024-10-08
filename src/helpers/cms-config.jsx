export const cmsConfig = {
  siteurl:
    "siteurl=" +
    (window.location.host.indexOf("localhost") !== 0
      ? window.location.host + "/cms"
      : "preprod-cltec085.mytriponline.tech/cms"),
  imagesPath: process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT,
};
