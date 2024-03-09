import React from 'react';

const Message = ({ pseudo, message, isUser }) => {
  return (
   
    <div className={isUser(pseudo) ? 'user-message' : 'not-user-message'}>
      {console.log(isUser(pseudo))}
      {isUser(pseudo) ? (
        <p>{message}</p>
      ) : (
        <p>
          <strong>{pseudo}: </strong>
          {message}
        </p>
      )}
    </div>
  );
};

export default Message;
