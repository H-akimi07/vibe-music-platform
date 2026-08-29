
// 1. SONG DATA
const songsData = [
  {
    id: 1,
    title: "Washing Machine Heart",
    artist: "Mitski",
    lyric: "Toss your shoes in my washing machine heart",
    duration: "3:24",
    cover: "🎤",
    plays: 120,
    liked: false,
    tags: ["Indie", "Pop"],
  },
  {
    id: 2,
    title: "Break The Rules",
    artist: "Charli XCX",
    lyric: "I just wanna break the rules",
    duration: "2:58",
    cover: "🎤",
    plays: 95,
    liked: false,
    tags: ["Pop", "Electronic"],
  },
  {
    id: 3,
    title: "Glue Song",
    artist: "beabadoobee",
    lyric: "Tangled in love, stuck by you, from the glue",
    duration: "4:12",
    cover: "🎤",
    plays: 87,
    liked: false,
    tags: ["Indie", "Folk"],
  },
  {
    id: 4,
    title: "Art Deco",
    artist: "Lana Del Rey",
    lyric: "You're so art deco, out on the floor",
    duration: "3:11",
    cover: "🎤",
    plays: 76,
    liked: false,
    tags: ["Pop", "Dream Pop"],
  },
  {
    id: 5,
    title: "Midnight Dreams",
    artist: "Aron Walker",
    lyric: "Lost in the rain, echoes of you",
    duration: "5:06",
    cover: "🎤",
    plays: 65,
    liked: false,
    tags: ["Electronic", "Chill"],
  },
  {
    id: 6,
    title: "Fading Lights",
    artist: "AURORA",
    lyric: "Shadows & light, fading away",
    duration: "3:45",
    cover: "🎤",
    plays: 54,
    liked: false,
    tags: ["Pop", "Soul"],
  },
];

// 2. APPLICATION STATE

let state = {
  songs: [],
  currentSong: null,
  isPlaying: false,
  currentIndex: -1,
  filter: "all",
  searchQuery: "",
};

// 3.dom elements
const dom = {
  songGrid: document.getElementById("songGrid"),
  recentGrid: document.getElementById("recentGrid"),
  searchInput: document.getElementById("searchInput"),
  filterBtns: document.querySelectorAll(".filter-btn"),

  vinylLarge: document.getElementById("vinylLarge"),
  playPauseBtn: document.getElementById("playPauseBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  progressBar: document.getElementById("progressBar"),
  progressContainer: document.getElementById("progressContainer"),
  currentTime: document.getElementById("currentTime"),
  totalTime: document.getElementById("totalTime"),
  currentTitle: document.getElementById("nowPlayingTitle"),
  currentArtist: document.getElementById("nowPlayingArtist"),
  likeBtn: document.getElementById("likeBtn"),

  totalSongs: document.getElementById("totalSongs"),
  totalDuration: document.getElementById("totalDuration"),
  totalArtists: document.getElementById("totalArtists"),
  totalLikes: document.getElementById("totalLikes"),

  addSongBtn: document.getElementById("addSongBtn"),
  newTitle: document.getElementById("newSongTitle"),
  newArtist: document.getElementById("newSongArtist"),
  newLyric: document.getElementById("newSongLyric"),
  newDuration: document.getElementById("newSongDuration"),
};

// 4. LOCAL STORAGE FUNCTIONS

const STORAGE_KEY = 'vibe_playlist';

function saveSongs(songs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
}

function loadSongs() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch {
            return null;
        }
    }
    return null;
}

function getSongs() {
    const saved = loadSongs();
    if (saved && saved.length > 0) {
        return saved;
    }
    saveSongs(songsData);
    return [...songsData];
}
