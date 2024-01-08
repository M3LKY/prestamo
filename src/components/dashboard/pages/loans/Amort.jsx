import React, { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import Sidebar from "../../../sidebar/Sidebar";
import { DeleteForever, Edit, Update, Logout } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Amort = ({ setAuth }) => {
  const [loans, setLoans] = useState([]);

  const location = useLocation();

  const clientId = location.pathname.split("/")[2];

  const filterFunctions = (type, monto, interes, cuota, dias) => {
    let amortizationTable, totals;
    console.log(type);
    if (type === "Interes Fijo") {
      ({ amortizationTable, totals } = generateAmortizationTableInteresFijo(
        monto,
        (interes /= 100),
        cuota,
        dias
      ));
      console.log(interes);
    } else if (type === "Saldo Insoluto Variable") {
      ({ amortizationTable, totals } = generateAmortizationTableSaldoVariado(
        monto,
        (interes /= 100),
        cuota,
        dias
      ));
      console.log(interes);
    } else if (type === "Tabla Prestamo") {
      ({ amortizationTable, totals } = generateAmortizationTable(
        monto,
        interes,
        cuota,
        dias
      ));
    }

    return { amortizationTable, totals };
  };

  const generateAmortizationTable = (vp, i, n, dias) => {
    let capitalInsoluto = parseFloat(vp);
    let totalSaldoInsoluto = n * i;
    let totalInteres = totalSaldoInsoluto - vp;
    let currentDate = new Date();
    let balance = totalSaldoInsoluto;

    const amortizationTable = [];

    for (let cuota = 1; cuota <= n; cuota++) {
      const interes = totalInteres / n;
      const amortizacion = vp / n;
      const cuotaCredita = parseFloat(interes) + parseFloat(amortizacion);

      const rowData = {
        cuota,
        fecha: currentDate.toLocaleDateString(),
        capitalInsoluto: Math.round(capitalInsoluto * 100) / 100,
        cuotaCredita: Math.round(cuotaCredita * 100) / 100,
        interes: Math.round(interes * 100) / 100,
        amortizacion: Math.round(amortizacion * 100) / 100,
        saldoInsoluto: Math.round(balance * 100) / 100,
      };

      amortizationTable.push(rowData);

      balance -= interes + amortizacion;
      capitalInsoluto -= amortizacion;
      currentDate.setDate(currentDate.getDate() + dias);
    }

    // Display totals
    const totals = {
      capitalInsoluto: (vp * 100) / 100,
      totalInteres: (totalInteres * 100) / 100,
      totalSaldoInsoluto: (totalSaldoInsoluto * 100) / 100,
    };
    console.log(parseFloat(totalInteres));
    return { amortizationTable, totals };
  };

  const generateAmortizationTableInteresFijo = (vp, i, n, dias) => {
    let capitalInsoluto = vp;
    let saldoInsoluto = capitalInsoluto + vp * i * n;
    // console.log(saldoInsoluto)
    let currentDate = new Date();

    const amortizationTable = [];

    for (let cuota = 1; cuota <= n; cuota++) {
      const interes = vp * i;
      // console.log(interes);
      const amortizacion = vp / n;
      const cuotaCredita = interes + amortizacion;

      const rowData = {
        cuota,
        fecha: currentDate.toLocaleDateString(),
        capitalInsoluto: Math.round(capitalInsoluto * 100) / 100,
        cuotaCredita: Math.round(cuotaCredita * 100) / 100,
        interes: Math.round(interes * 100) / 100,
        amortizacion: Math.round(amortizacion * 100) / 100,
        saldoInsoluto: Math.round(saldoInsoluto * 100) / 100,
      };

      amortizationTable.push(rowData);

      capitalInsoluto -= amortizacion;
      saldoInsoluto -= amortizacion + interes;
      currentDate.setDate(currentDate.getDate() + dias);
    }

    // Display totals
    const totals = {
      capitalInsoluto: Math.round(vp * 100) / 100,
      totalInteres: Math.round(vp * i * n * 100) / 100,
      totalSaldoInsoluto: Math.round((vp + vp * i * n) * 100) / 100,
    };

    return { amortizationTable, totals };
  };

  const generateAmortizationTableSaldoVariado = (vp, i, n, dias) => {
    let capitalInsoluto = vp;
    let cap = vp;
    let saldo = 0;
    let saldoInsoluto1 = 0;

    const amortizationTable = [];
    let currentDate = new Date();

    for (let c = 1; c <= n; c++) {
      const inte = cap * i;
      saldo += inte;
      const amort = vp / n;
      const cuotaC = inte + amort;
      cap -= amort;
      saldoInsoluto1 -= cuotaC;
    }

    let saldoInsoluto = vp + saldo;

    for (let cuota = 1; cuota <= n; cuota++) {
      const interes = capitalInsoluto * i;
      const amortizacion = vp / n;
      const cuotaCredita = interes + amortizacion;

      const rowData = {
        cuota,
        fecha: currentDate.toLocaleDateString(),
        capitalInsoluto: Math.round(capitalInsoluto * 100) / 100,
        cuotaCredita: Math.round(cuotaCredita * 100) / 100,
        interes: Math.round(interes * 100) / 100,
        amortizacion: Math.round(amortizacion * 100) / 100,
        saldoInsoluto: Math.round(saldoInsoluto * 100) / 100,
      };

      amortizationTable.push(rowData);

      capitalInsoluto -= amortizacion;
      saldoInsoluto -= cuotaCredita;
      currentDate.setDate(currentDate.getDate() + dias);
    }

    // Display totals
    const totals = {
      capitalInsoluto: Math.round(vp * 100) / 100,
      totalInteres: Math.round(saldo * 100) / 100,
      totalSaldoInsoluto: Math.round((vp + saldo) * 100) / 100,
    };

    return { amortizationTable, totals };
  };

  const GetLoans = async () => {
    try {
      const response = await fetch(`http://localhost:8000/loanns/${clientId}`, {
        method: "GET",
        headers: { Authorization: localStorage.getItem("token") },
      });

      const parseRes = await response.json();

      // Ensure parseRes is an array
      const loansArray = Array.isArray(parseRes) ? parseRes : [];

      console.log("amor:", loansArray);
      setLoans(loansArray);
    } catch (error) {
      console.log(error.message);
    }
  };

  // console.log("tepeeee: "+loans.type)

  useEffect(() => {
    GetLoans();
  }, []);

  return (
    <div className="flex  h-[900px] ">
      <Sidebar />
      <ToastContainer />
      {/* <GetAllLoans /> */}
      <div className="flex w-full">
        {/* Loans Information */}
        <div className="w-full h-[900px] mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded ">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-5 sm:px-6 bg-purple-200 rounded shadow-md ">
            {/* TITLE */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-purple-800">
                Loans Report
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-purple-400">
                Loans summary and informations.
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

          {/* TITLE */}
          <div className="flex items-center justify-between border-y-2 mt-5">
            <h3 className="text-lg font-medium leading-6 text-gray my-2  px-1 py-2 ">
              Loan Transactions
            </h3>
            <button className="bg-purple-500 hover:bg-red-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none focus:shadow-outline w-auto mt-2">
              <Link to="/borrowers">Add Loan</Link>
            </button>
          </div>

          {/* ALL LOANS */}
          <div className="w-full h-[650px] px-4 overflow-auto hover:overflow-scroll mt-5 border rounded shadow-md border-t-4 border-t-purple-500">
            <table className="table-fixed text-center">
              <thead>
                <tr>
                  <th className="w-1/6 px-1 py-2 text-gray-600">No. Cuota</th>
                  <th className="w-1/6 px-1 py-2 text-gray-600">Fecha</th>
                  <th className="w-1/6 px-1 py-2 text-gray-600">Monto</th>
                  <th className="w-1/6 px-1 py-2 text-gray-600">Cuota</th>
                  <th className="w-1/6 px-4 py-2 text-gray-600">Interes</th>
                  <th className="w-1/6 px-4 py-2 text-gray-600">Capital</th>
                  <th className="w-1/6 px-4 py-2 text-gray-600">Balance</th>
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
                    let { amortizationTable, totals } = filterFunctions(
                      loan.type,
                      parseInt(loan.monto),
                      loan.interes,
                      parseInt(loan.cuota),
                      parseInt(loan.dia)
                    );
                    return (
                      <React.Fragment key={index}>
                        {amortizationTable &&
                          amortizationTable.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              <td className="border px-4 py-2">{row.cuota}</td>
                              <td className="border px-4 py-2">{row.fecha}</td>
                              <td className="border px-4 py-2">
                                {row.capitalInsoluto}
                              </td>
                              <td className="border px-4 py-2">
                                {row.cuotaCredita}
                              </td>
                              <td className="border px-4 py-2">
                                {row.interes}
                              </td>
                              <td className="border px-4 py-2">
                                {row.amortizacion}
                              </td>
                              <td className="border px-4 py-2">
                                {row.saldoInsoluto}
                              </td>
                            </tr>
                          ))}
                        {totals && (
                          <tr>
                          <td className="border text-lg px-2 py-1">
                            <strong>T. Monto: </strong>{" "}
                            {totals.capitalInsoluto}
                          </td>
                          <td className="border text-lg px-2 py-1">
                            <strong>T. Interes: </strong>{" "}
                            {totals.totalInteres}
                          </td>
                          <td className="border text-lg px-2 py-1">
                            <strong>T. Balance: </strong>{" "}
                            {totals.totalSaldoInsoluto}

                          </td>
                        </tr>
                        )}
                      </React.Fragment>
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
};

export default Amort;
