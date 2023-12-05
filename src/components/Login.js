import React, { useEffect, useState } from 'react'
import { authActions } from '../redux/authReducer'
import { useDispatch, useSelector } from 'react-redux'
import userAPI from '../api/userAPI'
import {MdMail, MdKey, MdOutlineCancel} from 'react-icons/md'
import {TbAlertCircle} from 'react-icons/tb'
import {useParams,useNavigate, Navigate} from 'react-router-dom'
import { verifyToken } from '../redux/authReducer'

const Login=()=>{
  const dispatch = useDispatch();
  const [mail,setMail]=useState()
  const [mdp,setMdp]=useState()
  const [notif,setNotif]=useState()

  const navigate=useNavigate()

  useEffect(()=>{ 
    setNotif()
   },[mdp,mail])

  const connexion=()=>{
    const data={
      mail:mail,
      mdp:mdp
    }
    userAPI.connexion(data).then((resp) => {
      console.log(resp.data)
      console.log(resp.data.auth)

      if(resp.data.auth){
        /*
        localStorage.setItem("auth",JSON.stringify({
         token: resp.data.token,
         user:resp.data.user.iduser
        }))*/
        localStorage.setItem('accessToken', resp.data.token);
        /*
        localStorage.setItem("auth",JSON.stringify({
          token: resp.data.token,
          user:resp.data.user.iduser
         }))*/
        //dispatch(verifyToken())
        navigate(`/home/user`)
      } else{
        setNotif(resp.data.message)
      }
    }).catch(error => {
      console.log(error)
    })
  } 

 return(

<div>
<label htmlFor="email">Email :</label>
<input
  type="email"
  id="email"
  name="email"
  onChange={(e)=>{setMail(e.target.value)}}
  required
/>

<label htmlFor="password">Mot de passe :</label>
<input
  type="password"
  id="password"
  name="password"
  onChange={(e)=>{setMdp(e.target.value)}}
  required
/>

{notif && <div className='notif-error'><TbAlertCircle className='error-icon'/><div>{notif}</div></div>}
      <div className='clickable' onClick={()=>{navigate("/password-forgot")}}>Mot de passe oublié</div>
<div onClick={()=>{navigate("/signup")}}>Je n'ai pas de compte</div>
<button type="submit" onClick={()=>connexion()} >Se connecter</button>

</div>
 )

}
export default Login