import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Button from "react-bootstrap/Button";
import Chat from "../Messages/Chat";
const ExstudentContact = () => {
  const [requests, setRequests] = useState([]);
  const [selectedPseudo, setSelectedPseudo] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "server/contact/allRequestExsContact",
          {
            headers: {
              accessToken: sessionStorage.getItem("accessToken"),
            },
          }
        );
        if (!response.ok) {
          console.error(
            "Erreur lors de la récupération des données:",
            response.status
          );
          return;
        }
        const jsonData = await response.json();
        const newData = jsonData.columns.map((item) => ({
          con_id: item.con_id,
          con_date: item.con_date,
          con_etat: item.con_etat,
          exs_login: item.exs_login,
          stu_login: item.stu_login,
        }));
        console.log(newData);
        setRequests(newData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données:",
          error.message
        );
      }
    };

    fetchData();
  }, []);

  const columns = [
    { dataField: "con_date", text: "Date" },
    { dataField: "con_etat", text: "Etat" },
    {
      dataField: "",
      text: "A",
      formatter: (cellContent, row) => (
        <div>
          <p>
            {" "}
            {row.stu_login
              .match(/^(\w+)\.(\w+)(\d{4})$/)
              .slice(1, 3)
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(" ")}
          </p>
        </div>
      ),
    },
    {
      dataField: "action",
      text: "Ouvrir le chat",
      formatter: (cellContent, row) =>
        requests.con_etat === "Accepter" && (
          <Button
            variant="primary"
            onClick={() => handleOpenChat(row.msg_id, row.stu_login)}
          >
            Ouvrir le chat
          </Button>
        ),
    },
  ];

  const handleOpenChat = (msg_id, pseudo) => {
    setSelectedMessageId(msg_id);
    setSelectedPseudo(pseudo);
  };


  return (
    <div className="container mt-5">
      {selectedMessageId ? (
        <Chat messageid={selectedMessageId} pseudo={selectedPseudo} />
      ) : (
        <BootstrapTable
          keyField="con_id"
          data={requests}
          columns={columns}
          bordered={false}
        />
      )}
    </div>
  );
};

export default ExstudentContact;
