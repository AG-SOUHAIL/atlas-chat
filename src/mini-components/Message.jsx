
export default function Message({ messageId, text, user, timestamp, isCurrentUser, isDeleted, onDelete }) {

    const messageStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        margin: "10px",
        opacity: 0, // Initial opacity set to 0
        animation: 'popUp 0.5s ease-in-out forwards', // CSS animation
      };
    
      const contentStyle = {
        maxWidth: '75%', // Adjust the maximum width as needed
        minWidth: '100px',
        padding: '8px',
        borderRadius: '8px',
        backgroundColor: isCurrentUser ? '#dcf8c6' : 'white',
        boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
      };
    
      const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between', //isCurrentUser ? 'flex-end' : 'flex-start'
        fontSize: '12px',
        color: '#888',
      };
    
      const userStyle = {
        fontWeight: 'bold',
        marginRight: '5px',
      };
    
      const timestampStyle = {
        marginLeft: '5px',
      };
    
      const textStyle = {
        marginTop: '5px',
        fontSize: '14px',
        color: "black",
      };
    
    

    //     display: 'flex',
    //     alignItems: 'flex-start',
    //     marginBottom: '16px',
    //   };
    
    //   const avatarStyle = {
    //     backgroundColor: '#4caf50',
    //     color: 'white',
    //     borderRadius: '50%',
    //     width: '40px',
    //     height: '40px',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     fontSize: '18px',
    //     marginRight: '10px',
    //     marginLeft: '10px',
    //   };
    
    //   const contentStyle = {
    //     display: 'flex',
    //     flexDirection: 'column',
    //   };
    
    //   const headerStyle = {
    //     display: 'flex',
    //     justifyContent: 'space-between',
    //     fontSize: '14px',
    //     color: '#777',
    //   };
    
    //   const userStyle = {
    //     fontWeight: 'bold',
    //   };
    
    //   const timestampStyle = {
    //     marginLeft: '10px',
    //   };
    
    //   const textStyle = {
    //     marginTop: '5px',
    //     maxWidth: '300px', // Adjust the maximum width as needed
    //     overflow: 'hidden',
    //     whiteSpace: 'pre-line', // Preserve line breaks
    //     textOverflow: 'ellipsis',
    //   };

    // const handleDeleteClick = () => {
    //   onDelete(messageId);
    // };

  return (

    <div style={messageStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <span style={userStyle}>{isCurrentUser ? 'You' : user}</span>
          <span style={timestampStyle}>{timestamp}</span>
          {/* <span style={{ cursor: 'pointer', color: 'red' }} onClick={handleDeleteClick}>
              Delete
          </span> */}
        </div>
        <div style={textStyle}>{text}</div>
      </div>
    </div>

    // const messageStyle = {

    // <div style={Object.assign({}, messageStyle, isCurrentUser && { flexDirection: 'row-reverse' })}>
    //   <div style={avatarStyle}>{user[0]}</div>
    //   <div style={contentStyle}>
    //     <div style={headerStyle}>
    //       <span style={userStyle}>{user}</span>
    //       <span style={timestampStyle}>{timestamp}</span>
    //     </div>
    //     <div style={Object.assign({}, textStyle)}>{text}</div>
    //   </div>
    // </div>
  )
}