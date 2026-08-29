
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


// 5. RENDER SONG CARDS

function renderSongs() {
    let filtered = [...state.songs];
    
    if (state.filter === 'popular') {
        filtered.sort((a, b) => b.plays - a.plays);
    } else if (state.filter === 'recent') {
        filtered.sort((a, b) => b.id - a.id);
    }
    
    if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(song => 
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query)
        );
    }
    
    if (filtered.length === 0) {
        dom.songGrid.innerHTML = `
            <div class="col-12 text-center text-muted py-5">
                <i class="bi bi-music-note-beamed fs-1 d-block mb-3"></i>
                <h5>No songs found</h5>
                <p>Try adjusting your search or filter</p>
            </div>
        `;
        return;
    }
    
    dom.songGrid.innerHTML = filtered.map((song) => {
        const isActive = state.currentSong && state.currentSong.id === song.id;
        return `
            <div class="col-6 col-lg-4">
                <div class="song-card ${isActive ? 'playing' : ''}" data-id="${song.id}">
                    <div class="song-cover">
                        ${song.cover || '🎵'}
                    </div>
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                    <div class="song-lyric text-muted small">"${song.lyric || ''}"</div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="song-duration">${song.duration}</span>
                        <span class="text-muted small">
                            <i class="bi bi-heart${song.liked ? '-fill text-danger' : ''}"></i>
                        </span>
                    </div>
                    <button class="play-btn" data-id="${song.id}">
                        <i class="bi bi-play-fill"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.song-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.play-btn')) return;
            const id = parseInt(this.dataset.id);
            playSongById(id);
        });
    });
    
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            playSongById(id);
        });
    });
}


// 6. RENDER RECENTLY ADDED


function renderRecent() {
    const recent = [...state.songs]
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);
    
    if (recent.length === 0) {
        dom.recentGrid.innerHTML = `
            <div class="col-12 text-center text-muted py-3">
                <small>No recently added songs</small>
            </div>
        `;
        return;
    }
    
    dom.recentGrid.innerHTML = recent.map(song => `
        <div class="col-6 col-md-4">
            <div class="recent-item" data-id="${song.id}">
                <div class="d-flex align-items-center gap-2">
                    <span class="fs-4">${song.cover || '🎵'}</span>
                    <div class="flex-grow-1">
                        <div class="text-white small fw-semibold">${song.title}</div>
                        <div class="text-muted small">${song.artist}</div>
                    </div>
                    <i class="bi bi-play-circle text-primary"></i>
                </div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.recent-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            playSongById(id);
        });
    });
}

// 7. PLAYBACK FUNCTIONS

function playSongById(id) {
    const song = state.songs.find(s => s.id === id);
    if (!song) return;
    
    if (state.currentSong && state.currentSong.id === id && state.isPlaying) {
        pauseSong();
        return;
    }
    
    state.currentSong = song;
    state.isPlaying = true;
    state.currentIndex = state.songs.findIndex(s => s.id === id);
    
    updatePlayerUI();
    updateVinylState();
    renderSongs();
    updateStats();
    startProgressSimulation();
    
    saveToRecentlyPlayed(song);
}

function pauseSong() {
    state.isPlaying = false;
    clearInterval(progressInterval);
    updatePlayerUI();
    updateVinylState();
    renderSongs();
}

function nextSong() {
    if (state.songs.length === 0) return;
    if (state.currentIndex === -1) {
        playSongById(state.songs[0].id);
        return;
    }
    const nextIndex = (state.currentIndex + 1) % state.songs.length;
    playSongById(state.songs[nextIndex].id);
}

function prevSong() {
    if (state.songs.length === 0) return;
    if (state.currentIndex === -1) {
        playSongById(state.songs[0].id);
        return;
    }
    const prevIndex = (state.currentIndex - 1 + state.songs.length) % state.songs.length;
    playSongById(state.songs[prevIndex].id);
}

function saveToRecentlyPlayed(song) {
    let recent = JSON.parse(localStorage.getItem('vibe_recently_played') || '[]');
    recent = recent.filter(s => s.id !== song.id);
    recent.unshift({ ...song, playedAt: Date.now() });
    if (recent.length > 10) recent = recent.slice(0, 10);
    localStorage.setItem('vibe_recently_played', JSON.stringify(recent));
}

// 8. PLAYER UI UPDATES

function updatePlayerUI() {
    const song = state.currentSong;
    
    if (!song) {
        dom.currentTitle.textContent = 'No song selected';
        dom.currentArtist.textContent = '--';
        dom.totalTime.textContent = '0:00';
        dom.currentTime.textContent = '0:00';
        dom.progressBar.style.width = '0%';
        dom.playPauseBtn.innerHTML = '<i class="bi bi-play-fill fs-4"></i>';
        dom.likeBtn.className = 'btn btn-outline-secondary rounded-circle';
        dom.likeBtn.innerHTML = '<i class="bi bi-heart"></i>';
        return;
    }
    
    dom.currentTitle.textContent = song.title;
    dom.currentArtist.textContent = song.artist;
    dom.totalTime.textContent = song.duration || '3:00';
    
    if (state.isPlaying) {
        dom.playPauseBtn.innerHTML = '<i class="bi bi-pause-fill fs-4"></i>';
    } else {
        dom.playPauseBtn.innerHTML = '<i class="bi bi-play-fill fs-4"></i>';
    }
    
    if (song.liked) {
        dom.likeBtn.className = 'btn btn-danger rounded-circle';
        dom.likeBtn.innerHTML = '<i class="bi bi-heart-fill"></i>';
    } else {
        dom.likeBtn.className = 'btn btn-outline-secondary rounded-circle';
        dom.likeBtn.innerHTML = '<i class="bi bi-heart"></i>';
    }
}

