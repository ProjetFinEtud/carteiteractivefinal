import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as XLSX from "xlsx";
import { MDBCardTitle } from "mdb-react-ui-kit";
import Avatar from "@mui/material/Avatar";

const Active = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [dataPoste, setDataPoste] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/server/user/usersActived",
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
        console.log(jsonData);
        setData(jsonData);

        const responsePostes = await fetch(
         "/server/poste/allPrePostes",
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

    fetchData();
  }, [navigate]);

  const openUserModal = (student) => {
    setSelectedStudent(student);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Utilisateurs");
    XLSX.writeFile(workbook, "utilisateurs.xlsx");
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
        Header: "Création",
        accessor: "cpt_login_t_compte_cpt.cpt_creation",
      },
      {
        Header: "Connexion",
        accessor: "cpt_login_t_compte_cpt.cpt_update",
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
    ],
    []
  );

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

      <Button variant="success" onClick={exportToExcel}>
        Exporter vers Excel
      </Button>

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
                  src={"/images/" + selectedStudent.photo}
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
                {selectedStudent.cpt_login_t_compte_cpt.cpt_type === "exStudent" && (
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
                        <p className="mb-0"> {
                          dataPoste.find(
                            (poste) => poste.id ===  selectedStudent.t_poste_pos[0].pre_id
                          )?.nom
                        }</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="small text-muted mb-1">Entreprise</p>
                        <p className="mb-0">
                          {selectedStudent.t_poste_pos[0].pos_entreprise || "Pas d'entreprise'"}
                        </p>
                      </div>

                      <div>
                        <p className="small text-muted mb-1">Année début--fin</p>
                        <p className="mb-0"> 
                           {selectedStudent.t_poste_pos[0].pos_debut + "---" + selectedStudent.t_poste_pos[0].pos_fin}</p>
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

export default Active;
