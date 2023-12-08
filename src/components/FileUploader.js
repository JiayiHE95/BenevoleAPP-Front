import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa';
import fileAPI from '../api/fileAPI';

const FileUploader = () => {
  const [fileName, setFileName] = useState(null);
  const [alert, setAlert] = useState(null); 
  const [file, setFile] = useState(null); 
  const [comfirm, setComfirm] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // Assurez-vous que l'utilisateur sélectionne un seul fichier
    const file = acceptedFiles[0];
    setFileName(file.name)
    if (acceptedFiles.length !== 1) {
      setAlert('Veuillez sélectionner un seul fichier.');
      return;
    }
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
     setAlert('Veuillez sélectionner un fichier XLSX valide.');
     return;
    }
    setAlert(null);
    setFile(file);
  },[file]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.xlsx',
    multiple: false, // Permet uniquement un seul fichier
  });

  const readFile = () => {
   const reader = new FileReader();
   reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheet=workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      fileAPI.importDataToDB({rows}).then((res) => {
       console.log(res.data);
       if(res.data.success){
        setAlert(res.data.message);
       }else{
        setAlert("Importation échouée, veuillez réessayer.");
        console.log(res.data.message);
       }
     }
      )
    }
  }

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <p>
          Glissez-déposez un fichier XLSX ici, ou cliquez pour sélectionner un fichier.
        </p>
        {fileName && (
          <div style={{ marginTop: '10px' }}>
            <FaFileExcel size={60} />
            <div>{fileName}</div>
          </div>
        )}
      </div>
        {alert&&<div>{alert}</div>}
        {(!alert&&file)&&
        <div onClick={()=>setComfirm(true)}>Importer</div>}
        {comfirm&&
        <div>
         <div>Attention : Etes vous sûr de vouloir importer ce fichier ?</div>
         <div>Les jeux ayant un nouveau nom seront considérés comme un nouveau jeu, vous risquerez d'avoir des doublons </div>
         <div>Si vous souhaitez modifier les informations concernant un jeu déjà enregistré auparavant, veuillez vous diriger vers l'espace admin</div>
          <div onClick={()=>readFile()}>Comfirmer</div>
          <div onClick={()=>setComfirm(false)}>Annuler</div>
        </div>
        }
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  width:'300px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default FileUploader;
