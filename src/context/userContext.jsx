import React, { createContext, useContext, useReducer } from 'react';

// Create a context
const UserContext = createContext();

// Export the custom hook
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

export default UserContext;


// import React, { createContext, useContext, useReducer } from 'react';

// // Create a context
// const UserContext = createContext();

// // Create a reducer function
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

// // Export the custom hook
// export const useUserContext = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUserContext must be used within a MyContextProvider');
//   }
//   return context;
// };

// export default UserContext;
