
const songs = [
  {
    id: 1,
    title: "Midnight Drive",
    artist: "Alex Morgan",
    artistId: 101,
    genre: "Pop",
    album: "Midnight Drive",
    duration: "3:42",
    durationSeconds: 222,
    cover: "images/midnight.jpg",
    audio: "audio/first.mp3",
  },

  {
    id: 2,
    title: "Neon Dreams",
    artist: "Luna Ray",
    artistId: 102,
    genre: "Electronic",
    album: "Neon Dreams",
    duration: "4:05",
    durationSeconds: 245,
    cover: "images/art-deco.jpg",
    audio: "audio/third.mp3",
  },

  {
    id: 3,
    title: "Afterglow",
    artist: "The Vibes",
    artistId: 103,
    genre: "Indie",
    album: "Afterglow",
    duration: "3:28",
    durationSeconds: 208,
    cover: "images/charl.jpg",
    audio: "audio/second.mp3",
  },

  {
    id: 4,
    title: "Electric Heart",
    artist: "Nova",
    artistId: 104,
    genre: "Synthwave",
    album: "Electric Heart",
    duration: "3:56",
    durationSeconds: 236,
    cover: "images/fading.jpg",
    audio: "audio/forth.mp3",
  },

  {
    id: 5,
    title: "Lost In The City",
    artist: "Jay Stone",
    artistId: 105,
    genre: "R&B",
    album: "Lost In The City",
    duration: "4:12",
    durationSeconds: 252,
    cover: "images/glue.jpg",
    audio: "audio/fifth.mp3",
  },

  {
    id: 6,
    title: "Purple Sky",
    artist: "Mia Rose",
    artistId: 106,
    genre: "Pop",
    album: "Purple Sky",
    duration: "3:36",
    durationSeconds: 216,
    cover: "images/mist.jpg",
    audio: "audio/sixth.mp3",
  },
];

/* 
   DEFAULT PLAYLISTS
*/

const defaultPlaylists = [
  {
    id: 1,
    name: "Late Night Vibes",
    description: "Songs for late-night listening.",
    cover: "images/art-deco.jpg",
    songIds: [1, 3, 6],
    updatedAt: Date.now(),
  },

  {
    id: 2,
    name: "Neon Energy",
    description: "Electric sounds for high-energy moments.",
    cover: "images/fading.jpg",
    songIds: [2, 4],
    updatedAt: Date.now(),
  },

  {
    id: 3,
    name: "Chill & Relax",
    description: "A smooth collection for slow moments.",
    cover: "images/midnight.jpg",
    songIds: [3, 5],
    updatedAt: Date.now(),
  },

  {
    id: 4,
    name: "Weekend Mix",
    description: "Your soundtrack for the weekend.",
    cover: "images/glue.jpg",
    songIds: [1, 2, 4, 6],
    updatedAt: Date.now(),
  },
];

/* 
   LOCAL STORAGE
*/

const STORAGE_KEY = "vibePlaylists";
const VOLUME_KEY = "vibeVolume";
const THEME_KEY = "vibeTheme";
const CURRENT_SONG_KEY = "vibeCurrentSong";

let playlists = [];
let currentPlaylistId = null;

let currentSongIndex = -1;
let currentPlaylistSongs = [];
let isPlaying = false;

/* 
   DOM ELEMENTS
*/

const playlistGrid = document.getElementById("playlistGrid");
const emptyState = document.getElementById("emptyState");

const playlistCountElement = document.getElementById("playlistCount");
const totalSongsElement = document.getElementById("totalSongs");
const lastUpdatedElement = document.getElementById("lastUpdated");

const playlistSearch = document.getElementById("playlistSearch");

const createPlaylistForm = document.getElementById("createPlaylistForm");
const openCreatePlaylist = document.getElementById("openCreatePlaylist");
const emptyCreateButton = document.getElementById("emptyCreateButton");

const createPlaylistModalElement = document.getElementById(
  "createPlaylistModal",
);

