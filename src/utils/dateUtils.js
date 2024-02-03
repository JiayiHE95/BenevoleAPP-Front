export const formatDate = (inputDate) => {
 const dateObject = new Date(inputDate);

 const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
 const jourSemaine = joursSemaine[dateObject.getDay()];

 const jour = String(dateObject.getDate()).padStart(2, '0');
 const mois = String(dateObject.getMonth() + 1).padStart(2, '0');
 const annee = dateObject.getFullYear();

 const formattedDate = `${jourSemaine} ${jour}/${mois}/${annee}`;

 return formattedDate;
};
