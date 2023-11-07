import "./form.css";

export function AddMessageForm(props) {
  const { createMessage } = props;

  const handleSubmit = (e) => {
    e.preventDefault();

    // How do we get the current value of our input element?
  };

  return (
    <form class="complex-form" id="create-message-form">
      <div class="form-title">Post a message</div>
      <input
        type="text"
        id="post-username"
        class="form-element"
        placeholder="Enter your name"
        name="username"
        required
      />
      <textarea
        rows="5"
        id="post-content"
        class="form-element"
        placeholder="Enter your message"
        required
      ></textarea>
      <button type="submit" class="btn">Post your message</button>
    </form>
  );
}