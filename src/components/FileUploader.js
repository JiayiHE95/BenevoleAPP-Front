import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa';
import fileAPI from '../api/fileAPI';

const FileUploader = ({ festival }) => {
  const [fileName, setFileName] = useState(null);
  const [alert, setAlert] = useState(null);
  const [file, setFile] = useState(null);
  const [comfirm, setComfirm] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFileName(file.name);

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
  }, [file]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.xlsx',
    multiple: false,
  });

  const readFile = () => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      await Promise.all(
        rows.map(async (row, index) => {
          if (index > 0) {
            const data = {
              rows: row,
              idfestival: festival.idfestival,
              lastRow: index === rows.length - 1 ? true : false,
            };

            fileAPI.importDataToDB(data).then((res) => {
              if (!res.data.success) {
                setAlert('Importation échouée, veuillez réessayer.');
              }
            });
          }
        })
      );

      setAlert('Importation réussie (le traitement peut prendre un peu de temps)');
      setComfirm(false)
    };
  };

  return (
    festival && (
      <div className="file-uploader-container">
        <div {...getRootProps()} className="dropzone" style={dropzoneStyle}>
          <input {...getInputProps()} />
          <p >
            Glissez-déposez un fichier XLSX ici, ou cliquez pour sélectionner un fichier.
          </p>
          {fileName && (
            <div className="file-icon">
              <FaFileExcel size={60} />
              <div className="file-name">{fileName}</div>
            </div>
          )}
        </div>
        {alert && <div className="alert-message">{alert}</div>}
        {!alert && file && !comfirm && (
          <div className="import-button cursor" onClick={() => setComfirm(true)}>
            Importer
          </div>
        )}
        {comfirm && (
          <div className="confirmation-popup">
            <div className="confirmation-popup-text">
              Attention : Etes-vous sûr de vouloir importer ce fichier ?
            </div>
            <div>Les suppressions ne seront pas détectées pour préserver les archives des années précédentes.</div>
            <div>
              Si vous souhaitez supprimer des données pour le festival en cours, veuillez vous diriger vers l'espace admin.
            </div>
            <div className='botun'>
              <div className="confirmation-popup-confirm" onClick={() => readFile()}>
                Confirmer
              </div>
              <div className="confirmation-popup-cancel" onClick={() => setComfirm(false)}>
                Annuler
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  width: '300px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default FileUploader;