function updateVinylState() {
    if (state.isPlaying) {
        dom.vinylLarge.classList.add('playing');
    } else {
        dom.vinylLarge.classList.remove('playing');
    }
}

// 9. PROGRESS BAR


let progressInterval = null;

function startProgressSimulation() {
    clearInterval(progressInterval);
    if (!state.currentSong || !state.isPlaying) return;
    
    const totalSeconds = durationToSeconds(state.currentSong.duration || '3:00');
    let currentSeconds = 0;
    
    progressInterval = setInterval(() => {
        currentSeconds += 1;
        const progress = Math.min((currentSeconds / totalSeconds) * 100, 100);
        dom.progressBar.style.width = progress + '%';
        dom.currentTime.textContent = secondsToDuration(currentSeconds);
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            nextSong();
        }
    }, 1000);
}

function durationToSeconds(duration) {
    const parts = duration.split(':').map(Number);
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return 180;
}

function secondsToDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function resetProgress() {
    clearInterval(progressInterval);
    dom.progressBar.style.width = '0%';
    dom.currentTime.textContent = '0:00';
}

// 10. UPDATE STATS


function updateStats() {
    const songs = state.songs;
    const total = songs.length;
    
    const artists = new Set(songs.map(s => s.artist));
    const totalArtists = artists.size;
    
    const likes = songs.filter(s => s.liked).length;
    
    let totalSeconds = 0;
    songs.forEach(s => {
        totalSeconds += durationToSeconds(s.duration || '3:00');
    });
    const totalMinutes = Math.floor(totalSeconds / 60);
    
    dom.totalSongs.textContent = total;
    dom.totalArtists.textContent = totalArtists;
    dom.totalLikes.textContent = likes;
    dom.totalDuration.textContent = totalMinutes;
}

// 11. SEARCH AND FILTER


dom.searchInput.addEventListener('input', function() {
    state.searchQuery = this.value;
    renderSongs();
});

dom.filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        dom.filterBtns.forEach(b => b.classList.remove('active-filter'));
        this.classList.add('active-filter');
        state.filter = this.dataset.filter;
        renderSongs();
    });
});

// 12. PLAYER CONTROLS

dom.playPauseBtn.addEventListener('click', function() {
    if (!state.currentSong) {
        if (state.songs.length > 0) {
            playSongById(state.songs[0].id);
        }
        return;
    }
    
    if (state.isPlaying) {
        pauseSong();
    } else {
        state.isPlaying = true;
        updatePlayerUI();
        updateVinylState();
        renderSongs();
        startProgressSimulation();
    }
});

dom.nextBtn.addEventListener('click', nextSong);
dom.prevBtn.addEventListener('click', prevSong);

dom.progressContainer.addEventListener('click', function(e) {
    if (!state.currentSong) return;
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percent = (x / width) * 100;
    dom.progressBar.style.width = percent + '%';
    
    const totalSeconds = durationToSeconds(state.currentSong.duration || '3:00');
    const currentSeconds = Math.floor((percent / 100) * totalSeconds);
    dom.currentTime.textContent = secondsToDuration(currentSeconds);
    
    if (state.isPlaying) {
        clearInterval(progressInterval);
        startProgressSimulation();
    }
});

// 13. LIKE BUTTON


dom.likeBtn.addEventListener('click', function() {
    if (!state.currentSong) return;
    const song = state.currentSong;
    song.liked = !song.liked;
    saveSongs(state.songs);
    updatePlayerUI();
    renderSongs();
    updateStats();
});

// 14. ADD NEW SONG

dom.addSongBtn.addEventListener('click', function() {
    const title = dom.newTitle.value.trim();
    const artist = dom.newArtist.value.trim();
    const lyric = dom.newLyric.value.trim();
    const duration = dom.newDuration.value.trim();
    
    if (!title || !artist) {
        alert('Please enter title and artist name!');
        return;
    }
    
    const newSong = {
        id: Date.now(),
        title: title,
        artist: artist,
        lyric: lyric || '',
        duration: duration || '3:00',
        cover: '🎵',
        plays: 0,
        liked: false,
        tags: []
    };
    
    state.songs.push(newSong);
    saveSongs(state.songs);
    
    dom.newTitle.value = '';
    dom.newArtist.value = '';
    dom.newLyric.value = '';
    dom.newDuration.value = '';
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addSongModal'));
    if (modal) modal.hide();
    
    renderSongs();
    renderRecent();
    updateStats();
});

// 15. PLAY ALL AND SHUFFLE

document.getElementById('playAllBtn').addEventListener('click', function() {
    if (state.songs.length === 0) return;
    playSongById(state.songs[0].id);
});

document.getElementById('shuffleBtn').addEventListener('click', function() {
    if (state.songs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * state.songs.length);
    playSongById(state.songs[randomIndex].id);
});

document.getElementById('saveBtn').addEventListener('click', function() {
    alert('✅ Playlist saved to your library!');
});

