import React, { useState,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../redux/authReducer'
import userAPI from '../api/userAPI';
import {TbAlertCircle} from 'react-icons/tb'
import {AiOutlineCheckCircle} from 'react-icons/ai'
import {TbAddressBook} from 'react-icons/tb'
import {RxCodesandboxLogo} from 'react-icons/rx'
import {MdMail,MdPerson,MdPersonOutline, MdKey,MdPhone, MdOutlineCancel, MdLocationCity} from 'react-icons/md'

const Profil = ({user, onUpdateUser})=>{
 const [infoReset,setInfoReset]=useState(false)
 const [passwordSucces,setPasswordSucces]=useState(false)
 const [infoSucces,setInfoSucces]=useState(false)
 const [notif, setNotif]=useState(false)
 const [pwnotif, setPwNotif]=useState(false)
 const [oldpwnotif, setOldPwNotif]=useState(false)
 
 const [oldPassword,setOldPassword]=useState(false)
 const [newPassword,setNewPassword]=useState(false)
 const [resetPassword, setResetPassword]=useState()
 const [passwordReset,setPasswordReset]=useState(false)
 
 /*
 const [prenom,setPrenom]=useState()
 const [nom,setNom]=useState()
 const [pseudo,setPseudo]=useState()
 const [mdp,setMdp]=useState()
 const [tel,setTel]=useState()
 const [mail,setMail]=useState()
 const [asociation,setAssociation]=useState()
 const [hebergement,setHebergement]=useState()
 const [taille_tshirt,setTailleT]=useState()
 const [est_vegetarien,setEst_vegetarien]=useState()
 const [jeu_prefere,setJeu_prefere]=useState()*/

 const [prenom,setPrenom]=useState(user.prenom)
 const [nom,setNom]=useState( user.nom)
 const [pseudo,setPseudo]=useState(  user.pseudo)
 const [mdp,setMdp]=useState(   user.mdp)
 const [tel,setTel]=useState( user.tel)
 const [mail,setMail]=useState( user.mail)
 const [association,setAssociation]=useState( user.association)
 const [hebergement,setHebergement]=useState( user.hebergement)
 const [taille_tshirt,setTailleT]=useState(   user.taille_tshirt)
 const [est_vegetarien,setEst_vegetarien]=useState( user.est_vegetarien)
 const [jeu_prefere,setJeu_prefere]=useState( user.jeu_prefere)

 /*
 useEffect(()=>{
  userAPI.getUserById(user.iduser).then((resp)=>{
   if (resp.data.user){

    setUpdatedUser(resp.data.user)
    setNom(resp.data.user.nom)
    setPrenom(resp.data.user.prenom)
    setPseudo(resp.data.user.pseudo)
    setTel(resp.data.user.tel)
    setMail(resp.data.user.mail)
    setAssociation(resp.data.user.association)
    setHebergement(resp.data.user.hebergement)
    setTailleT(resp.data.user.taille_tshirt)
    setEst_vegetarien(resp.data.user.est_vegetarien)
    setJeu_prefere(resp.data.user.jeu_prefere)
    
   }
  })
 },[])*/

 useEffect(()=>{ 
  setNotif(false)
  setPwNotif(false)
  setOldPwNotif(false)
  setPasswordSucces(false)
 },[resetPassword,oldPassword,newPassword])

 const changePassword=()=>{
  if(resetPassword!==newPassword){
   setPwNotif(true)
   return
  }
  let data={
   mdp:oldPassword,
   newPassword:newPassword,
   oldPassword:oldPassword
  }
 for (const key in data) {
   if(data[key]===undefined||data[key]===""){
     setNotif(true)
     return
   }
 }
 data={
  mdp:oldPassword,
  mail:user.mail
 }
 userAPI.checkPassword(data).then((resp)=>{
  data.mdp=newPassword
  if(resp.data.passwordCorrect){
   userAPI.passwordReset(data).then((resp)=>{
    if(resp.data.reset){
     setPasswordSucces(true)
     setPasswordReset(false)
    }
   })
  }else{
   setOldPwNotif(true)
  }
 })
}
const changeInfos=()=>{
 const data={
  pseudo:pseudo,
  nom:nom,
  prenom:prenom,
  tel:tel,
  mail:mail,
  association:association,
  taille_tshirt:taille_tshirt,
  est_vegetarien:est_vegetarien,
  hebergement:hebergement,
  jeu_prefere:jeu_prefere,
  iduser:user.iduser
 }
 /*
  for (const key in data) {
    if(data[key]===undefined||data[key]===""){
      setNotif(true)
      return
    }
  }*/
  userAPI.updateUser(data).then((resp)=>{
    if(resp.data.update){
    setInfoSucces(true)
    setInfoReset(false)
    userAPI.getUserById(user.iduser).then((resp)=>{
      onUpdateUser(resp.data.user)

    })
    }
  })
}

 return(
  user&&
  <div className='personal-data'>
   <div className="text-bold">Informations Personnelles</div>
   {!infoReset && 
   /*<div>
    <div>{user.pseudo}</div>
    <div>{user.nom} {user.prenom}</div>
    <div>{user.mail}</div>
    <div>{user.tel}</div>
    <div>{user.association}</div>
    <div>{user.taille_tshirt}</div>
    <div>{user.est_vegetarien}</div>
    <div>{user.hebergement}</div>
    <div>{user.jeu_prefere}</div>
    <div>{user.role}</div>
   </div>*/
   <div>
  <div>{pseudo}</div>
  <div>{nom} {prenom}</div>
  <div>{mail}</div>
  <div>{tel}</div>
  <div>{association}</div>
  <div>{taille_tshirt}</div>
  <div>{est_vegetarien}</div>
  <div>{hebergement}</div>
  <div>{jeu_prefere}</div>
  <div>{user.role}</div>
</div>
   }
   {!passwordReset&& !infoReset&&<div className='clickable button' onClick={()=>{setPasswordReset(true); setPasswordSucces(false)}}>Changer le mot de passe</div>}
   {!passwordReset&& !infoReset&&<div className='clickable button' onClick={()=>{setInfoReset(true); setInfoSucces(false)}}>Changer les informtions</div>}
   {passwordSucces&&<div className="notif-succes"><AiOutlineCheckCircle className='error-icon'/><div>Changement de mot de passe réussi</div></div>}
   {infoSucces&&<div className="notif-succes"><AiOutlineCheckCircle className='error-icon'/><div>Changement d'informations réussi</div></div>}
  
   {passwordReset&&
   <div className='form-inputs'>
      <label htmlFor="mdp">Ancien mot de Passe:</label>
        <input
          type="password"
          name="mdp"
          onChange={(e)=>{setOldPassword(e.target.value)}}
          required
        />

      <label htmlFor="mdp">Nouveau mot de Passe:</label>
        <input
          type="password"
          name="mdp"
          onChange={(e)=>{setNewPassword(e.target.value)}}
          required
        />

        <label htmlFor="mdp-reset">Resaisir le mot de Passe:</label>
        <input
          type="password"
          name="mdp"
          onChange={(e)=>{setResetPassword(e.target.value)}}
          required
        />

      {notif&& <div className="notif-error"><TbAlertCircle className='error-icon'/>Aucun champs ne peut être vide</div>}
      {pwnotif&& <div className="notif-error"><TbAlertCircle className='error-icon'/>Nouveaux mots de passe non identiques, veuillez resaisir</div>}
      {oldpwnotif&& <div className="notif-error"><TbAlertCircle className='error-icon'/>Mot de passe non correct, veuillez resaisir</div>}
    </div>
   }

   {infoReset&&
    <div className='form-inputs'>
           <label htmlFor="pseudo">Pseudo:</label>
        <input
          type="text"
          id="pseudo"
          name="pseudo"
          placeholder={user.pseudo}
          onChange={(e)=>{setPseudo(e.target.value)}} 
          required
        />

        <label htmlFor="nom">Nom:</label>
        <input
          type="text"
          id="nom"
          name="nom"
          placeholder={user.nom}
          onChange={(e)=>{setNom(e.target.value)}} 
          required
        />

        <label htmlFor="prenom">Prénom:</label>
        <input
          type="text"
          id="prenom"
          name="prenom"
          placeholder={user.prenom}
          onChange={(e)=>{setPrenom(e.target.value)}}
          required
        />

        <label htmlFor="tel">Téléphone:</label>
        <input
          type="tel"
          id="tel"
          name="tel"
          placeholder={user.tel}
          onChange={(e)=>{setTel(e.target.value)}}
          required
        />

        <label htmlFor="mail">Email:</label>
        <input
          type="email"
          id="mail"
          name="mail"
          placeholder={user.mail}
          onChange={(e)=>{setMail(e.target.value)}}
          required
        />

        <label htmlFor="association">Association:</label>
        <input
          type="text"
          id="association"
          name="association"
          placeholder={user.association}
          onChange={(e)=>{setAssociation(e.target.value)}}
        />

        <label htmlFor="taille_tshirt">Taille Tshirt:</label>
        <select
          id="taille_tshirt"
          name="taille_tshirt"
          placeholder={user.taille_tshirt}
          onChange={(e)=>{setTailleT(e.target.value)}}
          required
        >
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>

        <label htmlFor="est_vegetarien">Est Végétarien:</label>
        <input
          type="checkbox"
          id="est_vegetarien"
          name="est_vegetarien"
          placeholder={user.est_vegetarien}
          onChange={(e)=>{setEst_vegetarien(e.target.value)}}
        />

        <label htmlFor="hebergement">Hébergement:</label>
        <input
          type="text"
          id="hebergement"
          name="hebergement"
          placeholder={user.hebergement}
          onChange={(e)=>{setHebergement(e.target.value)}}
        />

        <label htmlFor="jeu_prefere">Jeu Préféré:</label>
        <input
          type="text"
          id="jeu_prefere"
          name="jeu_prefere"
          placeholder={user.jeu_prefere}
          onChange={(e)=>{setJeu_prefere(e.target.value)}}
        />
  </div>
   }
   
  {passwordReset&&<div className='clickable button' onClick={()=>changePassword()}>Comfirmer</div>}
  {passwordReset&&<div className='clickable button' onClick={()=>setPasswordReset(false)}>Annuler</div>}
  {infoReset&&<div className='clickable button' onClick={()=>changeInfos()}>Comfirmer</div>}
  {infoReset&&<div className='clickable button' onClick={()=>setInfoReset(false)}>Annuler</div>}
 
  </div>
 )

}
export default Profil