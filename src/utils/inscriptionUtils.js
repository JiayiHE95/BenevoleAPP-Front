export const trierInscriptions = (inscriptions) => {
 // Trier par jour (ordre croissant)
 const inscriptionsTrie = [...inscriptions].sort((a, b) => {
   return a.Creneau.jour.localeCompare(b.Creneau.jour);
 });

 // Créer un objet où chaque clé est un jour et la valeur est un tableau d'inscriptions pour ce jour
 const inscriptionsParJour = inscriptionsTrie.reduce((acc, inscription) => {
   const jour = inscription.Creneau.jour;
   if (!acc[jour]) {
     acc[jour] = [];
   }
   acc[jour].push(inscription);
   return acc;
 }, {});

 // Trier les inscriptions de chaque jour par heure_debut (ordre croissant)
 for (const jour in inscriptionsParJour) {
   inscriptionsParJour[jour].sort((a, b) => {
     return a.Creneau.heure_debut.localeCompare(b.Creneau.heure_debut);
   });
 }

 // Regrouper les inscriptions ayant le même Creneau.heure_debut
 const inscriptionsRegroupees = {};
 for (const jour in inscriptionsParJour) {
   inscriptionsRegroupees[jour] = inscriptionsParJour[jour].reduce((acc, inscription) => {
     const heureDebut = inscription.Creneau.heure_debut;
     if (!acc[heureDebut]) {
       acc[heureDebut] = [];
     }
     acc[heureDebut].push(inscription);
     return acc;
   }, {});
 }

 return inscriptionsRegroupees;
};