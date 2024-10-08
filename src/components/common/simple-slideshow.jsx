import React from "react";
import { Slide } from "react-slideshow-image";
import "../../assets/css/simple-sildeshow.css";
import HtmlParser from "../../helpers/html-parser";

const SimpleSlideShow = (props) => {

  const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: false,
    arrows: true,
    pauseOnHover: true,
    onChange: (oldIndex, newIndex) => {
    },
  };
  return (
    <div className="slide-container">
      <Slide {...properties}>
        {props.data.map((item, key) => {
          return (
            <div className="each-slide" key={key}>
              {item.type === "Web_Image" &&
                <div style={{ backgroundImage: `url("${item.img}")` }}>
                  <a
                    className="w-100 h-100"
                    href={item.url}
                    target="_blank"
                  />
                </div>
              }
              {item.type === "Web_HTML" &&
                <div className="noselect">
                  <HtmlParser text={item.description} />
                </div>
              }
            </div>
          );
        })}
      </Slide>
    </div>
  );
};

export default SimpleSlideShow;
