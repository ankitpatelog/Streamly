let songdata;
let currentPlaylist = 0;
let song = [];
let currentidx = null;
let audio = new Audio();
let isPlaying = false;

// Embedded music data
const embeddedData = {
  playlists: [
    {
      index: "0",
      name: "Sanju Rathod",
      artistcover: "songs/SanjuRathod/sanju cover.webp",
      songs: [
        {
          title: "Shaky - Sanju Rathod",
          artist: "Sanju Rathod",
          file: "songs/SanjuRathod/Shaky - Sanju Rathod 128 Kbps.mp3",
          cover: "songs/SanjuRathod/Shaky cover.jpg",
        },
      ],
    },
    {
      index: "1",
      name: "BlackPink",
      artistcover: "songs/Blackpink/blackpink cover.jpg",
      songs: [
        {
          title: "How you like that- BlackPink",
          artist: "BlackPink",
          file: "songs/Blackpink/BLACKPINK - 'How You Like That' DANCE PERFORMANCE VIDEO - BLACKPINK.mp3",
          cover: "songs/Blackpink/hylt cover.jpg",
        },
      ],
    },
    {
      index: "2",
      name: "BlackPink",
      artistcover: "songs/Blackpink/blackpink cover.jpg",
      songs: [
        {
          title: "How you like that- BlackPink",
          artist: "BlackPink",
          file: "songs/Blackpink/BLACKPINK - 'How You Like That' DANCE PERFORMANCE VIDEO - BLACKPINK.mp3",
          cover: "songs/Blackpink/hylt cover.jpg",
        },
      ],
    },
  ],
};

// Load favorites from in-memory storage (NOT localStorage)
let favorites = [];

// Save favorites to in-memory storage
function saveFavorites() {
  // Just keep in memory, no localStorage
  console.log('Favorites saved:', favorites.length);
}

// Initialize app
function init() {
  songdata = embeddedData;
  displayPlaylists();
  setupAudioControls();
  setupSeekbar();
  createSearchBar();
  attachNavigationListeners();
}

// Display all playlists (Professional Card Grid Style)
function displayPlaylists() {
  const container = document.querySelector(".cont-card");
  container.innerHTML = "";
  document.getElementById("main-heading").textContent = "Trending Playlist";

  songdata.playlists.forEach((playlist, index) => {
    container.innerHTML += `
      <div class="artist-card" onclick="openPlaylist(${index})">
        <div class="artist-cover">
          <img src="${playlist.artistcover}" alt="${playlist.name} cover">
        </div>
        <div class="artist-info">
          <h4 class="artist-name">${playlist.name}</h4>
          <p class="artist-desc">${playlist.songs.length} songs</p>
        </div>
      </div>`;
  });

  // Inject same professional card styles used in artist & search section
  const style = document.createElement("style");
  style.innerHTML = `
    .cont-card {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 20px;
      padding: 10px;
    }

    .artist-card {
      background: #181818;
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      position: relative;
    }

    .artist-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
      background: #202020;
    }

    .artist-cover img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 14px 14px 0 0;
      transition: transform 0.3s ease;
    }

    .artist-card:hover .artist-cover img {
      transform: scale(1.05);
    }

    .artist-info {
      padding: 12px 10px 18px;
      color: #fff;
    }

    .artist-name {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }

    .artist-desc {
      font-size: 12px;
      color: #b3b3b3;
      line-height: 1.4;
    }
  `;
  document.head.appendChild(style);
}


