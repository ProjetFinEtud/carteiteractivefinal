import React, { useState } from 'react';
import Button from '@mui/material/Button';
import RegisterExs from "./Auth/Register/Exstudent/Register"
import RegisterStu from "./Auth/Register/Student/Register"

function Register() {
  const [showExs, setShowExs] = useState(true);

  const handleChangeRegister = (event) => {
    event.preventDefault()
    setShowExs(!showExs);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop:"70px" }}>
      <div style={{ marginBottom: '-30px' }}>
        <Button 
          variant={showExs ? "contained" : "outlined"} 
          onClick={handleChangeRegister}
          style={{ marginRight: '10px', fontWeight: showExs ? 'bold' : 'normal' }}
        >
          Inscription des anciens étudiants
        </Button>
        <Button 
          variant={!showExs ? "contained" : "outlined"} 
          onClick={handleChangeRegister}
          style={{ fontWeight: !showExs ? 'bold' : 'normal' }}
        >
          Inscription des étudiants
        </Button>
      </div>
      {showExs ? 
        <RegisterExs  />
        : 
        <RegisterStu  />
      }
    </div>
  );
}

export default Register;
