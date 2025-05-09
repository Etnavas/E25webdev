const client_id = 'YOUR_SPOTIFY_CLIENT_ID';
const redirect_uri = 'http://localhost:5500';

let queue = [];
let currentTrackIndex = 0;
let allTracks = [];

function authorizeSpotify() {
  const scopes = 'user-read-private user-read-email';
  window.location = `https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
}

function getAccessToken() {
  const hash = window.location.hash;
  if (!hash) return null;
  const token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
  return token;
}

async function searchTracks(query, genre, token) {
  let searchQuery = query;
  if (genre) {
    searchQuery += ` genre:${genre}`;
  }
  const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await result.json();
  return data.tracks.items;
}

document.getElementById('searchBtn').addEventListener('click', async () => {
  const token = getAccessToken();
  if (!token) return authorizeSpotify();

  const query = document.getElementById('searchInput').value;
  const genre = document.getElementById('genreFilter').value;
  const tracks = await searchTracks(query, genre, token);

  queue = [];
  allTracks = tracks.map(track => ({
    previewUrl: track.preview_url,
    name: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    imageUrl: track.album.images[0]?.url || '',
    genre: genre || 'Unknown'
  }));

  displayLibrary(allTracks);

  if (allTracks.length > 0) {
    currentTrackIndex = 0;
    queue = [...allTracks];
    playTrack(queue[currentTrackIndex]);
    updateQueueDisplay();
  }
});

function displayLibrary(tracks) {
  const libraryDiv = document.getElementById('library');
  libraryDiv.innerHTML = '';

  tracks.forEach((track, index) => {
    const col = document.createElement('div');
    col.className = 'col';

    const card = document.createElement('div');
    card.className = 'card h-100 text-dark';
    card.innerHTML = `
      <img src="${track.imageUrl}" class="card-img-top" alt="Album Art">
      <div class="card-body">
        <h5 class="card-title">${track.name}</h5>
        <p class="card-text">${track.artist}</p>
        <button class="btn btn-primary w-100">Play</button>
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => {
      currentTrackIndex = index;
      queue = [...tracks];
      playTrack(track);
      updateQueueDisplay();
    });

    col.appendChild(card);
    libraryDiv.appendChild(col);
  });
}

function updateQueueDisplay() {
  const queueList = document.getElementById('queue');
  queueList.innerHTML = '';
  queue.forEach((track, index) => {
    if (index !== currentTrackIndex) {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `${track.name} - ${track.artist}`;
      queueList.appendChild(li);
    }
  });
}

function playTrack(track) {
  const audio = document.getElementById('main-audio');
  const playerImg = document.getElementById('player-img');
  const playerTrack = document.getElementById('player-track');
  const playerArtist = document.getElementById('player-artist');

  audio.src = track.previewUrl;
  audio.play();

  playerImg.src = track.imageUrl;
  playerTrack.textContent = track.name;
  playerArtist.textContent = track.artist;
}

document.getElementById('main-audio').addEventListener('ended', () => {
  if (currentTrackIndex < queue.length - 1) {
    currentTrackIndex++;
    playTrack(queue[currentTrackIndex]);
    updateQueueDisplay();
  }
});

document.getElementById('genreFilter').addEventListener('change', () => {
  const selectedGenre = document.getElementById('genreFilter').value;
  const filteredTracks = selectedGenre
    ? allTracks.filter(track => track.genre.toLowerCase() === selectedGenre.toLowerCase())
    : allTracks;
  displayLibrary(filteredTracks);
});

document.getElementById('darkModeToggle').addEventListener('click', () => {
  document.body.classList.toggle('bg-dark-mode');
  document.body.classList.toggle('text-white');
  document.body.classList.toggle('bg-light-green');
  document.body.classList.toggle('text-dark');
  document.getElementById('navbar').style.backgroundColor = document.body.classList.contains('bg-dark-mode') ? '#2f3e46' : '#84a98c';
});

// Shuffle function
document.getElementById('shuffleBtn').addEventListener('click', () => {
    queue = shuffleArray(queue);
    currentTrackIndex = 0;
    playTrack(queue[currentTrackIndex]);
    updateQueueDisplay();
  });
  
  // Play Again function
  document.getElementById('playAgainBtn').addEventListener('click', () => {
    playTrack(queue[currentTrackIndex]);
  });
  
  // Shuffle array function
  function shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentTrackIndex < queue.length - 1) {
      currentTrackIndex++;
      playTrack(queue[currentTrackIndex]);
      updateQueueDisplay();
    }
  });
  
  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentTrackIndex > 0) {
      currentTrackIndex--;
      playTrack(queue[currentTrackIndex]);
      updateQueueDisplay();
    }
  });
  
