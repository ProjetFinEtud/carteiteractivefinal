import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import Avatar from "@mui/material/Avatar";

const Desactive = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [raisonSup, setRaisonSup] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [dataPoste, setDataPoste] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "/user/userDesactived",
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
      setData(jsonData);

      const responsePostes = await fetch(
        "/user/allPrePostes",
        {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        }
      );
      if (!responsePostes.ok) {
        console.error(
          "Erreur lors de la récupération des données:",
          responsePostes.status
        );
        return;
      }

      const jsonDataPostes = await responsePostes.json();
      if (jsonDataPostes) {
        const newDataPoste = jsonDataPostes.pre_post.map((item) => ({
          id: item.pre_id,
          nom: item.pre_nom,
        }));
        setDataPoste(newDataPoste);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données:",
        error.message
      );
      navigate("/");
    }
  };

  const onActivate = useCallback(async (exs_id, stud_id, type) => {
    var id = null;
    console.log(exs_id, stud_id);
    if (!exs_id) id = stud_id;
    else id = exs_id;
    console.log(id);
    console.log(type);
    try {
      const response = await fetch(`/user/activate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ type, id }),
      });

      if (!response.ok) {
        console.error(
          "Erreur lors de l'activation de l'étudiant:",
          response.status
        );
        return;
      }
      setGlobalFilter('');
      const newData = data.filter((student) => student.exs_id !== id);
      
      setData(newData);
    } catch (error) {
      console.error(
        "Erreur lors de l'activation de l'étudiant:",
        error.message
      );
    }
  }, [data]);

  const setReasonForDeletion = (raison) => {
    setRaisonSup(raison);
  };

  const onDelete = async (exs_id, stu_id, cpt_type) => {
    var id = null;
    if (!exs_id) {
      id = stu_id;
    } else {
      id = exs_id;
    }
    setSelectedStudentId(id);
    setSelectedType(cpt_type);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const user_id = selectedStudentId;
    const user_type = selectedType;
    try {
      const response = await fetch(`/user/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accessToken: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify({ user_id, user_type, raisonSup }),
      });

      if (!response.ok) {
        console.error(
          "Erreur lors de la suppression de l'étudiant:",
          response.status
        );
        return;
      }
      if (response.status === 200) {
        
        setGlobalFilter('');
        const newData = data.filter((student) => student.exs_id !== user_id);
        setData(newData);
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'étudiant:",
        error.message
      );
    }
  };

  const openUserModal = (student) => {
    setSelectedStudent(student);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  const activateSelectedUsers = async () => {
    try {
      const userPseudos = selectedStudents.map((student) => student.cpt_login);

      console.log(userPseudos);

      const response = await fetch(
        `/user/activateUsers`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accessToken: sessionStorage.getItem("accessToken"),
          },
          body: JSON.stringify({ pseudos: userPseudos }),
        }
      );

      if (!response.ok) {
        console.error(
          "Erreur lors de l'activation des utilisateurs:",
          response.status
        );
        return;
      }
      setGlobalFilter('');
      // Mettre à jour l'état data en supprimant les utilisateurs activés
      const newData = data.filter(
        (student) =>
          !selectedStudents.map((user) => user.cpt_login).includes(student.cpt_login)
      );
      setData(newData);
    } catch (error) {
      console.error(
        "Erreur lors de l'activation des utilisateurs:",
        error.message
      );
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Nom",
        accessor: (row) => row.exs_nom || row.stu_nom,
      },
      {
        Header: "Prénom",
        accessor: (row) => row.exs_prenom || row.stu_prenom,
      },
      {
        Header: "Email",
        accessor: (row) => row.exs_email || row.stu_email,
      },
      {
        Header: "Type",
        accessor: "cpt_login_t_compte_cpt.cpt_type",
      },
      {
        Header: "Domaine",
        accessor: "dom.dom_nom",
      },
      {
        Header: "Master",
        accessor: "ma.mas_nom",
      },
      {
        Header: "Activer",
        Cell: ({ row }) => (
          <button
            type="button"
            className="btn btn-success"
            onClick={() =>
              onActivate(
                row.original.exs_id,
                row.original.stu_id,
                row.original.cpt_login_t_compte_cpt.cpt_type
              )
            }
          >
            Activer
          </button>
        ),
      },
      {
        Header: "Supprimer",
        Cell: ({ row }) => (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() =>
              onDelete(
                row.original.exs_id,
                row.original.stu_id,
                row.original.cpt_login_t_compte_cpt.cpt_type
              )
            }
          >
            Supprimer
          </button>
        ),
      },
      {
        Header: "Voir",
        Cell: ({ row }) => (
          <button
            type="button"
            className="btn btn-info"
            onClick={() => openUserModal(row.original)}
          >
            Voir
          </button>
        ),
      },
      {
        Header: "Sélectionner",
        Cell: ({ row }) => (
          <MDBCheckbox
            checked={selectedStudents.some(
              (student) => student.cpt_login === row.original.cpt_login
            )}
            onChange={(e) => handleCheckboxChange(e, row.original)}
          />
        ),
      },
    ],
    [onActivate, selectedStudents]
  );

  const handleCheckboxChange = (e, student) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedStudents((prevSelected) => [...prevSelected, student]);
    } else {
      setSelectedStudents((prevSelected) =>
        prevSelected.filter(
          (prevStudent) => prevStudent.cpt_login !== student.cpt_login
        )
      );
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
  );

  const { globalFilter } = state;

  return (
    <div className="container mt-5">
      {/* <h2>Liste des utilisateurs désactivés</h2> */}
      <div>
        <input
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Rechercher..."
        />
      </div>
      <table {...getTableProps()} className="table table-striped">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {data.length !== 0 && (
        <Button variant="success" onClick={activateSelectedUsers}>
          Activer les utilisateurs sélectionnés
        </Button>
      )}

      <Modal
        show={isDeleteModalOpen}
        onHide={() => setIsDeleteModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cet étudiant ?
        </Modal.Body>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Raison de la suppression"
          name="raisonsup"
          onChange={(e) => setReasonForDeletion(e.target.value)}
        />
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isUserModalOpen}
        onHide={closeUserModal}
        centered
        dialogClassName="modal-user-profile"
      >
        <Modal.Header closeButton>
          <Modal.Title>Profil de l'utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div className="d-flex text-black">
              <div className="flex-shrink-0">
                <Avatar
                  src={"./upload/" + selectedStudent.photo}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{ width: 150, height: 150, objectFit: "cover" }}
                />
              </div>
              <div className="flex-grow-1 ms-3">
                <MDBCardTitle>
                  {(selectedStudent.exs_nom || selectedStudent.stu_nom) +
                    " " +
                    (selectedStudent.exs_prenom || selectedStudent.stu_prenom)}
                </MDBCardTitle>

                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="small text-muted mb-1">Email</p>
                      <p className="mb-0">
                        {selectedStudent.exs_email || selectedStudent.stu_email}
                      </p>
                    </div>
                    <div>
                      <p className="small text-muted mb-1">Type</p>
                      <p className="mb-0">
                        {selectedStudent.cpt_login_t_compte_cpt.cpt_type}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="small text-muted mb-1">Master</p>
                    <p className="mb-0">{selectedStudent.ma.mas_nom}</p>
                  </div>
                  <div>
                    <p className="small text-muted mb-1">Année début master</p>
                    <p className="mb-0">
                      {selectedStudent.exs_anneediplome ||
                        selectedStudent.stu_anneediplome}
                    </p>
                  </div>
                </div>
                {selectedStudent.cpt_login_t_compte_cpt.cpt_type ===
                  "exStudent" && (
                  <div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="small text-muted mb-1">Domaine</p>
                        <p className="mb-0">
                          {selectedStudent.dom.dom_nom || "Pas de domaine"}
                        </p>
                      </div>

                      <div>
                        <p className="small text-muted mb-1">Poste</p>
                        <p className="mb-0">
                          {dataPoste.find(
                            (poste) =>
                              poste.id ===
                              selectedStudent.t_poste_pos[0].pre_id
                          )?.nom}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="small text-muted mb-1">Entreprise</p>
                        <p className="mb-0">
                          {selectedStudent.t_poste_pos[0].pos_entreprise ||
                            "Pas d'entreprise'"}
                        </p>
                      </div>

                      <div>
                        <p className="small text-muted mb-1">
                          Année début--fin
                        </p>
                        <p className="mb-0">
                          {selectedStudent.t_poste_pos[0].pos_debut +
                            "---" +
                            selectedStudent.t_poste_pos[0].pos_fin}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Desactive;