const playlistDetailsModalElement = document.getElementById(
  "playlistDetailsModal",
);

const playlistDetailsContent = document.getElementById(
  "playlistDetailsContent",
);

const audioPlayer = document.getElementById("audioPlayer");

const playerCover = document.getElementById("playerCover");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");

const mainPlayButton = document.getElementById("mainPlayButton");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");

const progressBar = document.getElementById("progressBar");

const currentTimeElement = document.getElementById("currentTime");
const durationElement = document.getElementById("duration");

const playerVinyl = document.getElementById("playerVinyl");

const volumeBar = document.getElementById("volumeBar");
const volumeIcon = document.getElementById("volumeIcon");

const themeButton = document.getElementById("themeButton");

const playAllButton = document.getElementById("playAllButton");

const toastContainer = document.getElementById("toastContainer");

/* 
   BOOTSTRAP MODALS
*/

const createPlaylistModal = new bootstrap.Modal(createPlaylistModalElement);

const playlistDetailsModal = new bootstrap.Modal(playlistDetailsModalElement);

/* 
   INITIALIZATION
*/

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  loadPlaylists();
  loadVolume();
  // loadTheme();

  renderPlaylists();
  updateDashboard();

  setupEventListeners();
}

/* 
   LOAD PLAYLISTS
*/

function loadPlaylists() {
  try {
    const savedPlaylists = localStorage.getItem(STORAGE_KEY);

    if (savedPlaylists) {
      playlists = JSON.parse(savedPlaylists);
    } else {
      playlists = [...defaultPlaylists];
      savePlaylists();
    }
  } catch (error) {
    console.error("Failed to load playlists:", error);

    playlists = [...defaultPlaylists];
    savePlaylists();
  }
}

/* 
   SAVE PLAYLISTS
*/

function savePlaylists() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
  } catch (error) {
    console.error("Failed to save playlists:", error);
    showToast("Unable to save playlist data.");
  }
}

/* 
   EVENT LISTENERS
*/

function setupEventListeners() {
  /* Create playlist */
  openCreatePlaylist.addEventListener("click", openCreateModal);

  emptyCreateButton.addEventListener("click", openCreateModal);

  createPlaylistForm.addEventListener("submit", handleCreatePlaylist);

  /* Search */
  playlistSearch.addEventListener("input", handleSearch);

  /* Filter */
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", handleFilter);
  });

  /* Playlist card event delegation */
  playlistGrid.addEventListener("click", handlePlaylistGridClick);

  /* Player */
  mainPlayButton.addEventListener("click", togglePlayPause);

  previousButton.addEventListener("click", playPreviousSong);

  nextButton.addEventListener("click", playNextSong);

  /* Audio events */
  audioPlayer.addEventListener("timeupdate", updateProgress);

  audioPlayer.addEventListener("loadedmetadata", updateDuration);

  audioPlayer.addEventListener("ended", playNextSong);

  audioPlayer.addEventListener("play", handleAudioPlay);

  audioPlayer.addEventListener("pause", handleAudioPause);

  /* Progress bar */
  progressBar.addEventListener("input", handleProgressChange);

  /* Volume */
  volumeBar.addEventListener("input", handleVolumeChange);

  /* Theme is handled globally by JS/theme.js. */

  /* Play all */
  playAllButton.addEventListener("click", playAllSongs);

  /* Keyboard shortcut */
  document.addEventListener("keydown", handleKeyboardShortcuts);

  /* Cover selection */
  document.querySelectorAll(".cover-option").forEach((option) => {
    option.addEventListener("click", () => {
      document
        .querySelectorAll(".cover-option")
        .forEach((item) => item.classList.remove("selected"));

      option.classList.add("selected");
    });
  });
}

/* 
   CREATE PLAYLIST
*/

