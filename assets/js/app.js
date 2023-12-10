// app.js

console.log("Hello Saint Jo");

const prenom = 'Loïc'; // string
let year = 2024; // int
const dob = 2003; //ne plus utiliser
const isAdmin = false; //Boolean
const apprenants = ["Enzo", "Thomas", "Valentin"];  // tableau
const sac = {livre: 'BD Tintin', trousse: 'stylo', skills: ["Bagarre", "Jeux Vidéos"] } // objet
const disque = document.querySelector(".disque");
const btnPause = document.getElementById("btnPause");
const paragraphe = document.querySelector(".div1 p");
const playlist = document.getElementById("btnPlaylist");


setTimeout(() => {
    paragraphe.style.backgroundColor = "blue";
}, 4000);


document.getElementById('btnPlaylist').addEventListener('click', function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien

    var playlistContainer = document.querySelector('.playlistContainer');
    playlistContainer.style.display = (playlistContainer.style.display === 'block') ? 'none' : 'block';
});




btnPause.addEventListener("click", async () => {
    disque.classList.toggle("pause");

    if (disque.classList.contains("pause")) {
        btnPause.textContent = "Play";
    } else {
        btnPause.textContent = "Pause";
    }

    // Ajouter une petite pause pour laisser le temps au changement de classe d'être appliqué
    await new Promise(resolve => setTimeout(resolve, 0));
});

console.log(disque);

console.log(apprenants[2]);
console.log(sac.skills[0]);

apprenants.forEach(prenom => {
    console.log(`Bonjour ${prenom}`)
});

console.log(`Bonjour ${prenom}`);
// calculeAge();


// fonction à l'ancienne
function calculeAge(){
    const age = year - dob;
    console.log(`Voici ton âge : ${age} ans.`); 
}

// nouvelle fonction => arrow function
const calculeAge2 = () => {
    const age = year - dob;

    console.log(`Voici ton âge : ${age} ans.`); 

    // if(age > 18){
    //     console.log("Rentre bonhomme.")
    // }else{
    //     console.log("Dehors mauviette.")
    // }

    age > 18 ? console.log("Rentre bonhomme.") : console.log("Dehors mauviette.") // Condition ternaire
}


async function chargerMusique() {
    try {
        const response = await fetch('assets/json/listMusics.json');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        const tableBody = document.getElementById('listeMusique');

        data.musiques.forEach(musique => {
            const row = document.createElement('tr');
            const artisteCell = document.createElement('td');
            const musiqueCell = document.createElement('td');

            artisteCell.textContent = musique.artiste;
            musiqueCell.textContent = musique.titre;

            row.appendChild(artisteCell);
            row.appendChild(musiqueCell);
            tableBody.appendChild(row);
        });

        // Ajouter un gestionnaire d'événements pour la recherche
        document.getElementById('search').addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const rows = tableBody.getElementsByTagName('tr');

            for (let i = 0; i < rows.length; i++) {
                const artiste = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
                const musique = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();

                if (artiste.includes(searchTerm) || musique.includes(searchTerm)) {
                    rows[i].style.display = ''; // Afficher la ligne correspondante
                } else {
                    rows[i].style.display = 'none'; // Masquer les lignes qui ne correspondent pas
                }
            }
        });

                // Ajouter une classe visible à la table
                const table = document.querySelector('.musique-table');
                table.classList.add("visible");
    } catch (error) {
        console.error('Erreur de chargement du fichier JSON', error);
    }
}

// Appeler la fonction pour charger la liste de musiques dans le tableau
chargerMusique();
calculeAge2();
