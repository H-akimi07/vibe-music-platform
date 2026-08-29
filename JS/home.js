/*  HOME PAGE CONTROLLER  */

const homeState = {
  currentVibeIndex: new Date().getDate() % vibeDays.length,
};

const $ = (selector) => document.querySelector(selector);

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function renderTrending() {
  const grid = $("#trendingGrid");
  const trending = vibeSongs.slice(0, 8);

  grid.innerHTML = trending
    .map(
      (song, index) => `
    <article class="song-card" data-song-card="${song.id}">
      <div class="song-art" style="background:${song.color}">
        <i class="bi bi-disc-fill"></i>
        <button class="song-play" data-play-id="${song.id}" type="button"
                aria-label="Play ${song.title}">
          <i class="bi bi-play-fill"></i>
        </button>
      </div>

      <strong class="song-title">${song.title}</strong>
      <span class="song-artist">${song.artist}</span>

      <div class="song-bottom">
        <span class="song-genre">${song.genre.toUpperCase()}</span>
        <button class="favorite-btn ${isFavorite(song.id) ? "is-favorite" : ""}"
                data-favorite-id="${song.id}" type="button"
                aria-label="${isFavorite(song.id) ? "Remove from favorites" : "Add to favorites"}">
          <i class="bi bi-heart${isFavorite(song.id) ? "-fill" : ""}"></i>
        </button>
      </div>
    </article>
  `,
    )
    .join("");

  grid.querySelectorAll("[data-play-id]").forEach((button) => {
    button.addEventListener("click", () =>
      VibePlayer.load(button.dataset.playId, true),
    );
  });

  grid.querySelectorAll("[data-favorite-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const added = toggleFavorite(button.dataset.favoriteId);
      refreshSongFavoriteButtons();
      showVibeToast(added ? "Added to Favorites" : "Removed from Favorites");
    });
  });
}

function renderGenres() {
  const grid = $("#genreGrid");

  grid.innerHTML = vibeGenres
    .map(
      (genre) => `
    <button class="genre-card" type="button" style="background:${genre.color}"
            data-genre="${genre.name}">
      <h3>${genre.name}</h3>
      <p>${genre.count}</p>
      <i class="bi ${genre.icon} genre-icon"></i>
    </button>
  `,
    )
    .join("");

  grid.querySelectorAll("[data-genre]").forEach((card) => {
    card.addEventListener("click", () => {
      const genre = card.dataset.genre;
      const matches = vibeSongs.filter(
        (song) => song.genre.toLowerCase() === genre.toLowerCase(),
      );

      if (matches.length) {
        VibePlayer.load(matches[0].id, true);
        showVibeToast(`${genre} vibe loaded`);
      } else {
        showVibeToast(`Explore ${genre} on the Explore page`);
      }
    });
  });
}

function renderArtists() {
  const row = $("#artistRow");

  row.innerHTML = vibeArtists
    .map(
      (artist) => `
    <a class="artist-card" href="artist.html?id=${artist.id}" aria-label="Open ${artist.name}">
      <div class="artist-avatar" style="background:${artist.color}">
        ${getInitials(artist.name)}
      </div>
      <strong class="artist-name">${artist.name}</strong>
      <span class="artist-genre">${artist.genre}</span>
    </a>
  `,
    )
    .join("");
}

function renderVibeOfDay() {
  const vibe = vibeDays[homeState.currentVibeIndex];

  $("#vibeTitle").textContent = vibe.title;
  $("#vibeDescription").textContent = vibe.description;

  $("#vibeTags").innerHTML = vibe.tags
    .map((tag) => `<span class="vibe-tag">${tag}</span>`)
    .join("");

  $("#vibePlayBtn").onclick = () => VibePlayer.load(vibe.songId, true);
}