function openCreateModal() {
  createPlaylistForm.reset();

  document
    .querySelectorAll(".cover-option")
    .forEach((option) => option.classList.remove("selected"));

  const firstCover = document.querySelector(".cover-option");

  if (firstCover) {
    firstCover.classList.add("selected");
    firstCover.querySelector("input").checked = true;
  }

  createPlaylistModal.show();
}

function handleCreatePlaylist(event) {
  event.preventDefault();

  const name = document.getElementById("playlistName").value.trim();

  const description = document
    .getElementById("playlistDescription")
    .value.trim();

  const selectedCover = document.querySelector(
    'input[name="playlistCover"]:checked',
  );

  /* Validate playlist name */
  if (name.length < 2) {
    showToast("Playlist name must contain at least 2 characters.");
    return;
  }

  /* Prevent duplicate playlist names */
  const duplicate = playlists.some(
    (playlist) => playlist.name.toLowerCase() === name.toLowerCase(),
  );

  if (duplicate) {
    showToast("A playlist with this name already exists.");
    return;
  }

  const newPlaylist = {
    id: Date.now(),
    name,
    description: description || "A new collection of your favorite songs.",
    cover: selectedCover
      ? selectedCover.value
      : "images/fading.jpg",
    songIds: [],
    updatedAt: Date.now(),
  };

  playlists.unshift(newPlaylist);

  savePlaylists();

  renderPlaylists();
  updateDashboard();

  createPlaylistModal.hide();

  showToast("Playlist created successfully.");
}

/* 
   RENDER PLAYLISTS
*/

function renderPlaylists(customList = playlists) {
  playlistGrid.innerHTML = "";

  if (customList.length === 0) {
    playlistGrid.classList.add("d-none");
    emptyState.classList.remove("d-none");
    return;
  }

  playlistGrid.classList.remove("d-none");
  emptyState.classList.add("d-none");

  customList.forEach((playlist, index) => {
    const card = createPlaylistCard(playlist, index);

    playlistGrid.appendChild(card);
  });
}

/* 
   CREATE PLAYLIST CARD
*/

function createPlaylistCard(playlist, index) {
  const article = document.createElement("article");

  article.className = "playlist-card";

  article.dataset.id = playlist.id;

  article.style.animationDelay = `${index * 0.06}s`;

  const songCount = Array.isArray(playlist.songIds)
    ? playlist.songIds.length
    : 0;

  article.innerHTML = `
        <div class="playlist-cover-wrapper">

            <img
                class="playlist-cover"
                src="${playlist.cover}"
                alt="${escapeHTML(playlist.name)}"
                onerror="this.src='images/glue.jpg'"
            >

            <div class="cover-overlay">

                <button
                    class="play-button"
                    data-action="play"
                    aria-label="Play playlist"
                >
                    <i class="bi bi-play-fill"></i>
                </button>

                <button
                    class="playlist-menu"
                    data-action="details"
                    aria-label="Open playlist"
                >
                    <i class="bi bi-three-dots"></i>
                </button>

            </div>

        </div>

        <div class="playlist-content">

            <div class="playlist-title-row">

                <h3 class="playlist-title">
                    ${escapeHTML(playlist.name)}
                </h3>

            </div>

            <p class="playlist-description">
                ${escapeHTML(
                  playlist.description || "Your personal music collection.",
                )}
            </p>

            <div class="playlist-meta">

                <span class="song-count">
                    <i class="bi bi-music-note"></i>
                    ${songCount} songs
                </span>

                <span>
                    ${getRelativeDate(playlist.updatedAt)}
                </span>

            </div>

            <div class="card-actions">

                <button
                    class="card-action"
                    data-action="details"
                >
                    <i class="bi bi-eye me-1"></i>
                    Open
                </button>

                <button
                    class="card-action"
                    data-action="edit"
                >
                    <i class="bi bi-pencil me-1"></i>
                    Edit
                </button>

                <button
                    class="card-action delete"
                    data-action="delete"
                >
                    <i class="bi bi-trash me-1"></i>
                </button>

            </div>

        </div>
    `;

  return article;
}

