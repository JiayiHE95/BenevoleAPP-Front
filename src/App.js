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
import NewFestival from './pages/admin/NewFestival'
import FestivalPage from './pages/FestivalPage'; 
import Referent from './pages/admin/Referent'
import NotificationPage from './pages/NotificationPage'


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
        <Route path={'/infos/:festivalId'} element={<Infos />} />
        <Route path={'/planning/:festivalId'} element={<Planning />} />
        <Route path={'/registration/:festivalId'} element={<Registration />} />
        <Route path={'/referents/:festivalId'} element={<Referent />} />
        <Route path={'/notification/:festivalId'} element={<NotificationPage />} />
        <Route path={'/admin'} element={<Admin />} />
        <Route path={'/jeux-espaces/:festivalId'} element={<Espace/>} />
        <Route path={'/new-festival'} element={<NewFestival/>} />
        <Route path={"*"} element={<ErrorPage/>} />
        <Route path="/festival/:festivalId" element={<FestivalPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
