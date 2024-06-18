import { useContext, useState } from 'react';
import { auth, db, serverTimestamp, storage } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Alert from '../../mini-components/Alert';
import Input from '../../mini-components/Input';
import Button from '../../mini-components/Button';
import { useUserContext } from '../../context/userContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';



// Example usage
export default function Signup () {
  const { dispatch } = useUserContext();
  const { dispatch2 } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [methode, setMethode] = useState("signin")
  const navigate = useNavigate();

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

  const inputStyle = {
    padding: '10px',
    margin: '5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    width: "60%",
  };

  const uploadProfilePicture = async (userId, file) => {
    // const storageRef = storage.ref();
    // const userRef = storageRef.child(`profilePictures/${userId}`);
    const userRef = ref(storage, `profilePictures/${userId}`)
    await userRef.put(file);
  };

  // Function to register a new user
  const registerUser = async (email, password, displayName, profilePictureFile) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      
      // Store additional user information in the database
      await db.ref(`users/${userCredential.user.uid}`).set({
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
        profilePictureURL: 1,
        // Add other user data as needed
      });

      // Upload profile picture to Firebase Storage
      if (profilePictureFile) {
        const storageRef = ref(storage, `profilePictures/${userCredential.user.uid}`);
        await uploadBytes(storageRef, profilePictureFile);
        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile(userCredential.user, {
          photoURL: downloadURL
        });
        
        // Save the downloadURL in the user's database entry
        await db.ref(`users/${userCredential.user.uid}`).update({
          profilePictureURL: downloadURL,
        });
      }
      
      console.log('User registered successfully');
      handleAlertClick('seccess', 'User registered successfully');
      return userCredential.user;
    } catch (error) {
      console.error('Error registering user:', error.message);
      handleAlertClick('error' , 'Error registering user');
      throw error;
    }
  };
  
  // Function to sign in an existing user
  const signInUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully');
      handleAlertClick('seccess', 'User signed in successfully');
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error.message);
      handleAlertClick('error' , 'Error signing in');
      throw error;
    }
  };

  const handleRegister = async () => {
    try {
      const user = await registerUser(email, password, displayName, profilePictureFile);
      // Do something with the registered user, e.g., navigate to another page
    } catch (error) {
      // Handle registration error
    }
  };

  // const handleSignIn = async () => {
  //   try {
  //     const user = await signInUser(email, password);
  //     console.log(user);
  //     dispatch({ type: 'SET_USER', payload: user });
  //     dispatch2({type: "LOGIN", payload: user});
  //     navigate("/")
  //     // Do something with the signed-in user, e.g., navigate to another page
  //   } catch (error) {
  //     // Handle sign-in error
  //   }
  // };

  const handleSignIn = async () => {
    try {
      const user = await signInUser(email, password);
  
      // Update the last activity timestamp in the user's data
      await db.ref(`users/${user.uid}`).update({
        lastActivity: serverTimestamp(),
      });
  
      console.log(user);
      dispatch({ type: 'SET_USER', payload: user });
      dispatch2({ type: 'LOGIN', payload: user });
      navigate('/');
      // Do something with the signed-in user, e.g., navigate to another page
    } catch (error) {
      // Handle sign-in error
    }
  };

  const handleEmailInputChange = (value) => {
    setEmail(value);
  };

  const handleNameInputChange = (value) => {
    setDisplayName(value)
  };

  const handlePasswordInputChange = (value) => {
    setPassword(value)
  };

  // const handleFileInputChange = (event) => {
  //   const file = event.target.files[0];
  //   setProfilePictureFile(file);
  // };

  // const handleFileInputChange = (event) => {
  //   const fileInput = event.target;
  //   if (fileInput && fileInput.files && fileInput.files.length > 0) {
  //     const file = fileInput.files[0];
  //     setProfilePictureFile(file);
  //   }
  // };

  // const handleFileInputChange = (event) => {
  //   const fileInput = event.target;
  //   if (fileInput && fileInput.files && fileInput.files.length > 0) {
  //     const file = fileInput.files[0];
  //     console.log('Selected File:', file);
  //     setProfilePictureFile(file);
  //   }
  // };

  // const handleFileInputChange = (event) => {
  //   const fileInput = event.target;
  //   if (fileInput && fileInput.files && fileInput.files.length > 0) {
  //     const file = fileInput.files[0];
  //     if (file.type.startsWith('image/')) {
  //       console.log('Selected Image File:', file);
  //       setProfilePictureFile(file);
  //     } else {
  //       console.error('Invalid File Type. Please select an image.');
  //       // Optionally, you can show an error to the user.
  //     }
  //   }
  // };
  

  const handleFileInputChange = (event) => {
    const fileInput = event.target;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('Selected File:', file);  // Add this line for debugging
      setProfilePictureFile(file);
    }
  };

  return (
    <div className='SU-C'>
      <div className='SU-I-C'>
        <div className='MBS-C'>
          <Button width="100px" label="Register" onClick={() => {setMethode("register")}}/>
          <Button width="100px" label="Sign-In" onClick={() => {setMethode("signin")}}/>
        </div>
        {methode === 'register' && (<input style={inputStyle} type="file" onChange={handleFileInputChange} />)}
        <Input type="text" width='60%' placeholder="Email" onChange={handleEmailInputChange} />
        <Input type="password" width='60%' placeholder="Password" onChange={handlePasswordInputChange} />
        {methode === 'register' && (<Input type="text" width='60%' placeholder="Name" onChange={handleNameInputChange} />)}

        {methode === 'register' && (<Button width="30%" label="Register"  onClick={handleRegister}/>)}
        {methode === 'signin' && (<Button width='30%' label="Sign In"   onClick={handleSignIn}/>)}
      </div>

      {alerts.map((alert, index) => (
        <Alert key={index} type={alert.type} message={alert.message} index={index} />
      ))}
    </div>
  );
};