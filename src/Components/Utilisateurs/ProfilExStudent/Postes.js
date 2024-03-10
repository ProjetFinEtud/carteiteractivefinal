import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const Postes = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedPostes, setSelectedPostes] = useState(null);
  const [modifiedPostes, setModifiedPostes] = useState({
    pos_nom: "",
    pos_description: "",
    pos_entreprise: "",
    pos_debut: "",
    pos_fin: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({
    pos_nom: "",
    pos_description: "",
    pos_entreprise: "",
    pos_debut: "",
    pos_fin: "",
  });
  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/server/user/allPostes",
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
          navigate("/");
          return;
        }
        const jsonData = await response.json();
        console.log(jsonData)
        setData(jsonData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données:",
          error.message
        );
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setModifiedPostes((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    } else {
      setModifiedPostes((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    if (!modifiedPostes.pos_nom) {
      newErrors.pos_nom = "Veuillez entrer un nom de poste";
    } else {
      newErrors.pos_nom = "";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleValidation = async () => {
    try {
      if (!isEditing) {
        const isValid = validateForm();
        if (!isValid) {
          return;
        }
      }

      const formData = new FormData();

      formData.append("pos_nom", modifiedPostes.pos_nom);
      formData.append("pos_description", modifiedPostes.pos_description);
      formData.append("pos_entreprise", modifiedPostes.pos_entreprise);
      formData.append("pos_debut", modifiedPostes.pos_debut);
      formData.append("pos_fin", modifiedPostes.pos_fin);

      const url = isEditing
        ? "/server/Postes/updatePostess"
        : "/server/Postes/addPostess";
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: formData,
      });

      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la validation des modifications:", error);
    }
  };

  const handleShowImageModal = () => {
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  const handleShowImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPostes(null);
    setModifiedPostes({
      pos_nom: "",
      pos_description: "",
      pos_entreprise: "",
      pos_debut: "",
      pos_fin: "",
    });
    setIsEditing(false); 
  };

  const handleEdit = (poste) => {
    setSelectedPostes(poste);
    setModifiedPostes(poste); 
    setShowModal(true);
    setIsEditing(true); 
  };

  const handleAdd = () => {
    setModifiedPostes({
      pos_nom: "",
      pos_description: "",
      pos_entreprise: "",
      pos_debut: "",
      pos_fin: "",
    });
    setShowModal(true);
    setIsEditing(false); 
  };

  const columns = [
    {
      dataField: "pos_nom",
      text: "Nom",
    },
    {
      dataField: "pos_description",
      text: "Description",
    },
    {
      dataField: "pos_entreprise",
      text: "Entreprise",
    },
    {
      dataField: "pos_debut",
      text: "Début",
    },
    {
      dataField: "pos_fin",
      text: "Fin",
    },
    {
      dataField: "dom_icone",
      text: "Icone actuelle",
      formatter: (cellContent, row) => (
        <Button
          variant="primary"
          onClick={() => handleShowImage(row.dom_icone)}
        >
          Voir l'icone
        </Button>
      ),
    },
    {
      dataField: "dom_id",
      text: "Modifier",
      formatter: (cellContent, row) => (
        <Button onClick={() => handleEdit(row)}>Modifier</Button>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Button variant="success" onClick={handleAdd}>
          Ajouter un nouveau Postes
        </Button>
      </div>
      <BootstrapTable
        keyField="id"
        data={Array.isArray(data) ? data : []}
        columns={columns}
      />

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Modifier" : "Ajouter"} le Postes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(selectedPostes || !isEditing) && (
            <Form>
              <Form.Group controlId="formNom">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  name="pos_nom"
                  value={modifiedPostes ? modifiedPostes.pos_nom : ""}
                  onChange={handleInputChange}
                />
                {!isEditing && (
                  <Form.Text className="text-danger">
                    {errors.pos_nom}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="pos_description"
                  value={modifiedPostes ? modifiedPostes.pos_description : ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEntreprise">
                <Form.Label>Nom de l'entreprise</Form.Label>
                <Form.Control
                  type="text"
                  name="pos_entreprise"
                  value={modifiedPostes ? modifiedPostes.pos_entreprise : ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formDebut">
                <Form.Label>Date de début</Form.Label>
                <Form.Control
                  type="date"
                  name="pos_debut"
                  value={modifiedPostes ? modifiedPostes.pos_debut : ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formFin">
                <Form.Label>Date de fin</Form.Label>
                <Form.Control
                  type="date"
                  name="pos_fin"
                  value={modifiedPostes ? modifiedPostes.pos_fin : ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleValidation}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImageModal} onHide={handleCloseImageModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Icone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img
              src={"./upload/" + selectedImage}
              alt="Image"
              style={{ maxWidth: "100%" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseImageModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Postes;
