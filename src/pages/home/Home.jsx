import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import './home.css';
import { useUserContext } from '../../context/userContext';
import Avatar from '../../mini-components/Avatar';
import { db } from '../../firebase';
import Usersearch from '../../components/usersearch/Usersearch';
import Conversation from '../../components/conversation/Conversation';
import { useLayoutEffect } from 'react';

export default function Home() {
  const { state, dispatch } = useUserContext();
  const [contacts, setContacts] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);

  console.log(state);

  const navigate = useNavigate();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const snapshot = await db.ref(`contacts/${state.user.uid}`).once('value');

        if (snapshot.exists()) {
          const contactsData = snapshot.val();
          const contactsArray = Object.keys(contactsData).map((contactKey) => ({
            contactUID: contactKey,
            friendUID: contactsData[contactKey].friendUID,
            lastInteraction: contactsData[contactKey].lastInteraction,
          }));

          setContacts(contactsArray);
        } else {
          console.log('No contacts found.');
        }
      } catch (error) {
        console.error('Error fetching contacts:', error.message);
        console.error('Error details:', error);
      }
    };

    getContacts();
  }, [state.user.uid]);

  const getUserInfo = async (friendUID) => {
    try {
      const userSnapshot = await db.ref(`users/${friendUID}`).once('value');
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        // Return the user data from the function
        return userData;
      } else {
        console.log('User not found.');
        return null; // Return null if user not found
      }
    } catch (error) {
      console.error('Error fetching user information:', error.message);
      console.error('Error details:', error);
      return null; // Return null in case of an error
    }
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const infoArray = await Promise.all(
          contacts.map(async (contact) => {
            const userData = await getUserInfo(contact.friendUID);
            return userData;
          })
        );

        // Filter out null values (users not found or errors)
        const filteredInfoArray = infoArray.filter((user) => user !== null);

        setContactInfo(filteredInfoArray);
      } catch (error) {
        console.error('Error fetching contact information:', error.message);
        console.error('Error details:', error);
      }
    };

    fetchContactInfo();
  }, [contacts]);

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

  const [selectedContact, setSelectedContact] = useState(null);
  const handleContactClick = (friendUID) => {
    dispatch({ type: 'ADD_NEW_VALUE', payload: friendUID });
    setSelectedContact(friendUID);
    console.log('Navigating to conversation...');
    navigate('./conversation');
  };


  return (
    <div className='H-C'>
      <div className='M-C'>
        <div className='IB-C'>
          <Avatar margin='15px' src={state.user.photoURL} />
          <Usersearch />
        </div>
        <div className='ACD-C'>
          {contactInfo.map((user, index) => (
            <div key={index} className='CD-C'
            onClick={() => handleContactClick(user.uid)}>
              <Avatar src={user.profilePictureURL} alt={`Profile for ${user.displayName}`} />
              <div className='CD-I-C'>
                <p>{user.displayName}</p>
                <p>Last Activity: {formatDate(user.lastActivity)}</p>
              </div>
            </div>
          ))}
        </div> 
      </div>
    </div>
  );
}


// import { useState, useEffect } from 'react'
// import './home.css'
// import { useUserContext } from '../../context/userContext';
// import Avatar from '../../mini-components/Avatar';
// import { db } from '../../firebase';
// import Usersearch from '../../components/usersearch/Usersearch';


// export default function Home() {

//   const { state } = useUserContext();
//   const [contacts, setContacts] = useState([]);
//   const [contactInfo, setContactInfo] = useState();


//   useEffect(() => {
//     const getContacts = async () => {
//       try {
//         const snapshot = await db.ref(`contacts/${state.user.uid}`).once('value');

//         if (snapshot.exists()) {
//           const contactsData = snapshot.val();
//           const contactsArray = Object.keys(contactsData).map((contactKey) => ({
//             contactUID: contactKey,
//             friendUID: contactsData[contactKey].friendUID,
//             lastInteraction: contactsData[contactKey].lastInteraction,
//           }));

//           setContacts(contactsArray);
//         } else {
//           console.log('No contacts found.');
//         }
//       } catch (error) {
//         console.error('Error fetching contacts:', error.message);
//         console.error('Error details:', error);
//       }
//     };

//     getContacts();
//   }, [state.user.uid]);

//   const getUserInfo = async (friendUID) => {
//     try {
//       const userSnapshot = await db.ref(`users/${friendUID}`).once('value');
//       if (userSnapshot.exists()) {
//         const userData = userSnapshot.val();
//         // Access the user information here and use it as needed
//         console.log('User Information:', userData);
//       } else {
//         console.log('User not found.');
//       }
//     } catch (error) {
//       console.error('Error fetching user information:', error.message);
//       console.error('Error details:', error);
//     }
//   };

//   useEffect(() => {
//     // Run the getUserInfo function for each contact when contacts state changes
//     const fetchContactInfo = async () => {
//       const infoArray = await Promise.all(
//         contacts.map(async (contact) => {
//           const userData = await getUserInfo(contact.friendUID);
//           return userData;
//         })
//       );
//       setContactInfo(infoArray);
//     };

//     fetchContactInfo();
//   }, [contacts]);

//   return (
//     <div className='H-C'>
//       <div className='M-C'>
//         <div className='IB-C'>
//           <Avatar margin='15px' src={state.user.photoURL} />
//           <Usersearch />
//         </div>
//       </div>
//       <div>
//         {contactInfo.map((user, index) => (
//           <div key={index}>
//             <h2>User Information:</h2>
//             <p>Name: {user.displayName}</p>
//             <p>Email: {user.email}</p>
//             <p>Last Activity: {user.lastActivity}</p>
//             <img src={user.profilePictureURL} alt={`Profile for ${user.displayName}`} />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }



{/* <Card imageUrl={state.user.photoURL} name={state.user.displayName}/> */ }
{/* <Message text="Hello there!" user="John" timestamp="12:34 PM" isCurrentUser={false} />
        <Message text="Hi! How are you?" user="Souhail" timestamp="12:35 PM" isCurrentUser={true} />
        <Message text="Is evry think good?" user="Souhail" timestamp="12:35 PM" isCurrentUser={true} />
        <Message text="Yes, thanks for asking" user="Jane" timestamp="12:38 PM" isCurrentUser={false} />
        <Message text="In the quietude of the morning, the sun's gentle rays painted the sky with hues of pink and gold. Birds chirped merrily, creating a symphony that echoed through the tranquil meadows. A gentle breeze rustled the leaves, carrying the earthy fragrance of dew-kissed grass. As I sipped my warm cup of coffee, I marveled at the beauty of the world waking up to a new day. Nature's canvas unfolded before my eyes, a masterpiece of serenity and renewal, inviting me to embrace the possibilities that lay ahead." user="Souhail" timestamp="12:40 PM" isCurrentUser={true} /> */}
