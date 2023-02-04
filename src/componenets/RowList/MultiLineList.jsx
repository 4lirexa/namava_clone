import React,{useEffect, useReducer} from 'react';
import { fetchData } from '../../Utils/functions';
import './MultiLineList.scss'
import SingleRowList from './SingleRowList';
import {RealLazyLoad} from 'real-react-lazyload';
import config from '../../config';

const ACTION_TYPES = {
    SET_ITEMS : 'SET_ITEMS',
    SET_LOADING : 'SET_LOADING',
    SET_ERROR : 'SET_ERROR',
    FETCH_REQUEST : 'FETCH_REQUEST',
    SET_ITEMS_AND_ITEMSPROPS : "SET_ITEMS_AND_ITEMSPROPS"
}

const MultiLineListReducer = (state,action)=>{
    switch(action.type){
        case ACTION_TYPES.SET_ITEMS:
            state = {
                ...state, error : false ,
                 items : action.items,
                 loading : false,
                 pi : action.pi !== undefined ? action.pi : state['pi'],
                 page : action.page !== undefined ? action.page : state['page'],
                 showMore: action.showMore !== undefined ? action.showMore : state['showMore'],
                 fetchRequest: action.fetchRequest !== undefined ? action.fetchRequest : state['fetchRequest']
                }
            break;
        case ACTION_TYPES.SET_ITEMS_AND_ITEMSPROPS:
            state = {...state, error : false , items : action.items,loading : false,itemsProps : action.itemsProps}
            break;
        case ACTION_TYPES.SET_LOADING:
            state = {...state,loading : true}
            break;
        case ACTION_TYPES.SET_ERROR:
            state = {...state,items : [] , error : action.error,loading : false}
            break;
        case ACTION_TYPES.FETCH_REQUEST :
            state = {...state, fetchRequest : true}
            break;
        default:
            throw Error(`an unkown Action to MultiLineList Reducer ${action.type}` );
    }

    return state;
}



const MultiLineList = React.forwardRef(({className,data : {payloadType,payloadKey,title,items : defaultItems,showMore = false,pi,page,key = "id",maxItems,slug,options= {},preRow = 8},firstRequest = false , ItemComponent,placeholder = false,Preview = false},ref) => {

    const initialState = {
        items :  defaultItems || [],
        loading : false,
        error : false,
        showMore : showMore,
        pi : pi,
        page : page,
        fetchRequest : firstRequest,
        itemsProps : defaultItems ? payloadKey : false,
    }

    const [state,dispatch] = useReducer(MultiLineListReducer,initialState,(initState)=>initState);
    const {items , loading,error,fetchRequest} = state;

    useEffect(()=>{
        
        if((fetchRequest) && (items.length === 0 && error === false && loading === false) ){
            fetchNextData(state['pi'] !== undefined ? state['pi'] + 1 : undefined,state['page'] !== undefined ? state['page'] + 1 : undefined)
        }else if(state['itemsProps'] !== false && state['itemsProps'] !== payloadKey){
            dispatch({type : ACTION_TYPES.SET_ITEMS_AND_ITEMSPROPS,items : defaultItems , itemsProps : payloadKey})
        }
    },[payloadKey,payloadType,placeholder,fetchRequest,dispatch,loading,items.length,error])


    const fetchNextData = (pi = undefined,page = undefined)=>{

        const fetchDataOptions = {...options,pi};
        if(page !== undefined){
            fetchDataOptions['page'] = page;
        }

        let ps = 10;
        const section = config.sections[payloadType];
        if(section && (section['ps'] !== undefined || section['Count'] !== undefined)){
            ps = section['ps'] || section['Count'];
        }

        fetchData(payloadKey,payloadType,
            (result)=>{ 
                let resultItems;
                if(state['page'] !== undefined){
                    resultItems = result['result_items'][0]['items'];
                }else{
                    resultItems = result;
                }
                dispatch(
                    {
                        type : ACTION_TYPES.SET_ITEMS,
                        items : [...state['items'] , ...resultItems],
                        pi : pi,
                        page : page,
                        showMore : ( resultItems && resultItems.length >= ps) ? state['showMore'] : false,
                        fetchRequest : ( resultItems && resultItems.length >= ps) ? state['fetchRequest'] : false,
                    }
                    )
                },
            (error)=>{
                dispatch(
                    {
                        type: ACTION_TYPES.SET_ERROR,error
                    }
                    )
                },
            (isLoading)=>{
                if(isLoading)
                    dispatch(
                        {
                            type : ACTION_TYPES.SET_LOADING,
                            loading : isLoading
                        }
                    ) },fetchDataOptions)
    }


    const getRows = ()=>{
        
        let rows = [];
        let row = 0 ;
        let rowItems = [];
        let max = items.length;
        let z = 0;
        if(maxItems != null && maxItems < max){
            max = maxItems;
        }

        for (let i = 0; i < max; i++) {
            rowItems[z++] = items[i];
            if(z === preRow || i + 1 === max){
                rows.push(<SingleRowList showMoreCallback={()=>{
                    if(state['showMore'] === true){
                        fetchNextData(state['pi'] !== undefined ? state['pi'] + 1 : undefined,state['page'] !== undefined ? state['page'] + 1 : undefined);
                    }
                }} showMore={i + 1 === max ? state['showMore'] : false} key={`single-row-${payloadType}-${payloadKey}-${key}-${i}`} data={{
                    payloadType,
                    payloadKey,
                    items : rowItems,
                    key,
                    slug
                }} Preview={Preview} ItemComponent={ItemComponent} placeholder={false}/>);
                z = 0;
                rowItems = [];
            }
            
        }

        return rows;


    }



    const CanIRender = items.length > 0 && error === false;
    


    return ( 
        <div ref={ref} className={`multi-list col-12 p-0 ${className}`}>
            {title && (
                <div className="multi-title">
                    <h3>{title}</h3>
                </div>
            )}
            
            {CanIRender && (
                getRows()
            ) }
            
        </div>
     );
})

export default MultiLineList;