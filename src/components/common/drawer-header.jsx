import React from 'react'
import closeIcon from "../../assets/images/x.svg";
import SearchIcon from "../../assets/images/search.svg";
function DrawerHeader(props) {
  return (
    <div className='row'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className={window.innerWidth >= 768 ? 'col-lg-3 heroText text-center' : 'col-lg-3 d-flex justify-content-between heroText text-center'}>
            <label>Support<span>24</span></label>
            {window.innerWidth <= 768 &&
              <button className='btn btn-circle'
                onClick={props.handleClose}
                data-toggle="tooltip"
                data-placement="bottom"
                title="Close"
              >
                <img
                  style={{ filter: "none", width: "18px" }}
                  src={closeIcon}
                  alt=""
                />
              </button>
            }
          </div>
          <div className='col-lg-7'>
            {/* <label>Quick Search</label> */}
            {/* <div class="input-group my-3">
              <input type="text" class="form-control quickInput" placeholder="Quick Search" />
              <buttton class="btn btn-sm input-group-text bg-white searchBtn"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Quick Search"
              >
                <img
                  style={{ filter: "none", width: "18px" }}
                  src={SearchIcon}
                  alt=""
                />
              </buttton>
            </div> */}
          </div>
          {window.innerWidth >= 768 &&
            <div className='col-lg-2 d-flex justify-content-end'>
              <button className='btn btn-circle'
                onClick={props.handleClose}
                data-toggle="tooltip"
                data-placement="bottom"
                title="Close"
              >
                <img
                  style={{ filter: "none", width: "28px" }}
                  src={closeIcon}
                  alt=""
                />
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default DrawerHeader