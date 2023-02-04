import React from 'react';
// npm install react-router-dom
import { BrowserRouter as Router, Route, Routes, useParams, } from 'react-router-dom';
import Provider from './Utils/Provider';
import './style.scss'
import 'flickity/dist/flickity.min.css'
import Single from './pages/Single';
import Split from './pages/Split';
import Collection from './pages/Collection';
import Person from './pages/Person';
import TopMenu from './componenets/TopMenu';
import OtherRoutes from './Utils/OtherRoutes';
import Search from './pages/Search';
function App() {
    
    return (
            <Provider>
                <div className='container-fluid'>
                    <Router>
                        <div className='row p-0'>
                            <TopMenu/>
                        </div>
                    
                        <div className='row p-0'>
                                <div>
                                
                                    <Routes>
                                        <Route exact path="/" element={<Split/>} />
                                        <Route path={'/:type/:id'} exact element={<ValidateSinglePage/>} />
                                        <Route path={'/collection-:id'} exact element={<ValidateCollectionPage/>} />
                                        <Route path={'/person-:id'} exact element={<ValidatePersonPage/>} />
                                        <Route path={'/search'} exact element={<Search/>} />
                                        <Route path={'*'} exact element={<OtherRoutes/>} />
                                    </Routes>

                                </div>
                        </div>
                    </Router>
                </div>
            </Provider>
    );
}


export default App;

// :id([0-9]+):name
const ValidateSinglePage = ()=>{
    const params = useParams();
    // const PageIdAndNameUrl = params.id.match(/\d+/)
    const Title = params.id.split('-')
    if(Title[0] && Title[1]){
        return <Single id={Title[0]} title={Title[1]}/>
    }else{
        throw Error('Params not found')
    }
}

const ValidateCollectionPage = ()=>{
    const params = useParams();
    // const PageIdAndNameUrl = params.id.match(/\d+/)
    const Title = params.id.split('-')
    if(Title[0] && Title[1]){
        return <Collection id={Title[0]} title={Title[1]}/>
    }else{
        throw Error('Params not found')
    }
}

const ValidatePersonPage = ()=>{
    const params = useParams();
    // const PageIdAndNameUrl = params.id.match(/\d+/)
    const Title = params.id.split('-')
    if(Title[0] && Title[1]){
        return <Person id={Title[0]} title={Title[1]}/>
    }else{
        throw Error('Params not found')
    }
}