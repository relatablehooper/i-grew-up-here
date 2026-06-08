/* ============================================================================
   content.js  —  THE STORY LIVES HERE
   ----------------------------------------------------------------------------
   This is the only file you (Ayaan) need to edit to write your story.
   The engine reads everything from here: which rooms exist, where they sit on
   the map, what photos and panoramas they use, where the hotspots are, and the
   text of every memory vignette.

   HOW TO WRITE YOUR STORY:
   - Replace every caption marked [PLACEHOLDER ...] with your real writing.
   - The [VOICE SAMPLE] captions are examples written to show the *register* for
     that stage. Rewrite them in your own words — they are models, not final text.
   - Add real image paths when you have photos. Until then, leave paths as-is;
     the engine renders labeled placeholders automatically.
   - Aim, across ALL captions combined, for roughly 6–8 pages of double-spaced
     prose (~1,300–1,800 words). That is what gets graded for Knowledge/Thinking/
     Communication. Quality over quantity, but there must be enough real writing.

   STAGE VOICES (keep these distinct — the changing voice IS the story):
   - play:        present tense, sensory, wide-eyed, NO reflection. Short sentences.
   - performance: harder, goal-driven, "we / the team", future = next season.
   - cultivation: slower, reflective, first-person turns inward, the long view.
   - family:      warm, golden, nostalgic, belonging. Good memories only.
============================================================================ */

export const PROJECT = {
  title: "I Grew Up Here",
  subtitle: "A memory palace, in the shape of a gym.",
  // Shown in the optional "About this project" overlay (helps the teacher see
  // the post-modern devices — keep it honest and short).
  aboutPostModern:
    "This story has no fixed order. You build it by wandering. The same building " +
    "holds three different people who are all me, and in the cafe they finally sit " +
    "down together. The form is the point: memory is not a line, it is a place you " +
    "walk through.",
};

/* The four threads. Colors drive the per-room tint (CSS variables). */
export const STAGES = {
  play:        { label: "Play",        ages: "8–12",     color: "#F2B441" },
  performance: { label: "Performance", ages: "12–16",    color: "#3E78A0" },
  cultivation: { label: "Cultivation", ages: "16–now",   color: "#7C8B6B" },
  family:      { label: "Family",      ages: "summers",  color: "#E8915B" },
};

