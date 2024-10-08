import React from "react";
import SimpleSlideShow from "./../common/simple-slideshow";

const Advertisement = advt => {
  let images = [];
  advt.item.map(
    adv =>
      adv.type.toLowerCase().startsWith("web_") &&
      adv.images.find(x => x.type === "banner") &&
      images.push({
        img: adv.images.find(x => x.type === "banner").url,
        url: adv.url,
        type: adv.type,
        description: adv.description
      })
  );

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="border mb-3 bg-light" style={{ height: "112px" }}>
          <SimpleSlideShow data={images} />
        </div>
      </div>
    </div>
  );
};

export default Advertisement;
