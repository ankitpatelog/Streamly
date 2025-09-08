let countplaylist;
let songdata;
let currentPlaylist = 0;
let song = [];
let currentidx = null;
let currentView = "home";
let favorites = [];
let audio = new Audio();
let isPlaying = false;

// Configuration - Change this to your JSON file path
const JSON_FILE_PATH = "data.json"; // Put your JSON file here

// Fetch song data from JSON file
async function fetchSongData() {
  try {
    const response = await fetch(JSON_FILE_PATH);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching song data:", error);
    throw error;
  }
}

// Show home view
function showHome() {
  currentView = "home";
  displayplaylist();
  document.getElementById("main-heading").textContent = "Trending Playlist";

  document.querySelector(".musiclist").innerHTML = "";
  song = [];
  currentidx = null;
  updateNavigation(document.querySelector('.cont-1[onclick="showHome()"]'));
}

// Favorites Management Functions
function addToFavorites(playlistIndex, songIndex) {
  const songId = `${playlistIndex}-${songIndex}`;
  const songItem = songdata.playlists[playlistIndex].songs[songIndex];
  const playlist = songdata.playlists[playlistIndex];

  const favoriteItem = {
    id: songId,
    playlistIndex: playlistIndex,
    songIndex: songIndex,
    title: songItem.title,
    cover: songItem.cover,
    file: songItem.file,
    artist: songItem.artist,
    artistName: playlist.name,
  };

  const existingIndex = favorites.findIndex((fav) => fav.id === songId);
  if (existingIndex === -1) {
    favorites.push(favoriteItem);
    console.log("Added to favorites:", favoriteItem.title);
  } else {
    favorites.splice(existingIndex, 1);
    console.log("Removed from favorites:", favoriteItem.title);
  }

  updateHeartIcon(songId);

  if (currentView === "favorites") {
    showFavorites();
  }
}

function updateHeartIcon(songId) {
  const heartIcon = document.querySelector(`[data-song-id="${songId}"]`);
  if (heartIcon) {
    const isFavorite = favorites.some((fav) => fav.id === songId);
    heartIcon.style.fill = isFavorite ? "#ff6b6b" : "none";
    heartIcon.style.stroke = isFavorite ? "#ff6b6b" : "#ffffff";
  }
}

function showFavorites() {
  currentView = "favorites";
  document.getElementById("main-heading").textContent = "My Favorites";
  updateNavigation(
    document.querySelector('.cont-1[onclick="showFavorites()"]')
  );

  const container = document.querySelector(".cont-card");
  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML = `
            <div style="text-align: center; color: #ccc; padding: 50px;">
              <h3>No favorites yet!</h3>
              <p>Add some songs to your favorites to see them here.</p>
            </div>`;

    document.querySelector(".musiclist").innerHTML = "";
    return;
  }

  favorites.forEach((favorite, index) => {
    const cardHTML = `
            <div class="cards favorite-card" onclick="playFavoriteSong(${index})">
              <div class="cover">
                <img class="artist-src" src="${favorite.cover}" alt="cover image">
              </div>
              <div class="song-info">
                <div class="artist" style="font-size: 14px;">${favorite.title}</div>
                <div style="font-size: 12px; color: #ccc;">${favorite.artist}</div>
              </div>
            </div>`;
    container.innerHTML += cardHTML;
  });

  renderFavoritesSidebar();
}

function renderFavoritesSidebar() {
  song = [];
  const sidesongs = document.querySelector(".musiclist");
  sidesongs.innerHTML = "";

  favorites.forEach((favorite, index) => {
    song.push(favorite.file);

    const wrapper = `<div class="m1">
            <svg class="favbtn" data-song-id="${favorite.id}" onclick="removeFromFavorites('${favorite.id}')" width="20" height="20" viewBox="0 0 24 24" fill="#ff6b6b" stroke="#ff6b6b" style="cursor: pointer;">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.993 5.09691C11.0387 4.25883 9.78328 3.75 8.40796 3.75C5.42122 3.75 3 6.1497 3 9.10988C3 10.473 3.50639 11.7242 4.35199 12.67L12 20.25L19.4216 12.8944L19.641 12.6631C20.4866 11.7172 21 10.473 21 9.10988C21 6.1497 18.5788 3.75 15.592 3.75C14.2167 3.75 12.9613 4.25883 12.007 5.09692L12 5.08998L11.993 5.09691Z"/>
            </svg>
            <div class="cont-m1">
              <img src="${favorite.cover}" alt="cover">
            </div>
            <div class="cont-m2">
              <div style="font-weight: bold;">${favorite.title}</div>
              <div style="color: #ccc; font-size: 12px;">${favorite.artist}</div>
            </div>
            <div class="cont-m3">
              <svg class="playbtn" onclick="playsong(${index})" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>`;
    sidesongs.innerHTML += wrapper;
  });
}

