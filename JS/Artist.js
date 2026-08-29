
const artistsDatabase = {
  "101": {
    name: "AURORA",
    role: "Singer • Songwriter • Producer",
    bio: "AURORA is a soulful singer and songwriter who creates music that touches the heart and stays with you forever.",
    listeners: "2.4M",
    streams: "1.2B",
    songsCount: "45",
    image: "https://media.istockphoto.com/id/1778147067/photo/photo-of-pretty-cool-lady-wear-tinsel-jacket-rising-discoball-singing-songs-isolated-neon.jpg?b=1&s=612x612&w=0&k=20&c=OUWfK4H_8WbLOrrEnEraWrhEaQbRQ3EzPiKIPEg3irM=",


songs: [
  { id: "s1", title: "Runaway", album: "All My Demons Greeting Me", plays: "412M", duration: "4:08", img: "https://images.pexels.com/photos/12311203/pexels-photo-12311203.jpeg", audioUrl: "./audio/ranaway.mp3" },
  { id: "s2", title: "Cure For Me", album: "The Gods We Can Touch", plays: "189M", duration: "3:21", img: "https://images.pexels.com/photos/4552528/pexels-photo-4552528.jpeg", audioUrl: "./audio/song2.mp3" },
  { id: "s3", title: "Giving In To The Love", album: "The Gods We Can Touch", plays: "95M", duration: "3:01", img: "https://images.pexels.com/photos/7715779/pexels-photo-7715779.jpeg", audioUrl: "./audio/song3.mp3" },
  { id: "s4", title: "Seed", album: "A Different Kind of Human", plays: "64M", duration: "4:27", img: "https://images.pexels.com/photos/14045843/pexels-photo-14045843.jpeg", audioUrl: "./audio/song4.mp3" },
  { id: "s5", title: "Running with the Wolves", album: "All My Demons Greeting Me", plays: "143M", duration: "3:14", img: "https://images.pexels.com/photos/7802596/pexels-photo-7802596.jpeg", audioUrl: "./audio/song5.mp3" }
]

  }
};


let currentAudio = new Audio();

let currentSongId = null;


document.addEventListener("DOMContentLoaded", () => {

  const urlParams = new URLSearchParams(window.location.search);
  const artistId = urlParams.get("id") || "101";
  const artist = artistsDatabase[artistId];


  if (artist) {

    // =========================
    // HERO
    // =========================

    const nameEl = document.getElementById("artist-name");
    const roleEl = document.getElementById("artist-role");
    const bioEl = document.getElementById("artist-bio");
    const listenersEl = document.getElementById("artist-listeners");
    const streamsEl = document.getElementById("artist-streams");
    const songsCountEl = document.getElementById("artist-songs-count");
    const mainImgEl = document.getElementById("hero-main-img");
    const blurImgEl = document.getElementById("hero-blur-img");


    if (nameEl) nameEl.innerText = artist.name;
    if (roleEl) roleEl.innerText = artist.role;
    if (bioEl) bioEl.innerText = artist.bio;
    if (listenersEl) listenersEl.innerText = artist.listeners;
    if (streamsEl) streamsEl.innerText = artist.streams;
    if (songsCountEl) songsCountEl.innerText = artist.songsCount;

    if (mainImgEl) mainImgEl.src = artist.image;

    if (blurImgEl) {
      blurImgEl.style.backgroundImage = `url('${artist.image}')`;
    }


    // =========================
    // POPULAR SONGS
    // =========================

    const songsListContainer =
      document.getElementById("popular-songs-list");


    if (songsListContainer) {

      songsListContainer.innerHTML = "";


      artist.songs.forEach((song, index) => {

        const songRow = document.createElement("div");

        songRow.className =
          "song-row d-flex align-items-center justify-content-between p-3";

        songRow.dataset.songId = song.id;


        songRow.innerHTML = `
          
          <div class="d-flex align-items-center gap-3 flex-grow-1">

            <!-- شماره و دکمه Play -->
            <div class="song-control text-center fw-semibold"
                 style="width: 40px; cursor: pointer;">

              <span class="song-number">
                ${index + 1}
              </span>

              <span class="song-play-icon"
                    style="display:none; color: var(--vibe-primary); font-size: 18px;">
                ▶
              </span>

            </div>


            <!-- عکس -->
            <img
              src="${song.img}"
              alt="${song.title}"
              class="song-img"
              style="
                width:48px;
                height:48px;
                object-fit:cover;
                border-radius:6px;
              "
            >


            <!-- اطلاعات آهنگ -->
            <div class="text-start">

              <h4 class="fs-6 fw-bold mb-0 text-white song-title">
                ${song.title}
              </h4>

              <span
                class="text-xs opacity-50"
                style="color: var(--vibe-muted);"
              >
                ${song.album}
              </span>

            </div>

          </div>


          <!-- Plays و Duration -->
          <div class="d-flex align-items-center gap-4 text-sm fw-semibold">

            <div
              class="d-none d-md-block opacity-50"
              style="color: var(--vibe-muted);"
            >
              ${song.plays} plays
            </div>

            <div
              class="opacity-50"
              style="color: var(--vibe-muted);"
            >
              ${song.duration}
            </div>

          </div>
        `;


        const control =
          songRow.querySelector(".song-control");

        const playIcon =
          songRow.querySelector(".song-play-icon");

        const songNumber =
          songRow.querySelector(".song-number");


        // =========================
        // PLAY / PAUSE
        // =========================

        control.addEventListener("click", (event) => {

          event.stopPropagation();


          if (
            currentSongId === song.id &&
            !currentAudio.paused
          ) {

            currentAudio.pause();

            playIcon.innerText = "▶";
            songRow.classList.remove("active");

            return;
          }


          currentAudio.pause();


          document.querySelectorAll(".song-row").forEach(row => {

            row.classList.remove("active");

            const icon =
              row.querySelector(".song-play-icon");

            const number =
              row.querySelector(".song-number");

            if (icon) {
              icon.innerText = "▶";
              icon.style.display = "none";
            }

            if (number) {
              number.style.display = "inline";
            }

          });


          currentSongId = song.id;

          currentAudio.src = song.audioUrl;
          currentAudio.load();


          songRow.classList.add("active");

          songNumber.style.display = "none";
          playIcon.style.display = "inline";
          playIcon.innerText = "⏸";


          currentAudio.play()
            .then(() => {

              console.log(
                "Playing:",
                song.title
              );

            })
            .catch(error => {

              console.error(
                "Audio Error:",
                error
              );

              playIcon.innerText = "▶";

            });

        });


        // =========================
        // کلیک روی خود ردیف
        // =========================

        songRow.addEventListener("click", () => {

          control.click();

        });


        // =========================
        // وقتی آهنگ تمام شد
        // =========================

        currentAudio.addEventListener("ended", () => {

          if (currentSongId === song.id) {

            songRow.classList.remove("active");

            playIcon.innerText = "▶";
            playIcon.style.display = "none";

            songNumber.style.display = "inline";

            currentSongId = null;

          }

        });


        songsListContainer.appendChild(songRow);

      });

    }

  }


  // =========================
  // FOLLOW
  // =========================

  const followBtn =
    document.getElementById("btn-follow");

  const followText =
    document.getElementById("follow-text");

  let isFollowing = false;


  if (followBtn && followText) {

    followBtn.addEventListener("click", () => {

      isFollowing = !isFollowing;

      followText.innerText =
        isFollowing ? "Following" : "Follow";

      followBtn.style.backgroundColor =
        isFollowing ? "#ffffff" : "transparent";

      followBtn.style.color =
        isFollowing ? "#000000" : "#ffffff";

    });

  }

});


