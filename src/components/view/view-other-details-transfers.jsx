import React from "react";
import { Trans } from "../../helpers/translate";
import Date from "../../helpers/date";
import moment from "moment";

const ViewOtherDetailstransfers = (props) => {
  const { businessObject } = props;
  
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header">
        <h5 className="m-0 p-0">
          {Trans("_otherdetails")}
        </h5>
      </div>
      <div className="card-body position-relative">
        
        <ul className="list-unstyled p-0 m-0">
          <li className="row">
            <label className="col-3">
              {Trans("_viewTripType") + " : "}
            </label>
            <b className="col-7">{businessObject.tripType}</b>
          </li>

          {businessObject.stopInfo && (
             [...Array(businessObject.stopInfo.length).keys()].map(count => {
               if(businessObject.stopInfo[count].config.find((x) => x.key === "direction").value === "" 
                    && businessObject.stopInfo[count].code === "pickup" && businessObject.stopInfo[count].type === "Accommodation")
               {
                return( 
                  <React.Fragment>
                    <li className="row">
                      <label className="col-3">
                        {Trans("_PickupHotel") + " : "}
                      </label>
                      <b className="col-7">{businessObject.stopInfo[count].item[0].type}</b>
                    </li>

                    <li className="row">
                      <label className="col-3">
                        {Trans("_PickupDate") + " : "}
                      </label>
                      <b className="col-7">{<Date date={businessObject.stopInfo[count].item[0].time} />}</b>
                    </li>

                    <li className="row">
                      <label className="col-3">
                        {Trans("_PickupTime") + " : "}
                      </label>
                      <b className="col-7">{moment(businessObject.stopInfo[count].item[0].hour + ":" + businessObject.stopInfo[count].item[0].minute, "HH:mm").format("hh:mm A")}</b>
                    </li>
                  </React.Fragment>
                )
               } 
               else if(businessObject.stopInfo[count].config.find((x) => x.key === "direction").value !== "" 
                    && businessObject.stopInfo[count].code === "pickup" && businessObject.stopInfo[count].type === "Accommodation")
               {
                return( 
                  <React.Fragment>
                    <li className="row">
                      <label className="col-3">
                        {Trans("_ReturnPickupHotel") + " : "}
                      </label>
                      <b className="col-7">{businessObject.stopInfo[count].item[0].type}</b>
                    </li>

                    <li className="row">
                      <label className="col-3">
                        {Trans("_ReturnPickupDate") + " : "}
                      </label>
                      <b className="col-7">{<Date date={businessObject.stopInfo[count].item[0].time} />}</b>
                    </li>

                    <li className="row">
                      <label className="col-3">
                        {Trans("_ReturnPickupTime") + " : "}
                      </label>
                      <b className="col-7">{moment(businessObject.stopInfo[count].item[0].hour + ":" + businessObject.stopInfo[count].item[0].minute, "HH:mm").format("hh:mm A")}</b>
                    </li>
                  </React.Fragment>
                )
               }
               else if(businessObject.stopInfo[count].config.find((x) => x.key === "direction").value === "" 
                    && businessObject.stopInfo[count].code === "dropoff" && businessObject.stopInfo[count].type === "Accommodation")
               {
                return( 
                  <React.Fragment>
                    <li className="row">
                      <label className="col-3">
                        {Trans("_DropoffHotel") + " : "}
                      </label>
                      <b className="col-7">{businessObject.stopInfo[count].item[0].type}</b>
                    </li>
                  </React.Fragment>
                )
               }
               else if(businessObject.stopInfo[count].config.find((x) => x.key === "direction").value !== "" 
                    && businessObject.stopInfo[count].code === "dropoff" && businessObject.stopInfo[count].type === "Accommodation")
               {
                return( 
                  <React.Fragment>
                    <li className="row">
                      <label className="col-3">
                        {Trans("_ReturnDropoffHotel") + " : "}
                      </label>
                      <b className="col-7">{businessObject.stopInfo[count].item[0].type}</b>
                    </li>
                  </React.Fragment>
                )
               }

               if(businessObject.stopInfo[count].config.find((x) => x.key === "direction").value === "" 
                    && businessObject.stopInfo[count].code === "pickup" && businessObject.stopInfo[count].type === "Airport")
                {
                return( 
                  <React.Fragment>
                    <li className="row">
                      <label className="col-3">
                        {Trans("_PickupAirport") + " : "}
                      </label>
                      <b className="col-7">{businessObject.stopInfo[count].item[0].address}</b>
                    </li>

                    <li className="row">
                      <label className="col-3">
                        {Trans("_PickupDate") + " : "}
                      </label>
                      <b className="col-7">{<Date date={businessObject.stopInfo[count].item[0].time} />}</b>
                    </li>

                    <li className="row">
                      <label className="col-3">
                        {Trans("_PickupTime") + " : "}
                      </label>
                      <b className="col-7">{moment(businessObject.stopInfo[count].item[0].hour + ":" + businessObject.stopInfo[count].item[0].minute, "HH:mm").format("hh:mm A")}</b>
                    </li>
                  </React.Fragment>
                )
                } 
                else if(businessObject.stopInfo[count].config.find((x) => x.key === "direction").value !== "" 
                    && businessObject.stopInfo[count].code === "pickup" && businessObject.stopInfo[count].type === "Airport")
                {
                  return( 
                    <React.Fragment>
                      <li className="row">
                        <label className="col-3">
                          {Trans("_ReturnPickupAirport") + " : "}
                        </label>
                        <b className="col-7">{businessObject.stopInfo[count].item[0].address}</b>
                      </li>

                      <li className="row">
                        <label className="col-3">
                          {Trans("_ReturnPickupDate") + " : "}
                        </label>
                        <b className="col-7">{<Date date={businessObject.stopInfo[count].item[0].time} />}</b>
                      </li>

                      <li className="row">
                        <label className="col-3">
                          {Trans("_ReturnPickupTime") + " : "}
                        </label>
                        <b className="col-7">{moment(businessObject.stopInfo[count].item[0].hour + ":" + businessObject.stopInfo[count].item[0].minute, "HH:mm").format("hh:mm A")}</b>
                      </li>
                    </React.Fragment>
                  )
                }
                else if(businessObject.stopInfo[count].config.find((x) => x.key === "direction").value === "" 
                    && businessObject.stopInfo[count].code === "dropoff" && businessObject.stopInfo[count].type === "Airport")
                {
                  return( 
                    <React.Fragment>
                        <li className="row">
                          <label className="col-3">
                            {Trans("_DropoffAirport") + " : "}
                          </label>
                          <b className="col-7">{businessObject.stopInfo[count].item[0].address}</b>
                        </li>

                        <li className="row">
                          <label className="col-3">
                            {Trans("_DropoffDate") + " : "}
                          </label>
                          <b className="col-7">{<Date date={businessObject.stopInfo[count].item[0].time} />}</b>
                        </li>

                        <li className="row">
                          <label className="col-3">
                            {Trans("_DropoffTime") + " : "}
                          </label>
                          <b className="col-7">{moment(businessObject.stopInfo[count].item[0].hour + ":" + businessObject.stopInfo[count].item[0].minute, "HH:mm").format("hh:mm A")}</b>
                        </li>
                    </React.Fragment>
                  ) 
                }
                else if(businessObject.stopInfo[count].config.find((x) => x.key === "direction").value !== "" 
                    && businessObject.stopInfo[count].code === "dropoff" && businessObject.stopInfo[count].type === "Airport")
                {
                return( 
                  <React.Fragment>
                      <li className="row">
                        <label className="col-3">
                          {Trans("_ReturnDropoffAirport") + " : "}
                        </label>
                        <b className="col-7">{businessObject.stopInfo[count].item[0].address}</b>
                      </li>

                      <li className="row">
                        <label className="col-3">
                          {Trans("_ReturnDropoffDate") + " : "}
                        </label>
                        <b className="col-7">{<Date date={businessObject.stopInfo[count].item[0].time} />}</b>
                      </li>

                      <li className="row">
                        <label className="col-3">
                          {Trans("_ReturnDropoffTime") + " : "}
                        </label>
                        <b className="col-7">{moment(businessObject.stopInfo[count].item[0].hour + ":" + businessObject.stopInfo[count].item[0].minute, "HH:mm").format("hh:mm A")}</b>
                      </li>
                    </React.Fragment>
                 )
                }
             })
           )}
     
        </ul>
      </div>
    </div>
  );
};

export default ViewOtherDetailstransfers;
