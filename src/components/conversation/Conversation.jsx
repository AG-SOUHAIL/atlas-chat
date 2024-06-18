import { useState, useEffect, useRef } from 'react';
import './conversation.css';
import { useUserContext } from '../../context/userContext';
// import Avatar from '../../mini-components/Avatar';
import { db } from '../../firebase';
import Message from '../../mini-components/Message';
import Textarea from '../../mini-components/Textarea';
import Button from '../../mini-components/Button';
import Card from '../../mini-components/Card'
import usePresence from './usePresence';


export default function Conversation({ contactuid }) {
  const { state } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  usePresence(); // Hook to track the current user's presence

  const messagesContainerRef = useRef(null);
  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll to the bottom when messages change
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // ... (rest of your code remains unchanged)
  }, [state.user.uid, state.selectedContact]);


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userSnapshot = await db.ref(`users/${state.selectedContact}`).once('value');
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setUserInfo(userData);
        } else {
          console.log('User not found.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error.message);
        console.error('Error details:', error);
      }
    };
  
    fetchUserInfo();
  }, [state.selectedContact]);
  

  useEffect(() => {
    const handleRealTimeUpdates = (snapshot) => {
      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const messagesArray = Object.keys(messagesData).map((messageKey) => ({
          messageId: messageKey,
          sender: messagesData[messageKey].sender,
          content: messagesData[messageKey].content,
          timestamp: messagesData[messageKey].timestamp,
        }));

        setMessages(messagesArray);
      } else {
        console.log('No messages found.');
        setMessages([]);
      }
    };

    const conversationRef = db.ref(`conversations/${state.user.uid}_${state.selectedContact}`);
    conversationRef.on('value', handleRealTimeUpdates);

    // Clean up the listener when the component unmounts
    return () => {
      conversationRef.off('value', handleRealTimeUpdates);
    };
  }, [state.user.uid, state.selectedContact]);

  useEffect(() => {
    const statusRef = db.ref(`status/${state.selectedContact}`);
  
    const handleStatusChange = (snapshot) => {
      const status = snapshot.val();
      if (status) {
        setIsOnline(status.state === 'online');
      }
    };
  
    statusRef.on('value', handleStatusChange);
  
    // Clean up the listener when component unmounts or when state.user.uid changes
    return () => {
      statusRef.off('value', handleStatusChange);
    };
  }, [state.user.uid]); // Dependency array to handle updates on user change
  

  const handleSendMessage = async () => {
    try {
      const currentUserRef = db.ref(`conversations/${state.user.uid}_${state.selectedContact}`);
      const otherUserRef = db.ref(`conversations/${state.selectedContact}_${state.user.uid}`);

      const newMessageRef = currentUserRef.push();
      const messageData = {
        sender: state.user.uid,
        content: newMessage,
        timestamp: Date.now(),
        deleted: false,
      };
      await newMessageRef.set(messageData);

      // Also send the message to the other user's conversation
      await otherUserRef.push(messageData);
      scrollToBottom();
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.message);
      console.error('Error details:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };



  const formatDate = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) {
      return "No date available"; // or any default value you prefer
    }
  
    const date = new Date(timestamp);
    const currentDate = new Date();
  
    // Check if the date is the same as the current date
    const isSameDay =
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();
  
    if (isSameDay) {
      // If it's the same day, only display the time
      return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    } else {
      // If it's a different day, display the full date and time
      return `${padZero(date.getDate())}/${padZero(date.getMonth() + 1)}/${date.getFullYear()}, ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    }
  };
  const padZero = (number) => (number < 10 ? `0${number}` : number);

//   const handleDeleteMessage = async (messageId) => {
//     try {
//       const conversationRef = db.ref(`conversations/${state.user.uid}_${state.selectedContact}`);
//       await conversationRef.child(messageId).update({
//         content: 'Deleted message',
//         deleted: true,
//       });
//     } catch (error) {
//       console.error('Error deleting message:', error.message);
//       console.error('Error details:', error);
//     }
//   };

// const handleDeleteMessage = async (messageId) => {
//     try {
//       const currentUserRef = db.ref(`conversations/${state.user.uid}_${state.selectedContact}`);
//       const otherUserRef = db.ref(`conversations/${state.selectedContact}_${state.user.uid}`);
  
//       // Mark the message as deleted in the current user's conversation
//       await currentUserRef.child(messageId).update({
//         content: 'Deleted message',
//         deleted: true,
//       });
  
//       // Mark the message as deleted in the other user's conversation
//       await otherUserRef.child(messageId).update({
//         content: 'Deleted message',
//         deleted: true,
//       });
//     } catch (error) {
//       console.error('Error deleting message:', error.message);
//       console.error('Error details:', error);
//     }
//   };
  
// const handleDeleteMessage = async (messageId) => {
//     try {
//       const currentUserRef = db.ref(`conversations/${state.user.uid}_${state.selectedContact}`);
//       const otherUserRef = db.ref(`conversations/${state.selectedContact}_${state.user.uid}`);
  
//       // Optimistically update the UI
//       setMessages((prevMessages) =>
//         prevMessages.map((message) =>
//           message.messageId === messageId
//             ? { ...message, content: 'Deleted message', deleted: true }
//             : message
//         )
//       );
  
//       // Mark the message as deleted in the current user's conversation
//       await currentUserRef.child(messageId).update({
//         content: 'Deleted message',
//         deleted: true,
//       });
  
//       // Mark the message as deleted in the other user's conversation
//       await otherUserRef.child(messageId).update({
//         content: 'Deleted message',
//         deleted: true,
//       });
//     } catch (error) {
//       console.error('Error deleting message:', error.message);
//       console.error('Error details:', error);
//     }
//   };
  
// const handleDeleteMessage = async (messageId) => {
//     try {
//       const currentUserRef = db.ref(`conversations/${state.user.uid}_${state.selectedContact}`);
//       const otherUserRef = db.ref(`conversations/${state.selectedContact}_${state.user.uid}`);
  
//       console.log(`Deleting message with ID: ${messageId}`);
  
//       // Optimistically update the UI
//       setMessages((prevMessages) =>
//         prevMessages.map((message) =>
//           message.messageId === messageId
//             ? { ...message, content: 'Deleted message', deleted: true }
//             : message
//         )
//       );
  
//       // Mark the message as deleted in the current user's conversation
//       await currentUserRef.child(messageId).update({
//         content: 'Deleted message',
//         deleted: true,
//       });
  
//       // Mark the message as deleted in the other user's conversation
//       await otherUserRef.child(messageId).update({
//         content: 'Deleted message',
//         deleted: true,
//       });
  
//       console.log(`Message with ID ${messageId} deleted successfully.`);
//     } catch (error) {
//       console.error('Error deleting message:', error.message);
//       console.error('Error details:', error);
//     }
//   };
  
  console.log(state);
  console.log(userInfo);

  return (
    <div>
        {/* fixe the text area at the bottom and add scroll to the messages and edit he conversation container  */}
      {/* <div>Conversation with: {state.selectedContact}</div> */}
      <Card
        name={userInfo ? userInfo.displayName : 'Loading...'}
        imageUrl={userInfo ? userInfo.profilePictureURL : ''}
        content={userInfo ? formatDate(userInfo.lastActivity) : ''}
        isOnline={isOnline}  // Pass the isOnline prop
        to={'/'}
      />

      <div className='MSG-C' ref={messagesContainerRef}>
        {messages.map((message) => (
          <Message
            key={message.messageId}
            messageId={message.messageId}
            text={message.content}
            user={userInfo ? userInfo.displayName : 'Unknown'}
            timestamp={formatDate(message.timestamp)}
            isCurrentUser={message.sender === state.user.uid}
            isDeleted={message.deleted}
          />        
        ))}
      </div>
      <div className='MSG-S-C'>
        <Textarea
          height={'100px'}
          style={{ flex: 1 }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          
        />
        <Button onClick={handleSendMessage} label={'Send'}/>
      </div>
    </div>
  );
}


// import './conversation.css';

// export default function Conversation({contactuid}) {
//   return (
//     <div>{contactuid}</div>
//   )
// }