/* 
   PLAYLIST CARD EVENTS
*/

function handlePlaylistGridClick(event) {
  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) {
    return;
  }

  const card = actionButton.closest(".playlist-card");

  if (!card) {
    return;
  }

  const playlistId = Number(card.dataset.id);

  const action = actionButton.dataset.action;

  if (action === "play") {
    playPlaylist(playlistId);
  }

  if (action === "details") {
    openPlaylistDetails(playlistId);
  }

  if (action === "edit") {
    editPlaylist(playlistId);
  }

  if (action === "delete") {
    deletePlaylist(playlistId);
  }
}

/* 
   PLAY PLAYLIST
*/

function playPlaylist(playlistId) {
  const playlist = playlists.find((item) => item.id === playlistId);

  if (!playlist) {
    return;
  }

  currentPlaylistId = playlistId;

  currentPlaylistSongs = playlist.songIds
    .map((songId) => songs.find((song) => song.id === songId))
    .filter(Boolean);

  if (currentPlaylistSongs.length === 0) {
    showToast("This playlist does not contain any songs yet.");
    openPlaylistDetails(playlistId);
    return;
  }

  currentSongIndex = 0;

  loadSong(currentPlaylistSongs[currentSongIndex], true);
}

/* 
   PLAY ALL
*/

function playAllSongs() {
  if (playlists.length === 0) {
    showToast("Create a playlist first.");
    return;
  }

  const allSongIds = [
    ...new Set(playlists.flatMap((playlist) => playlist.songIds)),
  ];

  currentPlaylistSongs = allSongIds
    .map((id) => songs.find((song) => song.id === id))
    .filter(Boolean);

  if (currentPlaylistSongs.length === 0) {
    showToast("There are no songs available to play.");
    return;
  }

  currentPlaylistId = null;
  currentSongIndex = 0;

  loadSong(currentPlaylistSongs[currentSongIndex], true);
}

/* 
   LOAD SONG
*/

function loadSong(song, autoPlay = false) {
  if (!song) {
    return;
  }

  audioPlayer.src = song.audio;

  playerCover.src = song.cover;
  playerCover.alt = `${song.title} cover`;

  playerTitle.textContent = song.title;
  playerArtist.textContent = `${song.artist} • ${song.album}`;

  currentTimeElement.textContent = "0:00";
  durationElement.textContent = song.duration || "0:00";

  progressBar.value = 0;

  localStorage.setItem(CURRENT_SONG_KEY, JSON.stringify(song));

  updateActivePlaylistCard();

  if (autoPlay) {
    const playPromise = audioPlayer.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn("Audio playback requires user interaction:", error);

        showToast("Press play to start the selected song.");
      });
    }
  }
}

/* 
   PLAY / PAUSE
*/

function togglePlayPause() {
  if (!audioPlayer.src) {
    if (currentPlaylistSongs.length > 0) {
      loadSong(currentPlaylistSongs[0], true);
    } else {
      playAllSongs();
    }

    return;
  }

  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
}

/* 
   AUDIO PLAY
*/

function handleAudioPlay() {
  isPlaying = true;

  playerVinyl.classList.add("playing");

  mainPlayButton.innerHTML = '<i class="bi bi-pause-fill"></i>';

  mainPlayButton.setAttribute("aria-label", "Pause");

  updateActivePlaylistCard();
}

/* 
   AUDIO PAUSE
*/

function handleAudioPause() {
  isPlaying = false;

  playerVinyl.classList.remove("playing");

  mainPlayButton.innerHTML = '<i class="bi bi-play-fill"></i>';

  mainPlayButton.setAttribute("aria-label", "Play");
}

/* 
   NEXT SONG
*/

function playNextSong() {
  if (currentPlaylistSongs.length === 0) {
    return;
  }

  currentSongIndex++;

  if (currentSongIndex >= currentPlaylistSongs.length) {
    currentSongIndex = 0;
  }

  loadSong(currentPlaylistSongs[currentSongIndex], true);
}

