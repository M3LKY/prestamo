import {
  AddBox,
  PermIdentity,
  VisibilityOutlined,
  MailOutline,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useEffect } from "react";

import { Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function DatesWidget() {
  const [dates, setDates] = useState([]);
  const [sortedDates, setSortedDates] = useState([]);

  const getDates = async () => {
    try {
      const response = await fetch("http://localhost:8000/allLoans", {
        method: "GET",
        headers: { Authorization: localStorage.getItem("token") },
      });

      const parseRes = await response.json();
      console.log("res:" + parseRes);

      setDates(parseRes);
      console.log(dates);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDates();
  }, []);

  console.log(
    dates.sort((a, b) => {
      return new Date(a.maturity_date) - new Date(b.maturity_date);
    })
  );

  return (
    <div className="w-full h-[450px]  ">
      {/* CLIENTS */}
      <div className="mt-5 p-8 rounded-xl border border-t-4 border-t-purple-500 cursor-pointer shadow-md">
        <h3 className="text-xl mb-5 border-b-2">Deuda</h3>
        <div className="flex justify-between items-center">
          <div className="w-full h-[350px]  overflow-auto hover:overflow-scroll">
            <table className="table-fixed text-center w-full  ">
              <thead className="">
                <tr className="">
                  <th className="w-1/1 px-1 py-2 ">Customer</th>
                  <th className="w-1/1 px-1 py-2 ">Date</th>
                  {/* <th className="w-1/1 px-1 py-2 ">Debe</th> */}
                  <th className="w-1/6 px-1 py-2 ">Email</th>
                </tr>
              </thead>
              <tbody className="w-full">
                {dates.length <= 0 ? (
                  <tr className="border px-4 py-2 bg-red-50">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="px-4 py-2 bg-red-50">No Loan Data</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ) : (
                  dates.map((date, index) => {
                    return (
                      <tr key={index} className>
                        <td className="border px-4 py-2  bg-gray-50">
                          {date.firstname + " " + date.lastname}
                        </td>
                        <td className="border px-4 py-2 ">
                          {new Date(date.rdate).toDateString()}
                        </td>
                        {/* <td className="border px-4 py-2  bg-gray-50">
                          ₱ {date.cuotaCredito}
                        </td> */}
                        <td className="border px-4 py-2">
                          <button className="bg-purple-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center">
                            <Link
                              to={`/emailClient`}
                              className="flex items-center"
                            >
                              <MailOutline className="text-sm" />
                            </Link>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
