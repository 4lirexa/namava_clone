import React from 'react';
// import { createRoot } from 'react-dom/client';
import App from './App';
import ReactDOM from 'react-dom'

// const container = document.querySelector('#root');
// const root = createRoot(container);

const rootNode = document.getElementById('root');
ReactDOM.render(<App />, rootNode);

// root.render(<App />)
