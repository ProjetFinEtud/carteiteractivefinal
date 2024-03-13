import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Box from "@mui/material/Box";

const PrePostePage = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newNom, setNewNom] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/server/user/allPrePostes",
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
      setData(jsonData.pre_post);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setEditing(false);
    setNewNom("");
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("/server/user/createPreposte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          nom: newNom,
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
    setNewNom(item.nom);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/server/user/updatePreposte/${selectedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          nom: newNom,
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
      dataField: "pre_nom",
      text: "Nom",
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
            Ajouter un nouveau preposte
          </Button>

          <BootstrapTable keyField="id" data={data} columns={columns} />

          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {editing ? "Modifier" : "Ajouter"} un nouveau preposte
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formNewNom">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    value={newNom}
                    onChange={(e) => setNewNom(e.target.value)}
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

export default PrePostePage;
