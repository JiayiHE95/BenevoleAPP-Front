import React, { useState, useEffect } from 'react'
import userAPI from '../../api/userAPI'
import {useParams,useNavigate, Navigate} from 'react-router-dom'
import {MdMail,MdPerson,MdPersonOutline, MdKey,MdPhone, MdOutlineCancel} from 'react-icons/md'

import {AiOutlineCheckCircle} from 'react-icons/ai'
import { useJwt } from "react-jwt";
import festivalAPI from '../../api/festivalAPI'
import posteAPI from '../../api/posteAPI'
import NavBar from '../../components/NavBar'
import posteCreneauAPI from '../../api/posteCreneauAPI'
import FileUploader from '../../components/FileUploader'
import NavBarProfil from '../../components/NavbarProfil';

const NewFestival=()=>{
  const [user, setUser] = useState(null);
 const [date_debut,setDate_debut]=useState()
 const [date_fin,setDate_fin]=useState()
 const [heure_debut, setHeure_debut]=useState()
const [heure_fin, setHeure_fin]=useState()
 const [intervalle,setIntervalle]=useState()
 const [nom,setNom]=useState()
 const [nomFestival,setNomFestival]=useState("Festival du Jeu Montpellier")
 const [description,setDescription]=useState()
 const [postes, setPostes]=useState()
 const [postesId, setPostesId]=useState([])
 const [notif,setNotif]=useState(false)
 const [festival, setFestival] = useState(null);
 const navigate=useNavigate()

 const dateActuelle = new Date().toISOString().split('T')[0];

 const token=localStorage.getItem('accessToken')
  const { decodedToken,isExpired } = useJwt(token?token:"");

  useEffect(() => {
    if (decodedToken) {
      userAPI.getUserById(decodedToken.iduser).then((res) => {
        setUser(res.data.user);
      });
    }
  }, [decodedToken]);


 useEffect(()=>{
  posteAPI.getPostesListe().then((resp)=>{
   console.log(resp.data);
   setPostes(resp.data.postes)
  })
 },[nom])

 useEffect(()=>{
  setNotif(false)
 },[postesId])

 const createFestival=()=>{

  if (postesId.length>0) {
  
    const postsAvecCapaciteZero=postesId.filter((post)=>post.capacite===0)
    if(postsAvecCapaciteZero.length !== 0){
      setNotif(true)
      return
    }
   const festivalData={
    date_debut:date_debut,
    date_fin:date_fin,
    annee: date_debut?.split('-')[0],
    nom:nomFestival,
   }
   
   //verify si festivalData est bien rempli



   festivalAPI.createFestival(festivalData).then((resp)=>{
    const festivalId = resp.data.festival.idfestival
    
    setFestival(resp.data.festival)
    
    const postecreneauData={
      idfestival:festivalId,
      postes:postesId,
      intervalle:intervalle,
      heure_debut:heure_debut,
      heure_fin:heure_fin,
      date_debut:date_debut,
      date_fin:date_fin,
    }
    posteCreneauAPI.createPosteCreneau(postecreneauData).then((resp)=>{
      console.log(resp.data);
    })

   })
  }else{
    setNotif(true)
  }

 }

 const createPoste=()=>{
  const data={
   nom:nom,
   description:description
  }
  setNom('')
  setDescription('')
  posteAPI.createPoste(data).then((resp)=>{
   console.log(resp.data);
   posteAPI.getPostesListe().then((resp)=>{
    console.log(resp.data);
    setPostes(resp.data.postes)
   })
  })

 }

 const handlePosteClick = (id) => {
  const existingPost = postesId.find((post) => post.id === id);
  if (existingPost) {
    setPostesId(postesId.filter((post) => post.id !== id));
  } else {
    setPostesId([...postesId, { id:id, capacite:0}]);
    }
};

const handleCapaciteClick = (id, capacite) => {
  // Vérifier si l'ID existe déjà dans la liste postesId
  const existingPost = postesId.find((post) => post.id === id);

  if (existingPost&&capacite>0) {
    // Si l'ID existe, le supprimer de la liste
    existingPost.capacite = capacite;
    setNotif(false)
  } else{
    setNotif(true)
  }
}


 return(

  isExpired || (user && user.role !=="ADMIN") ? <Navigate to={'/'} />
  :
  <div className="NewFestival">
     <NavBarProfil/>
    <h1>Nouveau festival</h1>
    <div className="signup-form-containers">
      <div className='labels bold'>
        <label htmlFor="date_debut">Date début : </label>
        <label htmlFor="date_fin">Date fin : </label>
        <label htmlFor="nomFestival">Nom du festival : </label>
        <label htmlFor="heuredebut">Heure debut : </label>
        <label htmlFor="heurefin">Heure fin : </label>
        <label htmlFor='intervalle'>Durée créneau (heure) : </label>
        <label>Postes disponibles : </label>
      </div>

      <div className='inputs'>
        <input type="date" name="date_debut" id="date_debut"
          onChange={(e)=> {setDate_debut(e.target.value)} }
          min={dateActuelle}
          className="signup-input-fields"
          required
        />

        <input type="date" name="date_fin" id="date_fin"
          onChange={(e)=> {setDate_fin(e.target.value)} }
          min={date_debut}
          className="signup-input-fields"
          required
        />

        <input type="text" name="nomFestival" id="nomFestival"
          defaultValue={"Festival du Jeu Montpellier"}
          onChange={(e)=> {setNomFestival(e.target.value)}}
          className="signup-input-fields"
          required
        />
        <input type="time" name="heuredebut" id="heuredebut"
          onChange={(e)=> {setHeure_debut(e.target.value)}} 
          className="signup-input-fields"
          required
        />

        <input type="time" name="heurefin" id="heurefin"
          onChange={(e)=> {setHeure_fin(e.target.value)}}
          className="signup-input-fields"
          required
        />

        <input type="number" name="intervalle" id="intervalle" value={intervalle}
          onChange={(e)=> {setIntervalle(e.target.value)}}
          min={0}
          className="signup-input-fields"
          required
        />
      </div>

    {postes &&
      <div className='postes'>
        {postes.map((poste) => (
            <div className='poste' key={poste.idposte}>
              <div className='poste-check'>
                <input
                  type="checkbox"
                  name={poste.idposte}
                  id={poste.idposte}
                  onClick={(e) => handlePosteClick(poste.idposte, Number(e.target.nextElementSibling.value))}
                />
                <label htmlFor={poste.idposte}>{poste.nom}</label>
              </div>
              {postesId.some((post) => post.id === poste.idposte) && (
                <input
                  type="number"
                  placeholder="Capacité par créneau"
                  className="input-fields"
                  min={1}
                  onChange={(e) => handleCapaciteClick(poste.idposte, Number(e.target.value))}
                />
                )}
            </div>
          ))}
        {notif && <div className="notif-error"><MdOutlineCancel className='error-icon' /> Veuillez sélectionner une capacité supérieur à 0</div>}
        {notif && <div className="notif-error"><MdOutlineCancel className='error-icon' /> Veuillez sélectionner au moins un poste</div>}
      </div>
    }

   <div >

   </div>

   <div className='addNewPoste'>
      <label className='labels-newPoste bold'>Nouveau poste (facultatif) </label>
      <button className='bouton1 cursor' type="submit" onClick={()=>createPoste()}>Ajouter le poste</button>
    </div>

    <div className='labels bold'>
      <label htmlFor="newPoste">Nom du poste :</label>
      <label htmlFor="newPosteDescription">Description :</label>
    </div>
    <div className='inputs'>

      <input type="text" name="newPoste" id="newPoste" 
        value={nom}
        onChange={(e)=> {setNom(e.target.value)}}
        required
        className="signup-input-fields"
      />
      <input type="text" name="newPosteDescription" id="newPosteDescription" 
        value={description}
        onChange={(e)=> {setDescription(e.target.value)}}
        required
        className="signup-input-fields"
      />
    </div>
  
   {festival ?
   <div className="notif-succes">
    <AiOutlineCheckCircle className='error-icon'/>
      <div>Festival créé ! Importer le fichier de jeu et espace dès maintenant depuis l'accueil du festival</div>
    </div>
    :
    <div className='boutons'>
      <button type="submit" className='bouton2 cursor' onClick={()=>createFestival()}>Créer le festival</button>
      <button type="submit" className='bouton2 cursor' onClick={()=>navigate("/admin")}>Annuler</button>
    </div>
    }
    
    </div>
       
  </div>
 )


}

export default NewFestival