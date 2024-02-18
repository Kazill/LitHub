import React from 'react';
        import { Routes, Route } from 'react-router-dom';

        import Project from './project';
        import Projects from './projects';
        import Example from './pages/comWithBackEx';

        const Main = () => {
        return (
<Routes>
    <Route path='/' element={<Projects/>}></Route>
<Route path='/project' element={<Project/>}></Route>
<Route path='/projects' element={<Projects/>}></Route>
        <Route path='/example' element={<Example/>}></Route>
        </Routes>
        );
        }
        export default Main;