function removeFromFavorites(songId) {
  const index = favorites.findIndex((fav) => fav.id === songId);
  if (index !== -1) {
    favorites.splice(index, 1);
    showFavorites();
  }
}

function playFavoriteSong(index) {
  renderFavoritesSidebar();
  playsong(index);
}

function playsong(index) {
  if (song.length === 0) return;

  currentidx = index;
  audio.src = song[index];
  audio.play();
  isPlaying = true;

  const playBtn = document.querySelector(".play123");
  playBtn.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';

  updateCurrentSongDisplay(index);

  document.querySelectorAll(".m1").forEach((item, i) => {
    item.classList.toggle("playing", i === index);
  });
}

function updateCurrentSongDisplay(index) {
  const cover = document.getElementById("current-cover");
  const title = document.getElementById("current-title");
  const artist = document.getElementById("current-artist");

  if (currentView === "favorites" && favorites[index]) {
    cover.src = favorites[index].cover;
    cover.style.display = "block";
    title.textContent = favorites[index].title;
    artist.textContent = favorites[index].artist;
  } else if (
    currentView === "home" &&
    songdata.playlists[currentPlaylist] &&
    songdata.playlists[currentPlaylist].songs[index]
  ) {
    const songItem = songdata.playlists[currentPlaylist].songs[index];
    cover.src = songItem.cover;
    cover.style.display = "block";
    title.textContent = songItem.title;
    artist.textContent = songItem.artist;
  }
}

// Initialize the app
async function init() {
  try {
    // Show loading message
    document.querySelector(".cont-card").innerHTML =
      '<div class="loading">Loading playlists...</div>';

    // Fetch data from JSON file
    songdata = await fetchSongData();
    countplaylist = songdata.playlists.length;

    // Initialize the app
    displayplaylist();
    setupAudioControls();
    setupSeekbar();

    // Set home as active by default
    updateNavigation(document.querySelector('.cont-1[onclick="showHome()"]'));
  } catch (error) {
    // Show error message
    document.querySelector(".cont-card").innerHTML = `
            <div class="error">
              <h3>Error loading music data</h3>
              <p>Please make sure the JSON file exists and is accessible.</p>
              <p>Error: ${error.message}</p>
            </div>`;
  }
}

function displayplaylist() {
  const container = document.querySelector(".cont-card");
  container.innerHTML = "";

  songdata.playlists.forEach((playlist, index) => {
    const cardHTML = `
            <div class="cards" onclick="openPlaylist(${index})">
              <div class="cover">
                <img class="artist-src" src="${playlist.artistcover}" alt="playlist cover" onerror="this.style.display='none'">
              </div>
              <div class="song-info">
                <div class="artist">${playlist.name}</div>
                <div style="font-size: 12px; color: #ccc;">${playlist.songs.length} songs</div>
              </div>
            </div>`;
    container.innerHTML += cardHTML;
  });
}

function openPlaylist(index) {
  currentPlaylist = index;
  currentView = "home";
  song = [];

  const playlist = songdata.playlists[index];
  const sidesongs = document.querySelector(".musiclist");
  sidesongs.innerHTML = "";

  playlist.songs.forEach((songItem, songIndex) => {
    song.push(songItem.file);
    const songId = `${index}-${songIndex}`;
    const isFavorite = favorites.some((fav) => fav.id === songId);

    const wrapper = `<div class="m1">
            <svg class="favbtn" data-song-id="${songId}" onclick="addToFavorites(${index}, ${songIndex})" width="18" height="18" viewBox="0 0 24 24" fill="${
      isFavorite ? "#ff6b6b" : "none"
    }" stroke="${isFavorite ? "#ff6b6b" : "#ffffff"}" stroke-width="2">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.993 5.09691C11.0387 4.25883 9.78328 3.75 8.40796 3.75C5.42122 3.75 3 6.1497 3 9.10988C3 10.473 3.50639 11.7242 4.35199 12.67L12 20.25L19.4216 12.8944L19.641 12.6631C20.4866 11.7172 21 10.473 21 9.10988C21 6.1497 18.5788 3.75 15.592 3.75C14.2167 3.75 12.9613 4.25883 12.007 5.09692L12 5.08998L11.993 5.09691Z"/>
            </svg>
            <div class="cont-m1">
              <img src="${
                songItem.cover
              }" alt="cover" onerror="this.style.display='none'">
            </div>
            <div class="cont-m2">
              <div style="font-weight: bold;">${songItem.title}</div>
              <div style="color: #ccc; font-size: 12px;">${
                songItem.artist
              }</div>
            </div>
            <div class="cont-m3">
              <svg class="playbtn" onclick="playsong(${songIndex})" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>`;
    sidesongs.innerHTML += wrapper;
  });
}

