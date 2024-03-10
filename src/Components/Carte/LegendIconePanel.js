import React, { useState } from "react";
import "./LegendIconePanel.css"; 
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

function FilterGroup({ title, items, checkedValues, onFilterChange }) {

  const [isOpen, setIsOpen] = useState(true);
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (id) => {
    const updatedValues = checkedValues.includes(id)
      ? checkedValues.filter((value) => value !== id)
      : [...checkedValues, id];
    onFilterChange(updatedValues);
  };

  return (
    <div className="filter-group">
      <div className="filter-header" onClick={togglePanel}>
        {title} {isOpen ? "-" : "+"}
      </div>
      {isOpen && (
        <div className="legend-content">
          <FormGroup>
            {items.map((item) => (
              
              <div key={item.nom + item.id } className="legend-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedValues.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                }
                label={
                  <div className="legend-label">
                    {item.icone && (<img src={"/images/" + item.icone} alt="" /> )}
                    <span className="legend-text">{item.nom}</span>
                  </div>
                }
              />
            </div>
            ))}
          </FormGroup>
        </div>
      )}
    </div>
  );
}

function LegendIconePanel({ domaines,postes, onFilterDomaineChange,onFilterPosteChange  }) {
  const [checkedDomains, setCheckedDomains] = useState(
    domaines.map((item) => item.id)
  );
  const [checkedPoste, setCheckedPostes] = useState( postes.map((item) => item.id));

  const handleDomainChange = (values) => {
    setCheckedDomains(values);
    onFilterDomaineChange(values);
  };

  const handlePosteChange = (values) => {
    setCheckedPostes(values);
    onFilterPosteChange(values);
  };

  return (
    <div className="legend-panel">
      <h1>Filtres</h1>
      <FilterGroup
        title="Domaines"
        items={domaines}
        checkedValues={checkedDomains}
        onFilterChange={handleDomainChange}
      />
      <FilterGroup
        title="Postes"
        items={postes} // Ajoutez les postes selon votre besoin
        checkedValues={checkedPoste}
        onFilterChange={handlePosteChange}
      />
    </div>
  );
}

export default LegendIconePanel;