/* ----------------------------------------------------------------------------
   ROOMS
   Each room:
     id          unique string (used in the URL: #room/<id>)
     name        display name
     stage       'play' | 'performance' | 'cultivation' | 'family' | null
     type        'scene' (flat photo)  |  'pano' (360 panorama)
     image       path under /public (leave placeholder paths for now)
     map         { x, y } position on the floor-plan hub, in % (0–100)
     hotspots[]  clickable memory points
       x, y      position. scene => % (0–100). pano => { pitch, yaw } degrees.
       photo     path to a photo of younger Ayaan (placeholder for now)
       title     short label (also used as alt text)
       caption   the vignette (THIS is your writing)
       age       number, shown subtly on the card

   OPTIONAL ROOM FIELDS:
     personPhoto   { src, position, scale, verticalAlign, blendMode? }  or null
                   A photo of YOU standing in the room (transparent PNG works
                   best). It is composited onto the scene with a drop shadow
                   and a soft ground shadow so it feels present in the space,
                   not pasted on. See the comment above the personPhoto field
                   in src/room.js for prep tips. Leave null until you have one.
     easterEggVideo { src, label, triggerPosition: { x, y } } or null
                   A small trigger icon appears in that room. Click -> a
                   small video plays in an overlay. Only used on weights and
                   court today (the prompt's request).
---------------------------------------------------------------------------- */
export const ROOMS = [

  /* ---------------------------------- ENTRANCE (framing) ------------------ */
  {
    id: "entrance",
    name: "The Entrance",
    stage: null,
    type: "scene",
    image: "/scenes/entrance.jpg",
    intro: true,                 // the single guided beat before free exploration
    map: { x: 50, y: 92 },
    personPhoto: null,
    hotspots: [
      {
        id: "front-doors",
        x: 50, y: 60,
        photo: "/photos/now.jpg",
        title: "The doors",
        age: 18,
        caption:
          "[VOICE SAMPLE — rewrite] I have walked through these doors a thousand " +
          "times and never the same person twice. Today the scanner beeps and I am " +
          "eighteen. But the building does not know that. To it, every version of me " +
          "is still inside, somewhere, mid-game, mid-lap, mid-rep. Pick a direction. " +
          "You will meet one of them.",
      },
    ],
  },

  /* ---------------------------------- PLAY -------------------------------- */
  {
    id: "kids-academy",
    name: "Kids Academy",
    stage: "play",
    type: "scene",
    image: "/scenes/kids-academy.jpg",
    map: { x: 22, y: 70 },
    personPhoto: null,
    hotspots: [
      {
        id: "magnetic-tiles",
        x: 32, y: 58,
        photo: "/photos/age8-tiles.jpg",
        title: "The magnetic tiles",
        age: 8,
        caption:
          "[VOICE SAMPLE — rewrite] The tiles click when they find each other. I build " +
          "a tower taller than my own sitting-down height and it does not fall and that " +
          "is the whole afternoon. There is no point to it. That is the point. Nobody is " +
          "keeping score yet.",
      },
      {
        id: "dodgeball",
        x: 58, y: 52,
        photo: "/photos/age9-dodgeball.jpg",
        title: "Dodgeball",
        age: 9,
        caption:
          "[PLACEHOLDER — ~100–140 words, present tense, sensory. The game of tag / " +
          "dodgeball in the play area. The squeak of shoes, getting hit and not minding, " +
          "the pure motion of it. Keep it joyful and un-reflective — you are little here.]",
      },
      {
        id: "ipad-lego",
        x: 44, y: 72,
        photo: "/photos/age8-lego.jpg",
        title: "iPad & Lego corner",
        age: 8,
        caption:
          "[PLACEHOLDER — ~100 words. The quiet corner: iPad, Lego. The specific feeling " +
          "of being absorbed in something small. A detail only you would remember.]",
      },
    ],
  },

  {
    id: "indoor-pool",
    name: "The Pool / Summer Camp",
    stage: "play",
    type: "scene",
    image: "/scenes/indoor-pool.jpg",
    map: { x: 35, y: 55 },
    personPhoto: null,
    hotspots: [
      {
        id: "swim-lessons",
        x: 40, y: 60,
        photo: "/photos/age8-swim.jpg",
        title: "Learning to swim",
        age: 8,
        caption:
          "[PLACEHOLDER — ~120 words. Summer camp, the smell of chlorine, swimming, the " +
          "pool as the centre of summer. This room is the BRIDGE: play is starting to " +
          "turn into skill. Hint at that without naming it.]",
      },
      {
        id: "camp-sports",
        x: 65, y: 50,
        photo: "/photos/age10-camp.jpg",
        title: "Summer camp",
        age: 10,
        caption:
          "[PLACEHOLDER — ~100 words. Camp sports, the long unstructured days, friends " +
          "you only saw in July. The last pure-play summers before it got serious.]",
      },
    ],
  },

  /* ---------------------------------- PERFORMANCE ------------------------- */
  {
    id: "court",
    name: "The Basketball Court",
    stage: "performance",
    type: "scene",
    image: "/scenes/court.jpg",
    map: { x: 70, y: 62 },
    personPhoto: null,
    easterEggVideo: {
      src: "/videos/court-clip.mp4",
      label: "a moment from this room",
      triggerPosition: { x: 12, y: 18 }, // top-left corner of the scene
    },
    hotspots: [
      {
        id: "team-training",
        x: 50, y: 55,
        photo: "/photos/age14-court.jpg",
        title: "Training for the team",
        age: 14,
        caption:
          "[VOICE SAMPLE — rewrite] Now the squeak of shoes means something. Every drill " +
          "is for a tryout that has not happened yet. I am not playing the game; I am " +
          "paying for a future game, in advance, in sweat. Fun is still here but it has " +
          "a job now. We run the line until someone throws up and we are proud of him.",
      },
      {
        id: "highschool-club",
        x: 72, y: 48,
        photo: "/photos/age15-jersey.jpg",
        title: "High-school & club team",
        age: 15,
        caption:
          "[PLACEHOLDER — ~140 words. Making the high-school team and the out-of-school " +
          "club team. The identity of being 'a basketball player'. The pressure, the " +
          "belonging, the way the goal narrowed everything to next season.]",
      },
    ],
  },

  {
    id: "calisthenics",
    name: "The Calisthenics Area",
    stage: "performance",
    type: "scene",
    image: "/scenes/calisthenics.jpg",
    map: { x: 82, y: 50 },
    personPhoto: null,
    hotspots: [
      {
        id: "bodyweight",
        x: 45, y: 58,
        photo: "/photos/age15-calisthenics.jpg",
        title: "Bodyweight training",
        age: 15,
        caption:
          "[PLACEHOLDER — ~120 words. Calisthenics / bodyweight work, all of it aimed at " +
          "basketball performance. Pull-ups, dips, the bars. Body as a tool you are " +
          "sharpening for something else.]",
      },
      {
        id: "friendships",
        x: 68, y: 64,
        photo: "/photos/age15-friends.jpg",
        title: "The friends I made here",
        age: 15,
        caption:
          "[PLACEHOLDER — ~120 words. Meeting people and building friendships through " +
          "shared training. Friendship forged by suffering together. This is the warm " +
          "human centre of the performance stage — don't skip it.]",
      },
    ],
  },

  /* ---------------------------------- CULTIVATION ------------------------- */
  {
    id: "weights",
    name: "The Weight Floor",
    stage: "cultivation",
    type: "scene",
    image: "/scenes/weights.jpg",
    map: { x: 78, y: 32 },
    personPhoto: null,
    easterEggVideo: {
      src: "/videos/weights-clip.mp4",
      label: "a moment from this room",
      triggerPosition: { x: 88, y: 82 }, // bottom-right corner of the scene
    },
    hotspots: [
      {
        id: "lifting",
        x: 48, y: 56,
        photo: "/photos/age17-lifting.jpg",
        title: "Lifting",
        age: 17,
        caption:
          "[VOICE SAMPLE — rewrite] The weights do not care about a season. There is no " +
          "tryout at the end of this. I am not training to beat anyone now — I am training " +
          "to still be moving at sixty. The body stopped being a tool I use and became a " +
          "thing I keep. I rack the bar gently. I have learned it is mine for a while.",
      },
      {
        id: "nutrition",
        x: 70, y: 60,
        photo: "/photos/age17-nutrition.jpg",
        title: "Learning to eat",
        age: 17,
        caption:
          "[PLACEHOLDER — ~120 words. Learning about nutrition, balance, fueling rather " +
          "than just burning. The shift to thinking long-term about the body. Reflective " +
          "register — you are nearly the present-day narrator here.]",
      },
    ],
  },

  {
    id: "sauna",
    name: "The Sauna & Hot Tub",
    stage: "cultivation",
    type: "scene",
    image: "/scenes/sauna.jpg",
    map: { x: 62, y: 24 },
    personPhoto: null,
    hotspots: [
      {
        id: "recovery",
        x: 50, y: 55,
        photo: "/photos/now-sauna.jpg",
        title: "Recovery",
        age: 18,
        caption:
          "[PLACEHOLDER — ~140 words. Recovery: sauna, hot tub, rest as something you now " +
          "respect instead of skip. This is the quietest, most reflective room. Let the " +
          "narrator finally look back here, just before the cafe. The heat, the stillness, " +
          "the realization that you have changed.]",
      },
    ],
  },

  /* ---------------------------------- FAMILY (parallel thread) ------------ */
  {
    id: "outdoor-pool",
    name: "The Outdoor Pool",
    stage: "family",
    type: "scene",
    image: "/scenes/outdoor-pool.jpg",
    map: { x: 18, y: 30 },
    personPhoto: null,
    hotspots: [
      {
        id: "slide",
        x: 35, y: 50,
        photo: "/photos/family-slide.jpg",
        title: "The slide",
        age: 11,
        caption:
          "[PLACEHOLDER — ~110 words. The outdoor slide, jumping into the pool, summers " +
          "with family. Golden-hour warmth. This thread is about belonging, not becoming. " +
          "Good memories only — no conflict.]",
      },
      {
        id: "outdoor-hottub",
        x: 60, y: 58,
        photo: "/photos/family-hottub.jpg",
        title: "The outdoor hot tub",
        age: 13,
        caption:
          "[PLACEHOLDER — ~100 words. The outdoor hot tub with family. The specific " +
          "comfort of being together, doing nothing. A sensory anchor.]",
      },
      {
        id: "outdoor-restaurant",
        x: 75, y: 44,
        photo: "/photos/family-restaurant.jpg",
        title: "The outdoor restaurant",
        age: 12,
        caption:
          "[PLACEHOLDER — ~110 words. Eating at the outdoor restaurant with family after " +
          "the pool. Wet hair, food tasting better than it should. The ritual of it across " +
          "many summers — same table, different ages.]",
      },
    ],
  },
];

