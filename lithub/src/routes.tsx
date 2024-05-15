import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AddProject from './components/addProject';
import EditProject from './components/editProject';
import ApprovalPage from './pages/approval';
import Example from './pages/comWithBackEx';
import Duk from './pages/Duk';
import LoginPage from './pages/Login';
import MainPage from './pages/MainPage/MainPage';
import Profile from './pages/profile';
import Project from './pages/project';
import Projects from './pages/Projects/projects';
import RegisterPage from './pages/Register';
import AdminPage from './pages/Admin'
function loadUserProfile() {
    try {
        const Token = localStorage.getItem('accessToken')
        if(Token!=null) {
            const data = jwtDecode(Token);
            const now = new Date().getTime() / 1000; // Date().getTime() returns milliseconds.
            // So divide by 1000 to get seconds
            if (data.exp!==undefined && now > data.exp) {
                // user profile has expired.
                localStorage.removeItem('accessToken');
            }
        }
    } catch (err) {
        throw err
    }
}

const Main = () => {
    loadUserProfile()
    return (
        <div className="main">
            <Routes>
                <Route path='/' element={<MainPage />} />
                <Route path='/projects' element={<Projects/>}></Route>
                <Route path='/project' element={<Project/>}></Route>
                <Route path='/addProject' element={<AddProject/>}></Route>
                <Route path='/editProject' element={<EditProject/>}></Route>
                <Route path='/example' element={<Example/>}></Route>
                <Route path='/login' element={<LoginPage/>}></Route>
                <Route path='/register' element={<RegisterPage/>}></Route>
                <Route path='/approval-list' element={<ApprovalPage/>}></Route>
                <Route path='/duk' element={<Duk/>}></Route>
                <Route path='/profile/:username' element={<Profile/>}></Route>
                <Route path='/admin-creation' element={<AdminPage/>}></Route>
            </Routes>
        </div>
    );
}

export default Main;