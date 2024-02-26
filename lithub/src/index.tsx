import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Projects from './projects';
import reportWebVitals from './reportWebVitals';
import Nav from "./components/Nav";

import Main from './routes';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render((

<BrowserRouter>
    <Nav/>
  <Main /> {/* The various pages will be displayed by the `Main` component. */}
</BrowserRouter>
        ), document.getElementById('root')
        );

//const root = ReactDOM.createRoot(
  //document.getElementById('root') as HTMLElement
//);
//root.render(
  //<React.StrictMode>
    //<Projects />
    //<Main />
  //</React.StrictMode>
//);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
