// FestivalPage.js
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar'
import FileUploader from '../components/FileUploader';
import festivalAPI from '../api/festivalAPI';
import userAPI from '../api/userAPI';
import { useJwt } from 'react-jwt';

const FestivalPage = () => {
  const { festivalId } = useParams();
  const [festival, setFestival] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const navigate=useNavigate()
  const  [user,setUser]=useState(null)
  const [comfirmFestivalPopUp, setComfirmFestivalPopUp] = useState(false);
  

 const token=localStorage.getItem('accessToken')
 const { decodedToken,isExpired } = useJwt(token?token:"");

 useEffect(() => {
   if (decodedToken) {
     userAPI.getUserById(decodedToken.iduser).then((res) => {
       setUser(res.data.user);
     });
   }
 }, [decodedToken]);

  useEffect(() => {
    festivalAPI.getCurrentFestival(festivalId).then((res) => {
      if(res.data.find){
       console.log(res.data.festival)
       setFestival(res.data.festival)
    }
  })},[festivalId])

  const deleteFestival=()=>{
    const data={
      idfestival:festivalId
    }
    festivalAPI.deleteFestival(data).then((res)=>{
      console.log(res.data)
      navigate('/admin')
    })

  }

  const comfirmFestival=()=>{
    festivalAPI.updateFestival({idfestival:festival.idfestival, valide: true}).then((res)=>{
      if(res.data.festival){
       setFestival(res.data.festival)
      }
      setComfirmFestivalPopUp(false)
    })

  }

  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '500px',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    border: '1px solid #ccc',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    zIndex: '1000',
  };
  

  return (
    festival && user &&
    <div>
      <NavBar festivalId = {festivalId}/>
      <h2> Accueil Festival {festival.date_debut} - {festival.date_fin}</h2>
      {user.role==="BENEVOLE" && (festival.valide ?
      <div>Bienvenue {user.pseudo} ! Devenez notre bénévole tout de suite en cliquant sur Planning</div>
      :
      <div>Bienvenue {user.pseudo} ! Veuillez patienter, l'inscription pour les bénévoles n'est pas encore ouverte</div>
      )}
      {user.role==="ADMIN" &&
      <div>
        <div>le festival {festival.valide? " est " : "n'est pas encore "} ouvert aux inscriptions des bénévoles</div>
        <div>Importer le fichier contenant les informations des jeux et des espaces</div>
        <FileUploader festival={festival} />
        {festival.valide===false && <div onClick={()=>setComfirmFestivalPopUp(true)}>Ouvrir l'inscrption des bénévoles au festival</div>}
        {comfirmFestivalPopUp &&
          <div style ={popupStyle}>
          <div>Attention, cette action est irréversible. Les dates et les creneaux seront bloqué pour que les bénévoles puissent s'inscrire, mais vous pouvez toujours ajouster le nombre de bénévole pour chaque creneau</div>
          <div onClick={()=>comfirmFestival()}>Comfirmer</div>
          <div onClick={()=>setComfirmFestivalPopUp(false)}>Annuler</div>
          </div>
        }
        
        {!festival.valide && <div onClick={()=>{setDeletePopup(true)}}>Supprimer le festival</div>}
        {deletePopup &&
        <div style ={popupStyle}>
          <div>Attention, cette action est irréversible.Etes-vous sûr de vouloir supprimer ce festival ?</div>
          <div onClick={()=>deleteFestival()}>Oui</div>
          <div onClick={()=>setDeletePopup(false)}>Non</div>
        </div>
        }
        
        <div className='clickable' onClick={() => { navigate(`/inscriptions/${festivalId}`); }}>Gestion Inscription</div>

      </div>

      }
    </div>
  );
};

export default FestivalPage;
