import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DeleteForever, Edit, Update } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import { OutputType } from "jspdf-invoice-template";
import * as jsPDFInvoiceTemplate from "jspdf-invoice-template";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const PaymentsInfo = () => {
  const [payments, setPayments] = useState([]);
  const [client, setclient] = useState("");

  const location = useLocation();

  const clientId = location.pathname.split("/")[2];

  const GetPayments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/payments/${clientId}`,
        {
          method: "GET",
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      const parseRes = await response.json();
console.log("hola: "+parseRes)
      setPayments(parseRes);
    } catch (error) {
      console.log(error.message);
    }
  };


  const deleteNotif = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      }),
      {
        pending: "Deleting Payment...",
        success: "Deleted Succesfully!",
        error: "Error!",
      },
      {
        autoClose: 2000,
      }
    );
  };
  // Delete loan Function
  async function deletePayment(id) {
    try {
      await fetch(`http://localhost:8000/payment/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });
      deleteNotif();
      setTimeout(() => {
        setPayments(payments.filter((payment) => payment.id !== id));
      }, 2000);
    } catch (error) {
      console.log(error.message);
    }
  }

 

  useEffect(() => {
    GetPayments();
  }, []);
  const handleDownloadPDF = (i) => {
    const props = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: "Recibo",
      orientationLandscape: false,
      compress: true,
      logo: {
        src: "",
        type: "PNG", //optional, when src= data:uri (nodejs case)
        width: 53.33, //aspect ratio = width/height
        height: 26.66,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      stamp: {
        inAllPages: true, //by default = false, just in the last page
        src: "",
        type: "JPG", //optional, when src= data:uri (nodejs case)
        width: 20, //aspect ratio = width/height
        height: 20,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      business: {
        name: "PRESTA",
        address: "27 Febrero, Calle Penetracion",
        phone: "(809) 345-123",
        email: "PRESTA@gmail.com",
        email_1: "info@presta.al",
        website: "www.PRESTA.com",
      },
      contact: {
        label: "Recibo de:",
        name: payments[i].new_balance,
        address: "Albania, Tirane, Astir",
        phone: "(829) 987 5543",
      },
      invoice: {
        label: "Recibo #: ",
        num: payments[i].id,
        invDate: `Payment Date: ${payments[i].collection_date}`,
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          {
            title: "#",
            style: {
              width: 10,
            },
          },
          {
            title: "Title",
            style: {
              width: 30,
            },
          },
          {
            title: "Description",
            style: {
              width: 80,
            },
          },
          { title: "Cobrado por" },
          { title: "Metodo" },
        ],
        table: Array.from(Array(1), (item, index) => [
          index + 1,
          "Cuota",
          "Pago de prestamo",
          payments[i].collected_by,
          payments[i].method,
        ]),
        additionalRows: [
          {
            col1: "Total:",
            col2: payments[i].amount,
            col3: "ALL",
            style: {
              fontSize: 18, //optional, default 12
            },
          },
        ],
        // invDescLabel: "Invoice Note",
        // invDesc:
        //   "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
      },
      footer: {
        text: "PRESTA",
      },
      pageEnable: true,
      pageLabel: "Page ",
    };
  
    // Generate PDF
  const pdfCreated = jsPDFInvoiceTemplate.default(props);
  
  // Handle the PDF output as needed
  switch (props.outputType) {
    case jsPDFInvoiceTemplate.OutputType.Save:
      // Save the PDF
      pdfCreated.jsPDFDocObject.save(props.fileName || "document.pdf");
      break;
    case jsPDFInvoiceTemplate.OutputType.Blob:
      // Access the Blob object
      const blob = pdfCreated.blob;
      // Do something with the Blob (e.g., upload to the server)
      break;
    // Add more cases as needed
    default:
      break;
  }
   
};

console.log("hoho: ", client)
function propp(name){
   // Your props for the PDF
   
}
  return (
    <div className="h-[350px] overflow-hidden hover:overflow-scroll border rounded shadow-md px-8 py-8 border-t-4 border-t-purple-500">
      <ToastContainer />

      {/* Payment History */}
      <div className="flex items-center justify-between border-y-2 ">
        <h3 className="text-lg font-medium leading-6 text-gray my-2  px-1 py-2 ">
          Payment History
        </h3>
      </div>
      <table className="table-fixed text-center ">
        <thead>
          <tr>
            <th className="w-1/1 px-1 py-2 text-gray-600">Voucher</th>
            <th className="w-1/5 px-1 py-2 text-gray-600">Amount</th>
            <th className="w-1/5 px-4 py-2 text-gray-600">Collection Date</th>
            <th className="w-1/5 px-4 py-2 text-gray-600">Collected By:</th>
            <th className="w-1/5 px-4 py-2 text-gray-600">Method</th>
            <th className="w-1/5 px-4 py-2 text-gray-600">Recipt</th>
            <th className="w-1/5 px-4 py-2 text-gray-600">Delete</th>
          </tr>
        </thead>
        <tbody>
          {payments.length <= 0 ? (
            <tr className="border px-4 py-2 bg-red-50">
              <td></td>
              <td></td>
              <td></td>
              <td className="px-4 py-2 bg-red-50">No Payment Data</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ) : (
            payments.map((payment, index) => {
             
              return (
                <tr key={index}>
                  <td className="border px-4 py-2 bg-gray-50">
                    {payment.loan_id}
                  </td>
                  <td className="border px-4 py-2 ">₱ {payment.amount}</td>
                  <td className="border px-4 py-2 bg-gray-50">
                    {new Date(payment.collection_date).toDateString()}
                  </td>
                  <td className="border px-4 py-2 bg-gray-50">
                    {payment.collected_by}
                  </td>
                  <td className="border px-4 py-2 ">
                    {payment.method === "CHEQUE" ? (
                      <span className=" bg-green-500 text-white px-1 py-1 rounded-md">
                        {payment.method}
                      </span>
                    ) : payment.method === "TRANS" ? (
                      <span className=" bg-orange-300 text-white px-2 py-1 rounded-md">
                        {payment.method}
                      </span>
                    ) : (
                      <span className=" bg-blue-500 text-white px-2 py-1 rounded-md">
                        {payment.method}
                      </span>
                    )}
                  </td>
                  <td className="border px-4 py-2 ">
                    {" "}
                    <button
                      className="bg-purple-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
                      onClick={() => handleDownloadPDF(index)}
                    >
                      <PictureAsPdfIcon className="text-lg" />
                    </button>
                  </td>
                  <td>
                    <button
                      className="bg-purple-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline  text-sm"
                      onClick={() => deletePayment(payment.id)}
                    >
                      <DeleteForever className="text-lg" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsInfo;
