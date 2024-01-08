import { DeleteForever, Edit, Update } from '@mui/icons-material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PaymentsInfo from '../payments/ListPayments';
import ChecklistIcon from '@mui/icons-material/Checklist';


const OneLoan = () => {
  const [loans, setLoans] = useState([]);

  const location = useLocation();

  const loanID = location.pathname.split('/')[2];

  const GetLoans = async () => {
    try {
      const response = await fetch(`http://localhost:8000/loan/${loanID}`, {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
      });

      const parseRes = await response.json();

      setLoans(parseRes);
      console.log(loans);
      // console.log(loanId);
    } catch (error) {
      console.log(error.message);
    }
  };
  // console.log(loanId);

  useEffect(() => {
    GetLoans();
  }, []);

  return (
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
  );
};

export default OneLoan;
