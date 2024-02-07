import React, {useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route, Navigate, useNavigate, Outlet} from 'react-router-dom'
import { useJwt } from "react-jwt";

const AuthProvider = () => {

    const token = localStorage.getItem('accessToken');
    const { decodedToken,isExpired } = useJwt(token?token:"");
    const navigate = useNavigate();

    useEffect(() => {


        if (!token || isExpired) {

          navigate('/login');
        }

    }, [])

    return (
        <>
            <Outlet/>
        </>
    )

}


export default AuthProvider