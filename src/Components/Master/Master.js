import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Box } from "@mui/material";

const Master = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [modifiedMaster, setModifiedMaster] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({
    mas_nom: "",
    mas_description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const reloadPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
       // const response = await fetch("/server/master/allMaster", {
        const response = await fetch("/master/allMaster", {
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

        const newData = jsonData.columns.map((item) => ({
          mas_id: item.mas_id,
          mas_nom: item.mas_nom,
          mas_description: item.mas_description,
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
    const { name, value } = e.target;
    setModifiedMaster((prevState) => ({
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
    if (!modifiedMaster.mas_nom) {
      newErrors.mas_nom = "Veuillez entrer un nom de master";
    } else {
      newErrors.mas_nom = "";
    }

    if (!modifiedMaster.mas_description) {
      newErrors.mas_description = "Veuillez entrer une description";
    } else {
      newErrors.mas_description = "";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const updateTableData = (updatedData) => {
    setData(updatedData);
  };

  const handleValidation = async () => {
    try {
      if (!isEditing) {
        const validation = validateForm();
        if (!validation) {
          return;
        }
      }
      var id = null

      const url = isEditing
      //  ? "/server/master/updatemaster"
        ? "/master/updatemaster"
       // : "/server/master/addmaster";
        : "/master/addmaster";
      await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modifiedMaster),
      })
        .then((response) => response.json())
        .then((data) => {
          id = data.message;
        });
      const updatedData = [...data];
      const index = updatedData.findIndex(
        (item) => item.mas_id === modifiedMaster.mas_id
      );
      if (!Number.isInteger(id)) {
        updatedData[index] = modifiedMaster;
        updateTableData(updatedData);
      } else {
        modifiedMaster.dom_id = id; 
        updatedData.push(modifiedMaster);
        updateTableData(updatedData); 
      }

      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la validation des modifications:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMaster(null);
    setModifiedMaster(null);
    setIsEditing(false);
  };

  const handleEdit = (master) => {
    setSelectedMaster(master);
    setModifiedMaster({ ...master });
    setShowModal(true);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setModifiedMaster({ mas_nom: "", mas_description: "" });
    setShowModal(true);
    setIsEditing(false);
  };

  const columns = [
    {
      dataField: "mas_nom",
      text: "Nom",
    },
    {
      dataField: "mas_description",
      text: "Description",
    },
    {
      dataField: "mas_id",
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
          Ajouter un nouveau Master
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
            {isEditing ? "Modifier" : "Ajouter"} le master
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(selectedMaster || !isEditing) && (
            <Form>
              <Form.Group controlId="formNom">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  name="mas_nom"
                  value={modifiedMaster ? modifiedMaster.mas_nom : ""}
                  onChange={handleInputChange}
                />
                {!isEditing && (
                  <Form.Text className="text-danger">
                    {errors.mas_nom}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="mas_description"
                  value={modifiedMaster ? modifiedMaster.mas_description : ""}
                  onChange={handleInputChange}
                />
                {!isEditing && (
                  <Form.Text className="text-danger">
                    {errors.mas_description}
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
    </div>
    </Box>
    </div>

    
  );
};

export default Master;
