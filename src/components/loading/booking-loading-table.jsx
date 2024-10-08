import React from "react";

const BookingLoadingTable = () => {
  const loading = [...Array(10).keys()];
  return (
    <div className="bookings bookings-loading">
      <div className="border shadow-sm">
        <div className="table-responsive">
          <table className="table offline-booking-table">
            <thead>
              <tr>
                <th className="align-middle bg-light">
                  <b className="w-100 d-inline-block">&nbsp;</b>
                </th>
                <th className="align-middle bg-light">
                  <b className="w-50 d-inline-block">&nbsp;</b>
                </th>
                <th className="align-middle bg-light">
                  <b className="w-50 d-inline-block">&nbsp;</b>
                </th>
                <th className="align-middle bg-light">
                  <b className="w-100 d-inline-block">&nbsp;</b>
                </th>
                <th className="align-middle bg-light">
                  <b className="w-100 d-inline-block">&nbsp;</b>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading.map(item => {
                return (
                  <tr key={item}>
                    <td className="text-nowrap">
                      <b className="w-100 d-inline-block">&nbsp;</b>
                    </td>
                    <td className="text-nowrap">
                      <b className="w-50 d-inline-block">&nbsp;</b>
                    </td>
                    <td className="text-nowrap">
                      <b className="w-50 d-inline-block">&nbsp;</b>
                    </td>
                    <td className="text-nowrap">
                      <b className="w-100 d-inline-block">&nbsp;</b>
                    </td>
                    <td className="text-nowrap">
                      <b className="w-100 d-inline-block">&nbsp;</b>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingLoadingTable;
