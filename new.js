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

// Initialize app
function init() {
  songdata = embeddedData;
  displayPlaylists();
  setupAudioControls();
  setupSeekbar();
}

// Display all playlists
function displayPlaylists() {
  const container = document.querySelector(".cont-card");
  container.innerHTML = "";

  songdata.playlists.forEach((playlist, index) => {
    const cardHTML = `
      <div class="cards" onclick="openPlaylist(${index})">
        <div class="cover">
          <img class="artist-src" src="${playlist.artistcover}" alt="playlist cover">
        </div>
        <div class="song-info">
          <div class="artist">${playlist.name}</div>
          <div style="font-size: 12px; color: #ccc;">${playlist.songs.length} songs</div>
        </div>
      </div>`;
    container.innerHTML += cardHTML;
  });
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

    const wrapper = `
      <div class="m1">
        <div class="cont-m1">
          <img src="${songItem.cover}" alt="cover">
        </div>
        <div class="cont-m2">
          <div style="font-weight: bold;">${songItem.title}</div>
          <div style="color: #ccc; font-size: 12px;">${songItem.artist}</div>
        </div>
        <div class="cont-m3">
          <svg class="playbtn" onclick="playSong(${songIndex})" width="24" height="24" viewBox="0 0 24 24" fill="white">
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
}

function updateTimeDisplay() {
  document.querySelector(".current-time").textContent = formatTime(
    audio.currentTime
  );
}

function formatTime(seconds) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}
// Initialize on page load
window.addEventListener("load", init);