// Open selected playlist
function openPlaylist(index) {
  currentPlaylist = index;
  song = [];

  const playlist = songdata.playlists[index];
  const sidesongs = document.querySelector(".musiclist");
  sidesongs.innerHTML = "";

  playlist.songs.forEach((songItem, songIndex) => {
    song.push(songItem.file);
    
    const songId = `${index}-${songIndex}`;
    const isFav = favorites.some(fav => fav.id === songId);

    const wrapper = `
      <div class="m1" style="position: relative;">
        <svg class="favbtn" data-song-id="${songId}" onclick="event.stopPropagation(); toggleFavoriteInPlaylist(${index}, ${songIndex})" width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#ff6b6b' : 'none'}" stroke="${isFav ? '#ff6b6b' : '#fff'}" style="cursor:pointer; position: absolute; top: 5px; right: 5px; z-index: 10;">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.993 5.09691C11.0387 4.25883 9.78328 3.75 8.40796 3.75C5.42122 3.75 3 6.1497 3 9.10988C3 10.473 3.50639 11.7242 4.35199 12.67L12 20.25L19.4216 12.8944L19.641 12.6631C20.4866 11.7172 21 10.473 21 9.10988C21 6.1497 18.5788 3.75 15.592 3.75C14.2167 3.75 12.9613 4.25883 12.007 5.09692L12 5.08998L11.993 5.09691Z"/>
        </svg>
        <div class="cont-m1">
          <img src="${songItem.cover}" alt="cover">
        </div>
        <div class="cont-m2">
          <div style="font-weight: bold;">${songItem.title}</div>
          <div style="color: #ccc; font-size: 12px;">${songItem.artist}</div>
        </div>
        <div class="cont-m3">
          <svg class="playbtn" onclick="playSong(${songIndex})" width="24" height="24" viewBox="0 0 24 24" fill="white" style="cursor:pointer;">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>`;
    sidesongs.innerHTML += wrapper;
  });
}

// Play selected song
function playSong(index) {
  currentidx = index;
  audio.src = song[index];
  audio.play();
  isPlaying = true;

  document.querySelector(".play123").innerHTML =
    '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  updateCurrentDisplay(index);
  updateActiveItem(index);
}

// current song display
function updateCurrentDisplay(index) {
  const songItem = songdata.playlists[currentPlaylist].songs[index];

  document.getElementById("current-cover").src = songItem.cover;
  document.getElementById("current-cover").style.display = "block";
  document.getElementById("current-title").textContent = songItem.title;
  document.getElementById("current-artist").textContent = songItem.artist;
}

function updateActiveItem(index) {
  document
    .querySelectorAll(".m1")
    .forEach((item, i) => item.classList.toggle("playing", i === index));
}

function setupAudioControls() {
  document.querySelector(".play123").onclick = togglePlayPause;
  document.querySelector(".prevbtn").onclick = playPrevious;
  document.querySelector(".nextbtn").onclick = playNext;

  audio.ontimeupdate = updateSeekbar;
  audio.onloadedmetadata = updateDuration;
  audio.onended = playNext;
}

// Toggle play/pause
function togglePlayPause() {
  const playBtn = document.querySelector(".play123");

  if (isPlaying) {
    audio.pause();
    playBtn.innerHTML = '<path d="M8 5v14l11-7z"/>';
    isPlaying = false;
  } else {
    if (currentidx !== null && song.length > 0) {
      audio.play();
      playBtn.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
      isPlaying = true;
    }
  }
}

// Play previous song
function playPrevious() {
  if (song.length === 0) return;
  const newIndex = currentidx > 0 ? currentidx - 1 : song.length - 1;
  playSong(newIndex);
}

// Play next song
function playNext() {
  if (song.length === 0) return;
  const newIndex = currentidx < song.length - 1 ? currentidx + 1 : 0;
  playSong(newIndex);
}

function setupSeekbar() {
  document.querySelector(".line").onclick = (e) => {
    const rect = e.target.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };
}

