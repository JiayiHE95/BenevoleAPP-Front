import React, { useEffect, useState } from 'react'
import { authActions } from '../redux/authReducer'
import { useDispatch, useSelector } from 'react-redux'
import userAPI from '../api/userAPI'
import {MdMail, MdKey, MdOutlineCancel} from 'react-icons/md'
import {TbAlertCircle} from 'react-icons/tb'

const LoginCard=({isOpen, newCompte, reset})=>{
  const dispatch = useDispatch();
  const [mail,setMail]=useState()
  const [mdp,setMdp]=useState()
  const [notif,setNotif]=useState()

  useEffect(()=>{ 
    setNotif()
   },[mdp,mail])

  const connexion=()=>{
    const data={
      mail:mail,
      mdp:mdp
    }
    userAPI.connexion(data).then((resp) => {
      //console.log(resp.data)
      if(resp.data.auth){
        localStorage.setItem("auth",JSON.stringify({
         token: resp.data.token,
         user:resp.data.user
        }))
        dispatch(authActions.loginSuccess())
        isOpen(false)
        //window.location.reload()
      } else{
        setNotif(resp.data.message)
      }
    }).catch(error => {
      console.log(error)
    })
  } 

 return(
  <div className='form-wrapper'>
    <div className='form-container'>
      <MdOutlineCancel className='close-icon clickable' onClick={()=>{isOpen(false)}}/>
      <div className='form-title'>Connexion</div>
      <div className='form-inputs'>
        <div className='form-input'>
          <MdMail className='icon'></MdMail>
          <input type='email' required="required" placeholder='mail' onChange={(e)=>{setMail(e.target.value)}}></input>
        </div>
        <div className='form-input'>
          <MdKey className='icon'></MdKey>
          <input type='password' required="required" placeholder='mot de passe' onChange={(e)=>{setMdp(e.target.value)}}></input>
        </div>
      </div>
      {notif && <div className='notif-error'><TbAlertCircle className='error-icon'/><div>{notif}</div></div>}
      <div className='clickable' onClick={()=>{reset(true) ;isOpen(false)}}>Mot de passe oublié</div>
      <div className='clickable' onClick={()=>{newCompte(true) ;isOpen(false)}}>Créer un compte</div>
      <div className='clickable' onClick={()=>connexion()}>Valider</div>
    </div>
  </div>
 )

}
export default LoginCard