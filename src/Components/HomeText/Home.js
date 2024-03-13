import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Box from "@mui/material/Box";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/server/user/allAcc",
      {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      }
    );
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données");
      }
      const jsonData = await response.json();
      setData(jsonData.columns);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setEditing(false);
    setNewTitle("");
    setNewText("");
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("/server/user/addAcc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          title: newTitle,
          text: newText,
        }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout des données");
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout des données:", error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditing(true);
    setNewTitle(item.acc_titre);
    setNewText(item.acc_text);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/server/user/updateAcc/${selectedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          title: newTitle,
          text: newText,
        }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la modification des données");
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la modification des données:", error);
    }
  };

  const columns = [
    {
      dataField: "acc_titre",
      text: "Titre",
    },
    {
      dataField: "acc_texte",
      text: "Texte",
    },
    {
      dataField: "edit",
      text: "Modifier",
      formatter: (cell, row) => (
        <Button variant="primary" onClick={() => handleEdit(row)}>
          Modifier
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Box
        width="80%"
        height="90%"
        sx={{
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        <div className="container mt-5">
          <Button variant="success" onClick={() => setShowModal(true)}>
            Ajouter un nouvel élément
          </Button>

          <BootstrapTable keyField="id" data={data} columns={columns} />

          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {editing ? "Modifier" : "Ajouter"} un nouvel élément
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formNewTitle">
                  <Form.Label>Titre</Form.Label>
                  <Form.Control
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formNewText">
                  <Form.Label>Texte</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button variant="primary" onClick={editing ? handleUpdate : handleAdd}>
                {editing ? "Modifier" : "Ajouter"}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Box>
    </div>
  );
};

export default HomePage;
