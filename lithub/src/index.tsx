import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Projects from './pages/Projects/projects';
import reportWebVitals from './reportWebVitals';
import Nav from "./components/Nav";
import Side from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer"; // Import the Footer component

import Main from './routes';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render((

  <BrowserRouter>
    <div className="containerIndex" style={{display: 'flex', flexDirection: 'column'}}>
      <Nav />
        <div className="content" style={{flexGrow: 1}}>
            <Side/>
            <Main /> {/* The various pages will be displayed by the `Main` component. */}
        </div>
      <Footer />
    </div>
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
