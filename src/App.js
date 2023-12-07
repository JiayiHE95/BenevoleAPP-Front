import React, {useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import ErrorPage from './pages/ErrorPage'
import SignUp from './components/SignUp'
import Login from './components/Login'
import UserHome from './pages/UserHome'
import PasswordForgot from './components/PasswordForgot'

const App =()=> {

  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Home/>} />
        <Route path={'/reset-password/:token'} element={<PasswordForgot />} />
        <Route path={'/login'} element={<Login/>} />
        <Route path={'/home/user'} element={<UserHome />} />
        <Route path={'/signup'} element={<SignUp/>} />
        <Route path={'/password-forgot'} element={<PasswordForgot/>} />
        <Route path={"*"} element={<ErrorPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
