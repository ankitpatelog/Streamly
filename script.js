console.log("hello world");

let countplaylist; //no of playlist
let songdata;
let initialsong = [];
let clickedsong = [];
async function displayplaylist(params) {
  await fetch("songs.json")
    .then((Response) => Response.json())
    .then((data) => {
      countplaylist = data.playlists.length;
      songdata = data;
    });

  // adding the playllist according to the json file
  for (let i = 0; i < countplaylist; i++) {
    console.log(songdata);
    let artistname = songdata.playlists[i].name;
    let artistcover = songdata.playlists[i].artistcover;
    let artistindex = songdata.playlists[i].index;

    let container = document.querySelector(".cont-card");
    let cardsHTML = `<div class="cards" data-index="${artistindex}" onclick = "rendersongs(this.dataset.index)"   >
    <div class="cover">
    <img class ="artist-src" src="${artistcover}" alt="cover image" srcset="">
    </div>
    <div class="song-info">
    <div class="artist">${artistname}</div>
    </div>
    </div>`;

    container.innerHTML = container.innerHTML + cardsHTML;
  }
  let sidesongs = document.querySelector(".musiclist");
  sidesongs.innerHTML = "";
}

//fetch playlist songs form the json and disply in the side bar
function rendersongs(value) {
  console.log(value);


  let sidesongs = document.querySelector(".musiclist");
  sidesongs.innerHTML = "";

  let songslength = songdata.playlists[value].songs.length;

  for (let i = 0; i < songslength; i++) {
    console.log(songslength); //how many songs in the playlist

    let songurl = songdata.playlists[value].songs[0].file;
    let songtitle = songdata.playlists[value].songs[0].title;
    let cover = songdata.playlists[value].songs[0].cover;

    let wrapper = `<div class="m1">
    <div class="cont-m1">
    <img src="${cover}" alt="songcover" srcset="">
    </div>
    <div class="cont-m2">${songtitle}</div>
    <div class="cont-m3">
    <img src="/svg/play.svg" alt="" width="40" height="40" style="filter: brightness(0) invert(1);">
    </div>
    </div>`;

    let sidesongs = document.querySelector(".musiclist");
    sidesongs.innerHTML = sidesongs.innerHTML + wrapper;
}
}
displayplaylist();
