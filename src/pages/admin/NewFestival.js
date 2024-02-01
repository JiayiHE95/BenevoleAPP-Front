import React, { useState, useEffect } from 'react'
import userAPI from '../../api/userAPI'
import {useParams,useNavigate, Navigate} from 'react-router-dom'
import {MdMail,MdPerson,MdPersonOutline, MdKey,MdPhone, MdOutlineCancel, MdLocationCity} from 'react-icons/md'
import { useJwt } from "react-jwt";
import festivalAPI from '../../api/festivalAPI'
import posteAPI from '../../api/posteAPI'
import NavBar from '../../components/NavBar'
import posteCreneauAPI from '../../api/posteCreneauAPI'
import FileUploader from '../../components/FileUploader'


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
    annee: date_debut.split('-')[0],
    nom:nomFestival,
   }

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
  console.log(data);
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
     <NavBar/>
    <h1>Créer un nouveau festival</h1>
    <label htmlFor="date_debut">Date Début : </label>
    <input type="date" name="date_debut" id="date_debut"
    onChange={(e)=> {setDate_debut(e.target.value)} }
    min={dateActuelle}
    required/>

    <label htmlFor="date_fin">Date Fin : </label>
    <input type="date" name="date_fin" id="date_fin"
    onChange={(e)=> {setDate_fin(e.target.value)} }
    min={date_debut}
    required/>

    <label htmlFor="nomFestival">Nom du festival : </label>
    <input type="text" name="nomFestival" id="nomFestival"
    defaultValue={"Festival du Jeu Montpellier"}
    onChange={(e)=> {setNomFestival(e.target.value)}}
    required
    />
    <label htmlFor="heuredebut">L'heure de debut </label>
    <input type="time" name="heuredebut" id="heuredebut"
    onChange={(e)=> {setHeure_debut(e.target.value)}} 
    required
    />

    <label htmlFor="heurefin">L'heure de fin </label>
    <input type="time" name="heurefin" id="heurefin"
    onChange={(e)=> {setHeure_fin(e.target.value)}}
    required/>

    <label htmlFor='intervalle'>Durée créneau poste : </label>
    <input type="number" name="intervalle" id="intervalle" value={intervalle}
    onChange={(e)=> {setIntervalle(e.target.value)}}
    min={0}
    required/>

{postes &&
  <div className='postes'>
    {postes.map((poste) => (
        <div className='poste' key={poste.idposte}>
          <input
            type="checkbox"
            name={poste.idposte}
            id={poste.idposte}
            onClick={(e) => handlePosteClick(poste.idposte, Number(e.target.nextElementSibling.value))}
          />
          <label htmlFor={poste.idposte}>{poste.nom}</label>
          {postesId.some((post) => post.id === poste.idposte) && (
            <input
              type="number"
              placeholder="Capacité par créneau"
              min={1}
              onChange={(e) => handleCapaciteClick(poste.idposte, Number(e.target.value))}
            />
            )}
        </div>
      ))}
      {notif && <div className='notif'><MdOutlineCancel /> Veuillez sélectionner une capacité supérieur à 0</div>}
    {notif && <div className='notif'><MdOutlineCancel /> Veuillez sélectionner au moins un poste</div>}
  </div>
}

   <div>
    <label htmlFor="newPoste">Nom du poste</label>
    <input type="text" name="newPoste" id="newPoste" 
    onChange={(e)=> {setNom(e.target.value)}}
    required/>
    <label htmlFor="newPosteDescription">Description du poste</label>
    <input type="text" name="newPosteDescription" id="newPosteDescription" 
    onChange={(e)=> {setDescription(e.target.value)}}
    required/>
    <button type="submit" onClick={()=>createPoste()}>Ajouter le poste</button>
   </div>

   {festival&&
   <div>
        <h2>Festival créé ! Importer le fichier de jeu et espace maintenant ou depuis la page Admin</h2>
        <FileUploader festival={festival}/>
    </div>}
    

   <button type="submit" onClick={()=>createFestival()}>Créer le festival</button>
       
  </div>
 )


}

export default NewFestival