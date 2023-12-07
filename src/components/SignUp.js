import React, { useState, useEffect } from 'react'
import userAPI from '../api/userAPI'
import {MdMail,MdPerson,MdPersonOutline, MdKey,MdPhone, MdOutlineCancel, MdLocationCity} from 'react-icons/md'
import {TbAddressBook} from 'react-icons/tb'
import {RxCodesandboxLogo} from 'react-icons/rx'
import {TbAlertCircle} from 'react-icons/tb'
import {useParams,useNavigate, Navigate} from 'react-router-dom'

const SignUp=()=>{

const [prenom,setPrenom]=useState()
const [nom,setNom]=useState()
const [pseudo,setPseudo]=useState()
const [mdp,setMdp]=useState()
const [resetPassword, setResetPassword]=useState()
const [tel,setTel]=useState()
const [mail,setMail]=useState()
const [asociation,setAssociation]=useState()
const [hebergement,setHebergement]=useState()
const [taille_tshirt,setTailleT]=useState()
const [est_vegetarien,setEst_vegetarien]=useState()
const [jeu_prefere,setJeu_prefere]=useState()

const [notif, setNotif]=useState(false)
const [mailNotif, setMailNotif]=useState(false)
const [connexionNotif, setconnexionNotif]=useState(false)
const [createUserNotif, setcreateUserNotif]=useState(false)
const [passwordNotif, setPasswordNotif]=useState(false)

const navigate=useNavigate()

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
    hebergement:hebergement,
    taille_tshirt:taille_tshirt,
    est_vegetarien:est_vegetarien,
    jeu_prefere:jeu_prefere,
  }
  setNotif(false)
  userAPI.createUser(data).then((resp) => {
    console.log(resp.data)
    const data={
      mail:mail,
      mdp:mdp
    }
    userAPI.connexion(data).then((resp) => {
      if(resp.data.auth){
        localStorage.setItem('accessToken', resp.data.token);
        navigate(`/home/user`)
      }
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
  <div>
      <h1>Signup</h1>
      <div>
        <label htmlFor="pseudo">Pseudo:</label>
        <input
          type="text"
          id="pseudo"
          name="pseudo"
          onChange={(e)=>{setPseudo(e.target.value)}} 
          required
        />

        <label htmlFor="nom">Nom:</label>
        <input
          type="text"
          id="nom"
          name="nom"
          onChange={(e)=>{setNom(e.target.value)}} 
          required
        />

        <label htmlFor="prenom">Prénom:</label>
        <input
          type="text"
          id="prenom"
          name="prenom"
          onChange={(e)=>{setPrenom(e.target.value)}}
          required
        />

        <label htmlFor="tel">Téléphone:</label>
        <input
          type="tel"
          id="tel"
          name="tel"
          onChange={(e)=>{setTel(e.target.value)}}
          required
        />

        <label htmlFor="mail">Email:</label>
        <input
          type="email"
          id="mail"
          name="mail"
          onChange={(e)=>{setMail(e.target.value)}}
          required
        />

        <label htmlFor="association">Association:</label>
        <input
          type="text"
          id="association"
          name="association"
          onChange={(e)=>{setAssociation(e.target.value)}}
        />

        <label htmlFor="taille_tshirt">Taille Tshirt:</label>
        <select
          id="taille_tshirt"
          name="taille_tshirt"
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
          onChange={(e)=>{setEst_vegetarien(e.target.value)}}
        />

        <label htmlFor="hebergement">Hébergement:</label>
        <input
          type="text"
          id="hebergement"
          name="hebergement"
          onChange={(e)=>{setHebergement(e.target.value)}}
        />

        <label htmlFor="jeu_prefere">Jeu Préféré:</label>
        <input
          type="text"
          id="jeu_prefere"
          name="jeu_prefere"
          onChange={(e)=>{setJeu_prefere(e.target.value)}}
        />

        <label htmlFor="mdp">Mot de Passe:</label>
        <input
          type="password"
          id="mdp"
          name="mdp"
          onChange={(e)=>{setMdp(e.target.value)}}
          required
        />

        <label htmlFor="mdp-reset">Resaisir le mot de Passe:</label>
        <input
          type="password"
          id="mdp-reset"
          name="mdp"
          onChange={(e)=>{setResetPassword(e.target.value)}}
          required
        />
        {mailNotif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Mail déjà utilisé</div></div>}
        {passwordNotif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Mots de passe non identiques</div></div>}
        {notif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Aucun champs ne peut être vide</div></div>}
        {connexionNotif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Connexion Automatique échouée, veuillez vous connecter ultérieurement</div></div>}
        {createUserNotif&& <div className='notif-error'><TbAlertCircle className='error-icon'/><div>Création de compte échouée, veuillez essayer ultérieurement</div></div>}
        <div onClick={()=>{navigate("/login")}}>J'ai déjà un compte</div>
        <button type="submit" onClick={()=>addUser()}>Sign Up</button>
      </div>
    </div>
 )

}
export default SignUp