/* 
   PREVIOUS SONG
*/

function playPreviousSong() {
  if (currentPlaylistSongs.length === 0) {
    return;
  }

  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = currentPlaylistSongs.length - 1;
  }

  loadSong(currentPlaylistSongs[currentSongIndex], true);
}

/* 
   PROGRESS
*/

function updateProgress() {
  if (!audioPlayer.duration) {
    return;
  }

  const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;

  progressBar.value = percentage;

  currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
}

function updateDuration() {
  if (!Number.isNaN(audioPlayer.duration)) {
    durationElement.textContent = formatTime(audioPlayer.duration);
  }
}

function handleProgressChange() {
  if (!audioPlayer.duration) {
    return;
  }

  const percentage = Number(progressBar.value);

  audioPlayer.currentTime = (percentage / 100) * audioPlayer.duration;
}

/* 
   VOLUME
*/

function loadVolume() {
  const savedVolume = localStorage.getItem(VOLUME_KEY);

  const volume = savedVolume !== null ? Number(savedVolume) : 0.8;

  audioPlayer.volume = volume;
  volumeBar.value = volume;

  updateVolumeIcon(volume);
}

function handleVolumeChange() {
  const volume = Number(volumeBar.value);

  audioPlayer.volume = volume;

  localStorage.setItem(VOLUME_KEY, volume.toString());

  updateVolumeIcon(volume);
}

function updateVolumeIcon(volume) {
  if (volume === 0) {
    volumeIcon.className = "bi bi-volume-mute-fill";
  } else if (volume < 0.5) {
    volumeIcon.className = "bi bi-volume-down-fill";
  } else {
    volumeIcon.className = "bi bi-volume-up-fill";
  }
}

/* 
   SEARCH
*/

function handleSearch(event) {
  const query = event.target.value.trim().toLowerCase();

  const filtered = playlists.filter(
    (playlist) =>
      playlist.name.toLowerCase().includes(query) ||
      playlist.description.toLowerCase().includes(query),
  );

  renderPlaylists(filtered);
}

/* 
   FILTER
*/

function handleFilter(event) {
  document
    .querySelectorAll(".filter-button")
    .forEach((button) => button.classList.remove("active"));

  event.currentTarget.classList.add("active");

  const filter = event.currentTarget.dataset.filter;

  let filtered = [...playlists];

  if (filter === "large") {
    filtered = playlists.filter((playlist) => playlist.songIds.length >= 3);
  }

  if (filter === "small") {
    filtered = playlists.filter((playlist) => playlist.songIds.length < 3);
  }

  renderPlaylists(filtered);
}

/* 
   PLAYLIST DETAILS
*/

function openPlaylistDetails(playlistId) {
  const playlist = playlists.find((item) => item.id === playlistId);

  if (!playlist) {
    return;
  }

  currentPlaylistId = playlistId;

  const playlistSongs = playlist.songIds
    .map((id) => songs.find((song) => song.id === id))
    .filter(Boolean);

  playlistDetailsContent.innerHTML = `
        <div class="details-header">

            <img
                class="details-cover"
                src="${playlist.cover}"
                alt="${escapeHTML(playlist.name)}"
                onerror="this.src='images/charl.jpg'"
            >

            <div>

                <span class="section-kicker">
                    ${playlistSongs.length} SONGS
                </span>

                <h1 class="details-title">
                    ${escapeHTML(playlist.name)}
                </h1>

                <p class="details-description">
                    ${escapeHTML(
                      playlist.description || "No description available.",
                    )}
                </p>

                <button
                    class="gradient-button"
                    data-details-action="play-all"
                >
                    <i class="bi bi-play-fill"></i>
                    Play All
                </button>

                <button
                    class="glass-button ms-2"
                    data-details-action="add-song"
                >
                    <i class="bi bi-plus-lg"></i>
                    Add Songs
                </button>

            </div>

        </div>

        <div class="song-list">
            ${
              playlistSongs.length
                ? playlistSongs.map(createSongRow).join("")
                : `
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="bi bi-music-note"></i>
                            </div>
                            <h3>No songs yet</h3>
                            <p>Add songs to start building this playlist.</p>
                        </div>
                    `
            }
        </div>
    `;

  playlistDetailsContent.addEventListener("click", handleDetailsClick);

  playlistDetailsModal.show();
}

