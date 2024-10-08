import React from "react";
import Form from "../common/form";
import * as DropdownList from "../../helpers/dropdown-list";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import SVGIcon from "../../helpers/svg-icon";

class transfersaccomodationcart extends Form {
  state = {
    data: {
      pickuphotelname: "",
      pickupdate: "",
      pickuptime: "",
      dropoffhotelname: "",
      dropoffdate: "",
      dropofftime: "",
      type:"",
      supplierquestion:"",
    },
    errors: {}
  };

  render() {
    
    return (
        <div className="row">
          {[...Array(this.props.supplierquestion.item.length).keys()].map(count => {
            return (
              <div className="col-lg-3">
                {this.props.supplierquestion.item[count].type === "Textbox" ?
                            this.renderInput(this.props.supplierquestion.item[count].lookup, this.props.supplierquestion.item[count].mlLabel)
                            : this.props.supplierquestion.item[count].type === "DatePicker" ?
                            this.renderDate(
                              this.props.supplierquestion.item[count].lookup,
                              this.props.supplierquestion.item[count].lookup,
                              this.props.supplierquestion.item[count].mlLabel,
                              this.props.supplierquestion.item[count].mlLabel,
                              true,
                            )
                            : ( 
                            <div className={"form-group " + this.props.supplierquestion.item[count].lookup}>
                              <label htmlFor={this.props.supplierquestion.item[count].lookup}>{this.props.supplierquestion.item[count].mlLabel}</label>
                              <select
                                  className={"form-control"}
                                  defaultValue={this.props.supplierquestion.item[count].values[0] + ":" + this.props.supplierquestion.item[count].values[0]}
                                  //className={"form-control" + (this.props.transfer_ReturnHourIsValid === "invalid" ? " border-danger" : "")}
                                  //onChange={e => this.props.handleTransferReturnStartHour(e.target.value)}
                                >
                                  <option value="-Select Hour-">{Trans("_ddlSelect")}</option>
                                  {TransfersStartHour.map((item,key) => {
                                    return (
                                      <option value={item.data} key={key}>
                                        {item.display}
                                      </option>
                                    );
                                  })}
                                </select>
                            </div>
                            ) 
                            
                }
              </div>
            )
          })}
        </div>
     
    );
  }
}

export default transfersaccomodationcart;

const TransfersStartHour = [
  {data:"00:00",display:"12:00 am"},
  {data:"12:30",display:"12:30 am"},
  {data:"12:59",display:"12:59 am"},
  {data:"01:00",display:"01:00 am"},
  {data:"01:30",display:"01:30 pm"},
  {data:"01:59",display:"01:59 am"},
  {data:"02:00",display:"02:00 am"},
  {data:"02:30",display:"02:30 am"},
  {data:"02:59",display:"02:59 am"},
  {data:"03:00",display:"03:00 am"},
  {data:"03:30",display:"03:30 am"},
  {data:"03:59",display:"03:59 am"},
  {data:"04:00",display:"04:00 am"},
  {data:"04:30",display:"04:30 am"},
  {data:"04:59",display:"04:59 am"},
  {data:"05:00",display:"05:00 am"},
  {data:"05:30",display:"05:30 am"},
  {data:"05:59",display:"05:59 am"},
  {data:"06:00",display:"06:00 am"},
  {data:"06:30",display:"06:30 am"},
  {data:"06:59",display:"06:59 am"},
  {data:"07:00",display:"07:00 am"},
  {data:"07:30",display:"07:30 am"},
  {data:"07:59",display:"07:59 am"},
  {data:"08:00",display:"08:00 am"},
  {data:"08:30",display:"08:30 am"},
  {data:"08:59",display:"08:59 am"},
  {data:"09:00",display:"09:00 am"},
  {data:"09:30",display:"09:30 am"},
  {data:"09:59",display:"09:59 am"},
  {data:"10:00",display:"10:00 am"},
  {data:"10:30",display:"10:30 am"},
  {data:"10:59",display:"10:59 am"},
  {data:"11:00",display:"11:00 am"},
  {data:"11:30",display:"11:30 am"},
  {data:"11:59",display:"11:59 am"},
  {data:"12:00",display:"12:00 pm"},
  {data:"12:30",display:"12:30 pm"},
  {data:"12:59",display:"12:59 pm"},
  {data:"13:00",display:"01:00 pm"},
  {data:"13:30",display:"01:30 pm"},
  {data:"13:59",display:"01:59 pm"},
  {data:"14:00",display:"02:00 pm"},
  {data:"14:30",display:"02:30 pm"},
  {data:"14:59",display:"02:59 pm"},
  {data:"15:00",display:"03:00 pm"},
  {data:"15:30",display:"03:30 pm"},
  {data:"15:59",display:"03:59 pm"},
  {data:"16:00",display:"04:00 pm"},
  {data:"16:30",display:"04:30 pm"},
  {data:"16:59",display:"04:59 pm"},
  {data:"17:00",display:"05:00 pm"},
  {data:"17:30",display:"05:30 pm"},
  {data:"17:59",display:"05:59 pm"},
  {data:"18:00",display:"06:00 pm"},
  {data:"18:30",display:"06:30 pm"},
  {data:"18:59",display:"06:59 pm"},
  {data:"19:00",display:"07:00 pm"},
  {data:"19:30",display:"07:30 pm"},
  {data:"19:59",display:"07:59 pm"},
  {data:"20:00",display:"08:00 pm"},
  {data:"20:30",display:"08:30 pm"},
  {data:"20:59",display:"08:59 pm"},
  {data:"21:00",display:"09:00 pm"},
  {data:"21:30",display:"09:30 pm"},
  {data:"21:59",display:"09:59 pm"},
  {data:"22:00",display:"10:00 pm"},
  {data:"22:30",display:"10:30 pm"},
  {data:"22:59",display:"10:59 pm"},
  {data:"23:00",display:"11:00 pm"},
  {data:"23:30",display:"11:30 pm"},
  {data:"23:59",display:"11:59 pm"}
  ]