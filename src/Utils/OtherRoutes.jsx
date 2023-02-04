import React from 'react';
import { useMenusContext } from '../context/MenuContext';
import { Routes,Route } from 'react-router-dom';
import Page from '../pages/Page';


function OtherRoutes() {
    let {state:menus} = useMenusContext();

    return ( 
        <div>
            <Routes>
                {menus['loading'] === false && menus['data'] !== null && menus['data'].map(menuItem=>{
                    if(menuItem['slug'] == null || menuItem['pageItems'].length === 0){
                        return
                    }
                    return <Route path={`/${menuItem['slug']}`} exact element={<Page/>} />
                })}
            </Routes>
        </div>
     );
}

export default OtherRoutes;