function renderRecent() {
  const recentIds = getRecentlyPlayed();
  const recentList = $("#recentList");
  const empty = $("#recentEmpty");

  if (!recentIds.length) {
    recentList.innerHTML = "";
    empty.classList.add("show");
    return;
  }

  empty.classList.remove("show");

  const recentSongs = recentIds
    .map((id) => vibeSongs.find((song) => song.id === id))
    .filter(Boolean);

  recentList.innerHTML = recentSongs
    .map(
      (song) => `
    <div class="recent-item">
      <div class="recent-art" style="background:${song.color}"></div>
      <div>
        <strong>${song.title}</strong>
        <span>${song.artist} · ${song.genre}</span>
      </div>
      <span class="recent-time">${song.duration}</span>
      <button class="icon-btn recent-play" data-recent-play="${song.id}" type="button"
              aria-label="Play ${song.title}">
        <i class="bi bi-play-fill"></i>
      </button>
    </div>
  `,
    )
    .join("");

  recentList.querySelectorAll("[data-recent-play]").forEach((button) => {
    button.addEventListener("click", () =>
      VibePlayer.load(button.dataset.recentPlay, true),
    );
  });
}

function renderSearchResults(query = "") {
  const results = $("#searchResults");
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    results.classList.remove("show");
    results.innerHTML = "";
    return;
  }

  const matches = vibeSongs
    .filter(
      (song) =>
        song.title.toLowerCase().includes(normalized) ||
        song.artist.toLowerCase().includes(normalized) ||
        song.genre.toLowerCase().includes(normalized),
    )
    .slice(0, 6);

  if (!matches.length) {
    results.innerHTML = `<div class="p-3 text-secondary small">No VIBE found for "${query}".</div>`;
    results.classList.add("show");
    return;
  }

  results.innerHTML = matches
    .map(
      (song) => `
    <button class="search-result" type="button" data-search-song="${song.id}">
      <span class="result-art" style="background:${song.color}"></span>
      <span>
        <strong>${song.title}</strong>
        <small class="d-block text-secondary">${song.artist} · ${song.genre}</small>
      </span>
      <i class="bi bi-play-fill ms-auto"></i>
    </button>
  `,
    )
    .join("");

  results.classList.add("show");

  results.querySelectorAll("[data-search-song]").forEach((button) => {
    button.addEventListener("click", () => {
      VibePlayer.load(button.dataset.searchSong, true);
      results.classList.remove("show");
      $("#homeSearch").value = "";
    });
  });
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const icon = $("#themeToggle i");

  if (icon) {
    icon.className =
      theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
  }
}

function initTheme() {
  const savedTheme = getTheme();
  applyTheme(savedTheme);

  $("#themeToggle").addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
    showVibeToast(`${nextTheme === "dark" ? "Dark" : "Light"} mode enabled`);
  });
}

function initMobileMenu() {
  const toggle = $("#menuToggle");
  const links = $("#navLinks");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.innerHTML = open
      ? '<i class="bi bi-x-lg"></i>'
      : '<i class="bi bi-list"></i>';
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => links.classList.remove("open"));
  });
}

function initKeyboardSearch() {
  document.addEventListener("keydown", (event) => {
    const isShortcut =
      (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

    if (isShortcut) {
      event.preventDefault();
      $("#homeSearch").focus();
    }

    if (event.key === "Escape") {
      $("#searchResults").classList.remove("show");
      $("#homeSearch").blur();
    }
  });
}

function initSearch() {
  const input = $("#homeSearch");

  input.addEventListener("input", (event) => {
    renderSearchResults(event.target.value);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-section")) {
      $("#searchResults").classList.remove("show");
    }
  });
}

function initHeroActions() {
  $("#heroPlayBtn").addEventListener("click", async () => {
    const state = VibePlayer.getState();

    if (state.currentSong) {
      await VibePlayer.togglePlay();
    } else {
      await VibePlayer.load(vibeSongs[0].id, true);
    }
  });

  $("#surpriseBtn").addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * vibeSongs.length);
    const song = vibeSongs[randomIndex];
    VibePlayer.load(song.id, true);
    showVibeToast(`Surprise: ${song.title}`);
  });
}

