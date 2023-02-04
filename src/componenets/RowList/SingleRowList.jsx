import React,{useState} from 'react';
import PreviewItem from '../Movie/Preview';
import './SingleRowList.scss'
import {RealLazyLoad} from 'real-react-lazyload'

const SingleRowList = React.forwardRef(({className,data : {payloadType,payloadKey,items,key,slug},showMore = false,showMoreCallback , ItemComponent,placeholder = false,Preview = false},ref) => {


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
                content.push(<ItemComponent key={`single-row-item-${payloadType}-${payloadKey}-${i}`} placeholder={true}/>)
            }
        }
        else{
            content = items.map(item => (
            
            <ItemComponent className={((item[key]) === PreviewState['id']) && PreviewState['active'] ? 'active' : 'flickity-cellx is-selected'} key={`row-item-${payloadType}-${payloadKey}-${item[key]}-${item[slug]}`} item={item}  TogglePreview={TogglePreview}/>
            
            ))}
        
        if(showMore === true){
            content.push(
                <RealLazyLoad key={`showMore-real-lazy-load`} placeholder={
                    <div key={`single-row-item-${payloadType}-${payloadKey}-placeholder`}>
                        <ItemComponent placeholder={true}/>
                    </div>
                } componentEntryCallback={()=>{
                    if(typeof showMoreCallback === "function"){
                        showMoreCallback();
                    }
                    return true;
                }}>
                    <div key={`single-row-item-${payloadType}-${payloadKey}-placeholder`}>
                        <ItemComponent placeholder={true}/>
                    </div>
                </RealLazyLoad>
            )
        }
        return content;
    }



    const CanIRender = items.length > 0;
    


    return ( 
        <div ref={ref} className={`single-row col-12 p-0 ${className}`}>
            
            {(CanIRender && ItemComponent !== undefined) && (
                <div className="list-container" >
                        <div className="row">
                            {(getItems())}
                        </div>
                </div>
            )}
            {(Preview === true && CanIRender) && (
                <PreviewItem id={PreviewState['id']} isActive={PreviewState.active}/>
            ) }
        </div>
     );
})

export default SingleRowList;