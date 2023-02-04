import React, { createContext, useContext, useReducer } from 'react';

const SliderContext = createContext(null);


const initializeState = {
    id : undefined,
    items : [],
    loading : false,
    errors : [],
    succeeded : false,
    currentSlide : 0,
    previousSlide : null
}

const types = {
    SET_LOADING : 'SET_LOADING',
    SET_ITEMS : 'SET_ITEMS',
    SET_ERRORS : 'SET_ERRORS',
    SET_SLIDE : 'SET_SLIDE'
}

const reducer = (state,action)=>{

    switch(action.type){
        case types.SET_LOADING:
            state = {...state,loading : true};
            break;
        case types.SET_ITEMS:
            state = {...state,loading:false,id : action.payload.id , errors : [],succeeded : true,items : action.payload.items};
            break;
        case types.SET_ERRORS:
            state = {...state,loading : false , errors : action.payload.errors,items : [] , succeeded : false};
            break;
        case types.SET_SLIDE:
            state = {...state,currentSlide : action.payload.currentSlide,previousSlide : action.payload.previousSlide};
            break;
        default : 
            throw Error(`an unkownAction to Slider Reducer ${action.type}` )
    }

    return state;

}


function SliderProvider({children}) {

    let [state,dispatch] = useReducer(reducer,initializeState);
    return ( 
        <SliderContext.Provider value={{
            state,dispatch
        }}>
            {children}
        </SliderContext.Provider>
     );
}

const useSliderContext = ()=> {

    let context = useContext(SliderContext);
    if(!context){
        throw Error('useSliderContext must be used inside SliderProvider')
    }

    let {state,dispatch} = context;

    const nextSlide = ()=>{
        dispatch({
            type : types.SET_SLIDE,
            payload : {
                previousSlide : state.currentSlide,
                currentSlide : (state.currentSlide + 1) % state.items.length
            }
        })
    }

    const PreviousSlide = ()=>{
        dispatch({
            type : types.SET_SLIDE,
            payload : {
                previousSlide : state.currentSlide,
                currentSlide : (state.currentSlide + state.items.length - 1) % state.items.length
            }
        })
    }


    return {
        state,
        dispatch,
        nextSlide,
        PreviousSlide
    };
}


export {SliderProvider,useSliderContext,types};