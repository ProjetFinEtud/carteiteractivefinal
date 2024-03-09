import React, { useState } from 'react';

const Formulaire = ({ length, pseudo, addMessage }) => {
  const [message, setMessage] = useState('');

  const createMessage = () => {
    const newMessage = {
      pseudo,
      message
    };
    addMessage(newMessage);
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createMessage();
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      createMessage();
    }
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        required
        maxLength={length}
      />
      <button type='submit'>Envoyer!</button>
    </form>
  );
};

export default Formulaire;
