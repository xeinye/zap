var audioPlayers = {};
var currentAudio = null;
var currentButton = null;
var allCards = []; 
var uniqueNames = new Set(); // Armazena nomes únicos para o filtro

function playAudio(src, button) {
    if (currentAudio && currentAudio !== audioPlayers[src]) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentButton.textContent = 'Play';
    }

    if (!audioPlayers[src]) {
        var audio = new Audio(src);
        audioPlayers[src] = audio;
        audio.addEventListener('ended', () => {
            button.textContent = 'Play';
        });
    }

    var audio = audioPlayers[src];

    if (audio.paused) {
        audio.play();
        button.textContent = 'Pause';
    } else {
        audio.pause();
        button.textContent = 'Play';
    }

    currentAudio = audio;
    currentButton = button;
}

function loadCards() {
    fetch('assets/cards.json') 
        .then(response => response.json())
        .then(data => {
            allCards = data;
            allCards.forEach(item => uniqueNames.add(item.nome));
            updateFilterOptions();
            displayCards(allCards);
        })
        .catch(error => console.error('JSON:', error));
}

function updateFilterOptions() {
    const filterSelect = document.getElementById('filter');
    filterSelect.innerHTML = '<option value="">Todos</option>';

    uniqueNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        filterSelect.appendChild(option);
    });
}

function displayCards(cards) {
    // Ordena os cards por nome
    const sortedCards = cards.sort((a, b) => a.nome.localeCompare(b.nome));

    const list = document.getElementById('list');
    list.innerHTML = ''; // Limpa a lista antes de adicionar novos cards

    sortedCards.forEach(item => {
        const li = document.createElement('li');
        li.className = 'card';
        li.innerHTML = `
            <p class="number">${item.nome}</p>
            <div class="detail">
                <div class="logo-text">${item.texto}</div>
                <div class="audio-controls">
                    <button onclick="playAudio('${item.audio}', this)">Play</button>
                    <a href="${item.audio}" download="${item.texto}.mp3">Download</a>
                </div>
            </div>
        `;
        list.appendChild(li);
    });
}

function pauseAllAudio() {
    for (const src in audioPlayers) {
        const audio = audioPlayers[src];
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0; // Reinicia o áudio
        }
    }
}

function filterCards() {
    pauseAllAudio(); // Pausa todos os áudios antes de aplicar o filtro

    const filterValue = document.getElementById('filter').value;
    if (filterValue === '') {
        displayCards(allCards);
    } else {
        const filteredCards = allCards.filter(card => card.nome === filterValue);
        displayCards(filteredCards);
    }
}

document.addEventListener('DOMContentLoaded', loadCards);
