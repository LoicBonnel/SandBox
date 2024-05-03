// Région : Initialisation des éléments DOM

const disque = document.querySelector(".disque");
const btnPause = document.getElementById("btnPause");
const playlist = document.getElementById("btnPlaylist");
const tableBody = document.getElementById("listeMusiqueBody");
const video = document.getElementById('bgVideo');
const audio = document.querySelector('audio');
const btnPauseImage = document.getElementById('imgBtn');
let data;
let audioPlayer = null;

// Région : Gestion des événements

// Gestion de l'affichage de la playlist au clic sur le bouton
document.getElementById('btnPlaylist').addEventListener('click', function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien

    var playlistContainer = document.querySelector('.playlistContainer');
    playlistContainer.style.display = (playlistContainer.style.display === 'block') ? 'none' : 'block';
});



// Fonction pour charger et jouer la musique
async function chargerEtJouerMusique() {
    try {
        const response = await fetch('https://apiswagger-docw.onrender.com/api/V1/music');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        data = await response.json();
        data = data.result;

        afficherMusiques(data); // Afficher toutes les musiques au chargement initial

        // Ajouter une classe visible à la table
        const table = document.querySelector('.musique-table');
        table.classList.add("visible");
    } catch (error) {
        console.error('Erreur de chargement du fichier JSON', error);
    }
}

// Fonction pour afficher les musiques dans le tableau
function afficherMusiques(musiques) {
    // Effacer le contenu existant du tableau
    tableBody.innerHTML = '';

    // Affichage de la liste des musiques dans le DOM
    musiques.forEach(musique => {
        const row = document.createElement('tr');
    
        const idCell = document.createElement('td');
        const artistCell = document.createElement('td');
        const titleCell = document.createElement('td');
        const actionCell = document.createElement('td'); // Ajoutez une cellule pour l'action
    
        artistCell.textContent = musique.artist;
        titleCell.textContent = musique.title;
    
        // Création d'un bouton de lecture pour chaque musique
        const playButton = document.createElement('button');
        playButton.textContent = '';
        playButton.style.cursor = "pointer";
        playButton.style.width = '80px';
        playButton.style.height = '80px';
        playButton.style.backgroundColor = 'blue'; // Ajoutez un style de fond
        playButton.style.color = 'white'; // Ajoutez un style de couleur de texte
        playButton.style.border = 'none'; // Supprimez la bordure du bouton
        playButton.style.padding = '10px 20px'; // Ajoutez un espace de rembourrage
        playButton.style.borderRadius = '5px'; // Ajoutez un rayon de bordure arrondi
        
        // Ajoutez une image de fond au bouton
        playButton.style.backgroundImage = `url(${musique.cover})`;
        playButton.style.backgroundSize = 'cover'; // Ajustez la taille de l'image de fond
        playButton.style.backgroundPosition = 'center'; // Centrez l'image de fond
        
        playButton.addEventListener('click', function() {
            playAudio(musique.id);
            // Réinitialiser la vidéo et le disque
            video.load();
        });
    
        actionCell.appendChild(playButton); // Ajoutez le bouton à la cellule d'action
    
        row.appendChild(artistCell);
        row.appendChild(titleCell);
        row.appendChild(actionCell); // Ajoutez la cellule d'action à la ligne
    
        tableBody.appendChild(row);
    });
}

// Ajouter un gestionnaire d'événements pour l'événement "input" du champ de recherche
document.getElementById('search').addEventListener('input', function() {
    const searchTerm = escapeHtml(this.value.trim().toLowerCase()); // Récupérer le terme de recherche et le normaliser
    
    // Filtrer les musiques en fonction du terme de recherche
    const musiquesFiltrees = data.filter(musique => {
        return musique.artist.toLowerCase().includes(searchTerm) || musique.title.toLowerCase().includes(searchTerm);
    });

    afficherMusiques(musiquesFiltrees); // Afficher les musiques filtrées
});

// Fonction pour échapper les caractères spéciaux HTML
function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function (match) {
        switch (match) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case "'":
                return '&#039;';
        }
    });
}

// Région : Lecture des sons et gestion des événements

function playAudio(musicId) {
    // Trouver la musique correspondant à l'ID
    const musique = data.find(m => m.id === musicId);
    if (musique) {
        // Construire le chemin de la musique en fonction du titre ou d'autres propriétés
        const audioSrc = `${musique.sound}`;
        // Si un objet audio est déjà en cours de lecture, arrêtez-le
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
        // Créer un nouvel élément audio s'il n'existe pas encore
        if (!audioPlayer) {
            audioPlayer = new Audio();
        }
        // Définir la source audio et jouer la musique
        audioPlayer.src = audioSrc;
        audioPlayer.play();
        // Mettre à jour la cover du disque avec celle de la musique sélectionnée
        const coverDisque = document.querySelector(".coverDisque");
        coverDisque.src = musique.cover;
        // Retirer la classe "pause" pour démarrer le disque
        disque.classList.remove("pause");
    } else {
        console.error('Musique non trouvée pour l\'ID:', musicId);
    }
}

document.getElementById('btnPause').addEventListener('click', function() {
    disque.classList.toggle("pause");

    // Gestion de la pause/play au clic sur le bouton Pause
    if (video.paused) {
        btnPauseImage.src = "./assets/pictures/bouton-pause.png";
        video.play();
        if (audioPlayer) {
            audioPlayer.play();
        }
    } else {
        btnPauseImage.src = "./assets/pictures/bouton-jouer.png";
        video.pause();
        if (audioPlayer) {
            audioPlayer.pause();
        }
    }
});


function choisirMusiqueAleatoire() {
    if (data && data.length > 0) {
        const indexAleatoire = Math.floor(Math.random() * data.length);
        const musiqueAleatoire = data[indexAleatoire];
        return musiqueAleatoire;
    } else {
        console.error('Aucune donnée de musique chargée ou la liste est vide.');
        return null;
    }
}

document.getElementById('btnRandom').addEventListener('click', function() {
    const musiqueAleatoire = choisirMusiqueAleatoire();
    if (musiqueAleatoire) {
        playAudio(musiqueAleatoire.id);
        // Réinitialiser la vidéo et le disque si nécessaire
        video.load();
    }
});

chargerEtJouerMusique();