function updateSeekbar() {
  if (!audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;
  document.querySelector(".dot").style.left = `${percent}%`;
  document.querySelector(
    ".line"
  ).style.background = `linear-gradient(to right, #1db954 ${percent}%, #404040 ${percent}%)`;
  updateTimeDisplay();
}

function updateDuration() {
  document.querySelector(".duration").textContent = formatTime(audio.duration);
  const durationSmall = document.querySelector(".duration-small");
  if (durationSmall) {
    durationSmall.textContent = formatTime(audio.duration);
  }
}

function updateTimeDisplay() {
  const currentTime = formatTime(audio.currentTime);
  document.querySelector(".current-time").textContent = currentTime;
  const currentTimeSmall = document.querySelector(".current-time-small");
  if (currentTimeSmall) {
    currentTimeSmall.textContent = currentTime;
  }
}

function formatTime(seconds) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

/* ------------------------------ */
/* 🌟 NEW FEATURES 🌟 */
/* ------------------------------ */

// 1️⃣ HOME BUTTON - Reloads the main playlist view
function showHome() {
  displayPlaylists();
  document.querySelector(".musiclist").innerHTML = "";
  document.getElementById("main-heading").textContent = "Trending Playlist";
  song = [];
  currentidx = null;
}

// 2️⃣ SEARCH FEATURE - Search by song title or artist name (hidden until clicked)
function createSearchBar() {
  const navSection = document.querySelector(".box-2");

  // Create search bar but keep it hidden initially
  const searchDiv = document.createElement("div");
  searchDiv.innerHTML = `
    <input type="text" id="searchInput" placeholder="Search songs or artists..." 
      style="width: 90%; padding: 8px; margin: 10px; border-radius: 5px; border: none; outline: none; background: #282828; color: white; display: none;">
  `;
  navSection.insertBefore(searchDiv, navSection.children[2]);

  const searchInput = searchDiv.querySelector("#searchInput");

  // Make Search button toggle visibility
  const searchButton = Array.from(document.querySelectorAll(".cont-1")).find(el =>
    el.innerText.trim().toLowerCase() === "search"
  );
  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const isVisible = searchInput.style.display === "block";
      searchInput.style.display = isVisible ? "none" : "block";
      if (!isVisible) searchInput.focus();
    });
  }

  // Search logic with professional cards
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    const container = document.querySelector(".cont-card");

    if (!query) {
      displayPlaylists();
      document.getElementById("main-heading").textContent = "Trending Playlist";
      return;
    }

    document.getElementById("main-heading").textContent = `Search Results for "${query}"`;

    const results = [];
    songdata.playlists.forEach((playlist, pIndex) => {
      playlist.songs.forEach((songItem, sIndex) => {
        if (
          songItem.title.toLowerCase().includes(query) ||
          songItem.artist.toLowerCase().includes(query)
        ) {
          results.push({ ...songItem, playlistIndex: pIndex, songIndex: sIndex });
        }
      });
    });

    container.innerHTML = "";

    if (results.length === 0) {
      container.innerHTML = `<div style="color:#ccc;text-align:center;padding:20px;">No songs found.</div>`;
      return;
    }

    // Use professional card design for search results
    results.forEach((songItem) => {
      const songId = `${songItem.playlistIndex}-${songItem.songIndex}`;
      const isFav = favorites.some(fav => fav.id === songId);

      container.innerHTML += `
        <div class="artist-card" onclick="openPlaylist(${songItem.playlistIndex})">
          <div class="artist-cover">
            <img src="${songItem.cover}" alt="${songItem.title}">
          </div>
          <div class="artist-info">
            <h4 class="artist-name">${songItem.title}</h4>
            <p class="artist-desc">${songItem.artist}</p>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="${isFav ? '#ff6b6b' : 'none'}"
            stroke="${isFav ? '#ff6b6b' : '#fff'}"
            style="cursor:pointer; position:absolute; top:10px; right:10px;"
            onclick="event.stopPropagation(); toggleFavoriteInPlaylist(${songItem.playlistIndex}, ${songItem.songIndex})">
            <path fill-rule="evenodd" clip-rule="evenodd" 
              d="M11.993 5.09691C11.0387 4.25883 9.78328 3.75 8.40796 3.75C5.42122 3.75 
                 3 6.1497 3 9.10988C3 10.473 3.50639 11.7242 4.35199 
                 12.67L12 20.25L19.4216 12.8944L19.641 
                 12.6631C20.4866 11.7172 21 10.473 
                 21 9.10988C21 6.1497 18.5788 3.75 
                 15.592 3.75C14.2167 3.75 12.9613 
                 4.25883 12.007 5.09692L12 
                 5.08998L11.993 5.09691Z"/>
          </svg>
        </div>`;
    });

    // Apply same grid layout as artist section
    const style = document.createElement("style");
    style.innerHTML = `
      .cont-card {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 20px;
        padding: 10px;
      }

      .artist-card {
        background: #181818;
        border-radius: 14px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 0 0 rgba(0, 0, 0, 0);
        text-align: center;
        position: relative;
      }

      .artist-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
        background: #202020;
      }

      .artist-cover img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 14px 14px 0 0;
        transition: transform 0.3s ease;
      }

      .artist-card:hover .artist-cover img {
        transform: scale(1.05);
      }

      .artist-info {
        padding: 12px 10px 18px;
        color: #fff;
      }

      .artist-name {
        font-size: 15px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 6px;
        letter-spacing: 0.5px;
      }

      .artist-desc {
        font-size: 12px;
        color: #b3b3b3;
        line-height: 1.4;
        height: 35px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `;
    document.head.appendChild(style);
  });
}



