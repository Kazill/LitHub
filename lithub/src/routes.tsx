import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Projects from './projects';
import Project from './project';
import MainPage from './MainPage';
import EditProject from './editProject';
import AddProject from './addProject';
import Example from './pages/comWithBackEx';
import LoginPage from './pages/Login'

const Main = () => {
    return (
        <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/projects' element={<Projects/>}></Route>
            <Route path='/project' element={<Project/>}></Route>
            <Route path='/addProject' element={<AddProject/>}></Route>
            <Route path='/editProject' element={<EditProject/>}></Route>
            <Route path='/example' element={<Example/>}></Route>
            <Route path='/login' element={<LoginPage/>}></Route>
        </Routes>
    );
}

export default Main;