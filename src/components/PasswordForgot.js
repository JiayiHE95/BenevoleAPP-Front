import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import userAPI from '../api/userAPI'
import {useNavigate} from 'react-router-dom'
import {MdMail,MdPerson,MdPersonOutline, MdKey,MdPhone, MdOutlineCancel, MdLocationCity, MdHeight} from 'react-icons/md'
import {TbAlertCircle} from 'react-icons/tb'

const PasswordForgot=({isOpen})=>{

  const [user,setUser]=useState()
  const [mail,setMail]=useState()
  const [mdp,setMdp]=useState("")
  const [isValide,setIsValide]=useState(false)
  const [resetPassword, setResetPassword]=useState()
  const [emptyNotif, setEmptyNotif]=useState(false)
  const [mailNotif, setMailNotif]=useState()
  const [succesNotif, setSuccesNotif]=useState(false)
  const [passwordNotif, setPasswordNotif]=useState(false)
  const navigate=useNavigate()
  const { token } = useParams();
  
  useEffect(()=>{ 
    if (token !==undefined){
      userAPI.checkToken({
        headers:{"pw-token":token}
      }).then((resp)=>{
        setIsValide(resp.data.auth)
        if(resp.data.auth){
          userAPI.getUserByPWToken(token).then((resp)=>{
            setUser(resp.data[0])
          })
        }
      })
    }
  },[])

  useEffect(()=>{
    resetPassword!==mdp? setPasswordNotif(true) : setPasswordNotif(false)
    setEmptyNotif(false)
  }
  ,[resetPassword,mdp])

  useEffect(()=>{
    setEmptyNotif(false)
  }
  ,[mail])

  const passwordForgot=()=>{
    if (mail===undefined) {
      setEmptyNotif(true)
      return
    }
    const data={mail:mail}
    userAPI.passwordForgot(data).then((resp) => {
      setMailNotif(resp.data.message)
      if(resp.data.reset){
        setSuccesNotif(true)
      }

    })
  }

  const passwordReset=()=>{
    if (resetPassword!==mdp || mdp==="" || user ===undefined) {return}
    const data={mdp:mdp, mail:user.mail}
    userAPI.passwordReset(data).then((resp) => {
      setMailNotif(resp.data.message)
      if(resp.data.reset){
        setSuccesNotif(true)
      }
    })
  }

  return (
    token ? (
      isValide && user ?
      <div className="site-container">
        <div className='form-wrapper'>
          <div className='form-container password-reset'>
            <div className='form-title' style={{color:'black'}}>Nouveau mot de passe</div>
            <div className='passwordreset-mail'>
              <div style={{color:'black'}}>{user.mail}</div>
            </div>
            <div className='form-inputs'>
              <label style={{color:'black'}} htmlFor="password" className='label'>Mot de passe :</label>
              <input
              style={{color:'black'}}
                type="password"
                id="password"
                name="password"
                className='input-field'
                onChange={(e) => { setMdp(e.target.value) }}
                required
              />
              <label style={{color:'black'}} htmlFor="password" className='label'>Resaisir le mot de passe :</label>
              <input
              style={{color:'black'}}
                type="password"
                id="password"
                name="password"
                className='input-field'
                onChange={(e) => { setResetPassword(e.target.value) }}
                required
              />
            </div>
            {passwordNotif && <div className='notif-error'><TbAlertCircle className='error-icon' /><div>Mots de passe non identiques</div></div>}
            {emptyNotif && <div className='notif-error'><TbAlertCircle className='error-icon' /><div>Aucun champ ne peut être vide</div></div>}
            {mailNotif && <div className='notif-error'>{mailNotif}</div>}
            {!succesNotif && <div className='clickable submit-button' onClick={() => passwordReset()}> Valider</div>}
            <div className='clickable' onClick={() => { navigate("/") }}>Retourner à la page d'accueil</div>
          </div>
        </div>
      </div>
      :
      <div className="" >
        <div  style={{height:"100vh"}} className='form-container passwordreset-token'>
          <div className='form-title'>Mot de passe oublié</div>
          <div>Token expiré, veuillez refaire une demande d'initialisation du mot de passe</div>
          <div className='clickable' onClick={() => { navigate("/") }}>Retourner à la page d'accueil</div>
        </div>
      </div>
    )
    :
    <div className='form-wrapper'>
      <div className='form-container password-forgot'>
        <div className='form-title'>Mot de passe oublié</div>
        <div className='form-inputs'>
          <label htmlFor="mail" className='label'>Saisir le mail :</label>
          <input
            type="email"
            id="mail"
            name="mail"
            className='input-field'
            onChange={(e) => { setMail(e.target.value) }}
            required
          />
        </div>
        {emptyNotif && <div className='notif-error'><TbAlertCircle className='error-icon' /><div>Aucun champ ne peut être vide</div></div>}
        {mailNotif && <div className='notif-error'>{mailNotif}</div>}
        {!succesNotif && <div className='clickable submit-button' onClick={() => passwordForgot()}> Valider</div>}
        <div className='clickable' onClick={() => { navigate("/") }}>Retourner à la page d'accueil</div>
      </div>
    </div>
  )
  

}
export default PasswordForgot