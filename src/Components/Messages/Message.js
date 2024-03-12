import React from 'react';

const Message = ({ pseudo, message, isUser }) => {
  return (
   
    <div className={isUser(pseudo) ? 'user-message' : 'not-user-message'}>
      {console.log(isUser(pseudo))}
      {isUser(pseudo) ? (
        <p>{message}</p>
      ) : (
        <p>
          <strong>{pseudo.match(/^(\w+)\.(\w+)(\d{4})$/)
              .slice(1, 3)
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(" ")}: </strong>
          {message}
        </p>
      )}
    </div>
  );
};

export default Message;
