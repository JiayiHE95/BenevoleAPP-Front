import React, { useState, useEffect } from 'react'
import userAPI from '../api/userAPI'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../redux/authReducer'
import {MdMail,MdPerson,MdPersonOutline, MdKey,MdPhone, MdOutlineCancel, MdLocationCity} from 'react-icons/md'
import {TbAddressBook} from 'react-icons/tb'
import {RxCodesandboxLogo} from 'react-icons/rx'
import {TbAlertCircle} from 'react-icons/tb'

const NewCompteCard=({isOpen})=>{

const [prenom,setPrenom]=useState()
const [nom,setNom]=useState()
const [pseudo,setPseudo]=useState()
const [mdp,setMdp]=useState()
const [resetPassword, setResetPassword]=useState()
const [tel,setTel]=useState()
const [mail,setMail]=useState()
const [asociation,setAssociation]=useState()
const [taille_tshirt,setTailleT]=useState()
const [est_vegetarien,setEst_vegetarien]=useState()
const [jeu_prefere,setJeu_prefere]=useState()

const [notif, setNotif]=useState(false)
const [mailNotif, setMailNotif]=useState(false)
const [connexionNotif, setconnexionNotif]=useState(false)
const [createUserNotif, setcreateUserNotif]=useState(false)
const [passwordNotif, setPasswordNotif]=useState(false)

const dispatch = useDispatch();

useEffect(()=>{
  userAPI.getUserByMail(mail).then((resp)=>{
    resp.data.exist ? setMailNotif(true):setMailNotif(false)
  })
}
,[mail])

useEffect(()=>{
  resetPassword!==mdp? setPasswordNotif(true) : setPasswordNotif(false)
}
,[resetPassword])

const mergeCart=()=>{
  const visitorCart = JSON.parse(localStorage.getItem('visitorCart'))
  if (visitorCart){
    localStorage.setItem("cart",JSON.stringify({cart:visitorCart.cart}))
    localStorage.removeItem('visitorCart')
  }
}

const addUser=()=>{
  if (resetPassword!==mdp) {
    return
  }
  
  const data={
    prenom:prenom,
    nom:nom,
    pseudo:pseudo,
    mdp:mdp,
    mail:mail,
    tel:tel,
    asociation:asociation,
    taille_tshirt:taille_tshirt,
    est_vegetarien:est_vegetarien,
    jeu_prefere:jeu_prefere,
  }
  /*
  for (const key in data) {
    if(data[key]===undefined||data[key]===""){
      setNotif(true)
      return
    }
  }*/
  setNotif(false)
  userAPI.createUser(data).then((resp) => {
    console.log(resp.data)
    const data={
      mail:mail,
      mdp:mdp
    }
    userAPI.connexion(data).then((resp) => {
      if(resp.data.auth){
        mergeCart()
        localStorage.setItem("auth",JSON.stringify({
         token: resp.data.token,
         user:resp.data.user
        }))
      }
      dispatch(authActions.loginSuccess())
      isOpen(false)
    }).catch(error => {
      setconnexionNotif(true)
      console.log(error)
    })
  }).catch(error => {
    setcreateUserNotif(true)
    console.log(error)
  })
}

 return(
   <div className='form-wrapper'>
     <div className='form-container'>
     <MdOutlineCancel className='close-icon clickable' onClick={()=>{isOpen(false)}}/>
    <div className='form-title'>Nouveau compte</div>
    <div className='form-inputs'>
     <div className='form-input'>
      <MdPerson className='icon'></MdPerson>
     <input type='text' placeholder='Nom' onChange={(e)=>{setNom(e.target.value)}} required></input>
    </div>
   <div className='form-input'>
    <MdPersonOutline className='icon'></MdPersonOutline>
    <input type='text' placeholder='Prénom' onChange={(e)=>{setPrenom(e.target.value)}} required></input>
   </div>
     <div className='form-input'>
      <MdPerson className='icon'></MdPerson>
     <input type='text' placeholder='Pseudo' onChange={(e)=>{setPseudo(e.target.value)}} required></input>
    </div>
   <div className='form-input'>
    <MdPhone className='icon'></MdPhone>
    <input type='text' placeholder='Téléphone' onChange={(e)=>{setTel(e.target.value)}}></input>
   </div>
   <div className='form-input'>
    <TbAddressBook className='icon'></TbAddressBook>
    <input type='text' placeholder='Association' onChange={(e)=>{setAssociation(e.target.value)}}></input>
   </div>
   <div className='form-input'>
    <RxCodesandboxLogo className='icon'/>
    <input type='text' placeholder='Taille T shirt' onChange={(e)=>{setTailleT(e.target.value)}}></input>
   </div>
   <div className='form-input'>
    <MdLocationCity className='icon'></MdLocationCity>
     <input type='text' placeholder='Vege' onChange={(e)=>{setEst_vegetarien(e.target.value)}}></input>
   </div>
   <div className='form-input'>
   <MdMail className='icon'></MdMail>
    <input type='email' placeholder='Mail' onChange={(e)=>{setMail(e.target.value)}}></input>
   </div>
   <div className='form-input'>
   <MdMail className='icon'></MdMail>
    <input type='text' placeholder='Jeu préféré' onChange={(e)=>{setJeu_prefere(e.target.value)}}></input>
   </div>
   <div className='form-input'>
    <MdKey className='icon'></MdKey>
    <input type='password' placeholder='Mot de passe' onChange={(e)=>{setMdp(e.target.value)}}></input>
   </div>
   <div className='form-input'>
   <MdKey className='icon'></MdKey>
     <input type='password' placeholder='Resaisissez le mot de passe' onChange={(e)=>{setResetPassword(e.target.value)}}></input>
   </div>
   </div>
    {mailNotif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Mail déjà utilisé</div></div>}
    {passwordNotif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Mots de passe non identiques</div></div>}
    {notif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Aucun champs ne peut être vide</div></div>}
    {connexionNotif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Connexion Automatique échouée, veuillez vous connecter ultérieurement</div></div>}
    {createUserNotif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Création de compte échouée, veuillez essayer ultérieurement</div></div>}

   <div className='clickable' onClick={()=>addUser()}> Valider</div>
   </div>
  </div>
 )

}
export default NewCompteCard