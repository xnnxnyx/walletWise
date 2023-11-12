//import "./messages.css";
//import { Message } from "./Message";

export function Messages(props) {
  const { messages, deleteMessage } = props;

  return (
    <div className="messages" onClick={() => console.log('HELLO')}>
      {messages.length === 0 ? (
        <h2>No messages added yet, try adding some.</h2>
      ) : (
        messages.map((message, idx) => (
          <Message
            key={message._id}
            item={message}
            deleteItem={deleteMessage}
          />
        ))
      )}
    </div>
  );
}