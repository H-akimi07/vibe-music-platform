


// Hero section part ......

// دیتا بیس فرضی خواننده‌ها (زمانی که پروژه به سرور وصل نیست)

const artistsDatabase = {
  "101": {
    name: "AURORA",
    role: "Singer • Songwriter • Producer",
    bio: "AURORA is a soulful singer and songwriter who creates music that touches the heart and stays with you forever.",
    listeners: "2.4M",
    streams: "1.2B",
    songsCount: "45",
    image: "https://media.istockphoto.com/id/1778147067/photo/photo-of-pretty-cool-lady-wear-tinsel-jacket-rising-discoball-singing-songs-isolated-neon.jpg?b=1&s=612x612&w=0&k=20&c=OUWfK4H_8WbLOrrEnEraWrhEaQbRQ3EzPiKIPEg3irM=F" // یک عکس نمونه با کیفیت بالا
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // ۱. گرفتن ID خواننده از آدرس مرورگر (مثال: artist.html?id=101)
  const urlParams = new URLSearchParams(window.location.search);
  const artistId = urlParams.get('id') || "101"; // اگر آیدی نبود به صورت پیش‌فرض آیدی آرورا را بگذار

  // ۲. پیدا کردن خواننده در دیتابیس
  const artist = artistsDatabase[artistId];

  if (artist) {
    // ۳. رندر کردن و نشاندن اطلاعات در صفحه
    document.getElementById("artist-name").innerText = artist.name;
    document.getElementById("artist-role").innerText = artist.role;
    document.getElementById("artist-bio").innerText = artist.bio;
    document.getElementById("artist-listeners").innerText = artist.listeners;
    document.getElementById("artist-streams").innerText = artist.streams;
    document.getElementById("artist-songs-count").innerText = artist.songsCount;

    // تنظیم تصاویر هیرو
    document.getElementById("hero-main-img").src = artist.image;
    document.getElementById("hero-blur-img").style.backgroundImage = `url('${artist.image}')`;
  }

  // ۴. پیاده‌سازی سیستم پویا Follow 
  const followBtn = document.getElementById("btn-follow");
  const followText = document.getElementById("follow-text");
  let isFollowing = false;

  followBtn.addEventListener("click", () => {
    isFollowing = !isFollowing;
    if (isFollowing) {
      followText.innerText = "Following";
      followBtn.classList.remove("btn-outline-light");
      followBtn.classList.add("btn-light"); // تغییر ظاهر دکمه به حالت فعال
    } else {
      followText.innerText = "Follow";
      followBtn.classList.remove("btn-light");
      followBtn.classList.add("btn-outline-light");
    }
  });
});

