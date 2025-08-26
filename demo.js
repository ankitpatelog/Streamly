let countplaylist; // number of playlists
let songdata;

let currentPlaylist = 0;   // 🔑 keep track of which playlist is open
let song = [];             // only songs of current playlist
let currentidx = -1;

// fetch playlists and render
async function displayplaylist() {
  await fetch("songs.json")
    .then((Response) => Response.json())
    .then((data) => {
      countplaylist = data.playlists.length;
      songdata = data;
    });

  // add playlist cards
  let container = document.querySelector(".cont-card");
  container.innerHTML = "";
  for (let i = 0; i < countplaylist; i++) {
    let artistname = songdata.playlists[i].name;
    let artistcover = songdata.playlists[i].artistcover;
    let artistindex = songdata.playlists[i].index;

    let cardsHTML = `<div class="cards" data-index="${artistindex}" onclick="rendersongs(${artistindex})">
      <div class="cover">
        <img class="artist-src" src="${artistcover}" alt="cover image">
      </div>
      <div class="song-info">
        <div class="artist">${artistname}</div>
      </div>
    </div>`;

    container.innerHTML += cardsHTML;
  }
}

// render songs of one playlist
function rendersongs(value) {
  currentPlaylist = value;   // 🔑 update current playlist
  song = [];                 // reset to only that playlist’s songs

  let sidesongs = document.querySelector(".musiclist");
  sidesongs.innerHTML = "";

  let songslength = songdata.playlists[value].songs.length;

  for (let i = 0; i < songslength; i++) {
    let songurl = songdata.playlists[value].songs[i].file;
    let songtitle = songdata.playlists[value].songs[i].title;
    let cover = songdata.playlists[value].songs[i].cover;

    song.push(songurl);  // only push songs of current playlist

    let wrapper = `<div class="m1">
      <div class="cont-m1">
        <img src="${cover}" alt="songcover">
      </div>
      <div class="cont-m2">${songtitle}</div>
      <div class="cont-m3">
        <img class="playbtn" data-no="${i}" src="/svg/play.svg" alt="" width="40" height="40" style="filter: brightness(0) invert(1);">
      </div>
    </div>`;

    sidesongs.innerHTML += wrapper;
  }
}

// one global audio element
let audio = new Audio();

// listen for clicks on play buttons
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("playbtn")) {
    let index = parseInt(e.target.dataset.no, 10); // local index inside playlist
    currentidx = index;

    audio.src = song[index];   // ✅ only uses current playlist songs
    audio.play();

    console.log(`▶️ Playing from playlist ${currentPlaylist}, song index ${index}:`, song[index]);
  }
});

displayplaylist();
