import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
const Poste = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [modifiedPoste, setModifiedPoste] = useState(null);
  const [prePostes, setPrePostes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({
    descriptionPoste: "",
    nomEntreprise: "",
    dateDebut: "",
    dateFin: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/server/user/allPostes", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        if (!response.ok) {
          console.error(
            "Erreur lors de la récupération des données:",
            response.status
          );
          navigate("/");
          return;
        }
        const jsonData = await response.json();

        const newData = jsonData.postes.map((item) => ({
          id: item.pos_id,
          descriptionPoste: item.pos_description,
          nomEntreprise: item.pos_entreprise,
          dateDebut: item.pos_debut,
          dateFin: item.pos_fin,
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

    const fetchPrePostes = async () => {
      try {
        const response = await fetch("/server/user/allPrePostes", {
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
        setPrePostes(jsonData.pre_post);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données:",
          error.message
        );
      }
    };

    fetchData();
    fetchPrePostes();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setModifiedPoste((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = { ...errors };

    Object.keys(modifiedPoste).forEach((key) => {
      if (!modifiedPoste[key] && key !== "dateFin") {
        newErrors[key] = `Veuillez entrer ${key}`;
      }
    });

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleValidation = async () => {
    try {
      const validation = validateForm();
      if (!validation) {
        console.log("error");
        return;
      }

      const url = isEditing
        ? `/server/user/updateposte/${modifiedPoste.id}`
        : "/server/user/createposte";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify(modifiedPoste),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des données");
      }

      const updatedData = isEditing
        ? data.map((item) =>
            item.id === modifiedPoste.id ? modifiedPoste : item
          )
        : [...data, modifiedPoste];

      setData(updatedData);

      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la validation des modifications:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPoste(null);
    setModifiedPoste(null);
    setIsEditing(false);
  };

  const handleEdit = (poste) => {
    setSelectedPoste(poste);
    setModifiedPoste({ ...poste });
    setShowModal(true);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setModifiedPoste({
      nomPoste: "",
      descriptionPoste: "",
      nomEntreprise: "",
      dateDebut: "",
      dateFin: "",
    });
    setShowModal(true);
    setIsEditing(false);
  };

  const getNomPosteById = (postId) => {
    const poste = prePostes.find((poste) => poste.pre_id === postId);
    return poste ? poste.pre_nom : "";
  };

  const columns = [
    {
      dataField: "nomPoste",
      text: "Nom du poste",
      formatter: (cell, row) => getNomPosteById(row.nomPoste),
    },
    {
      dataField: "descriptionPoste",
      text: "Description",
    },
    {
      dataField: "nomEntreprise",
      text: "Nom de l'entreprise",
    },
    {
      dataField: "dateDebut",
      text: "Date de début",
    },
    {
      dataField: "dateFin",
      text: "Date de fin",
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cellContent, row) => (
        <Button onClick={() => handleEdit(row)}>Modifier</Button>
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
          <Button variant="success" onClick={() => handleAdd()}>
            Ajouter un ancien poste que vous avez occupé
          </Button>
          <BootstrapTable
            keyField="id"
            data={Array.isArray(data) ? data : []}
            columns={columns}
          />

          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {isEditing ? "Modifier" : "Ajouter"} le poste
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formNom">
                  <Form.Label>Nom du poste</Form.Label>
                  <Form.Control
                    as="select"
                    name="nomPoste"
                    value={modifiedPoste ? modifiedPoste.nomPoste : ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionner un poste</option>
                    {prePostes.map((prePoste) => (
                      <option key={prePoste.pre_id} value={prePoste.pre_id}>
                        {prePoste.pre_nom}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Text className="text-danger">
                    {errors.nomPoste}
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descriptionPoste"
                    value={modifiedPoste ? modifiedPoste.descriptionPoste : ""}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-danger">
                    {errors.descriptionPoste}
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formNomEntreprise">
                  <Form.Label>Nom de l'entreprise</Form.Label>
                  <Form.Control
                    type="text"
                    name="nomEntreprise"
                    value={modifiedPoste ? modifiedPoste.nomEntreprise : ""}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-danger">
                    {errors.nomEntreprise}
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formDateDebut">
                  <Form.Label>Date de début</Form.Label>
                  <DatePicker
                    views={["year"]}
                    label=""
                    value={modifiedPoste.dateDebut}
                    onChange={(date) => handleDateChange(date, "dateDebut")}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Form.Text className="text-danger">
                    {errors.dateDebut}
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formDateFin">
                  <Form.Label>Date de fin</Form.Label>
                  <DatePicker
                    views={["year"]}
                    label=""
                    value={modifiedPoste.dateFin}
                    onChange={(date) => handleDateChange(date, "dateFin")}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Form.Text className="text-danger">
                    {errors.dateFin}
                  </Form.Text>
                </Form.Group>
              </Form>
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
        </div>
      </Box>
    </div>
  );
};

export default Poste;
