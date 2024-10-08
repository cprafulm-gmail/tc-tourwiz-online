import React from "react";

const TableLoading = (props) => {
  const loading = [...Array(5).keys()];
  const columns = [...Array(props.columns).keys()];
  return (
    loading.map((item, key) => {
      return (
        <tr key={key} className="bookings bookings-loading">
          {columns.map((item2, key2) => {
            return (
              <td key={key + key2}>
                <div className="row">
                  <label className="col-lg-12 mb-0 text-secondary w-25">
                    <b className="w-50 d-inline-block mb-2">&nbsp;</b>
                  </label>
                </div>
              </td>
            )
          })
          }
        </tr>
      );
    })
  )
}

export default TableLoading;
