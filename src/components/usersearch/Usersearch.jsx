import './usersearch.css';
import { useState, useEffect } from 'react'
import { useUserContext } from '../../context/userContext';
import Avatar from '../../mini-components/Avatar';
import Input from '../../mini-components/Input';
import Button from '../../mini-components/Button';
import { db, serverTimestamp } from '../../firebase';
import { ref, get, push, set } from 'firebase/database';
import Alert from '../../mini-components/Alert';






export default function Usersearch() {


    const { state } = useUserContext();

    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isComponentMounted, setIsComponentMounted] = useState(true);
  
    useEffect(() => {
      return () => {
        // Component will unmount, set the flag to false
        setIsComponentMounted(false);
      };
    }, []);
  
    const handleSearch = async () => {
      try {
        // Hardcoded value for testing
  
        const query = searchQuery;
  
        console.log('Query:', query);
  
        const snapshot = await db
          .ref('users')
          .orderByChild('displayName')
          .equalTo(query)
          .once('value');
  
        console.log('Snapshot:', snapshot.val());
        if (snapshot.val() === null) {
          handleAlertClick('error', "Ther is no user whit this name!")
        }
  
  
        if (snapshot.exists()) {
          const users = snapshot.val();
          const results = Object.keys(users).map((uid) => ({ uid, ...users[uid] }));
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
  
      } catch (error) {
        console.error('Error searching for users:', error.message);
        console.error('Error details:', error);
      }
    };
  
    const handleAddContact = async (friendUid) => {
      try {
        if (!db) {
          console.error('Firebase database instance is not initialized');
          handleAlertClick('error', "Firebase database instance is not initialized.")
          return;
        }
  
        // Check if the friend is already a contact
        const contactsSnapshot = await get(ref(db, `contacts/${state.user.uid}`));
        const contacts = contactsSnapshot.val();
  
        if (contacts) {
          const existingContact = Object.values(contacts).find(contact => contact.friendUID === friendUid);
  
          if (existingContact) {
            console.log('Friend is already a contact.');
            handleAlertClick('info', "He is already in your contact.")
            // Optionally show a message or handle accordingly
            return;
          }
        }
  
        // Update the contacts for the current user
        const userContactsRef = ref(db, `contacts/${state.user.uid}`);
        const newContactRef = push(userContactsRef);
        await set(newContactRef, {
          friendUID: friendUid,
          lastInteraction: serverTimestamp(),
        });
  
        // Update the contacts for the friend user
        const friendContactsRef = ref(db, `contacts/${friendUid}`);
        const friendContactRef = push(friendContactsRef);
        await set(friendContactRef, {
          friendUID: state.user.uid,
          lastInteraction: serverTimestamp(),
        });
  
        // Clear search results after adding a contact
        handleAlertClick('success', `Your are freind with ${searchQuery} now!`)
        setSearchResults([]);
      } catch (error) {
        console.error('Error adding contact:', error);
      }
    };
  
  
  
  
    // const handleAddContact = async (friendUid) => {
    //   try {
    //     // Update the contacts for the current user
    //     await db.ref(`contacts/${state.user.uid}`)
    //       .push({
    //         friendUID: friendUid,
    //         lastInteraction: serverTimestamp(),
    //       });
  
    //     // Update the contacts for the friend user
    //     await db.ref(`contacts/${friendUid}`)
    //       .push({
    //         friendUID: state.user.uid,
    //         lastInteraction: serverTimestamp(),
    //       });
  
    //     // Clear search results after adding a contact
    //     setSearchResults([]);
    //   } catch (error) {
    //     console.error('Error adding contact:', error);
    //   }
    // };
  
  
  
  
  
    const [alerts, setAlerts] = useState([]);
    const handleAlertClick = (type, customMessage) => {
      const message = customMessage || 'This is a temporary alert!';
  
      const newAlert = { type, message };
  
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  
      // After 3 seconds, remove the alert
      setTimeout(() => {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert !== newAlert));
      }, 2000);
    };
  
    const handleSearchQ = (value) => {
      setSearchResults([]);
      console.log(value);
      setSearchQuery(value);
    };
  
    // const formatDate = (timestamp) => {
    //   const date = new Date(timestamp);
    //   const formattedDate = `${padZero(date.getDate())}/${padZero(date.getMonth() + 1)}/${date.getFullYear()}, ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    //   return formattedDate;
    // };
  
    // const padZero = (number) => (number < 10 ? `0${number}` : number);
  
    // const formatDate = (timestamp) => {
    //   const date = new Date(timestamp);
    //   const currentDate = new Date();
  
    //   // Check if the date is the same as the current date
    //   const isSameDay =
    //     date.getDate() === currentDate.getDate() &&
    //     date.getMonth() === currentDate.getMonth() &&
    //     date.getFullYear() === currentDate.getFullYear();
  
    //   if (isSameDay) {
    //     // If it's the same day, only display the time
    //     return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    //   } else {
    //     // If it's a different day, display the full date and time
    //     return `${padZero(date.getDate())}/${padZero(date.getMonth() + 1)}/${date.getFullYear()}, ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    //   }
    // };
  
    // const padZero = (number) => (number < 10 ? `0${number}` : number);
  
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
      

    const handleSearchToggle = () => {
      setSearchResults([]);
      setSearchQuery([]);
      setSearching((prevSearching) => !prevSearching);
    };
  



    return (
        <div>
            {searching === true && (
                <div className='US-C'>
                    <Input
                        width={'260px'}
                        type="text"
                        placeholder="Search for users..."
                        value={searchQuery}
                        onChange={handleSearchQ}
                    />
                    <Button onClick={handleSearch} label='Shearch...' />
                    {searchResults.map((user) => (
                        <div data-aos="fade-up" key={user.uid} className='USR-C'>
                            <Avatar src={user.profilePictureURL} />
                            <div className='USR-I-C'>
                                <p>{user.displayName}</p>
                                <p>Last Activity: {formatDate(user.lastActivity)}</p>
                            </div>
                            <Button
                                height='25px'
                                onClick={() => handleAddContact(user.uid)}
                                label={
                                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.625 6.75c-.184 2.478-2.063 4.5-4.125 4.5-2.063 0-3.945-2.021-4.125-4.5-.188-2.578 1.64-4.5 4.125-4.5 2.484 0 4.312 1.969 4.125 4.5Z"></path>
                                        <path d="M13.5 14.25c-4.078 0-8.217 2.25-8.983 6.497-.093.512.198 1.003.734 1.003h16.5c.536 0 .825-.491.733-1.003-.766-4.247-4.905-6.497-8.984-6.497Z"></path>
                                        <path d="M4.125 8.25v5.25"></path>
                                        <path d="M6.75 10.875H1.5"></path>
                                    </svg>
                                }
                            />
                        </div>
                    ))}
                </div>
            )}

            <Button
                onClick={handleSearchToggle}
                label={
                    searching ? (
                        <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="m18.75 6.82-1.57-1.57L12 10.43 6.82 5.25 5.25 6.82 10.43 12l-5.18 5.18 1.57 1.57L12 13.57l5.18 5.18 1.57-1.57L13.57 12l5.18-5.18Z"></path>
                        </svg>
                    ) : (
                        <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="m21.407 19.753-4.41-4.41a8.148 8.148 0 0 0 1.633-4.903c0-4.516-3.674-8.19-8.19-8.19s-8.19 3.674-8.19 8.19 3.674 8.19 8.19 8.19a8.148 8.148 0 0 0 4.902-1.633l4.41 4.41a1.171 1.171 0 0 0 1.655-1.654ZM4.59 10.44a5.85 5.85 0 1 1 5.85 5.85 5.857 5.857 0 0 1-5.85-5.85Z"></path>
                        </svg>
                    )
                }
            />

            {alerts.map((alert, index) => (
            <Alert key={index} type={alert.type} message={alert.message} index={index} />
            ))}
        </div>
    )
}

