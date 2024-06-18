import React, { useReducer } from 'react';
import UserContext from './userContext';


const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_VALUE':
      return { ...state, value: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_NEW_VALUE':
      return { ...state, selectedContact: action.payload };
    default:
      return state;
  }
};

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'UPDATE_VALUE':
//       return { ...state, value: action.payload };
//     case 'SET_USER':
//       return { ...state, user: action.payload };
//     case 'ADD_NEW_VALUE':
//       return { ...state, newValue: action.payload }; // Add a new value to the state
//     default:
//       return state;
//   }
// };

// Step 4: Create a ContextProvider component
export const UserContextProvider = ({ children }) => {
  // Initialize state using useReducer
  const [state, dispatch] = useReducer(reducer, { value: '' });

  // Step 5: Export the context and state
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

  // Create a reducer function
  // const reducer = (state, action) => {
  //   switch (action.type) {
  //     case 'UPDATE_VALUE':
  //       return { ...state, value: action.payload };
  //     case 'SET_USER':
  //       return { ...state, user: action.payload };
  //     default:
  //       return state;
  //   }
  // };