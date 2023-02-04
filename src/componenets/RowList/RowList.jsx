import React,{createRef,useEffect, useReducer,useState} from 'react';
import { Link } from 'react-router-dom';
import './RowList.scss';
import Flickity from 'flickity';
import { fetchData } from '../../Utils/functions';
import {RealLazyLoad} from 'real-react-lazyload'
import PreviewItem from '../Movie/Preview';


const ACTION_TYPES = {
    SET_ITEMS : 'SET_ITEMS',
    SET_LOADING : 'SET_LOADING',
    SET_ERROR : 'SET_ERROR',
    FETCH_REQUEST : 'FETCH_REQUEST'
}

const RowListReducer = (state,action)=>{
    switch(action.type){
        case ACTION_TYPES.SET_ITEMS:
            state = {...state, error : false , items : action.items,loading : false,isEmpty : action.isEmpty !== undefined ? action.isEmpty : state['isEmpty']}
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
            throw Error(`an unkownAction to Menus Reducer ${action.type}` );
    }

    return state;
}



const RowList = React.forwardRef(({className,data : {payloadType,payloadKey,title,items : defaultItems} , firstRequest = false , ItemComponent,placeholder = false,Preview = false},ref) => {

    const initialState = {
        items :  defaultItems || [],
        loading : false,
        error : false,
        fetchRequest : firstRequest,
        isEmpty : false
    }

    const [state,dispatch] = useReducer(RowListReducer,initialState,(initState)=>initState);
    const {items , loading,error,isEmpty,fetchRequest} = state;

    // Features Movies
    // const [items,setItems] = useState([]);
    // const [loading,setLoading] = useState(false);
    // const [error,setError] = useState(false)
    // const [fetchRequest,setFetchRequest] = useState(false);
    
    useEffect(()=>{
        
        if((fetchRequest ) && (isEmpty ===false && items.length === 0 && error === false && loading === false) ){
            fetchData(payloadKey,payloadType,(result)=>{ if(result.length === 0){dispatch({type : ACTION_TYPES.SET_ITEMS,items : [],isEmpty : true});return} dispatch({type : ACTION_TYPES.SET_ITEMS,items : result})},(error)=>{dispatch({type: ACTION_TYPES.SET_ERROR,error})},(isLoading)=>{ if(isLoading) dispatch({type : ACTION_TYPES.SET_LOADING, loading : isLoading}) })
        }
    },[payloadKey,payloadType,placeholder,fetchRequest,dispatch,loading,items.length,error])

    // Flicker Config
    const flickityRef = createRef();
    useEffect(()=>{
        let flickityHandler = undefined;
        if(flickityRef.current && flickityRef.current.querySelector('.row')){
            flickityHandler = new Flickity(flickityRef.current.querySelector('.row'),{
                contain: true,
                pageDots : false,
                prevNextButtons : false,
                cellAlign : 'right',
                rightToLeft : true,
                groupCells : true
            })
        }
        return ()=>{
            if(flickityHandler){
                flickityHandler.remove();
            }
        }
    },[flickityRef,items.length])


    const [PreviewState , SetPreviewState] = useState({
        id : undefined,
        active : false
    })

    const TogglePreview = (id)=>{
        SetPreviewState((oldState)=>{
            let newState = {...oldState};
            if(id !== oldState['id']){
                newState['id'] = id;
                newState['active'] = true;
            }else{
                newState['active'] = !oldState['active'];
            }
            return newState;
        })
        
    }

    const getItems = ()=>{
        let content = [];
        if(placeholder || (placeholder === false && items.length === 0)){
            let count = 8;
            if(typeof placeholder === 'number'){
                count = placeholder;
            }
            for (let i = 0; i < count; i++) {
                content.push(<ItemComponent key={`row-item-${payloadType}-${payloadKey}-${i}`} placeholder={true}/>)
            }
        }
        else{
            content = items.map(item => (
            
            <ItemComponent className={((item['id'] || item['episodId']) === PreviewState['id']) && PreviewState['active'] ? 'active' : 'flickity-cell is-selected'} key={`row-item-${payloadType}-${payloadKey}-${item['id'] || item['episodId']}`} item={item}  TogglePreview={TogglePreview}/>
            
            ))}

        return content;
    }

    if(placeholder){
        return(
            <div ref={ref} className="row">
                {getItems()}
            </div>
        )
    }

    const CanIRender = items.length > 0 && error === false && loading === false;
    


    return ( 
        <div ref={ref} className={`row-list col-12 p-0 ${className}`}>
            {state['isEmpty'] !== true && (
                <React.Fragment>
                    {title && (
                        <div className="row-title">
                            <h3>{title}</h3>
                            {state['loading'] === false && (
                                <Link to={"/"} state={{data: {
                                    payloadKey,
                                    payloadType,
                                    items,
                                    title
                                },
                                showMore : true,
                                showList : true}} className="more-link">
                                    <span>مشاهده همه</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="10 0 20 40" className="t-icon-0-1-107">
                                        <path className="svg-c1"  d="M14.77 18.793c0-.493.196-.967.545-1.315l6.2-6.2a1.86 1.86 0 0 1 2.626 2.633l-4.88 4.882 4.88 4.88a1.86 1.86 0 0 1-2.63 2.63l-6.2-6.2c-.347-.348-.54-.82-.54-1.31z" style={{transform: "translateY(2px)"}}></path>
                                    </svg>
                                </Link>
                            )}
                        </div>
                    )}
                    <div className="list-container" ref={flickityRef}>
                        
                        <RealLazyLoad forceVisible={CanIRender} placeholder={
                            <RowList placeholder={true} data={{payloadKey,payloadType}} ItemComponent={ItemComponent}/>
                        } componentEntryCallback={()=>{
                            if(fetchRequest === false && loading === false){
                                dispatch({type : ACTION_TYPES.FETCH_REQUEST})
                            }
                            return false;
                        }}>
                            <div className="row">
                                {(items.length > 0 && loading === false) && (getItems())}
                            </div>
                        </RealLazyLoad>
                            
                        
                    </div>
                    {(Preview === true && CanIRender) && (
                        <PreviewItem id={PreviewState['id']} isActive={PreviewState.active}/>
                    ) }
                </React.Fragment>
            )}
        </div>
     );
})

export default RowList;