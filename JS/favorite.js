/* ================================ VIBE FAVORITE.JS ================================ */
/* MUSIC DATA (same catalog as explore.js) */
const songs = [ { id: 1, title: "Mastam Mastam", artist: "Aryana Sayeed", genre: "Pop", duration: "3:45", cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80" }, { id: 2, title: "Boro Boro", artist: "Arash", genre: "Pop", duration: "3:32", cover: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80" }, { id: 3, title: "Delam Gerefte", artist: "Ebi", genre: "R&B", duration: "4:10", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80" }, { id: 4, title: "Joon Joon", artist: "Farhad Darya", genre: "Pop", duration: "4:02", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80" }, { id: 5, title: "Baran", artist: "Ahmad Zahir", genre: "Jazz", duration: "4:21", cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80" }, { id: 6, title: "Nafas", artist: "Googoosh", genre: "Pop", duration: "3:55", cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80" }, { id: 7, title: "Darya", artist: "Qais Ulfat", genre: "R&B", duration: "4:15", cover: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80" }, { id: 8, title: "Zendegi", artist: "Mansour", genre: "Electronic", duration: "3:38", cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80" } ];

/* HTML ELEMENTS */
const favSearchInput = document.getElementById("favSearchInput");
const favSortSelect = document.getElementById("favSortSelect");
const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");
const favoriteGrid = document.getElementById("favoriteGrid");
const favResultCount = document.getElementById("favResultCount");
const favEmptyState = document.getElementById("favEmptyState");
const favNoResults = document.getElementById("favNoResults");
const favClearSearchBtn = document.getElementById("favClearSearchBtn");

const favCountStat = document.getElementById("favCountStat");
const favDurationStat = document.getElementById("favDurationStat");
const favGenreStat = document.getElementById("favGenreStat");

const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const playerCover = document.getElementById("playerCover");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volumeBar = document.getElementById("volumeBar");

let currentSearch = "";
let currentSort = "recent";
let currentPlaylist = [];
let currentSongIndex = 0;

/* ================================ HELPERS ================================ */
function getFavoriteIds() {
    return JSON.parse(localStorage.getItem("vibeFavorites")) || [];
}

function saveFavoriteIds(ids) {
    localStorage.setItem("vibeFavorites", JSON.stringify(ids));
}

function durationToSeconds(durationText) {
    const parts = durationText.split(":");
    return (parseInt(parts[0]) * 60) + parseInt(parts[1]);
}

function secondsToDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const secondsLeft = totalSeconds % 60;

    return minutes + ":" + secondsLeft.toString().padStart(2, "0");
}

/* ================================ DISPLAY FAVORITES ================================ */
function displayFavorites() {

    const favoriteIds = getFavoriteIds();

    let favoriteSongs = songs.filter(function(song) {
        return favoriteIds.includes(song.id);
    });

    /* STATS (always based on the full favorites list, not the filtered search) */

    updateStats(favoriteSongs);

    /* SEARCH FILTER */

    let visibleSongs = favoriteSongs.filter(function(song) {
        return song.title.toLowerCase().includes(currentSearch) ||
            song.artist.toLowerCase().includes(currentSearch);
    });

    /* SORT */

    if (currentSort === "recent") {
        visibleSongs.sort(function(a, b) {
            return favoriteIds.indexOf(b.id) - favoriteIds.indexOf(a.id);
        });
    } else if (currentSort === "az") {
        visibleSongs.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });
    } else if (currentSort === "shortest") {
        visibleSongs.sort(function(a, b) {
            return durationToSeconds(a.duration) - durationToSeconds(b.duration);
        });
    } else if (currentSort === "longest") {
        visibleSongs.sort(function(a, b) {
            return durationToSeconds(b.duration) - durationToSeconds(a.duration);
        });
    }

    currentPlaylist = visibleSongs;

    /* EMPTY STATES */

    favoriteGrid.innerHTML = "";

    if (favoriteSongs.length === 0) {

        favEmptyState.classList.remove("d-none");
        favNoResults.classList.add("d-none");
        favResultCount.textContent = "0 tracks";

        return;
    }

    favEmptyState.classList.add("d-none");

    if (visibleSongs.length === 0) {

        favNoResults.classList.remove("d-none");
        favResultCount.textContent = "0 tracks";

        return;
    }

    favNoResults.classList.add("d-none");

    favResultCount.textContent = visibleSongs.length + " tracks";

    visibleSongs.forEach(function(song) {

        const card = document.createElement("div");

        card.className = "col";
        card.id = "favCard-" + song.id;

        card.innerHTML = `
            <div class="explore-song-card">

                <div class="explore-cover-wrapper">

                    <img
                        src="${song.cover}"
                        alt="${song.title}"
                        class="explore-song-cover"
                        loading="lazy"
                    >

                    <div class="explore-cover-overlay">

                        <button
                            class="explore-play-btn"
                            onclick="playSong(${song.id})"
                        >
                            <i class="bi bi-play-fill"></i>
                        </button>

                    </div>

                </div>

                <div class="explore-song-info">

                    <h3 class="explore-song-title">
                        ${song.title}
                    </h3>

                    <p class="explore-song-artist">
                        ${song.artist}
                    </p>

                    <div class="explore-song-bottom">

                        <span class="explore-song-genre">
                            ${song.genre}
                        </span>

                        <button
                            class="explore-favorite-btn is-favorite"
                            onclick="removeFavorite(${song.id})"
                        >
                            <i class="bi bi-heart-fill"></i>
                        </button>

                    </div>

                </div>

            </div>
        `;

        favoriteGrid.appendChild(card);
    });
}

