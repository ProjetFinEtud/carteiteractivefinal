import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Button from "react-bootstrap/Button";
import Chat from "../Messages/Chat";

const DemandeContact = () => {
  const [requests, setRequests] = useState([]);
  const [selectedPseudo, setSelectedPseudo] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [bolChange, setBolchange] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/server/user/allRequestExsContact", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
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
        setRequests(newData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleOpenChat = (msg_id, pseudo) => {
    setSelectedMessageId(msg_id);
    setSelectedPseudo(pseudo);
    setBolchange(true);
  };

  const handleAcceptRequest = async (id) => {
    try {
      const response = await fetch(`/server/user/activateRequestContact/${id}`, {
        method: "PUT",
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des données");
      }
      const updatedRequests = requests.map((request) =>
        request.con_id === id ? { ...request, con_etat: "Accepté" } : request
      );
      setRequests(updatedRequests);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const con_id = id;
      const response = await fetch("/server/user/refusedRequestContact", {
        method: "PUT",
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ con_id }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des données");
      }
      const updatedRequests = requests.map((request) =>
        request.con_id === id ? { ...request, con_etat: "Refusé" } : request
      );
      setRequests(updatedRequests);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      const con_id = id;
      const response = await fetch("/server/user/deleteRequestContact", {
        method: "DELETE",
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ con_id }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression des données");
      }
      const updatedRequests = requests.filter((request) => request.con_id !== id);
      setRequests(updatedRequests);
    } catch (error) {
      setError(error.message);
    }
  };

  const changePage = () => {
    setBolchange(!bolChange);
  };

  const columns = [
    { dataField: "con_date", text: "Date" },
    { dataField: "con_etat", text: "Etat" },
    {
      dataField: "",
      text: "A",
      formatter: (cellContent, row) => (
        <div>
          <p>
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
      text: "Actions",
      formatter: (cellContent, row) => (
        <div>
          {row.con_etat === "Demande en cours" && (
            <>
              <Button
                variant="success"
                onClick={() => handleAcceptRequest(row.con_id)}
                style={{ marginRight: "10px" }}
              >
                Accepter
              </Button>
              <Button
                variant="danger"
                onClick={() => handleRejectRequest(row.con_id)}
              >
                Refuser
              </Button>
            </>
          )}
          {row.con_etat === "Accepter" && (
            <div style={{ margin: "2px" }}>
              <Button
                variant="primary"
                onClick={() => handleOpenChat(row.msg_id, row.exs_login)}
                style={{ marginRight: "10px" }}
              >
                Ouvrir le chat
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteRequest(row.msg_id)}
              >
                Supprimer le contact
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      {error && <p style={{ color: "red" }}>Erreur: {error}</p>}
      {bolChange && selectedMessageId && (
        <Chat
          messageid={selectedMessageId}
          pseudo={selectedPseudo}
          changePage={changePage}
        />
      )}
      {!bolChange && (
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

export default DemandeContact;
