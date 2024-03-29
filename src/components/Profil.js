import React, { useState,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../redux/authReducer'
import userAPI from '../api/userAPI';
import {TbAlertCircle} from 'react-icons/tb'
import {AiOutlineCheckCircle} from 'react-icons/ai'
import {TbAddressBook} from 'react-icons/tb'
import {RxCodesandboxLogo} from 'react-icons/rx'
import {MdMail,MdPerson,MdPersonOutline, MdKey,MdPhone, MdOutlineCancel, MdLocationCity} from 'react-icons/md'

const Profil = ({user, onUpdateUser, showRightSide})=>{
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
 
 const [prenom,setPrenom]=useState(user.prenom)
 const [nom,setNom]=useState( user.nom)
 const [pseudo,setPseudo]=useState(  user.pseudo)
 const [tel,setTel]=useState( user.tel)
 const [mail,setMail]=useState( user.mail)
 const [association,setAssociation]=useState( user.association)
 const [hebergement,setHebergement]=useState( user.hebergement)
 const [taille_tshirt,setTailleT]=useState(   user.taille_tshirt)
 const [est_vegetarien,setEst_vegetarien]=useState( user.est_vegetarien)
 const [jeu_prefere,setJeu_prefere]=useState( user.jeu_prefere)


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

const hiddleMotif=()=>{
  setNotif(false)
  setPwNotif(false)
  setOldPwNotif(false)
  setPasswordSucces(false)
  setInfoSucces(false)
}

 return(
  user&&
  <div className='personal-data'>
   <div className="bold">Informations Personnelles</div>
   {!infoReset && !passwordReset&&
   <div className='personal-data-main'>
    <div>{nom} {prenom} ({pseudo})</div>
    <div>{mail}</div>
    <div>{tel}</div>
    {association&&<div>Mon association : {association}</div>}
    <div>Taille T-shirt : {taille_tshirt}</div>
    <div>{est_vegetarien===true? "Végétarien":"Non végétarien"}</div>
    {hebergement&&<div>{hebergement}</div>}
    {jeu_prefere&&<div>{jeu_prefere}</div>}
    <div>{user.role==="BENEVOLE"? "Bénévole":"Admin"}</div>
 </div>
   }

  {passwordSucces&&<div className="notif-succes"><AiOutlineCheckCircle className='error-icon'/><div>Changement de mot de passe réussi</div></div>}
  {infoSucces&&<div className="notif-succes"><AiOutlineCheckCircle className='error-icon'/><div>Changement d'informations réussi</div></div>}
   {!passwordReset&& !infoReset&&
   <div className='boutons'>
     <div className='cursor bouton2' onClick={()=>{setPasswordReset(true); setPasswordSucces(false); hiddleMotif()}}>Changer le mot de passe</div>
     <div className='cursor bouton2' onClick={()=>{setInfoReset(true); setInfoSucces(false); hiddleMotif()}}>Changer les informations</div>
   </div>
   }
  
   {passwordReset&&
   <div className="signup-form-containers">
    <div className='labels'>
      <label htmlFor="mdp">Ancien mot de passe:</label>
      <label htmlFor="mdp">Nouveau mot de passe:</label>
      <label htmlFor="mdp-reset">Resaisir le mot de passe:</label>
    </div>
    <div className='inputs'>
        <input
          type="password"
          name="mdp"
          className="signup-input-fields"
          onChange={(e)=>{setOldPassword(e.target.value)}}
          required
        />

        <input
          type="password"
          name="mdp"
          className="signup-input-fields"
          onChange={(e)=>{setNewPassword(e.target.value)}}
          required
        />

        <input
          type="password"
          name="mdp"
          className="signup-input-fields"
          onChange={(e)=>{setResetPassword(e.target.value)}}
          required
        />
    </div>
    </div>
   }
   {notif&& <div className="notif-error"><TbAlertCircle className='error-icon'/>Aucun champs ne peut être vide</div>}
   {pwnotif&& <div className="notif-error"><TbAlertCircle className='error-icon'/>Nouveaux mots de passe non identiques, veuillez resaisir</div>}
   {oldpwnotif&& <div className="notif-error"><TbAlertCircle className='error-icon'/>Mot de passe non correct, veuillez resaisir</div>}

   {infoReset&&
    <div className="signup-form-containers">
       <div className='labels'>
          <label htmlFor="pseudo">Pseudo:</label>
          <label htmlFor="nom">Nom:</label>
          <label htmlFor="prenom">Prénom:</label>
          <label htmlFor="tel">Téléphone:</label>
          <label htmlFor="mail">Email:</label>
          <label htmlFor="association">Association:</label>
          <label htmlFor="taille_tshirt">Taille Tshirt:</label>
          <label htmlFor="est_vegetarien">Est Végétarien:</label>
          <label htmlFor="hebergement">Hébergement:</label>
          <label htmlFor="jeu_prefere">Jeu Préféré:</label>
       </div>
        <div className='inputs'>
        <input
          type="text"
          id="pseudo"
          name="pseudo"
          className="signup-input-fields"
          value={pseudo}
          onChange={(e)=>{setPseudo(e.target.value)}} 
          required
        />

        <input
          type="text"
          id="nom"
          name="nom"
          className="signup-input-fields"
          value={nom}
          onChange={(e)=>{setNom(e.target.value)}} 
          required
        />

        <input
          type="text"
          id="prenom"
          name="prenom"
          className="signup-input-fields"
          value={prenom}
          onChange={(e)=>{setPrenom(e.target.value)}}
          required
        />

        <input
          type="tel"
          id="tel"
          name="tel"
          className="signup-input-fields"
          value={tel}
          onChange={(e)=>{setTel(e.target.value)}}
          required
        />

        <input
          type="email"
          id="mail"
          name="mail"
          className="signup-input-fields"
          value={mail}
          onChange={(e)=>{setMail(e.target.value)}}
          required
        />

        
        <input
          type="text"
          id="association"
          name="association"
          className="signup-input-fields"
          value={association}
          onChange={(e)=>{setAssociation(e.target.value)}}
        />

        
        <select
          id="taille_tshirt"
          name="taille_tshirt"
          className="signup-input-fields"
          value={taille_tshirt}
          onChange={(e)=>{setTailleT(e.target.value)}}
          required
        >
          <option value="XS" selected={user.taille_tshirt==="XS"}>XS</option>
          <option value="S" selected={user.taille_tshirt==="S"}>S</option>
          <option value="M" selected={user.taille_tshirt==="M"}>M</option>
          <option value="L" selected={user.taille_tshirt==="L"}>L</option>
          <option value="XL" selected={user.taille_tshirt==="XL"}>XL</option>
          <option value="XXL" selected={user.taille_tshirt==="XXL"}>XXL</option>
        </select>

        
        <input
          type="checkbox"
          id="est_vegetarien"
          name="est_vegetarien"
          defaultChecked={est_vegetarien}
          className="signup-checkbox-fields"
          onChange={(e)=>{setEst_vegetarien(e.target.value)}}
        />

        
        <input
          type="text"
          id="hebergement"
          name="hebergement"
          className="signup-input-fields"
          value={hebergement}
          onChange={(e)=>{setHebergement(e.target.value)}}
        />

       
        <input
          type="text"
          id="jeu_prefere"
          name="jeu_prefere"
          className="signup-input-fields"
          value={jeu_prefere}
          onChange={(e)=>{setJeu_prefere(e.target.value)}}
        />
        </div>
  </div>
   }
   
  {passwordReset&&
    <div className='boutons'>
      <div className='bouton2 cursor' onClick={()=>changePassword()}>Comfirmer</div>
      <div className='bouton2 cursor' onClick={()=>{setPasswordReset(false);hiddleMotif()}}>Annuler</div>
    </div>
  }

  {infoReset&&
    <div className='boutons'>
      <div className='bouton2 cursor' onClick={()=>changeInfos()}>Comfirmer</div>
      <div className='bouton2 cursor' onClick={()=>{setInfoReset(false); hiddleMotif()}}>Annuler</div>
    </div>
  }
 
  </div>
 )

}
export default Profil