function setupAudioControls() {
  const playBtn = document.querySelector(".play123");
  const prevBtn = document.querySelector(".prevbtn");
  const nextBtn = document.querySelector(".nextbtn");

  playBtn.onclick = togglePlayPause;
  prevBtn.onclick = playPrevious;
  nextBtn.onclick = playNext;

  audio.addEventListener("timeupdate", updateSeekbar);
  audio.addEventListener("loadedmetadata", updateDuration);
  audio.addEventListener("ended", playNext);
}

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

function playPrevious() {
  if (song.length === 0) return;

  if (currentidx > 0) {
    playsong(currentidx - 1);
  } else {
    playsong(song.length - 1);
  }
}

function playNext() {
  if (song.length === 0) return;

  if (currentidx < song.length - 1) {
    playsong(currentidx + 1);
  } else {
    playsong(0);
  }
}

function setupSeekbar() {
  const seekbar = document.querySelector(".line");
  const dot = document.querySelector(".dot");

  seekbar.addEventListener("click", (e) => {
    const rect = seekbar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  });

  dot.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const rect = seekbar.getBoundingClientRect();

    function mousemove(e) {
      const percent = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      audio.currentTime = percent * audio.duration;
    }

    function mouseup() {
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    }

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  });
}

function updateSeekbar() {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    const dot = document.querySelector(".dot");
    dot.style.left = `${percent}%`;

    const progressBar = document.querySelector(".line");
    progressBar.style.background = `linear-gradient(to right, #1db954 0%, #1db954 ${percent}%, #404040 ${percent}%, #404040 100%)`;
  }

  updateTimeDisplay();
}

function updateDuration() {
  const duration = formatTime(audio.duration);
  document.querySelector(".duration").textContent = duration;
  document.querySelector(".duration-small").textContent = duration;
}

function updateTimeDisplay() {
  const currentTime = formatTime(audio.currentTime);
  document.querySelector(".current-time").textContent = currentTime;
  document.querySelector(".current-time-small").textContent = currentTime;
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === 0) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function updateNavigation(activeElement) {
  document.querySelectorAll(".cont-1").forEach((item) => {
    item.classList.remove("active");
  });
  activeElement.classList.add("active");
}

// Initialize the app when page loads
window.addEventListener("load", init);

// JSO data 
const embeddedData = {
  playlists: [
    {
      index: "0",
      name: "Sanju Rathod",
      artistcover: "songs/SanjuRathod/sanju cover.webp",
      songs: [
        {
          no: 1,
          title: "Shaky - Sanju Rathod",
          artist: "Sanju Rathod",
          duration: "2:45",
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
          no: 2,
          title: "Pink Venom- BlackPink",
          artist: "BlackPink",
          duration: "3:00",
          file: "songs/Blackpink/BLACKPINK - Shut Down M_V - BLACKPINK.mp3",
          cover: "songs/Blackpink/pink venom cover.jpg",
        },
        {
          no: 3,
          title: "How you like that- BlackPink",
          artist: "BlackPink",
          duration: "3:00",
          file: "songs/Blackpink/BLACKPINK - 'How You Like That' DANCE PERFORMANCE VIDEO - BLACKPINK.mp3",
          cover: "songs/Blackpink/hylt cover.jpg",
        },
        {
          no: 4,
          title: "Pink Venom- BlackPink",
          artist: "BlackPink",
          duration: "3:00",
          file: "songs/Blackpink/BLACKPINK - Shut Down M_V - BLACKPINK.mp3",
          cover: "songs/Blackpink/pink venom cover.jpg",
        },
        {
          no: 5,
          title: "How you like that- BlackPink",
          artist: "BlackPink",
          duration: "3:00",
          file: "songs/Blackpink/BLACKPINK - 'How You Like That' DANCE PERFORMANCE VIDEO - BLACKPINK.mp3",
          cover: "songs/Blackpink/hylt cover.jpg",
        },
      ],
    },
  ],
};

// Modified fetchSongData function to use embedded data
async function fetchSongData() {
  try {
    // First try to fetch from external JSON file
    const response = await fetch("./newjson.json");
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("External JSON file not found, using embedded data");
    }
  } catch (error) {
    console.log("Using embedded data:", error.message);
    // Fallback to embedded data
    return embeddedData;
  }
}
