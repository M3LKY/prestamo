import { VisibilityOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import { useEffect } from "react";

import { Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function ApprovalWidget() {
  const [loans, setLoans] = useState([]);

  const getLoans = async () => {
    try {
      const response = await fetch("http://localhost:8000/allLoans", {
        method: "GET",
        headers: { Authorization: localStorage.getItem("token") },
      });

      const parseRes = await response.json();
      // console.log(parseRes);

      setLoans(parseRes);
      console.log("aver:" + parseRes);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getLoans();
  }, []);

  // console.log(loans.sort((a, b) => a.maturity_date - b.maturity_date));

  return (
    <div className="w-full h-[450px] ">
      {/* CLIENTS */}
      <div className=" mt-5 p-8 rounded-xl border border-t-4 border-t-purple-500 cursor-pointer shadow-md">
        <h3 className="text-xl mb-5 border-b-2">Loans For Approval</h3>
        <div className="flex justify-between items-center">
          <div className="w-full h-[350px] overflow-auto hover:overflow-scroll">
            <table className="table-fixed text-center w-full">
              <thead>
                <tr className="">
                  <th className="w-1/1 px-1 py-2">Loan</th>
                  <th className="w-1/1 px-1 py-2">Paid</th>
                  <th className="w-1/6 px-1 py-2">View</th>
                </tr>
              </thead>
              <tbody>
                {loans.length <= 0 ? (
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
                  loans.map((loan, index) => {
                    return (
                      <tr key={index}>
                        <td className="border px-4 py-2 bg-gray-50">
                          ₱ {loan.monto}
                        </td>
                        <td className="border px-4 py-2 flex items-center justify-center">
                          <span className="text-black px-4 py-1 rounded-md">
                            {loan.type}
                          </span>
                        </td>

                        <td className="border px-4 py-2  bg-gray-50">
                          <button className="bg-purple-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center">
                            <Link
                              to={`/editLoan/${loan.id}`}
                              className="flex items-center"
                            >
                              <VisibilityOutlined className="text-sm" />
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
