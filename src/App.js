import React, {useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import { useDispatch, useSelector } from 'react-redux'
import { verifyToken } from './redux/authReducer'
import ErrorPage from './pages/ErrorPage'
import SignUp from './components/SignUp'
import Login from './components/Login'
import UserHome from './pages/UserHome'
import PasswordForgot from './components/PasswordForgot'
import { useJwt } from "react-jwt";



function App() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  const isAdmin = useSelector(state => state.auth.isAdmin)
  const dispatch = useDispatch();

  /*
  useEffect(()=>{ 
    console.log("je suis dans app")
      dispatch(verifyToken())
  })*/
  
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