/* ================================ STATS ================================ */
function updateStats(favoriteSongs) {

    favCountStat.textContent = favoriteSongs.length;

    const totalSeconds = favoriteSongs.reduce(function(total, song) {
        return total + durationToSeconds(song.duration);
    }, 0);

    favDurationStat.textContent = secondsToDuration(totalSeconds);

    const genreCount = new Set(favoriteSongs.map(function(song) {
        return song.genre;
    })).size;

    favGenreStat.textContent = genreCount;
}

/* ================================ REMOVE FAVORITE ================================ */
function removeFavorite(id) {

    let favoriteIds = getFavoriteIds();

    favoriteIds = favoriteIds.filter(function(songId) {
        return songId !== id;
    });

    saveFavoriteIds(favoriteIds);

    const card = document.getElementById("favCard-" + id);

    if (card) {

        card.querySelector(".explore-song-card").classList.add("is-removing");

        setTimeout(function() {
            displayFavorites();
        }, 220);

    } else {
        displayFavorites();
    }
}

/* ================================ CLEAR ALL ================================ */
clearFavoritesBtn.addEventListener("click", function() {

    if (getFavoriteIds().length === 0) return;

    const confirmed = window.confirm("Remove all songs from your favorites?");

    if (confirmed) {
        saveFavoriteIds([]);
        displayFavorites();
    }
});

/* ================================ SEARCH ================================ */
favSearchInput.addEventListener("input", function() {
    currentSearch = favSearchInput.value.toLowerCase().trim();
    displayFavorites();
});

favClearSearchBtn.addEventListener("click", function() {
    favSearchInput.value = "";
    currentSearch = "";
    displayFavorites();
});

/* ================================ SORT ================================ */
favSortSelect.addEventListener("change", function() {
    currentSort = favSortSelect.value;
    displayFavorites();
});

/* ================================ PLAYER ================================ */
function updatePlayer(song) {
    if (!playerCover) return;

    playerCover.src = song.cover;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
}

function playSong(id) {

    currentSongIndex = currentPlaylist.findIndex(function(song) {
        return song.id === id;
    });

    const song = currentPlaylist[currentSongIndex];

    if (!song) return;

    updatePlayer(song);

    audioPlayer.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    audioPlayer.play();

    localStorage.setItem("vibeLastPlayed", JSON.stringify(song));
}

function togglePlay() {

    if (!audioPlayer.src) return;

    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}

function nextSong() {

    if (currentPlaylist.length === 0) return;

    currentSongIndex++;

    if (currentSongIndex >= currentPlaylist.length) {
        currentSongIndex = 0;
    }

    playSong(currentPlaylist[currentSongIndex].id);
}

function previousSong() {

    if (currentPlaylist.length === 0) return;

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentPlaylist.length - 1;
    }

    playSong(currentPlaylist[currentSongIndex].id);
}

/* PLAYER EVENTS */
audioPlayer.addEventListener("play", function() {
    playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
});

audioPlayer.addEventListener("pause", function() {
    playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
});

audioPlayer.addEventListener("ended", function() {
    nextSong();
});

audioPlayer.addEventListener("loadedmetadata", function() {
    progressBar.max = audioPlayer.duration;
    duration.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", function() {
    progressBar.value = audioPlayer.currentTime;
    currentTime.textContent = formatTime(audioPlayer.currentTime);
});

progressBar.addEventListener("input", function() {
    audioPlayer.currentTime = progressBar.value;
});

volumeBar.addEventListener("input", function() {
    audioPlayer.volume = volumeBar.value;
});

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60);

    return minutes + ":" + secondsLeft.toString().padStart(2, "0");
}

/* ================================ START ================================ */
displayFavorites();



// active Navbar
  document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const linkPage = link
        .getAttribute("href")
        .split("/")
        .pop()
        .toLowerCase();

      if (
        linkPage === currentPage ||
        (currentPage === "" && linkPage === "index.html")
      ) {
        link.classList.add("active");
      }
    });
  });