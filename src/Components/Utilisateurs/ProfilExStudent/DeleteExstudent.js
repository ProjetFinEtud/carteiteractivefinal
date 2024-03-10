import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const DeleteStudent = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [raisonSup, setRaisonSup] = useState("");

  const logout = (() =>{
    sessionStorage.removeItem("accessToken")

    setTimeout(() => {
      navigate("/")
      reloadPage()
    }, 2000);
    
    return
})
const reloadPage = () => {
  window.location.reload();
}

  const handleChange = (event) => {
    setRaisonSup(event.target.value);
  };



  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
        const response = await fetch(`/server/user/userDeleteHisAccount`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            accessToken: sessionStorage.getItem("accessToken"),
          },
          body: JSON.stringify({ raisonSup }),
        });
  
        if (!response.ok) {
          console.error(
            "Erreur lors de la suppression de l'étudiant:",
            response.status
          );
          return;
        }
        if (response.status === 200) {
            logout()
        }
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de l'étudiant:",
          error.message
        );
      }
  };

  return (
    <div>
      <h2>Supprimer votre compte</h2>
      <p>Au regret de vous voir partir</p>
      <button className="btn btn-danger" onClick={handleShowModal}>
        Supprimer l'étudiant
      </button>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer votre compte ?
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Raison de la suppression"
            name="raisonsup"
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteStudent;