/* 
   SONG ROW
*/

function createSongRow(song) {
  return `
        <div
            class="song-row"
            data-song-id="${song.id}"
        >

            <img
                class="song-row-cover"
                src="${song.cover}"
                alt="${escapeHTML(song.title)}"
            >

            <div class="song-row-info">

                <h4>
                    ${escapeHTML(song.title)}
                </h4>

                <p>
                    ${escapeHTML(song.artist)}
                </p>

            </div>

            <span class="song-duration">
                ${song.duration}
            </span>

            <button
                class="song-play"
                data-details-action="play-song"
                data-song-id="${song.id}"
                aria-label="Play song"
            >
                <i class="bi bi-play-fill"></i>
            </button>

        </div>
    `;
}

/* 
   DETAILS EVENTS
*/

function handleDetailsClick(event) {
  const button = event.target.closest("[data-details-action]");

  if (!button) {
    return;
  }

  const action = button.dataset.detailsAction;

  if (action === "play-all") {
    playPlaylist(currentPlaylistId);
    playlistDetailsModal.hide();
  }

  if (action === "play-song") {
    const songId = Number(button.dataset.songId);

    playSingleSongFromPlaylist(currentPlaylistId, songId);

    playlistDetailsModal.hide();
  }

  if (action === "add-song") {
    addSongToCurrentPlaylist();
  }
}

/* 
   PLAY SINGLE SONG
*/

function playSingleSongFromPlaylist(playlistId, songId) {
  const playlist = playlists.find((item) => item.id === playlistId);

  if (!playlist) {
    return;
  }

  currentPlaylistId = playlistId;

  currentPlaylistSongs = playlist.songIds
    .map((id) => songs.find((song) => song.id === id))
    .filter(Boolean);

  currentSongIndex = currentPlaylistSongs.findIndex(
    (song) => song.id === songId,
  );

  if (currentSongIndex === -1) {
    return;
  }

  loadSong(currentPlaylistSongs[currentSongIndex], true);
}

/* 
   ADD SONG
*/

function addSongToCurrentPlaylist() {
  const playlist = playlists.find((item) => item.id === currentPlaylistId);

  if (!playlist) {
    return;
  }

  const availableSongs = songs.filter(
    (song) => !playlist.songIds.includes(song.id),
  );

  if (availableSongs.length === 0) {
    showToast("All available songs are already in this playlist.");
    return;
  }

  const selectedSong = availableSongs[0];

  playlist.songIds.push(selectedSong.id);

  playlist.updatedAt = Date.now();

  savePlaylists();

  renderPlaylists();

  updateDashboard();

  openPlaylistDetails(playlist.id);

  showToast(`"${selectedSong.title}" added to playlist.`);
}

/* 
   EDIT PLAYLIST
*/

function editPlaylist(playlistId) {
  const playlist = playlists.find((item) => item.id === playlistId);

  if (!playlist) {
    return;
  }

  const newName = prompt("Enter a new playlist name:", playlist.name);

  if (newName === null) {
    return;
  }

  const trimmedName = newName.trim();

  if (trimmedName.length < 2) {
    showToast("Playlist name must contain at least 2 characters.");

    return;
  }

  const duplicate = playlists.some(
    (item) =>
      item.id !== playlist.id &&
      item.name.toLowerCase() === trimmedName.toLowerCase(),
  );

  if (duplicate) {
    showToast("Another playlist already uses this name.");

    return;
  }

  playlist.name = trimmedName;
  playlist.updatedAt = Date.now();

  savePlaylists();

  renderPlaylists();
  updateDashboard();

  showToast("Playlist updated successfully.");
}