// ================= part 3 album secton =================

const albumsData = [
  {
    id: "a1",
    title: "Midnight Dreams",
    artist: "AURORA",
    year: "2024",
    songs: "12 songs",
    image: "https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg"
  },

  {
    id: "a2",
    title: "Echoes",
    artist: "AURORA",
    year: "2023",
    songs: "10 songs",
    image: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg"
  },

  {
    id: "a3",
    title: "Shadows & Light",
    artist: "AURORA",
    year: "2022",
    songs: "11 songs",
    image: "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg"
  },

  {
    id: "a4",
    title: "Unspoken",
    artist: "AURORA",
    year: "2021",
    songs: "9 songs",
    image: "https://images.pexels.com/photos/14870726/pexels-photo-14870726.jpeg"
  }
];


// ================= RENDER ALBUMS =================

document.addEventListener("DOMContentLoaded", () => {

  const albumsList = document.getElementById("albums-list");

  if (!albumsList) return;

  albumsList.innerHTML = "";

  albumsData.forEach(album => {

    const card = document.createElement("div");

    card.className = "album-card";

    card.innerHTML = `
      
      <div class="album-image">

        <img 
          src="${album.image}" 
          alt="${album.title}"
        >

      </div>

      <div class="album-info">

        <h3 class="album-title">
          ${album.title}
        </h3>

        <p class="album-artist">
          ${album.artist}
        </p>

        <span class="album-meta">
          ${album.year} • ${album.songs}
        </span>

      </div>
    `;

    albumsList.appendChild(card);
  });



  // ================= VIEW ALL =================

  const seeAll = document.getElementById("albums-see-all");

  if (seeAll) {

    seeAll.addEventListener("click", () => {

      console.log("Showing all albums");

    });

  }

});


// cards section 5 

// ================= LAST SECTION JS =================

const listeners = document.getElementById("listeners");

let target = 2.4;
let current = 0;

const counter = setInterval(() => {

    current += 0.1;

    if (current >= target) {
        current = target;
        clearInterval(counter);
    }

    listeners.textContent = current.toFixed(1) + "M";

}, 50);


// SONG CLICK

const songs = document.querySelectorAll(".song-item");

songs.forEach(song => {

    song.addEventListener("click", () => {

        songs.forEach(item => {
            item.style.background = "transparent";
        });

        song.style.background = "var(--vibe-card-hover)";

    });

});


// light mood js code

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {

        themeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
        themeToggle.title = "Dark Mode";

        localStorage.setItem("theme", "light");

    } else {

        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        themeToggle.title = "Light Mode";

        localStorage.setItem("theme", "dark");
    }
});