/* ----------------------------------------------------------------------------
   THE CAFE — the convergence / climax. Special scene: all selves at once.
   Each 'self' is a figure placed in the scene; clicking opens their final word.
---------------------------------------------------------------------------- */
export const CAFE = {
  id: "cafe",
  name: "The Cafe",
  image: "/scenes/cafe.jpg",
  map: { x: 50, y: 78 },
  intro:
    "[PLACEHOLDER — 2–3 sentences. The narrator sits down and, impossibly, the others " +
    "are already there. Set the temporal-collapse moment: every age at one table.]",
  selves: [
    {
      id: "self-play",
      stage: "play",
      x: 30, y: 55,
      photo: "/photos/age8-cafe.jpg",
      title: "Eight",
      caption:
        "[PLACEHOLDER — what the 8-year-old says / notices. Still present-tense, still " +
        "unbothered. He does not know he is a memory.]",
    },
    {
      id: "self-performance",
      stage: "performance",
      x: 50, y: 50,
      photo: "/photos/age15-cafe.jpg",
      title: "Fifteen",
      caption:
        "[PLACEHOLDER — the 15-year-old, still measuring himself against a goal, " +
        "surprised to be sitting still.]",
    },
    {
      id: "self-cultivation",
      stage: "cultivation",
      x: 70, y: 55,
      photo: "/photos/now-cafe.jpg",
      title: "Now",
      age: 18,
      caption:
        "[PLACEHOLDER — the present narrator. The thesis lands here, gently. 'I grew up " +
        "here.' The same room, lived three ways, finally in one frame.]",
    },
  ],
};

