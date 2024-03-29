import React, { useState, useEffect } from 'react';
import userAPI from '../api/userAPI';
import { MdMail, MdPerson, MdPersonOutline, MdKey, MdPhone, MdOutlineCancel, MdLocationCity } from 'react-icons/md';
import { TbAddressBook } from 'react-icons/tb';
import { RxCodesandboxLogo } from 'react-icons/rx';
import { TbAlertCircle } from 'react-icons/tb';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

const SignUp = () => {

  const [prenom, setPrenom] = useState();
  const [nom, setNom] = useState();
  const [pseudo, setPseudo] = useState();
  const [mdp, setMdp] = useState();
  const [resetPassword, setResetPassword] = useState();
  const [tel, setTel] = useState();
  const [mail, setMail] = useState();
  const [asociation, setAssociation] = useState();
  const [hebergement, setHebergement] = useState();
  const [taille_tshirt, setTailleT] = useState();
  const [est_vegetarien, setEst_vegetarien] = useState();
  const [jeu_prefere, setJeu_prefere] = useState();

  const [notif, setNotif] = useState(false);
  const [mailNotif, setMailNotif] = useState(false);
  const [connexionNotif, setconnexionNotif] = useState(false);
  const [createUserNotif, setcreateUserNotif] = useState(false);
  const [passwordNotif, setPasswordNotif] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    userAPI.getUserByMail(mail).then((resp) => {
      resp.data.exist ? setMailNotif(true) : setMailNotif(false);
    });
  }, [mail]);

  useEffect(() => {
    resetPassword !== mdp ? setPasswordNotif(true) : setPasswordNotif(false);
  }, [resetPassword]);

  const validateForm = () => {
    if (
      !pseudo ||
      !prenom ||
      !nom ||
      !tel ||
      !mail ||
      !taille_tshirt ||
      !mdp ||
      !resetPassword
    ) {
      setNotif(true);
      return false;
    }
    return true;
  };

  const addUser = () => {
    if (resetPassword !== mdp || !validateForm()) {
      return;
    }

    const data = {
      prenom: prenom,
      nom: nom,
      pseudo: pseudo,
      mdp: mdp,
      mail: mail,
      tel: tel,
      association: asociation,
      hebergement: hebergement,
      taille_tshirt: taille_tshirt,
      est_vegetarien: est_vegetarien,
      jeu_prefere: jeu_prefere,
    };

    setNotif(false);
    userAPI
      .createUser(data)
      .then((resp) => {
        const data = {
          mail: mail,
          mdp: mdp,
        };
        userAPI
          .connexion(data)
          .then((resp) => {
            if (resp.data.auth) {
              localStorage.setItem('accessToken', resp.data.token);
              navigate(`/home/user`);
            }
          })
          .catch((error) => {
            setconnexionNotif(true);
            console.log(error);
          });
      })
      .catch((error) => {
        setcreateUserNotif(true);
        console.log(error);
      });
  };


  return (
    <div className="signup-containers">
      <h1>Inscription</h1>
      <div className="signup-form-containers">
        <label htmlFor="pseudo" className="signup-labels">
          Pseudo:
        </label>
        <input
          type="text"
          id="pseudo"
          name="pseudo"
          className="signup-input-fields"
          onChange={(e) => {
            setPseudo(e.target.value);
          }}
          required
        />

        <label htmlFor="nom" className="signup-labels">
          Nom:
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          className="signup-input-fields"
          onChange={(e) => {
            setNom(e.target.value);
          }}
          required
        />

        <label htmlFor="prenom" className="signup-labels">
          Prénom:
        </label>
        <input
          type="text"
          id="prenom"
          name="prenom"
          className="signup-input-fields"
          onChange={(e) => {
            setPrenom(e.target.value);
          }}
          required
        />

        <label htmlFor="tel" className="signup-labels">
          Téléphone:
        </label>
        <input
          type="tel"
          id="tel"
          name="tel"
          className="signup-input-fields"
          onChange={(e) => {
            setTel(e.target.value);
          }}
          required
        />

        <label htmlFor="mail" className="signup-labels">
          Email:
        </label>
        <input
          type="email"
          id="mail"
          name="mail"
          className="signup-input-fields"
          onChange={(e) => {
            setMail(e.target.value);
          }}
          required
        />

        <label htmlFor="association" className="signup-labels">
          Association:
        </label>
        <input
          type="text"
          id="association"
          name="association"
          className="signup-input-fields"
          onChange={(e) => {
            setAssociation(e.target.value);
          }}
        />

        <label htmlFor="taille_tshirt" className="signup-labels">
          Taille Tshirt:
        </label>
        <select
          id="taille_tshirt"
          name="taille_tshirt"
          className="signup-input-fields"
          onChange={(e) => {
            setTailleT(e.target.value);
          }}
          required
        >
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>

        <label htmlFor="est_vegetarien" className="signup-labels">
          Est Végétarien:
        </label>
        <input
          type="checkbox"
          id="est_vegetarien"
          name="est_vegetarien"
          className="signup-checkbox-fields"
          onChange={(e) => {
            setEst_vegetarien(e.target.value);
          }}
        />

        <label htmlFor="hebergement" className="signup-labels">
          Hébergement:
        </label>
        <input
          type="text"
          id="hebergement"
          name="hebergement"
          className="signup-input-fields"
          onChange={(e) => {
            setHebergement(e.target.value);
          }}
        />

        <label htmlFor="jeu_prefere" className="signup-labels">
          Jeu Préféré:
        </label>
        <input
          type="text"
          id="jeu_prefere"
          name="jeu_prefere"
          className="signup-input-fields"
          onChange={(e) => {
            setJeu_prefere(e.target.value);
          }}
        />

        <label htmlFor="mdp" className="signup-labels">
          Mot de Passe:
        </label>
        <input
          type="password"
          id="mdp"
          name="mdp"
          className="signup-input-fields"
          onChange={(e) => {
            setMdp(e.target.value);
          }}
          required
        />

        <label htmlFor="mdp-reset" className="signup-labels">
          Resaisir le mot de Passe:
        </label>
        <input
          type="password"
          id="mdp-reset"
          name="mdp"
          className="signup-input-fields"
          onChange={(e) => {
            setResetPassword(e.target.value);
          }}
          required
        />
        {mailNotif && (
          <div className="signup-notif-errors">
            <TbAlertCircle className="signup-error-icons" />
            <div>Mail déjà utilisé</div>
          </div>
        )}
        {passwordNotif && (
          <div className="signup-notif-errors">
            <TbAlertCircle className="signup-error-icons" />
            <div>Mots de passe non identiques</div>
          </div>
        )}
        {notif && (
          <div className="signup-notif-errors">
            <TbAlertCircle className="signup-error-icons" />
            <div>Aucun champ ne peut être vide</div>
          </div>
        )}
        <div
          className="signup-clickables"
          onClick={() => {
            navigate("/login");
          }}
        >
          J'ai déjà un compte
        </div>
        <button
          type="submit"
          className="signup-submit-buttons"
          onClick={() => addUser()}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;
