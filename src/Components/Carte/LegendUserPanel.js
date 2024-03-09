import React, { useState } from 'react';
import './LegendUserPanel.css'; // Import du fichier CSS pour le style

function LegendUserPanel({ title, items, onUserClick }) {
  const [isOpen, setIsOpen] = useState(true);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleUserClick = (user) => {
    onUserClick(user);
  };

  return (
    <div className="legend-user-panel">
      <div className="legend-user-header">
        <div className="legend-user-title">Utilisateurs</div>
        <button className="toggle-button" onClick={togglePanel}>
          {isOpen ? '-' : '+'}
        </button>
      </div>
      {isOpen && (
        <div className="legend-user-content">
          {items.map((item, index) => (
            <div key={index} className="legend-user-item" onClick={() => handleUserClick(item)}>
              <label htmlFor={`legend-user-checkbox-${index}`} className="legend-user-label">
                <div className="legend-user-icon" style={{ backgroundColor: item.color }}>
                  <img src={"/images/" + item.icone} alt={""} />
                </div>
                <div className="legend-user-text">{item.nom + " " + item.prenom}</div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LegendUserPanel;
