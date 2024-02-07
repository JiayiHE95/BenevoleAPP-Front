import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar'
import FileUploader from '../components/FileUploader';
import festivalAPI from '../api/festivalAPI';
import userAPI from '../api/userAPI';
import { useJwt } from 'react-jwt';
import { formatDate } from '../utils/dateUtils';
import jeuEspaceAPI from '../api/jeuEspaceAPI';

const FestivalPage = () => {
  const { festivalId } = useParams();
  const [showPopup, setShowPopup] = useState(false);

  const [festival, setFestival] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const navigate=useNavigate()
  const  [user,setUser]=useState(null)
  const [comfirmFestivalPopUp, setComfirmFestivalPopUp] = useState(false);
  
  const token=localStorage.getItem('accessToken')
  const { decodedToken,isExpired } = useJwt(token?token:"");
  const [csvImported, setCsvImported] = useState(false);

  
 useEffect(() => {
  jeuEspaceAPI.getOneByFestival(festivalId).then((res) => {

      if(res.data.find){
          setCsvImported(true)
      }
  })
}, [comfirmFestivalPopUp]);

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
       setFestival(res.data.festival)
    }
  })},[festivalId])

  const deleteFestival=()=>{
    const data={
      idfestival:festivalId
    }
    festivalAPI.deleteFestival(data).then((res)=>{
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
    zIndex: '1000',
  };
  
  

  return (
    festival && user &&
    <div className="main-container">
      <NavBar festivalId={festivalId} />
  
      <h2 className="main-title"> Accueil Festival <br></br>{formatDate(festival.date_debut)} - {formatDate(festival.date_fin)}</h2>
  
      {user.role === "BENEVOLE" && (festival.valide ?
        <div className="welcome-message">Bienvenue {user.pseudo} ! Devenez notre bénévole tout de suite en cliquant sur Planning</div>
        :
        <div className="welcome-message">Bienvenue {user.pseudo} ! Veuillez patienter, l'inscription pour les bénévoles n'est pas encore ouverte</div>
      )}
  
      {user.role === "ADMIN" &&
        <div className="admin-section">
          
          <div className="welcome-message">Le festival {festival.valide ? " est " : "n'est pas encore "} ouvert aux inscriptions des bénévoles</div>
          
          <div className="boutonGestion clickable" onClick={() => { setShowPopup(!showPopup) }}>Import CSV</div>
          {showPopup &&<div className='import'>  
            <div className="popupStyle2" >
              
              <FileUploader festival={festival} />
              <button className='del d cursor' onClick={() => setShowPopup(false)}><span class="material-symbols-outlined ">cancel</span></button>
            </div>
          </div>
          }

          {festival.valide === false && <div className="boutonGestion clickable" onClick={() => setComfirmFestivalPopUp(true)}>Ouvrir l'inscription des bénévoles au festival</div>}
          
          {comfirmFestivalPopUp &&
            <div className="popupStyle2" style={popupStyle}>
              {csvImported?
              
              <div className='ccc'>Attention, cette action est irréversible. Les dates et les créneaux seront bloqués pour que les bénévoles puissent s'inscrire, mais vous pouvez toujours ajuster le nombre de bénévoles pour chaque créneau</div>
              :
              <div className='ccc'>Attention, vous devez importer le fichier csv avant de rendre le festival accessible aux bénévoles (Si cela a déjà été fait, il se peut que le traitement des données prenne un peu de temps, veuillez réessayer plus tard.)</div>
            }
              
              <div className='deuxBoutons'>
                {csvImported && <div className="cc cursor" onClick={() => comfirmFestival()}>Confirmer</div>}
                <div className="cc cursor" onClick={() => setComfirmFestivalPopUp(false)}>Annuler</div>
              </div>
            </div>
          }
  
          {!festival.valide && <div className="boutonGestion clickable" onClick={() => { setDeletePopup(true) }}>Supprimer le festival</div>}
  
          {deletePopup &&
            <div className="popupStyle2" style={popupStyle}>
              <div className='ccc'>Attention, cette action est irréversible. Etes-vous sûr de vouloir supprimer ce festival ?</div>
              
              <div className='deuxBoutons'>
                <div className="cc cursor" onClick={() => deleteFestival()}>Oui</div>
                <div className="cc cursor" onClick={() => setDeletePopup(false)}>Non</div>
              </div>
            </div>
          }

  
          
        </div>
      }
    </div>
  );
  
};

export default FestivalPage;
