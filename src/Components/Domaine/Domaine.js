import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Box from "@mui/material/Box";
const Domaine = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [modifiedDomaine, setModifiedDomaine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({
    dom_nom: "",
    dom_icone: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/domaine/alldomaines",
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

        const newData = jsonData.columns.map((item) => ({
          dom_id: item.dom_id,
          dom_nom: item.dom_nom,
          dom_icone: item.dom_icone,
        }));
        setData(newData);
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
    console.log(files)
    if (files) {
      setModifiedDomaine((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        dom_icone: "",
      }));
    } else {
      setModifiedDomaine((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        dom_nom: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    if (!modifiedDomaine.dom_nom) {
      newErrors.dom_nom = "Veuillez entrer un nom de domaine";
    } else {
      newErrors.dom_nom = "";
    }

    console.log(modifiedDomaine.dom_icon)

    if (!modifiedDomaine.dom_icone) {
      newErrors.dom_icone = "Veuillez importer une icone";
    } else {
      newErrors.dom_icone = "";
    }

    setErrors(newErrors);

    // Le formulaire est valide s'il n'y a pas d'erreurs
    return Object.values(newErrors).every((error) => !error);
  };

  const updateTableData = (updatedData) => {
    setData(updatedData);
  };

  const handleValidation = async () => {
    try {
      var id = null
      var image = null
      var validation = null;
      if (!isEditing) {
        validation = validateForm();
        if (!validation) {
          console.log("error");
          return;
        }
      }

      const formData = new FormData();

      formData.append("dom_nom", modifiedDomaine.dom_nom);
      formData.append("dom_id", modifiedDomaine.dom_id);
      if (modifiedDomaine.dom_icone) {
        formData.append("image", modifiedDomaine.dom_icone);
      }

      const url = isEditing
        ? "/domaine/updatedomaines"
        : "/domaine/adddomaines";
     const response =  await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: formData,
      }).then(response => response.json())
      .then(data => {
        id = data.message;
        image=data.returnimage
      });
      const updatedData = [...data];
      const index = updatedData.findIndex(
        (item) => item.dom_id === modifiedDomaine.dom_id
      );
      if (index !== -1) {
        modifiedDomaine.dom_icone = image
        updatedData[index] = modifiedDomaine
        updateTableData(updatedData);
      } else {
        modifiedDomaine.dom_id = id; 
        modifiedDomaine.dom_icone = image
        updateTableData(updatedData); 
      }
      

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
    handleShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDomaine(null);
    setModifiedDomaine(null);
    setIsEditing(false); // Réinitialisation du mode édition après la fermeture de la modal
  };

  const handleEdit = (domaine) => {
    setSelectedDomaine(domaine);
    setModifiedDomaine({ ...domaine });
    setShowModal(true);
    setIsEditing(true); // Définition du mode édition à vrai
  };

  const handleAdd = () => {
    setModifiedDomaine({ dom_nom: "", dom_id: "" });
    setShowModal(true);
    setIsEditing(false); // Définition du mode édition à faux lors de l'ajout
  };

  const columns = [
    {
      dataField: "dom_nom",
      text: "Nom",
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
    <div style={{ height: "100vh", width: "100%"}}>
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
          <Button variant="success" onClick={() => handleAdd()}>
            Ajouter un nouveau domaine
          </Button>
          {/* </div> */}
          <BootstrapTable
            keyField="id"
            data={Array.isArray(data) ? data : []}
            columns={columns}
          />

          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {isEditing ? "Modifier" : "Ajouter"} le domaine
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {(selectedDomaine || !isEditing) && (
                <Form>
                  <Form>
                    <Form.Group controlId="formNom">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        type="text"
                        name="dom_nom"
                        value={modifiedDomaine ? modifiedDomaine.dom_nom : ""}
                        onChange={handleInputChange}
                      />
                      {!isEditing && (
                        <Form.Text className="text-danger">
                          {errors.dom_nom}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Form>

                  <Form.Group controlId="formImage">
                    <Form.Label>Icone</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      name="dom_icone"
                      onChange={handleInputChange}
                    />
                    {!isEditing && (
                      <Form.Text className="text-danger">
                        {errors.dom_icone}
                      </Form.Text>
                    )}
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
            {console.log("/images/" + selectedImage)}
              {selectedImage && (
                <img
                  src={"/images/" + selectedImage}
                  
                  alt="icone du domaine"
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
      </Box>
    </div>
  );
};

export default Domaine;
