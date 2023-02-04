import React from 'react';
import { useLocation } from 'react-router-dom';
import MultiLineList from '../componenets/RowList/MultiLineList';
import { getItemComponent } from '../Utils/functions';

function List({data :{payloadType,payloadKey,items,title,option},showMore,firstRequest}) {
    const location = useLocation();
    console.log('list' , location);
    const itemComponent = getItemComponent(payloadType);
    return ( 
        <div className="list container-fluid">
            <div className="row p-0">
                <MultiLineList data={{
                    payloadType,
                    payloadKey,
                    items,
                    title,
                    option,
                    showMore,
                    pi : items !== undefined ? 1 : 0,
                }} firstRequest={firstRequest} Preview={true} ItemComponent={itemComponent} />
            </div>
        </div>
     );
}

export default List;