import { useState } from "react";
import { useRef } from "react";


export default  function Textarea ({onChange, value, onKeyDown}) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);


  // const autoResizeTextarea = () => {
  //   const textarea = textareaRef.current;
  //   textarea.style.height = 'auto';
  //   textarea.style.height = textarea.scrollHeight + 'px';
  // };

  const styles = {
    container: {
      position: 'relative',
      bottom: 0,
      width: '100%',
    },
    textarea: {
      width: 'calc(100% - 20px)',
      padding: '10px',
      margin: '0',
      border: 'none',
      borderRadius: '8px',
      resize: 'none',
      overflow: 'hidden',
      boxSizing: 'border-box',
      fontSize: '16px',
      lineHeight: '1.4',
      minHeight: '40px', // Set a minimum height if needed
      maxHeight: '120px', // Set a maximum height if needed
    },
  };

  return (
    <div style={styles.container}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Type a message..."
        style={styles.textarea}
      />
    </div>
  );
};