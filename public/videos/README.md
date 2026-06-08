# public/videos/ — easter-egg video clips go here

This folder is where you drop the short video clips that play when a reader
finds the hidden play-circle in a room. The engine reads the file path from
`src/data/content.js` on each room's `easterEggVideo.src` field.

## Currently configured

| Room                | File the engine looks for         | Hidden trigger lives… |
|---------------------|-----------------------------------|-----------------------|
| The Basketball Court (`court`)  | `public/videos/court-clip.mp4`   | top-left corner of the scene  |
| The Weight Floor (`weights`)    | `public/videos/weights-clip.mp4` | bottom-right corner of the scene |

Drop a file with **exactly** the filename above and it goes live on the next
push. While a file is missing, the trigger still appears and clicking it shows
a *"video coming soon"* card in the same overlay style — so the feature is
visible and testable even before you film anything.

## File specs that play well in browsers

- **Container/codec:** `.mp4` with H.264 video + AAC audio (the universal one)
  - Phone videos are usually `.MOV`; you can rename to `.mp4` in most cases,
    or quick-convert via *QuickTime → File → Export As → 1080p*.
- **Length:** ~5–30 seconds. The tone of the overlay is "a clip pulled out
  of your pocket to show someone," not a cinematic moment. Short is better.
- **Aspect ratio:** vertical or landscape both work. The overlay window is
  `object-fit: cover`, so the video fills its frame and crops as needed.
- **Audio:** the video autoplays muted (browser policy); the reader can hit
  the **Unmute** button. Make sure muted-by-default isn't awkward — your
  basketball court clip probably looks great muted, your weight floor clip
  probably doesn't need sound at all.

## Want to add an easter egg to a different room?

Edit `src/data/content.js`: on the room you want, add a field like

```js
easterEggVideo: {
  src: "/videos/<your-filename>.mp4",
  label: "a moment from this room",
  triggerPosition: { x: 88, y: 82 }, // % of the scene — pick a corner
},
```

…then drop the video here at `public/videos/<your-filename>.mp4`. Done.
No engine code change.