/* 
   DELETE PLAYLIST
*/

function deletePlaylist(playlistId) {
  const playlist = playlists.find((item) => item.id === playlistId);

  if (!playlist) {
    return;
  }

  const confirmed = confirm(
    `Delete "${playlist.name}"? This action cannot be undone.`,
  );

  if (!confirmed) {
    return;
  }

  playlists = playlists.filter((item) => item.id !== playlistId);

  savePlaylists();

  renderPlaylists();
  updateDashboard();

  showToast("Playlist deleted.");
}

/* 
   DASHBOARD
*/

function updateDashboard() {
  playlistCountElement.textContent = playlists.length;

  const uniqueSongs = new Set(
    playlists.flatMap((playlist) => playlist.songIds),
  );

  totalSongsElement.textContent = uniqueSongs.size;

  if (playlists.length === 0) {
    lastUpdatedElement.textContent = "Never";
    return;
  }

  const latest = Math.max(
    ...playlists.map((playlist) => playlist.updatedAt || 0),
  );

  lastUpdatedElement.textContent = getRelativeDate(latest);
}

/* 
   ACTIVE PLAYLIST CARD
*/

function updateActivePlaylistCard() {
  document
    .querySelectorAll(".playlist-card")
    .forEach((card) => card.classList.remove("is-playing"));

  if (!currentPlaylistId) {
    return;
  }

  const activeCard = document.querySelector(
    `.playlist-card[data-id="${currentPlaylistId}"]`,
  );

  if (activeCard) {
    activeCard.classList.add("is-playing");

    const icon = activeCard.querySelector(".play-button i");

    if (icon) {
      icon.className = isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill";
    }
  }
}

/* 
   THEME
*/

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");

    themeButton.innerHTML = '<i class="bi bi-sun-fill"></i>';
  } else {
    themeButton.innerHTML = '<i class="bi bi-moon-stars"></i>';
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light-theme");

  localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");

  themeButton.innerHTML = isLight
    ? '<i class="bi bi-sun-fill"></i>'
    : '<i class="bi bi-moon-stars"></i>';
}

/* 
   KEYBOARD SHORTCUTS
*/

function handleKeyboardShortcuts(event) {
  /* Ctrl + K focuses search */
  if (event.ctrlKey && event.key.toLowerCase() === "k") {
    event.preventDefault();

    playlistSearch.focus();
  }

  /* Space toggles player */
  if (event.code === "Space" && !isTypingInField(event.target)) {
    event.preventDefault();

    togglePlayPause();
  }
}

function isTypingInField(element) {
  if (!element) {
    return false;
  }

  const tag = element.tagName.toLowerCase();

  return tag === "input" || tag === "textarea" || tag === "select";
}

/* 
   TOAST
*/

function showToast(message) {
  const toastElement = document.createElement("div");

  toastElement.className = "toast vibe-toast";

  toastElement.setAttribute("role", "alert");

  toastElement.setAttribute("aria-live", "assertive");

  toastElement.setAttribute("aria-atomic", "true");

  toastElement.innerHTML = `
        <div class="toast-body">

            <i class="bi bi-stars"></i>

            <span>
                ${escapeHTML(message)}
            </span>

        </div>
    `;

  toastContainer.appendChild(toastElement);

  const toast = new bootstrap.Toast(toastElement, {
    delay: 3000,
  });

  toast.show();

  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove();
  });
}

/* 
   UTILITY FUNCTIONS
*/

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function getRelativeDate(timestamp) {
  if (!timestamp) {
    return "Recently";
  }

  const difference = Date.now() - timestamp;

  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}



function escapeHTML(value) {
  const div = document.createElement("div");

  div.textContent = String(value);

  return div.innerHTML;
}
