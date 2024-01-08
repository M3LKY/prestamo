import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import ChecklistIcon from '@mui/icons-material/Checklist';

import Sidebar from "../../../sidebar/Sidebar";
import AddPayments from "./AddPayments";

const PaymentLoansInfo = ({ setAuth }) => {
  const [loans, setLoans] = useState([]);

  const location = useLocation();

  const clientId = location.pathname.split("/")[2];
  const loanId = location.pathname.split("/")[3];

  const GetLoans = async () => {
    try {
      const response = await fetch(`http://localhost:8000/loan/${loanId}`, {
        method: "GET",
        headers: { Authorization: localStorage.getItem("token") },
      });

      const parseRes = await response.json();

      setLoans(parseRes);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    GetLoans();
  }, []);

  return (
    <div className="flex h-[1200px]">
      <Sidebar />

      <div className="w-full h-[1200px] mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded">
        {/* HEADER */}

        <div className="flex items-center justify-between px-4 py-5 sm:px-6 bg-purple-200 rounded shadow-md ">
          {/* TITLE */}
          <div>
            <h3 className="text-lg font-medium leading-6 text-purple-800">
              Payment for Loan Voucher #{loanId}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-purple-400">
              Add a payment for a client
            </p>
          </div>

          {/* BUTTON */}
          <div className="text-purple-400">
            <button
              className=""
              onClick={(e) => {
                setAuth(false);
              }}
            >
              <Link to="/login">
                <Logout />
              </Link>
            </button>
          </div>
        </div>

        {/* Loans Information */}
        <div className="mt-5 px-4 h-[180px] rounded border shadow-md border-t-4 border-t-purple-500 ">
          <div className="flex items-center justify-between border-y-2 mt-5">
            <h3 className="text-lg font-medium leading-6 text-gray my-2  px-1 py-2 ">
              Client&apos;s Loan
            </h3>
          </div>
          <table className="table-fixed text-center ">
            <thead>
              <tr>
                <th className="w-1/1 px-1 py-2 text-gray-600">Voucher</th>
                <th className="w-1/6 px-1 py-2 text-gray-600">Tipo</th>
                <th className="w-1/6 px-1 py-2 text-gray-600">Interes</th>
                <th className="w-1/6 px-4 py-2 text-gray-600">Monto</th>
                <th className="w-1/6 px-4 py-2 text-gray-600">Couta</th>
                <th className="w-1/6 px-4 py-2 text-gray-600">Emision</th>
                <th className="w-1/1 px-4 py-2 text-gray-600">Actions</th>
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
                <tr>
                  <td className="border px-4 py-2">{loans.id}</td>
                  <td className="border px-4 py-2">{loans.type}</td>
                  <td className="border px-4 py-2">₱ {loans.interes}</td>
                  <td className="border px-4 py-2">₱ {loans.monto}</td>
                  <td className="border px-4 py-2 ">{loans.cuota} coutas</td>
                  <td className="border px-4 py-2">
                    {new Date(loans.rdate).toDateString()}
                  </td>

                  <td className="border px-4 py-2 flex">
                    <button className="bg-purple-500 hover:bg-red-700 text-white px-3 rounded focus:outline-none focus:shadow-outline h-10 ml-2 mr-2">
                      <Link to={`/amortizacion/${loans.id}`}><ChecklistIcon /></Link>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Payment Form */}
        <AddPayments
        loans={loans}
          loanId={loanId}
          balance={loans.balance}
          name={loans.firstname + " " + loans.lastname}
          pagado={loans.pagado}
          clientId={clientId}
        />
      </div>
    </div>
  );
};

export default PaymentLoansInfo;
