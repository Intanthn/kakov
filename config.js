// ═══════════════════════════════════════════════════════════════
//  ✏️  EDIT THIS FILE — customize the gift for your friend!
// ═══════════════════════════════════════════════════════════════

const BIRTHDAY_CONFIG = {
  // Your friend's name (shown on the big title)
  name: "Ovira",

  // Short nickname (optional — not shown if hero uses fixed text)
  nickname: "",

  // Birthday date (optional — set to null to hide)
  birthdayDate: "19 Juni",

  // Main greeting messages (shown one by one with typing effect)
  messages: [
    "Another year of being awesome and somehow still looking good doing it 😎",
    "Thanks for being the kind of friend everyone wishes they had.",
    "Here's to more adventures, inside jokes, and late night talks.",
    "You're leveling up my pionir kesatria",
    "Wishing you the happiest birthday ever! 🎂",
  ],

  // Personal note at the end (leave empty "" to hide)
  personalNote:
    "From your best friend, little sister and friend forever. Hope this little thing made you happy 💙",

  // ── PHOTOS ──────────────────────────────────────────────────
  // 3 BIG main photos (animated showcase — tap to enlarge)
  mainPhotos: [
    { src: "photo1.jpg", caption: "" },
    { src: "photo2.jpg", caption: "" },
    { src: "photo3.jpg", caption: "" },
  ],

  // Extra photos — repeated as many small floating sprinkles around the main ones
  sprinklePhotos: [
    { src: "photo4.jpg" },
    { src: "photo5.jpg" },
    { src: "photo6.jpg" },
    { src: "photo7.jpg" },
    { src: "photo8.jpg" },
    { src: "photo9.jpg" },
  ],

  // How many small photos to show (reuses sprinklePhotos if needed)
  sprinkleCount: 24,

  // Music (optional) — put an mp3 in the folder and set the path, or null to disable
  music: null, // e.g. "music/happy-birthday.mp3"

  // Theme accent — pick one: "ocean" | "midnight" | "forest" | "sunset"
  theme: "ocean",

  // Number of candles on the interactive cake (1 = single candle on top)
  candleCount: 1,
};
