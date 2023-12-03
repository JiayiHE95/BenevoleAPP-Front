import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import userAPI from '../api/userAPI'
import {useNavigate} from 'react-router-dom'
import {MdMail,MdPerson,MdPersonOutline, MdKey,MdPhone, MdOutlineCancel, MdLocationCity} from 'react-icons/md'
import {TbAlertCircle} from 'react-icons/tb'

const PasswordResetCard=({isOpen})=>{

  const [user,setUser]=useState()
  const [mail,setMail]=useState()
  const [mdp,setMdp]=useState("")
  const [isValide,setIsValide]=useState(false)
  const [resetPassword, setResetPassword]=useState()
  const [notif, setNotif]=useState(false)
  const [mailNotif, setMailNotif]=useState()
  const [succesNotif, setSuccesNotif]=useState(false)
  const [passwordNotif, setPasswordNotif]=useState(false)
  const navigate=useNavigate()
  const { token } = useParams();
  
  useEffect(()=>{ 
    if (token !==undefined){
      console.log(token)
      userAPI.checkToken({
        headers:{"pw-token":token}
      }).then((resp)=>{

        setIsValide(resp.data.auth)
        if(resp.data.auth){
          console.log("dgusygdu")
          userAPI.getUserByPWToken(token).then((resp)=>{
            console.log(resp.data[0])
            setUser(resp.data[0])
          })
        }
      })
    }
  },[])

  useEffect(()=>{
    resetPassword!==mdp? setPasswordNotif(true) : setPasswordNotif(false)
  }
  ,[resetPassword,mdp])

  const passwordForgot=()=>{
    const data={mail:mail}
    userAPI.passwordForgot(data).then((resp) => {
      //TODO change icone de error /valide
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

  return(
    token ? (
      isValide && user ?
      <div className="site-container">
       <div className='form-wrapper'>
        <div className='form-container'>
          <div className='form-title'>Nouveau mot de passe</div>
          <div className='passwordreset-mail'>  
               <div>{user.mail}</div>
          </div>
          <div className='form-inputs'>
            <div className='form-input'>
               <MdKey className='icon'></MdKey>
              <input type='password' placeholder='Nouveau mot de passe' onChange={(e)=>{setMdp(e.target.value)}}></input>
            </div>
            <div className='form-input'>
               <MdKey className='icon'></MdKey>
              <input type='password' placeholder='Resaisir le mot de passe' onChange={(e)=>{setResetPassword(e.target.value)}}></input>
            </div>
          </div>
            {passwordNotif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Mots de passe non identiques</div></div>}
            {notif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Aucun champs ne peut être vide</div></div>}
            {mailNotif &&<div className='notif-error'>{mailNotif}</div>}
            {!succesNotif && <div className='clickable' onClick={()=>passwordReset()}> Valider</div>}
            <div className='clickable' onClick={()=>{navigate("/")}}>Retourner à la page d'accueil</div>
        </div>
      </div>
         </div>
      :
      <div className="site-container">
        <div className='passwordreset-token'>
          <div>Token expiré, veuillez refaire une demande d'initialisation du mot de passe</div>
          <div className='clickable' onClick={()=>{navigate("/")}}>Retourner à la page d'accueil</div>
        </div>
      </div>
    )
    :
    <div className='form-wrapper'>
      <div className='form-container'>
        <MdOutlineCancel className='close-icon clickable' onClick={()=>{isOpen(false)}}/>
        <div className='form-title'>Mot de passe oublié</div>
        <div className='form-inputs'>
          <div className='form-input'>
            <MdMail className='icon'></MdMail> 
            <input type='text' placeholder='Mail' onChange={(e)=>{setMail(e.target.value)}}></input>
          </div>
        </div>
        {mailNotif&&<div className='notif-error'>{mailNotif}</div>}
        {!succesNotif && <div className='clickable' onClick={()=>passwordForgot()}> Valider</div>}
      </div>
    </div>
    
  )

}
export default PasswordResetCard