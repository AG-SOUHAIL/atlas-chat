import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const userCondition = null;

const INITIAL_STATE = {
    currentUser: userCondition || null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch2] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(()=>{
        const userCondition = state.currentUser;
    },[state.currentUser])

    return(
        <AuthContext.Provider value={{currentUser: state.currentUser, dispatch2}}>
            {children}
        </AuthContext.Provider>
    );
};

// import { createContext, useEffect, useReducer } from "react";
// import AuthReducer from "./AuthReducer";

// const INITIAL_STATE = {
//     currentUser: JSON.parse(localStorage.getItem("user")) || null,
// };

// export const AuthContext = createContext(INITIAL_STATE);

// export const AuthContextProvides = ({children}) => {
//     const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

//     useEffect(()=>{
//         localStorage.setItem("user", JSON.stringify(state.currentUser))
//     },[state.currentUser])

//     return(
//         <AuthContext.Provider value={{currentUser: state.currentUser, dispatch}}>
//             {children}
//         </AuthContext.Provider>
//     );
// };