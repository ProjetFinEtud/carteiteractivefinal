import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
// import './animations.css';
import Formulaire from './Formulaire';
import Message from './Message';
import { database } from './base'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import IconButton from '@mui/material/IconButton';

const Chat = ({ messageid, pseudo, changePage }) => {
  const [messages, setMessages] = useState({});
  const messagesRef = useRef(null);

  const handleBack = () => {
    changePage(false);
  };

  useEffect(() => {
    const messagesRef = database.ref(`messages${messageid}`);
    messagesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(data.messages);
      }
    });

    return () => {
      messagesRef.off();
    };
  }, [messageid]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);


  const addMessage = (message) => {
    const newMessages = { ...messages };

    newMessages[`message-${Date.now()}`] = message;

    database.ref(`messages${messageid}`).update({ messages: newMessages });
  };

  const isUser = (messagePseudo) => messagePseudo === pseudo;


  const messageList = Object.keys(messages).map((key) => (
    <CSSTransition timeout={200} classNames='fade' key={key}>
      <Message
        isUser={isUser}
        message={messages[key].message}
        pseudo={messages[key].pseudo}
      />
    </CSSTransition>
    
  ));


  return (
    <>
      <IconButton onClick={handleBack} aria-label="Retour à la demande de contact">
        <ArrowBackIcon />
      </IconButton>
    <div className='box'>
      <div>
        <div className='messages' ref={messagesRef}>
          <TransitionGroup className='message'>{messageList}</TransitionGroup>
        </div>
      </div>
      <Formulaire length={140} pseudo={pseudo} addMessage={addMessage} />
    </div>
    </>
   
  );
};

export default Chat;
