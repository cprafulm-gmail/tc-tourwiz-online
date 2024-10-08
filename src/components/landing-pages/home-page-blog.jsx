import React from "react";
import HtmlParser from "../../helpers/html-parser";


const HomePageBlog = (props) => {
  const fistThreeBlogs = props.blogPosts.slice(0, 3);
  return (
    <div className="tw-reasons pb-5" style={{background:"#f7f7f7", marginBottom:"-42px"}}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 className="pb-3">Recent posts from our Blog</h2>
          </div>
        </div>

        <div className="row">
        {fistThreeBlogs.map((item, key) => {
            return (
          <div className="col-lg-4 mb-3"  id={key} key={key}>
            <div className="tw-reasons-box p-0" style={{backgroundColor:"#fff", alignItems:"inherit"}}>
              <img style={{width:"100%", margin:"0px", height:"200px"}}
                src={item.jetpack_featured_media_url}
                alt={item.title["rendered"]}
              />
              <a href={item.link} className="p-2 pt-3" style={{color:"#000", textDecoration:"none"}} target="_blank">
                          <h3 className="blog-title"><HtmlParser text={item.title["rendered"]} /></h3>
                          </a>
              <div className="pl-2 pr-2 pb-4 blogContent">
              <HtmlParser text={item.excerpt["rendered"]} />
              </div>
            </div>
          </div>
                                                                )
                                                            })}
        </div>

        
      </div>
    </div>
  );
};

export default HomePageBlog;
