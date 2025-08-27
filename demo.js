let countplaylist; // number of playlists
let songdata;

let currentPlaylist = 0;   // 🔑 keep track of which playlist is open
let song = [];             
let currentidx = null;

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

    sidesongs.innerHTML = sidesongs.innerHTML + wrapper;
  }
}

// one global audio element stores current palying song 
let audio = new Audio();

// listen for clicks on play buttons
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("playbtn")) {

    let index = parseInt(e.target.dataset.no, 10);

    // 🎵 If same song clicked
    if (currentidx === index) {
      if (audio.paused) {
        audio.play(); //  resume from paused position
        e.target.src = "/svg/pause.svg";
        document.querySelector(".play123").src = "/svg/pause.svg";
      } else {
        audio.pause(); //  pause but keep currentTime
        e.target.src = "/svg/play.svg";
        document.querySelector(".play123").src = "/svg/play.svg";
      }
      return; // 🔑 stop here so it won’t reset src
    }

    // 🎵 Different song → load from start
    currentidx = index;
    audio.src = song[index];
    audio.play();

    // Reset all playlist buttons
    document.querySelectorAll(".playbtn").forEach(btn => {
      btn.src = "/svg/play.svg";
    });

    // Set clicked button + playbar to pause icon
    e.target.src = "/svg/pause.svg";
    document.querySelector(".play123").src = "/svg/pause.svg";
  }
});


// playbar button
let playbarBtn = document.querySelector(".play123");
playbarBtn.addEventListener("click", () => {
  if (!currentidx && currentidx !== 0) return; // no song chosen yet

  if (audio.paused) {
    audio.play();
    playbarBtn.src = "/svg/pause.svg";

    // also update the playlist button for current song
    let btn = document.querySelector(`.playbtn[data-no="${currentidx}"]`);
    if (btn) btn.src = "/svg/pause.svg";

  } else {
    audio.pause();
    playbarBtn.src = "/svg/play.svg";

    // also update the playlist button for current song
    let btn = document.querySelector(`.playbtn[data-no="${currentidx}"]`);
    if (btn) btn.src = "/svg/play.svg";
  }
});

// previous button
let prevbtn = document.querySelector(".prevbtn"); // make sure your HTML has class="prevbtn"
prevbtn.addEventListener("click", () => {
  if (currentidx == null) return; // no song selected yet

  // go to previous index (loop if needed)
  let previdx = (currentidx - 1 + song.length) % song.length;
  currentidx = previdx;

  // change source and play
  audio.src = song[previdx];
  audio.play();

  // reset all playlist buttons to play
  document.querySelectorAll(".playbtn").forEach(btn => {
    btn.src = "/svg/play.svg";
  });

  // update the new active playlist button
  let btn = document.querySelector(`.playbtn[data-no="${previdx}"]`);
  if (btn) btn.src = "/svg/pause.svg";

  // update playbar
  document.querySelector(".play123").src = "/svg/pause.svg";
});

// next button
let nextbtn = document.querySelector(".nextbtn"); // make sure your HTML has class="nextbtn"
nextbtn.addEventListener("click", () => {
  if (currentidx == null) return; // no song selected yet

  // go to next index (loop if needed)
  let nextidx = (currentidx + 1) % song.length;
  currentidx = nextidx;

  // change source and play
  audio.src = song[nextidx];
  audio.play();

  // reset all playlist buttons to play
  document.querySelectorAll(".playbtn").forEach(btn => {
    btn.src = "/svg/play.svg";
  });

  // update the new active playlist button
  let btn = document.querySelector(`.playbtn[data-no="${nextidx}"]`);
  if (btn) btn.src = "/svg/pause.svg";

  // update playbar
  document.querySelector(".play123").src = "/svg/pause.svg";
});

displayplaylist();
