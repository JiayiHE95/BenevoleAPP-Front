import React, {useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import { useDispatch, useSelector } from 'react-redux'
import { verifyToken } from './redux/authReducer'
import PasswordResetCard from './components/PasswordResetCard'
import ErrorPage from './pages/ErrorPage'

function App() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  const isAdmin = useSelector(state => state.auth.isAdmin)
  const dispatch = useDispatch();

  useEffect(()=>{ 
    dispatch(verifyToken())
  })
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"*"} element={<ErrorPage/>} />
        <Route path={'/'} element={<Home/>} />
        <Route path={'/reset-password/:token'} element={<PasswordResetCard />} />
    
      </Routes>
    </BrowserRouter>
  )
}

export default App;
