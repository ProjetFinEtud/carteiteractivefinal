import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Button from "react-bootstrap/Button";
import Chat from "../Messages/Chat";

const StudentContact = () => {
  const [requests, setRequests] = useState([]);
  const [selectedPseudo, setSelectedPseudo] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("server/user/allRequestStuContact", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
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
          msg_id: item.msg_id,
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

  const handleOpenChat = (msg_id, pseudo) => {
    setSelectedMessageId(msg_id);
    setSelectedPseudo(pseudo);
  };

  const handleDelete = (con_id) => {
    // // Supprimer la demande de contact de la base de données
    // database.ref(`messages/${con_id}`).remove()
    //   .then(() => {
    //     console.log("Demande supprimée avec succès");
    //     // Mettre à jour l'état pour refléter les changements
    //     setRequests(requests.filter(request => request.con_id !== con_id));
    //   })
    //   .catch(error => console.error("Erreur lors de la suppression de la demande :", error));
  };

  const columns = [
    { dataField: "con_date", text: "Date" },
    { dataField: "con_etat", text: "Etat" },
    {
      dataField: "",
      text: "A",
      formatter: (cellContent, row) => (
        <div>
          <p> { row.stu_login.match(/^(\w+)\.(\w+)(\d{4})$/)[1].slice(1, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1))+ " " + row.stu_login.match(/^(\w+)\.(\w+)(\d{4})$/)[2].slice(1, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)) }</p>
        </div>
   

      ),
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: (cellContent, row) =>
        row.con_etat === "Accepter" ? (
          <div>
            <Button
              variant="primary"
              onClick={() => handleOpenChat(row.msg_id, row.stu_login)}
              style={{ marginRight: "10px" }}
            >
              Ouvrir le chat
            </Button>
            <Button variant="danger" onClick={() => handleDelete(row.con_id)}>
              Supprimer l'utilisateur
            </Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => handleDelete(row.con_id)}>
            Supprimer la demande
          </Button>
        ),
    },
  ];

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

export default StudentContact;