// 🎤 Artist Data (JSON-style)
const artistData = [
  {
    name: "Sanju Rathod",
    cover: "songs/SanjuRathod/sanju cover.webp",
    description: "Sanju Rathod is known for his vibrant regional music and soulful tracks.",
  },
  {
    name: "BlackPink",
    cover: "songs/Blackpink/blackpink cover.jpg",
    description: "BlackPink is a popular K-pop girl group blending EDM, pop, and hip-hop.",
  },
  {
    name: "Arijit Singh",
    cover: "songs/Arijit/arijit_cover.jpg",
    description: "Arijit Singh is a renowned playback singer famous for emotional melodies.",
  },
];


// 3️⃣ ARTIST BUTTON - Show artists from JSON data (Professional Card Grid Style)
function showArtists() {
  document.getElementById("main-heading").textContent = "All Artists";
  const container = document.querySelector(".cont-card");
  container.innerHTML = "";

  // Create artist cards grid
  artistData.forEach((artist) => {
    container.innerHTML += `
      <div class="artist-card" onclick="filterByArtist('${artist.name}')">
        <div class="artist-cover">
          <img src="${artist.cover}" alt="${artist.name} cover">
        </div>
        <div class="artist-info">
          <h4 class="artist-name">${artist.name}</h4>
          <p class="artist-desc">${artist.description}</p>
        </div>
      </div>`;
  });

  // Inject modern CSS styling for artist cards dynamically
  const style = document.createElement("style");
  style.innerHTML = `
    .cont-card {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 20px;
      padding: 10px;
    }

    .artist-card {
      background: #181818;
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 0 0 rgba(0, 0, 0, 0);
      text-align: center;
      position: relative;
    }

    .artist-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
      background: #202020;
    }

    .artist-cover img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 14px 14px 0 0;
      transition: transform 0.3s ease;
    }

    .artist-card:hover .artist-cover img {
      transform: scale(1.05);
    }

    .artist-info {
      padding: 12px 10px 18px;
      color: #fff;
    }

    .artist-name {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }

    .artist-desc {
      font-size: 12px;
      color: #b3b3b3;
      line-height: 1.4;
      height: 35px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
  document.head.appendChild(style);
}




function filterByArtist(artist) {
  document.getElementById("main-heading").textContent = `Songs by ${artist}`;
  const container = document.querySelector(".cont-card");
  container.innerHTML = "";
  
  songdata.playlists.forEach((playlist, pIndex) => {
    if (playlist.name === artist) {
      playlist.songs.forEach((songItem, sIndex) => {
        const songId = `${pIndex}-${sIndex}`;
        const isFav = favorites.some(fav => fav.id === songId);
        
        container.innerHTML += `
          <div class="cards" onclick="openPlaylist(${pIndex})">
            <div class="cover"><img src="${songItem.cover}" alt="cover"></div>
            <div class="song-info">
              <div style="font-weight:bold;">${songItem.title}</div>
              <div style="font-size:12px;color:#ccc;">${songItem.artist}</div>
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="${isFav ? '#ff6b6b' : 'none'}"
                 stroke="${isFav ? '#ff6b6b' : '#fff'}" style="cursor:pointer;margin:6px"
                 onclick="event.stopPropagation(); toggleFavoriteInPlaylist(${pIndex}, ${sIndex})">
              <path fill-rule="evenodd" clip-rule="evenodd" 
                    d="M11.993 5.09691C11.0387 4.25883 9.78328 3.75 8.40796 3.75C5.42122 3.75 
                       3 6.1497 3 9.10988C3 10.473 3.50639 11.7242 4.35199 
                       12.67L12 20.25L19.4216 12.8944L19.641 
                       12.6631C20.4866 11.7172 21 10.473 
                       21 9.10988C21 6.1497 18.5788 3.75 
                       15.592 3.75C14.2167 3.75 12.9613 
                       4.25883 12.007 5.09692L12 
                       5.08998L11.993 5.09691Z"/>
            </svg>
          </div>`;
      });
    }
  });
}

// 4️⃣ FAVORITES SYSTEM - Toggle favorite with heart icon
function toggleFavoriteInPlaylist(playlistIndex, songIndex) {
  const songId = `${playlistIndex}-${songIndex}`;
  const songItem = songdata.playlists[playlistIndex].songs[songIndex];
  const playlist = songdata.playlists[playlistIndex];
  
  const index = favorites.findIndex((f) => f.id === songId);
  
  if (index !== -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push({
      id: songId,
      playlistIndex: playlistIndex,
      songIndex: songIndex,
      title: songItem.title,
      artist: songItem.artist,
      file: songItem.file,
      cover: songItem.cover,
      artistName: playlist.name
    });
  }
  
  saveFavorites();
  
  // Update heart icon
  const heartIcon = document.querySelector(`[data-song-id="${songId}"]`);
  if (heartIcon) {
    const isFav = favorites.some(fav => fav.id === songId);
    heartIcon.setAttribute('fill', isFav ? '#ff6b6b' : 'none');
    heartIcon.setAttribute('stroke', isFav ? '#ff6b6b' : '#fff');
  }
}

// 5️⃣ SHOW FAVORITES PAGE (Professional Card Grid Style)
function showFavorites() {
  document.getElementById("main-heading").textContent = "My Favorites";
  const container = document.querySelector(".cont-card");
  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML = `<div style="color:#ccc;text-align:center;padding:20px;">No favorite songs yet. Click the heart icon on any song to add it here!</div>`;
    return;
  }

  favorites.forEach((fav) => {
    container.innerHTML += `
      <div class="artist-card" onclick="playFavoriteSong('${fav.id}')">
        <div class="artist-cover" style="position: relative;">
          <img src="${fav.cover}" alt="cover">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#ff6b6b"
               stroke="#ff6b6b" style="cursor:pointer; position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); border-radius: 50%; padding: 4px;"
               onclick="event.stopPropagation(); removeFavorite('${fav.id}')">
            <path fill-rule="evenodd" clip-rule="evenodd" 
              d="M11.993 5.09691C11.0387 4.25883 9.78328 3.75 8.40796 3.75C5.42122 3.75 
                 3 6.1497 3 9.10988C3 10.473 3.50639 11.7242 4.35199 
                 12.67L12 20.25L19.4216 12.8944L19.641 
                 12.6631C20.4866 11.7172 21 10.473 
                 21 9.10988C21 6.1497 18.5788 3.75 
                 15.592 3.75C14.2167 3.75 12.9613 
                 4.25883 12.007 5.09692L12 
                 5.08998L11.993 5.09691Z"/>
          </svg>
        </div>
        <div class="artist-info">
          <h4 class="artist-name">${fav.title}</h4>
          <p class="artist-desc">${fav.artist}</p>
          <p style="font-size:11px; color:#888;">Artist: ${fav.artistName}</p>
        </div>
      </div>`;
  });

  // Inject same style (for consistency)
  const style = document.createElement("style");
  style.innerHTML = `
    .cont-card {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 20px;
      padding: 10px;
    }

    .artist-card {
      background: #181818;
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      position: relative;
    }

    .artist-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
      background: #202020;
    }

    .artist-cover img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 14px 14px 0 0;
      transition: transform 0.3s ease;
    }

    .artist-card:hover .artist-cover img {
      transform: scale(1.05);
    }

    .artist-info {
      padding: 12px 10px 18px;
      color: #fff;
    }

    .artist-name {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }

    .artist-desc {
      font-size: 12px;
      color: #b3b3b3;
      line-height: 1.4;
      height: 35px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
  document.head.appendChild(style);
}


function playFavoriteSong(songId) {
  const fav = favorites.find(f => f.id === songId);
  if (fav) {
    openPlaylist(fav.playlistIndex);
    setTimeout(() => playSong(fav.songIndex), 100);
  }
}

function removeFavorite(songId) {
  const index = favorites.findIndex(f => f.id === songId);
  if (index !== -1) {
    favorites.splice(index, 1);
    saveFavorites();
    showFavorites(); // Refresh the view
  }
}

// 6️⃣ ATTACH NAVIGATION LISTENERS
function attachNavigationListeners() {
  document.querySelectorAll(".cont-1").forEach((el) => {
    const text = el.innerText.trim().toLowerCase();
    if (text === "home") el.addEventListener("click", showHome);
    if (text === "artist") el.addEventListener("click", showArtists);
    if (text === "favorites") el.addEventListener("click", showFavorites);
  });
}

// Initialize on page load
window.addEventListener("load", init);