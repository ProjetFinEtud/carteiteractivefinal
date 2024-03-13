import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Button from "react-bootstrap/Button";
import Chat from "../Messages/Chat";
import { database } from "../Messages/base";
import { message_id } from "../../../../server/function/function";
import Modal from "react-bootstrap/Modal";
const StudentContact = () => {
  const [requests, setRequests] = useState([]);
  const [selectedPseudo, setSelectedPseudo] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [bol, setBol] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
    changePage(true);
  };

  const changePage = (bolChange) => {
    setBol(bolChange);
    console.log(bol);
  };

  const handleDelete = (msg_id, id) => {
    setSelectedMessageId(msg_id);
    setDeleteId(id)
    setShowModal(true); 
  };

  const confirmDelete = async () =>{
    const id = deleteId
    const msg_id = selectedMessageId
    try {
      const response = await fetch(`server/user/deleteRequestContact/${id}`, {
        method: "DELETE",
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

      database
        .ref(`messages/${msg_id}`)
        .remove()
        .then(() => {
          console.log("Demande supprimée avec succès");
        })
        .catch((error) =>
          console.error("Erreur lors de la suppression de la demande :", error)
        );

      const updatedRequests = requests.filter(
        (request) => request.con_id !== id
      );
      setRequests(updatedRequests);
      setShowModal(false);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données:",
        error.message
      );
    }
  }

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
            {row.exs_login
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
              Supprimer le contact
            </Button>
          </div>
        ) : (
          <Button
            variant="danger"
            onClick={() => handleDelete(row.msg_id, row.con_id)}
          >
            Supprimer la demande
          </Button>
        ),
    },
  ];

  return (
    <>
      <div className="container mt-5">
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation de suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir supprimer cet élément ?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>
        {bol ? (
          <Chat
            messageid={selectedMessageId}
            pseudo={selectedPseudo}
            changePage={changePage}
          />
        ) : (
          <BootstrapTable
            keyField="con_id"
            data={requests}
            columns={columns}
            bordered={false}
          />
        )}
      </div>
    </>
  );
};

export default StudentContact;
