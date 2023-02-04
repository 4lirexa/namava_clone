import React, { createContext, useContext, useReducer } from 'react';

const MenuContext = createContext(null);


const initializeState = {
    data : null,
    home : null,
    loading : false,
    errors : [],
    succeeded : false,
}

const types = {
    SET_LOADING : 'SET_LOADING',
    SET_DATA : 'SET_DATA',
    SET_ERRORS : 'SET_ERRORS',
}

const reducer = (state,action)=>{

    switch(action.type){
        case types.SET_LOADING:
            state = {...state,loading : true};
            break;
        case types.SET_DATA:
            state = {...state,loading:false, errors : [],succeeded : true,data : action.data,home : action.home};
            break;
        case types.SET_ERRORS:
            state = {...state,loading : false , errors : action.payload.errors,data : null,home: null , succeeded : false};
            break;
        default : 
            throw Error(`an unkownAction to Menus Reducer ${action.type}` )
    }

    return state;

}


function MenusProvider({children}) {

    let [state,dispatch] = useReducer(reducer,initializeState);
    return ( 
        <MenuContext.Provider value={{
            state,dispatch
        }}>
            {children}
        </MenuContext.Provider>
     );
}

const useMenusContext = ()=> {

    let context = useContext(MenuContext);
    if(!context){
        throw Error('useMenusContext must be used inside MenusProvider')
    }

    let {state,dispatch} = context;


    return {
        state,
        dispatch
    };
}


export {MenusProvider,useMenusContext,types};