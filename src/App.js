import React, {useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import ErrorPage from './pages/ErrorPage'
import SignUp from './components/SignUp'
import Login from './components/Login'
import UserHome from './pages/UserHome'
import PasswordForgot from './components/PasswordForgot'
import Planning from './pages/Planning'
import Admin from './pages/admin/Admin'
import Registration from './pages/Registration'
import Infos from './pages/Infos'
import Espace from '../src/pages/Espace'


const App =()=> {

  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Home/>} />
        <Route path={'/login'} element={<Login/>} />
        <Route path={'/signup'} element={<SignUp/>} />
        <Route path={'/password-forgot'} element={<PasswordForgot/>} />
        <Route path={'/reset-password/:token'} element={<PasswordForgot />} />
        <Route path={'/home/user'} element={<UserHome />} />
        <Route path={'/infos'} element={<Infos />} />
        <Route path={'/planning'} element={<Planning />} />
        <Route path={'/registration'} element={<Registration />} />
        <Route path={'/admin'} element={<Admin />} />
        <Route path={"*"} element={<ErrorPage/>} />
        <Route path={'/espaces'} element={<Espace/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