/* ----------------------------------------------------------------------------
   POST-MODERN DEVICES — what shows up in the "About this project" overlay
   ----------------------------------------------------------------------------
   The teacher's rubric explicitly grades "clear examples of post-modern
   elements." The About overlay reads this list verbatim and shows it on screen
   so a marker can point at each device while playing with the site.

   These are MY (the engine's) suggested defaults — feel free to rename, reorder,
   add to, or rewrite the notes in your own voice. The names line up with the
   ones CLAUDE.md / your rubric uses.
---------------------------------------------------------------------------- */
export const POSTMODERN_DEVICES = [
  {
    name: "Non-linear, fragmented narrative",
    note: "You pick the path. The story has no fixed order; it's assembled by wandering.",
  },
  {
    name: "Spatial form replaces chronological time",
    note: "Geography organises the story instead of a timeline. The map IS the plot.",
  },
  {
    name: "Temporal collapse",
    note: "In the cafe, every age sits at one table at once. Three times in one frame.",
  },
  {
    name: "Multiplicity of self",
    note: "There is no single narrator — there are versions of him, room by room.",
  },
  {
    name: "Reader as co-author",
    note: "The interactivity is the point: meaning only exists when you build it.",
  },
  {
    name: "Metafiction",
    note: "The piece is openly a 'text made of memory' — a building used as a book.",
  },
  {
    name: "Intertextual nod to Borges",
    note: "The labyrinth / infinite-space motif — the rubric names 'The Immortal'.",
  },
];
