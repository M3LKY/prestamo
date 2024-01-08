import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AddPayments = ({ loanId, pagado, balance, clientId, name }) => {
  const [loans, setLoans] = useState([]);
  const [newPagado, setNewPagado] = useState(0); // Initialize as 0 or any default value

  const [pagadoState, setPagadoState] = useState(0); // Initialize as 0 or any default value

  // Use useEffect to update pagadoState when the prop pagado changes
  useEffect(() => {
    const parsedPagado = parseInt(pagado, 10);
    setPagadoState(isNaN(parsedPagado) ? 0 : parsedPagado);
  }, [pagado]);

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

  const [inputs, setInputs] = useState({
    amount: "",
    collection_date: "",
    collected_by: "",
    new_balance: name,
    method: "",
    client_id: clientId,
    loan_id: loanId,
  });

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const {
    amount,
    collection_date,
    collected_by,
    new_balance,
    method,
    client_id,
    loan_id,
  } = inputs;

  console.log("loand  " + new_balance);

  console.log("amount   " + amount);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (pagado === null) {
      pagado = 0;
    }
    let prePagado = parseInt(pagado);
    setNewPagado((prevPagado) => {
      const newPagadoValue = prePagado + parseInt(amount);
      console.log("New Pagado:", newPagadoValue, prevPagado);
      updatePago(newPagadoValue);
      return newPagadoValue;
    });

    try {
      const body = {
        amount,
        collection_date,
        collected_by, 
        name,
        method,
        client_id,
        loan_id,
      };

      const response = await fetch(
        `http://localhost:8000/payments/${clientId}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(body),
        }
      );
      toast.success("Payment Created.");
      const parseRes = await response.json();

      // addSuccessful();
      handleClick();
    } catch (error) {
      console.log(error.message);
    }
  };

  const updatePago = async (p) => {
    console.log("Updating pago. NewPagado:", newPagado);

    // Ensure newPagado is a valid number
    console.log("Type of newPagado:", typeof newPagado);

    try {
      const send = await fetch(`http://localhost:8000/updatePagado/${loanId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ newPagado: p }),
      });

      const parseRes = await send.json();
      console.log(parseRes);
    } catch (error) {
      console.log(error.message);
    }
  };
  // console.log("padadoooL:   "+loans.pagado)
  const GetLoans = async () => {
    try {
      const response = await fetch(`http://localhost:8000/loanns/${loanId}`, {
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

  function calculateCumulativeSum(amortizationTable) {
    if (!amortizationTable || amortizationTable.length === 0) {
      return [];
    }

    const cumulativeSumArray = [];
    let cumulativeSum = 0;

    amortizationTable.forEach((row) => {
      cumulativeSum += row.cuotaCredita;
      cumulativeSumArray.push(cumulativeSum);
    });

    return cumulativeSumArray;
  }
  function paidcheck(num1, num2) {
    if (num2 >= num1) {
      return "PAID";
    }
    return "-";
  }
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/Borrower/${clientId}`);
  }
  return (
    <div className="flex mt-5 px-4 py-2 h-[830px] rounded border shadow-md border-t-4 border-t-purple-500 ">
      <ToastContainer />

      {/* Add Loan */}
      <div className="w-full ">
        <div className="flex w-full items-center justify-between border-y-2 mt-5">
          <h3 className="text-lg font-medium leading-6 text-gray my-2  px-1 py-2 ">
            Loan Payment
          </h3>
        </div>
        {/* FORM */}
        <form className="grid grid-cols-2 p-2 mt-2 " onSubmit={onSubmit}>
          <div className="flex w-full ">
            {/* CLIENT ID */}

            <div className="w-auto">
              <label htmlFor="client_id">Client ID:</label>
              <input
                type="number"
                className="block border border-grey-500 p-3 rounded mb-4 mr-5"
                name="client_id"
                value={clientId}
                disabled
              />
            </div>

            {/* VOUCHER */}
            <div className="w-auto">
              <label htmlFor="loan_id">Voucher:</label>
              <input
                type="number"
                className="block border border-grey-500 p-3 rounded mb-4"
                placeholder="Voucher #"
                name="loan_id"
                value={loanId}
                disabled
                onChange={(e) => onChange(e)}
              />
            </div>
          </div>

          {/* COLLECTION DATE */}
          <div>
            <label htmlFor="collection_date">Collection Date:</label>
            <input
              type="date"
              className="block border border-grey-500 w-10/12 p-3 rounded mb-4"
              placeholder="Collection Date"
              name="collection_date"
              value={collection_date}
              onChange={(e) => onChange(e)}
              required
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              className="block border border-grey-500 w-10/12 p-3 rounded mb-4"
              placeholder="Amount"
              name="amount"
              value={amount}
              onChange={(e) => onChange(e)}
              required
            />
          </div>

          {/* COLLECTED BY */}
          <div>
            <label htmlFor="collected_by">Collected By:</label>
            <input
              type="text"
              className="block border border-grey-500 w-10/12 p-3 rounded mb-4"
              placeholder="Collected by"
              name="collected_by"
              value={collected_by}
              onChange={(e) => onChange(e)}
              required
            />
          </div>

          {/* METHOD */}
          <div>
            <label htmlFor="terms">Method:</label>
            <select
              className="block border border-grey-500 w-10/12 p-3 rounded mb-4"
              name="method"
              id="method"
              value={method}
              onChange={(e) => {
                onChange(e);
              }}
              required
            >
              <option value="TRANS">TRANS</option>
              <option value="CHEQUE">CHEQUE</option>
              <option value="CASH">CASH</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div>
            <button
              className="bg-purple-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-auto ml-auto "
              type="submit"
            >
              Add Payment
            </button>

            <Link
              to={`/Borrower/${clientId}`}
              className="bg-purple-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/5 ml-10"
            >
              Back
            </Link>
          </div>

          {/*  */}
        </form>
        {/* NEW BALANCE */}
        <div className="h-[400px] overflow-hidden hover:overflow-scroll">
          <table className="table-fixed text-center  ">
            <thead>
              <tr>
                <th className="w-1/6 px-1 py-2 text-gray-600">No. Cuota</th>
                <th className="w-1/6 px-1 py-2 text-gray-600">V.Pagar</th>
                <th className="w-1/6 px-1 py-2 text-gray-600">Importe</th>
                <th className="w-1/6 px-1 py-2 text-gray-600">Pagado</th>
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
                  // console.log("padadoooL:   "+amortizationTable)

                  return (
                    <React.Fragment key={index}>
                      {amortizationTable &&
                        amortizationTable.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            <td className="border px-2 py-1">{row.cuota}</td>
                            <td className="border px-2 py-1">
                              {parseInt(row.cuotaCredita)}
                            </td>
                            <td className="border px-2 py-1">
                              {
                                parseInt(calculateCumulativeSum(
                                  amortizationTable.slice(0, rowIndex + 1)
                                )[rowIndex])
                              }
                            </td>
                            <td>
                              {paidcheck(
                                calculateCumulativeSum(
                                  amortizationTable.slice(0, rowIndex + 1)
                                )[rowIndex],
                                parseInt(pagado)
                              )}
                            </td>
                          </tr>
                        ))}
                      {totals && (
                        <tr>
                          <td className="border px-2 py-1">
                            <strong>Total Monto: </strong>{" "}
                            {totals.capitalInsoluto}
                          </td>
                          <td className="border px-2 py-1">
                            <strong>Total Interes: </strong>{" "}
                            {totals.totalInteres}
                          </td>
                          <td className="border px-2 py-1">
                            <strong>Total Restante: </strong>{" "}
                            {(totals.totalSaldoInsoluto -= pagado)}
                          </td>
                          <td className="border px-2 py-1">
                            <strong>Total Pagado: </strong> {pagado}
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
  );
};

export default AddPayments;