function initVibeRefresh() {
  $("#refreshVibeBtn").addEventListener("click", () => {
    homeState.currentVibeIndex =
      (homeState.currentVibeIndex + 1) % vibeDays.length;
    renderVibeOfDay();
    showVibeToast("Your vibe has changed ✨");
  });
}

function initRecentControls() {
  $("#clearRecentBtn").addEventListener("click", () => {
    const hasHistory = getRecentlyPlayed().length > 0;

    if (!hasHistory) {
      showVibeToast("Your history is already empty");
      return;
    }

    clearRecentlyPlayed();
    renderRecent();
    showVibeToast("Listening history cleared");
  });
}

function initNewsletter() {
  const form = $("#newsletterForm");
  const input = $("#emailInput");
  const message = $("#formMessage");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = input.value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email) {
      message.textContent = "Please enter your email.";
      message.className = "form-message error";
      return;
    }

    if (!validEmail) {
      message.textContent = "Please enter a valid email address.";
      message.className = "form-message error";
      return;
    }

    message.textContent = "You're on the VIBE list ✨";
    message.className = "form-message success";
    form.reset();
  });
}

function initHome() {
  $("#heroSongCount").textContent = `${vibeSongs.length}+`;

  VibePlayer.init();
  initTheme();
  initMobileMenu();
  initKeyboardSearch();
  initSearch();
  initHeroActions();
  initVibeRefresh();
  initRecentControls();
  initNewsletter();

  renderTrending();
  renderGenres();
  renderArtists();
  renderVibeOfDay();
  renderRecent();
}

document.addEventListener("DOMContentLoaded", initHome);

/* VIBE shared data foundation.
  Every teammate should import/use these same objects and IDs. */

