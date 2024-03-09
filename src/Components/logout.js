import React from 'react';
import { useNavigate } from "react-router-dom";

function PrivacyPolicyModal() {
  const navigate = useNavigate();
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
  return (
    <>
        <h1>Vous êtes déconnecté</h1>
        {logout()}
    </>
  );
}

export default PrivacyPolicyModal;
