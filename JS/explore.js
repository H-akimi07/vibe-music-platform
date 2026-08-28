/* ================================
   1. MUSIC DATA + VARIABLES
================================ */

const songs = [
    {
        id: 1,
        title: "Mastam Mastam",
        artist: "Aryana Sayeed",
        genre: "Pop",
        duration: "3:45",
        cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80"
    },
    {
        id: 2,
        title: "Boro Boro",
        artist: "Arash",
        genre: "Pop",
        duration: "3:32",
        cover: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80"
    },
    {
        id: 3,
        title: "Delam Gerefte",
        artist: "Ebi",
        genre: "R&B",
        duration: "4:10",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80"
    },
    {
        id: 4,
        title: "Joon Joon",
        artist: "Farhad Darya",
        genre: "Pop",
        duration: "4:02",
        cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80"
    },
    {
        id: 5,
        title: "Baran",
        artist: "Ahmad Zahir",
        genre: "Jazz",
        duration: "4:21",
        cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80"
    },
    {
        id: 6,
        title: "Nafas",
        artist: "Googoosh",
        genre: "Pop",
        duration: "3:55",
        cover: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80"
    },
    {
        id: 7,
        title: "Darya",
        artist: "Qais Ulfat",
        genre: "R&B",
        duration: "4:15",
        cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80"
    },
    {
        id: 8,
        title: "Zendegi",
        artist: "Mansour",
        genre: "Electronic",
        duration: "3:38",
        cover: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80"
    }
];


const searchInput = document.getElementById("searchInput");
const genreButtons = document.querySelectorAll(".genre-btn");
const sortSelect = document.getElementById("sortSelect");
const songGrid = document.getElementById("songGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const clearSearch = document.getElementById("clearSearch");
const surpriseBtn = document.getElementById("surpriseBtn");
const themeToggle = document.getElementById("themeToggle");


let currentGenre = "All";
let currentSearch = "";
let currentSort = "popular";
/* ================================
   2. DISPLAY + SEARCH + FILTER
================================ */

function displaySongs() {

    let filteredSongs = songs.filter(function(song) {

        const genreMatch =
            currentGenre === "All" ||
            song.genre === currentGenre;

        const searchMatch =
            song.title.toLowerCase().includes(currentSearch) ||
            song.artist.toLowerCase().includes(currentSearch);

        return genreMatch && searchMatch;
    });


    if (currentSort === "az") {

        filteredSongs.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });

    }


    songGrid.innerHTML = "";


    if (filteredSongs.length === 0) {

        emptyState.classList.remove("d-none");

        resultCount.textContent = "0 tracks";

        return;
    }


    emptyState.classList.add("d-none");

    resultCount.textContent =
        filteredSongs.length + " tracks";


    filteredSongs.forEach(function(song) {

        const card = document.createElement("div");

        card.className = "col";


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
                            class="explore-favorite-btn"
                            onclick="toggleFavorite(${song.id}, this)"
                        >
                            <i class="bi bi-heart"></i>
                        </button>

                    </div>

                </div>

            </div>
        `;


        songGrid.appendChild(card);

    });

}


searchInput.addEventListener("input", function() {

    currentSearch =
        searchInput.value.toLowerCase().trim();

    displaySongs();

});


genreButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        genreButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentGenre =
            button.dataset.genre;

        displaySongs();

    });

});


sortSelect.addEventListener("change", function() {

    currentSort = sortSelect.value;

    displaySongs();

});
/* ================================
   3. FAVORITES + PLAY + SURPRISE
================================ */

function toggleFavorite(id, button) {

    let favorites =
        JSON.parse(
            localStorage.getItem("vibeFavorites")
        ) || [];


    if (favorites.includes(id)) {

        favorites = favorites.filter(function(item) {
            return item !== id;
        });

        button.classList.remove("active");

        button.innerHTML =
            '<i class="bi bi-heart"></i>';

    } else {

        favorites.push(id);

        button.classList.add("active");

        button.innerHTML =
            '<i class="bi bi-heart-fill"></i>';
    }


    localStorage.setItem(
        "vibeFavorites",
        JSON.stringify(favorites)
    );
}


function playSong(id) {

    const song = songs.find(function(song) {
        return song.id === id;
    });


    if (!song) return;


    localStorage.setItem(
        "vibeLastPlayed",
        JSON.stringify(song)
    );


    alert(
        "▶ Now playing: " +
        song.title +
        " — " +
        song.artist
    );
}


surpriseBtn.addEventListener("click", function() {

    const randomIndex =
        Math.floor(Math.random() * songs.length);

    const randomSong =
        songs[randomIndex];


    alert(
        "✨ Your vibe:\n" +
        randomSong.title +
        " — " +
        randomSong.artist
    );

});
/* ================================
   4. CLEAR + KEYBOARD + THEME
================================ */

clearSearch.addEventListener("click", function() {

    searchInput.value = "";

    currentSearch = "";

    currentGenre = "All";

    currentSort = "popular";

    sortSelect.value = "popular";


    genreButtons.forEach(function(button) {
        button.classList.remove("active");
    });


    genreButtons[0].classList.add("active");


    displaySongs();

});


document.addEventListener("keydown", function(event) {

    if (
        event.key === "/" &&
        document.activeElement !== searchInput
    ) {

        event.preventDefault();

        searchInput.focus();

    }

});


themeToggle.addEventListener("click", function() {

    document.body.classList.toggle("light-mode");


    const icon =
        themeToggle.querySelector("i");


    if (
        document.body.classList.contains("light-mode")
    ) {

        icon.className = "bi bi-sun";

    } else {

        icon.className = "bi bi-moon-stars";

    }

});


/* START */

displaySongs();

console.log("VIBE Explore is ready!");
/* ================================ 5. MUSIC PLAYER ================================ */
const audioPlayer = document.getElementById("audioPlayer");
let currentSongIndex = 0;
/* PLAY */
function playSong(id) {
currentSongIndex = songs.findIndex(function(song) {
    return song.id === id;
});

const song = songs[currentSongIndex];

if (!song) return;

/*
   فعلاً برای تست از یک آهنگ آنلاین استفاده می‌کنیم.
   بعداً می‌توانیم آهنگ‌های واقعی مناسب پروژه را اضافه کنیم.
*/

audioPlayer.src =
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

audioPlayer.play();

localStorage.setItem(
    "vibeLastPlayed",
    JSON.stringify(song)
);

console.log(
    "Playing:",
    song.title,
    "-", 
    song.artist
);
}
/* NEXT */
function nextSong() {
currentSongIndex++;

if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
}

playSong(songs[currentSongIndex].id);
}
/* PREVIOUS */
function previousSong() {
currentSongIndex--;

if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
}

playSong(songs[currentSongIndex].id);
}
/* AUTO NEXT */
audioPlayer.addEventListener("ended", function() {
nextSong();
});