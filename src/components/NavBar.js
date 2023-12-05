import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { verifyToken } from '../redux/authReducer'
import { authActions } from '../redux/authReducer'
import Login from './Login'
import SignUp from './SignUp'
import PasswordResetCard from './PasswordForgot'
import {FaBars} from 'react-icons/fa'

const NavBar =()=>{
 const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
 const user = useSelector(state => state.auth.user)
 const navigate=useNavigate()
 //const [isOpenedDropdown, setIsOpenedDropdown] = useState(false)
 const dispatch = useDispatch();
 //let imagePath = window.location.origin+"/picture/";
 
 useEffect(()=>{ 
  dispatch(verifyToken())
 },[])

 return(
  <div className='navbar-container'>
   <div className='logo clickable' onClick={()=>{navigate("/")}}>
      <div className='logo-name'>Benevole APP</div>
   </div>
   {isLoggedIn && user ?
    <div className='navbar'>
      <div>test</div>
      <div className='clickable' onClick={()=>{navigate("/about")}}>About</div>
      {(user.isAdmin ===1 || user.isAdmin ===true) &&
      <div className='clickable' onClick={()=>{navigate("/home/admin")}}>Admin</div>}
      <div className='clickable' onClick={()=>{navigate("/planning")}}>Planning</div>
      <div className='clickable' onClick={()=>{navigate(`/home/user/${user.iduser}`)}}>{user.pseudo}</div>
      <div className='clickable' onClick={()=>dispatch(authActions.logout())}>Déconnexion</div>
    </div>
    :
    <div className='navbar'>
      <div className='clickable' onClick={()=>{navigate("/about")}}>About</div>
      <div className='clickable' onClick={()=>{navigate("/planning")}}>Planning</div>
    </div>
   } 

  {isLoggedIn && user ?
  /*
    <div className={isOpenedDropdown ? 'dropdown-navbar-open':'dropdown-navbar'}>
      <div className='clickable' onClick={()=>{navigate("/about")}}>About</div>
      {(user.role ==="ADMIN") &&
      <div className='clickable' onClick={()=>{navigate("/home/admin")}}>Admin</div>}
      <div className='clickable' onClick={()=>{navigate("/planning")}}>Planning</div>
      <div className='clickable' onClick={()=>{navigate(`/home/user/${user.idUser}`)}}>{user.pseudo}</div>
      <div className='clickable' onClick={()=>{dispatch(authActions.logout());setIsOpenedDropdown(!isOpenedDropdown)}}>Déconnexion</div>
    </div>
    :
    <div className={isOpenedDropdown ? 'dropdown-navbar-open':'dropdown-navbar'} >
      <div className='clickable' onClick={()=>{navigate("/about")}}>About</div>
      <div className='clickable' onClick={()=>{navigate("/planning")}}>Planning</div>
    </div>*/
    <div>test test</div>:<div>test test</div>
   }  
   </div>
   )
}
export default NavBar