const vibeSongs = [
  {
    id: 1,
    title: "Midnight Drive",
    artist: "Alex Morgan",
    artistId: 101,
    genre: "Pop",
    album: "After Hours",
    duration: "3:42",
    durationSeconds: 222,
    color: "linear-gradient(135deg,#7c3aed,#ec4899)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Ocean Lights",
    artist: "Luna Ray",
    artistId: 102,
    genre: "Electronic",
    album: "Neon Tides",
    duration: "4:12",
    durationSeconds: 252,
    color: "linear-gradient(135deg,#2563eb,#a855f7)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Golden Hour",
    artist: "Mia Vale",
    artistId: 103,
    genre: "Indie",
    album: "Soft Focus",
    duration: "3:28",
    durationSeconds: 208,
    color: "linear-gradient(135deg,#f59e0b,#ec4899)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: 4,
    title: "Electric Soul",
    artist: "Nova Lane",
    artistId: 104,
    genre: "R&B",
    album: "Electric Soul",
    duration: "3:56",
    durationSeconds: 236,
    color: "linear-gradient(135deg,#db2777,#7c3aed)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: 5,
    title: "Cloud Nine",
    artist: "Eli Rivers",
    artistId: 105,
    genre: "Chill",
    album: "Weightless",
    duration: "4:05",
    durationSeconds: 245,
    color: "linear-gradient(135deg,#06b6d4,#6366f1)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: 6,
    title: "Afterglow",
    artist: "Luna Ray",
    artistId: 102,
    genre: "Electronic",
    album: "Neon Tides",
    duration: "3:51",
    durationSeconds: 231,
    color: "linear-gradient(135deg,#6366f1,#ec4899)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    id: 7,
    title: "Slow Motion",
    artist: "Mia Vale",
    artistId: 103,
    genre: "Indie",
    album: "Soft Focus",
    duration: "3:34",
    durationSeconds: 214,
    color: "linear-gradient(135deg,#f97316,#eab308)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    id: 8,
    title: "Velvet Nights",
    artist: "Alex Morgan",
    artistId: 101,
    genre: "R&B",
    album: "After Hours",
    duration: "4:01",
    durationSeconds: 241,
    color: "linear-gradient(135deg,#4c1d95,#be185d)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    id: 9,
    title: "Sunset Radio",
    artist: "Eli Rivers",
    artistId: 105,
    genre: "Chill",
    album: "Weightless",
    duration: "3:19",
    durationSeconds: 199,
    color: "linear-gradient(135deg,#f97316,#ef4444)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
  {
    id: 10,
    title: "Dream State",
    artist: "Nova Lane",
    artistId: 104,
    genre: "Dream Pop",
    album: "Parallel",
    duration: "4:20",
    durationSeconds: 260,
    color: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  },
  {
    id: 11,
    title: "City Rain",
    artist: "Alex Morgan",
    artistId: 101,
    genre: "Lo-fi",
    album: "After Hours",
    duration: "3:45",
    durationSeconds: 225,
    color: "linear-gradient(135deg,#334155,#7c3aed)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
  },
  {
    id: 12,
    title: "Starlight",
    artist: "Luna Ray",
    artistId: 102,
    genre: "Ambient",
    album: "Neon Tides",
    duration: "5:02",
    durationSeconds: 302,
    color: "linear-gradient(135deg,#0f766e,#6366f1)",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
  },
];

const vibeArtists = [
  {
    id: 101,
    name: "Alex Morgan",
    genre: "Pop / R&B",
    listeners: "2.4M",
    color: "linear-gradient(135deg,#7c3aed,#ec4899)",
  },
  {
    id: 102,
    name: "Luna Ray",
    genre: "Electronic",
    listeners: "1.8M",
    color: "linear-gradient(135deg,#2563eb,#8b5cf6)",
  },
  {
    id: 103,
    name: "Mia Vale",
    genre: "Indie",
    listeners: "1.3M",
    color: "linear-gradient(135deg,#f59e0b,#ec4899)",
  },
  {
    id: 104,
    name: "Nova Lane",
    genre: "R&B",
    listeners: "980K",
    color: "linear-gradient(135deg,#db2777,#7c3aed)",
  },
  {
    id: 105,
    name: "Eli Rivers",
    genre: "Chill",
    listeners: "860K",
    color: "linear-gradient(135deg,#06b6d4,#6366f1)",
  },
];

const vibeGenres = [
  {
    name: "Pop",
    count: "2.8K tracks",
    icon: "bi-stars",
    color: "linear-gradient(135deg,#ec4899,#7c3aed)",
  },
  {
    name: "Electronic",
    count: "1.9K tracks",
    icon: "bi-lightning-charge-fill",
    color: "linear-gradient(135deg,#2563eb,#8b5cf6)",
  },
  {
    name: "Indie",
    count: "1.4K tracks",
    icon: "bi-vinyl-fill",
    color: "linear-gradient(135deg,#f59e0b,#ef4444)",
  },
  {
    name: "R&B",
    count: "1.2K tracks",
    icon: "bi-mic-fill",
    color: "linear-gradient(135deg,#db2777,#7c3aed)",
  },
  {
    name: "Chill",
    count: "980 tracks",
    icon: "bi-cloud-fill",
    color: "linear-gradient(135deg,#0891b2,#6366f1)",
  },
  {
    name: "Lo-fi",
    count: "760 tracks",
    icon: "bi-headphones",
    color: "linear-gradient(135deg,#475569,#7c3aed)",
  },
  {
    name: "Dream Pop",
    count: "640 tracks",
    icon: "bi-moon-stars-fill",
    color: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
  },
  {
    name: "Ambient",
    count: "520 tracks",
    icon: "bi-wind",
    color: "linear-gradient(135deg,#0f766e,#6366f1)",
  },
];

const vibeDays = [
  {
    title: "Neon After Dark",
    description:
      "Smooth electronic textures, dreamy vocals and just enough bass for a midnight city ride.",
    tags: ["Night", "Electronic", "Dreamy"],
    songId: 2,
  },
  {
    title: "Golden Morning",
    description:
      "Warm guitars, soft drums and optimistic melodies for a fresh start.",
    tags: ["Morning", "Indie", "Warm"],
    songId: 3,
  },
  {
    title: "Main Character",
    description:
      "Confident pop and R&B energy for the moments when everything feels cinematic.",
    tags: ["Confidence", "Pop", "Energy"],
    songId: 1,
  },
  {
    title: "Cloud Nine",
    description:
      "Float through your day with atmospheric sounds and zero unnecessary noise.",
    tags: ["Chill", "Ambient", "Focus"],
    songId: 5,
  },
];

/*
  Shared VIBE music player.
  Other pages should reuse this architecture instead of creating a second player.
*/

const VibePlayer = (() => {
  const audio = document.getElementById("audioPlayer");

  const state = {
    queue: [...vibeSongs],
    currentIndex: 0,
    currentSong: null,
    isPlaying: false,
  };

  const elements = {
    title: document.getElementById("playerTitle"),
    artist: document.getElementById("playerArtist"),
    cover: document.getElementById("playerCover"),
    favorite: document.getElementById("playerFavorite"),
    playPause: document.getElementById("playPauseBtn"),
    prev: document.getElementById("prevBtn"),
    next: document.getElementById("nextBtn"),
    progress: document.getElementById("progressBar"),
    currentTime: document.getElementById("currentTime"),
    duration: document.getElementById("duration"),
    volume: document.getElementById("volumeBar"),
  };

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  function updatePlayIcon() {
    elements.playPause.innerHTML = state.isPlaying
      ? '<i class="bi bi-pause-fill"></i>'
      : '<i class="bi bi-play-fill"></i>';
    elements.playPause.setAttribute(
      "aria-label",
      state.isPlaying ? "Pause" : "Play",
    );
  }

  function updateFavoriteIcon() {
    if (!state.currentSong) return;
    const favorite = isFavorite(state.currentSong.id);
    elements.favorite.innerHTML = favorite
      ? '<i class="bi bi-heart-fill"></i>'
      : '<i class="bi bi-heart"></i>';
    elements.favorite.classList.toggle("is-favorite", favorite);
  }

  function updateUI() {
    const song = state.currentSong;
    if (!song) return;

    elements.title.textContent = song.title;
    elements.artist.textContent = song.artist;
    elements.cover.style.background = song.color;
    elements.cover.innerHTML = '<i class="bi bi-music-note-beamed"></i>';
    elements.duration.textContent = song.duration;
    updateFavoriteIcon();
    updatePlayIcon();
  }

  async function load(songId, autoplay = false) {
    const song = vibeSongs.find((item) => item.id === Number(songId));
    if (!song) return;

    state.currentSong = song;
    state.currentIndex = state.queue.findIndex((item) => item.id === song.id);
    if (state.currentIndex < 0) state.currentIndex = 0;

    audio.src = song.audio;
    audio.load();
    addRecentlyPlayed(song.id);
    updateUI();

    if (autoplay) {
      try {
        await audio.play();
      } catch (error) {
        // Browser autoplay policies can block playback until user interaction.
        showVibeToast("Press play to start the track.");
      }
    }
    renderRecent();
  }

  async function togglePlay() {
    if (!state.currentSong) {
      await load(vibeSongs[0].id, true);
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        showVibeToast("Audio could not start. Check your connection.");
      }
    } else {
      audio.pause();
    }
  }

  async function next() {
    if (!state.queue.length) return;
    state.currentIndex = (state.currentIndex + 1) % state.queue.length;
    await load(state.queue[state.currentIndex].id, true);
  }

  async function previous() {
    if (!state.queue.length) return;
    if (audio.currentTime > 4) {
      audio.currentTime = 0;
      return;
    }
    state.currentIndex =
      (state.currentIndex - 1 + state.queue.length) % state.queue.length;
    await load(state.queue[state.currentIndex].id, true);
  }

  function seek(percent) {
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = (Number(percent) / 100) * audio.duration;
  }

  function setVolume(value) {
    const volume = Math.min(1, Math.max(0, Number(value)));
    audio.volume = volume;
    saveVolume(volume);
  }

  function bindEvents() {
    elements.playPause.addEventListener("click", togglePlay);
    elements.next.addEventListener("click", next);
    elements.prev.addEventListener("click", previous);

    elements.progress.addEventListener("input", (event) => {
      seek(event.target.value);
    });

    elements.volume.addEventListener("input", (event) => {
      setVolume(event.target.value);
    });

    elements.favorite.addEventListener("click", () => {
      if (!state.currentSong) return;
      const added = toggleFavorite(state.currentSong.id);
      updateFavoriteIcon();
      refreshSongFavoriteButtons();
      showVibeToast(added ? "Added to Favorites" : "Removed from Favorites");
    });

    audio.addEventListener("play", () => {
      state.isPlaying = true;
      updatePlayIcon();
    });

    audio.addEventListener("pause", () => {
      state.isPlaying = false;
      updatePlayIcon();
    });

    audio.addEventListener("timeupdate", () => {
      if (!Number.isFinite(audio.duration)) return;
      const percent = (audio.currentTime / audio.duration) * 100;
      elements.progress.value = percent;
      elements.currentTime.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", () => {
      elements.duration.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("ended", next);
  }

  function init() {
    elements.volume.value = getVolume();
    audio.volume = getVolume();
    bindEvents();
  }

  return {
    init,
    load,
    togglePlay,
    next,
    previous,
    getState: () => ({ ...state }),
  };
})();

function refreshSongFavoriteButtons() {
  document.querySelectorAll("[data-favorite-id]").forEach((button) => {
    const id = Number(button.dataset.favoriteId);
    const favorite = isFavorite(id);
    button.classList.toggle("is-favorite", favorite);
    button.innerHTML = favorite
      ? '<i class="bi bi-heart-fill"></i>'
      : '<i class="bi bi-heart"></i>';
    button.setAttribute(
      "aria-label",
      favorite ? "Remove from favorites" : "Add to favorites",
    );
  });
}

function showVibeToast(message) {
  const toast = document.getElementById("toastMessage");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__vibeToastTimer);
  window.__vibeToastTimer = setTimeout(
    () => toast.classList.remove("show"),
    1900,
  );
}

/*
  Shared LocalStorage contract.
  DO NOT rename these keys without the team agreeing first.
*/

const VIBE_STORAGE_KEYS = {
  favorites: "vibeFavorites",
  recentlyPlayed: "vibeRecentlyPlayed",
  playlists: "vibePlaylists",
  theme: "vibeTheme",
  volume: "vibeVolume",
  followedArtists: "vibeFollowedArtists",
};

function getStorage(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn("VIBE storage read failed:", error);
    return fallback;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFavorites() {
  return getStorage(VIBE_STORAGE_KEYS.favorites, []);
}

function isFavorite(songId) {
  return getFavorites().includes(Number(songId));
}

function toggleFavorite(songId) {
  const id = Number(songId);
  const favorites = getFavorites();
  const next = favorites.includes(id)
    ? favorites.filter((item) => item !== id)
    : [...favorites, id];

  setStorage(VIBE_STORAGE_KEYS.favorites, next);
  return next.includes(id);
}

function getRecentlyPlayed() {
  return getStorage(VIBE_STORAGE_KEYS.recentlyPlayed, []);
}

function addRecentlyPlayed(songId) {
  const id = Number(songId);
  const recent = getRecentlyPlayed().filter((item) => item !== id);
  recent.unshift(id);
  setStorage(VIBE_STORAGE_KEYS.recentlyPlayed, recent.slice(0, 10));
}

function clearRecentlyPlayed() {
  localStorage.removeItem(VIBE_STORAGE_KEYS.recentlyPlayed);
}

function getTheme() {
  return localStorage.getItem(VIBE_STORAGE_KEYS.theme) || "dark";
}

function saveTheme(theme) {
  localStorage.setItem(VIBE_STORAGE_KEYS.theme, theme);
}

function getVolume() {
  const saved = Number(localStorage.getItem(VIBE_STORAGE_KEYS.volume));
  return Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.75;
}

function saveVolume(volume) {
  localStorage.setItem(VIBE_STORAGE_KEYS.volume, String(volume));
}
