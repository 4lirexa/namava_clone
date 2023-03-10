import React, { useState } from 'react';
import SearchBox from '../componenets/Search/SearchBox';
import { FilterProvider } from '../context/FilterContext';
import { useMenusContext } from '../context/MenuContext';
import './Search.scss'
import MultiLineList from '../componenets/RowList/MultiLineList';
import MovieItem from '../componenets/Movie/MovieItem';

function Search() {
    let {state:menus} = useMenusContext();
    let [state,setState] = useState({
        items : [],
        loading : false,
        error : false,
        options : null,
        page : undefined,
        total : undefined
    })
    console.log('search',state);
    return ( 
        <div className="search container-fluid">
            <div className="row p-0">
                {menus['data'] != null && menus['loading'] === false && (
                    <FilterProvider>
                        <SearchBox onSearchItems={setState}/>
                    </FilterProvider>
                )}
            </div>
            <div className="row p-0 mt-3">
                {state['loading'] === false && state['items'].length > 0 && (
                    <MultiLineList data={{
                        payloadType : "SearchAdvanced",
                        payloadKey : 0,
                        items : state['items'],
                        showMore : true,
                        key : 'id',
                        page : state['page'],
                        options : state['params'],
                    }} Preview={true} firstRequest={false} ItemComponent={MovieItem} />
                )}
            </div>
        </div>
     );
}

export default Search;