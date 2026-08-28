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