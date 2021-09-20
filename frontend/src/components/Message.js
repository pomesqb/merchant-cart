import React from "react";

const Message = ({ variant, children }) => {
  let classContent = `alert alert-${variant}`;
  return (
    <div className={classContent} role="alert">
      {children}
    </div>
  );
};

Message.defaultProps = {
  variant: "danger",
};

export default Message;
