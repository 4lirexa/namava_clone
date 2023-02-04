import React from 'react';
import { useLocation } from 'react-router-dom';
import List from './List';
import Page from './Page';

function Split() {
    const location = useLocation();
    return ( 
        (location['state'] && location['state']['showList'] === true) ? <List {...location['state']}/> : <Page />
     );
}

export default Split;