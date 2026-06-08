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
  aboutPostModern: `Memory doesn't move in straight lines. It moves the way you move through a building, room to room, doubling back, finding that one hallway unlocks something you'd forgotten was stored there.

This project is built on that logic. I Grew Up Here uses Lifetime Fitness in Mississauga as a memory palace: a real physical space that has held three distinct versions of me across a decade. The non-linear structure isn't a stylistic choice. It's the argument. By letting you explore rather than guiding you through, the site asks you to assemble the story the way memory actually assembles experience: fragmented, spatial, yours to sequence.

The building stayed the same. That's the point.

What changed was everything inside it, including me.

— Ayaan`,
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
        photo: "/photos/ayaan-now.jpg",
        title: "The doors",
        age: 18,
        caption: `The doors open the same way they always have.

That's the thing nobody tells you about growing up inside a place. The place doesn't change. The lobby still stretches back the same impossible distance. The light still falls through the same windows at the same angle, pale and even, the kind of light that doesn't belong to any particular season. The front desk is where it's always been. The scan beeps. You find your locker, second row, same spot as always, and the building receives you the way it always has: without ceremony, without comment.

You have been eight years old in this lobby. You have been fourteen, frustrated and electric. You are here now.

This is not a tour. This is a memory palace. Move through it however you need to.`,
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
        id: "kids-club",
        x: 50, y: 55,
        photo: "/photos/ayaan-young.jpg",
        title: "Kids' Club",
        caption: `The first thing you should know is that I didn't always want to be here.

My dad had a membership before I had an opinion about it, and so the Kids' Club was simply where I ended up, dropped off while he went to do whatever it was adults did in the parts of the building I wasn't allowed to wander yet. I was anxious the way young kids are anxious in rooms full of strangers. I didn't know anyone. I stood near the wall and waited to feel less like an outsider.

What changed it was the mini basketball hoop. I got a shot off in front of a group of kids and they reacted, and something in the room shifted. Someone started talking to me. Then it was easy. That's all it took: one moment of being good at something in front of people, and suddenly I was part of it.

The Kids' Club was its own small world. There was a treehouse. There were tablets loaded with Geometry Dash, and I lost whole afternoons to that game, fingers working the screen with a focus I didn't yet know how to apply to anything real. There were dodgeball games run by counsellors who took the job seriously. There were movie afternoons, the room dim and crowded, Cloudy with a Chance of Meatballs and Zootopia projected on the wall while we sat on the floor shoulder to shoulder, strangers becoming something closer.

I didn't choose this place. My dad chose it, the way parents choose things for their children before their children know what they need.

But here is what I've come to understand: the anxious kid standing near the wall was already being built into someone. Every afternoon in that room, every game, every film, every moment of accidental belonging, was quietly doing its work.

I just couldn't see it yet.`,
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
        id: "the-court",
        x: 50, y: 55,
        photo: "/photos/ayaan-teen.jpg",
        title: "The Court",
        caption: `There is no single moment. That's what I want to be honest about.

This era doesn't compress into one clean memory, a made shot, a perfect game, a flash of clarity. It was an accumulation. Hours and hours on this court that blurred into each other the way practice always does when you're serious about something.

The solo sessions were their own thing entirely. No music, just the sound of the ball and the court. My footwork. The squeak of my sneakers. Sometimes I had the space mostly to myself and I was completely in my own world, and it was both peaceful and pressured at the same time, that particular combination of calm focus and internal demand that comes from being alone with something you care about. I was working on all of it across those years: handles, shooting, conditioning, the parts of my game I'd identified as weak, the gap between who I was and who I wanted to be.

Then there were the afternoons with friends who became close precisely because of this shared obsession. Pickup games that went long enough that nobody noticed the time. You don't manufacture that kind of closeness. It comes from grinding beside someone, from shared failure and shared momentum, from being seen on your worst days and your best ones. Some of those friendships are still the closest ones I have.

The frustration was real. The love was realer. They lived together the whole time, which is the only honest way to describe what it feels like to want to be excellent at something.

The light in here was the same as everywhere else in this building, pale and even and indifferent to the hour. But everything under that light felt urgent. My body was changing. My ambitions were sharpening. I was learning, through ten thousand repetitions, what it meant to want something badly enough to keep showing up for it.

Even when it was hard. Especially then.`,
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
        id: "the-weight-floor",
        x: 50, y: 55,
        photo: "/photos/ayaan-weights.jpg",
        title: "The Weight Floor",
        caption: `The shift didn't announce itself.

I just started showing up here more. Basketball became casual, still played, still loved, but held differently, loosely, for fun instead of as proof of something. The weight floor asked a different question: not how good can you get, but who are you building.

I follow programs now. I track progress. I go at 3 or 4 in the afternoon most days, because I've learned that protecting that window, getting there after school before the evening runs away from me, is what consistency actually looks like. It's not inspiration. It's a slot in the day that I've decided matters.

The results are real and visible. I've put in enough time and taken it seriously enough that I'm further along than most people my age, and I know that because I've been honest with myself about what the work requires. Strength is the foundation. But the goal underneath the goal is health, building something that lasts, building a body that can do what I ask of it for a long time.

Sometimes Christian is with me. Sometimes it's the regulars I've gotten to know, familiar faces, nods of recognition, a kind of quiet community that doesn't require much language. Sometimes I'm alone, and I've come to prefer those sessions too. Accountable to no one but yourself. No performance. Just the work.

I scan in at the front desk. I go to the same row of lockers. My body does these things before my mind catches up. You know you belong somewhere when arriving stops requiring a decision.

I am trying to build a strong body and mind. I am trying to become a man I can be proud of.

The light here is the same light it's always been.

I am not.`,
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
        id: "summers",
        x: 50, y: 55,
        photo: "/photos/summers.jpg",
        title: "Summers",
        caption: `The pool is the part of this story that belongs to all of us.

My mom brought me to swim lessons here until I was around twelve, patient and methodical, watching from the edge while instructors moved my arms through the water and taught me that you have to trust the thing holding you up before you can move through it. My dad came for the summers, for the outdoor scene, for the hot tubs, for the particular looseness that a warm afternoon and nowhere urgent to be can give a family. My sister was there too, small and fast and completely fearless.

I remember the slides most clearly. Going again and again, the two of us, each loop faster than the one before, until our lungs hurt from laughing. Then food at the outdoor restaurant: my parents at a table, my sister and I still wet, hotdogs and orange slices that tasted better than they had any right to, the way food always tastes better when your body has been used well.

The light here was different. Outdoor and honest, not the controlled indoor glow of the rest of the building. You could see the sky.

This is the section of the memory palace where time gets slippery. My parents look younger. My sister is the height she was at seven. I am not yet anyone in particular, just a kid, just their kid, just here.

Some rooms you don't outgrow. You just visit them differently.`,
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
  intro: `Imagine they're all here.

The family: younger parents, my sister small, the afternoon pool still on all of us, the taste of oranges and summer.

But in the logic of a memory palace, every room holds everything that ever happened in it simultaneously.`,
  selves: [
    {
      id: "self-play",
      stage: "play",
      x: 30, y: 55,
      photo: "/photos/ayaan-young.jpg",
      title: "Eight",
      caption: `The eight-year-old near the wall, watching the door for his dad, not yet knowing that scoring on that mini hoop in front of a group of kids would be the moment everything loosened.`,
    },
    {
      id: "self-performance",
      stage: "performance",
      x: 50, y: 50,
      photo: "/photos/ayaan-teen.jpg",
      title: "Fourteen",
      caption: `The fourteen-year-old still catching his breath from the court, no headphones, just the sound of the ball and the floor and his own breathing, frustrated and hungry and full of an ambition that doesn't have a shape yet.`,
    },
    {
      id: "self-cultivation",
      stage: "cultivation",
      x: 70, y: 55,
      photo: "/photos/ayaan-now.jpg",
      title: "Now",
      age: 18,
      caption: `And the present version: tired in the specific good way that follows real effort, occasionally sitting here with Christian after a session, occasionally alone, occasionally just passing through on the way to somewhere else.

They're all at tables in this cafe. The light is the same as it is everywhere else in this building, pale and steady, the same in February as it is in July. The cafe has never been a destination for me, exactly. More of a passage. Somewhere you end up when the workout is done and you're not ready to go back to the world yet.

What I feel, imagining it, is gratitude.

Not nostalgia. Nostalgia looks backward with longing, wanting to return. This is something different. The anxious kid near the wall, the frustrated teenager on the court, the family loud at the pool, all of it was the construction of this. Every uncomfortable afternoon. Every grinding session. Every hour I didn't choose but ended up inside anyway.

This place didn't change. I did, completely, inside it.

That's the whole story. That's what I grew up here means.`,
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
