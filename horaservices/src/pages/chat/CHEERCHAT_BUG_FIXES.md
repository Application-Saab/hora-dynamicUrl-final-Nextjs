# CheerChat Bug Fixes — Safari / iOS

## Root Cause (Common Theme)

All Safari/iOS bugs share the same underlying cause: **SSR hydration gap + empty localStorage on fresh page load.**

Next.js renders components on the server where `window` is `undefined`. Any value read from `localStorage` returns `null`/`""` on the server. React's hydration rule requires the client to match the server's initial state — so it does **not** re-run `useState` initializers on the client. Values stay empty even though `localStorage` has them.

On **Chrome/Android** this was invisible because users navigated via SPA (in-app link click), so providers were already mounted with correct state. On **Safari/iOS**, users hit the URL directly (fresh/hard load), triggering the gap every time.

The fix pattern used throughout: fall back to the `?id=` URL param that is already embedded in every chat room URL at navigation time.

```js
localStorage.getItem("userID") ||
new URLSearchParams(window.location.search).get("id")
```

---

## Bug 1: Chat input box appeared at the top of the screen on Safari/iOS

**Root Cause:**
`.chat-input-container` used `position: sticky; bottom: 0`. Safari does not support `sticky` positioning inside a `position: fixed; display: flex` container — the element ignores the rule and renders at its natural DOM position (top of the flex column).

**Fix — `GroupsList.css`:**
Replaced `position: sticky` with `flex-shrink: 0`. This keeps the input pinned at the bottom by preventing it from shrinking inside the flex column, which works correctly in Safari.

---

## Bug 2: Native keyboard did not open after dismissing the emoji picker

**Root Cause:**
The simple-mode keyboard icon handler called `focus()` inside a `setTimeout(..., 150ms)`. iOS only opens the native keyboard when `focus()` is called **synchronously within the same user gesture event stack**. Any async delay breaks this restriction.

Additionally, `insertEmoji` was setting `inputmode="none"` on the input (to suppress the keyboard during emoji insertion) and then removing it after 50ms via `setTimeout`. On iOS, removing `inputmode` from a focused element causes the native keyboard to appear — conflicting with the emoji picker still being open.

**Fix — `EmojiPicker/index.jsx`:**
- Keyboard icon click: `removeAttribute("inputmode")` + synchronous `focus()` called directly in the handler, before `setIsPickerOpen(false)`. No `setTimeout`.
- Added `useEffect([isPickerOpen])`: when picker closes for any reason, `removeAttribute("inputmode")` is called on the textarea so the keyboard always works on the next open.
- Removed unused `freezeKeyboardHeight` function (declared but never called).

**Fix — `room/index.jsx` (`insertEmoji`):**
Removed the `setTimeout(() => removeAttribute("inputmode"), 50)` block. `inputmode="none"` now stays on the element while the picker is open (preventing keyboard from appearing mid-selection), and is cleaned up by the EmojiPicker `useEffect` when the picker closes.

---

## Bug 3: Group name and avatar not showing on Safari/iOS fresh page load

**Root Cause:**
`loggedinUserId` in `ChatContext.jsx` was initialized via `useState` from `localStorage`. On the server it evaluates to `""`. After hydration it stays `""`. The chat rooms fetch (`useLayoutEffect`) is guarded by `if (loggedinUserId)` — with `""` it never runs, so `chatRooms` stays empty and the group name/avatar never loads.

**Fix — `ChatContext.jsx`:**
Added one `useEffect` with empty deps that runs once after client mount:

```js
useEffect(() => {
  if (loggedinUserId) return;              // already set — no-op for Chrome/Android
  const id =
    localStorage.getItem("userID") ||
    new URLSearchParams(window.location.search).get("id");
  if (id) setLoggedinUserId(id);
}, []);
```

Setting `loggedinUserId` triggers the existing `useLayoutEffect` to fetch chat rooms, and the group name/avatar appears correctly.

---

## Bug 4: Messages and join notifications not showing on Safari/iOS fresh page load

**Root Cause:**
Two more files read `userId`/`userID` directly from `localStorage` — returning `null` on Safari fresh load:

- **`room/index.jsx`**: `userId = null` → `fetchMessagesForRoom` bails out → no messages rendered.
- **`ChatProvider.jsx`**: `userID = null` → `connectSocket` never called → socket stays disconnected → no real-time join/message events.

**Fix — `room/index.jsx` and `ChatProvider.jsx`:**
Same URL param fallback pattern applied to both:

```js
const userId =
  typeof window !== "undefined"
    ? localStorage.getItem("userID") ||
      new URLSearchParams(window.location.search).get("id")
    : null;
```

---

## Bug 5: Navigating to a room from the chat list passed `id=null` in the URL

**Root Cause:**
`chat/index.jsx` (the groups list page) also read `userId` from `localStorage` — `null` on Safari fresh load. When the user tapped a room, it navigated to `/chat/room?groupId=...&id=null`. The string `"null"` would then be read as the userId in `room/index.jsx`, breaking everything downstream.

**Fix — `chat/index.jsx`:**
Same URL param fallback applied. When the user arrives at the chat list via the back button from a room (URL: `/chat?id=...`), the correct userId is read from the URL param.

---

## Bug 6: Bottom nav visible between chat input and keyboard on iOS/iPad (with keyboard open)

**Root Cause:**
Two separate issues combined on iOS:

1. **Bottom nav rendering on chat room page**: `pagelayout.jsx` showed the bottom nav for all `/chat*` paths including `/chat/room`. The chat-layout is full-screen (`position: fixed; z-index: 9999`) but on iOS, `position: fixed` stacking behaves differently — the nav leaked through below the chat layout when the keyboard was open.

2. **`visualViewport.offsetTop` misalignment**: On iOS, when the keyboard opens, `visualViewport.offsetTop` can be > 0 (the visible area is scrolled within the layout viewport). The chat-layout was anchored at `top: 0` (layout viewport) instead of aligning with the actual visible area — creating a gap between the chat-layout bottom and the keyboard top where the bottom nav appeared.

**Fix — `pagelayout.jsx`:**
Excluded `/chat/room` from the `showBottomNav` condition. The chat room is full-screen by design; the bottom nav should only appear on the `/chat` list page.

**Fix — `room/index.jsx` (`setVvh`):**
When keyboard is detected open (`vv.height < window.innerHeight`), set `chatLayout.style.top = vv.offsetTop + "px"` to align the layout with the visual viewport. Reset to `""` when keyboard closes.

---

## Bug 7: Input box jumping to top when emoji selected on iOS/iPad

**Root Cause:**
When emoji picker was open (simple mode) and the user selected an emoji, `insertEmoji` called `focus()` with `inputmode="none"` — then removed `inputmode` after 50ms via `setTimeout`. On iOS, removing `inputmode` from a focused element causes the native keyboard to appear. This triggered `setVvh` (keyboard detected), which set `--vvh` to a smaller value. But the emoji picker's `paddingBottom` (`keyboardHeight + 5px`) was still applied to `.chat-layout`. The combination of small `--vvh` + large `paddingBottom` pushed the input to the very top of the layout.

**Fix — `room/index.jsx` (`setVvh`) + `EmojiPicker/index.jsx`:**
- `setVvh`: when keyboard opens, also clear `chatLayout.style.paddingBottom = ""` — prevents emoji picker padding from conflicting with an open keyboard.
- `insertEmoji`: removed the `setTimeout` that was restoring `inputmode`. `inputmode="none"` now stays while picker is open.
- `EmojiPicker useEffect([isPickerOpen])`: removes `inputmode` when picker closes — cleans up correctly regardless of how it was dismissed.
- Keyboard icon handler: `removeAttribute("inputmode")` + synchronous `focus()` so keyboard appears immediately when user taps the keyboard icon.

---

## Files Changed (Safari/iOS Session)

| File | Change |
|------|--------|
| `src/pages/chat/GroupsList.css` | `position: sticky` → `flex-shrink: 0` on `.chat-input-container` |
| `src/components/EmojiPicker/index.jsx` | Synchronous focus on keyboard dismiss; `inputmode` lifecycle managed via `useEffect`; removed dead `freezeKeyboardHeight` function |
| `src/hooks/ChatContext.jsx` | One `useEffect` added to sync `loggedinUserId` from localStorage / URL on mount |
| `src/pages/chat/room/index.jsx` | `userId` URL fallback; `setVvh` aligns layout with `vv.offsetTop` and clears emoji picker padding when keyboard opens; `insertEmoji` no longer removes `inputmode` early |
| `src/hooks/ChatProvider.jsx` | `userID` URL fallback — enables socket connection on Safari fresh load |
| `src/pages/chat/index.jsx` | `userId` URL fallback — fixes room navigation from chat list |
| `src/components/pagelayout.jsx` | Bottom nav hidden on `/chat/room` — chat room is full-screen, nav doesn't belong there |

---

# CheerChat Bug Fixes — Android / Physical Device Session

## Bug 8: `crypto.randomUUID is not a function` on older Android browsers

**Root Cause:**
`analytics.js` called `crypto.randomUUID()` directly. This API is not available on Android browsers older than Chrome 92 (e.g. Samsung Internet, older WebViews).

**Fix — `src/utils/analytics.js`:**
Added a `generateUUID()` fallback that uses `Math.random()` when `crypto.randomUUID` is unavailable:

```js
function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
```

---

## Bug 9: Real-time messages not appearing on receiving device (live chat broken)

**Root Cause:**
The socket server only broadcasts `message:new` to clients that have explicitly joined a room via `socket.emit("joinRoom", { groupId })`. The chat room page never emitted `joinRoom` when opening an existing room — only when *creating* a new direct room. So the receiving device's socket was not subscribed and never received incoming messages.

**Fix — `src/pages/chat/room/index.jsx`:**
Added a `useEffect` that emits `joinRoom` whenever `selectedGroup` is set:

```js
useEffect(() => {
  if (!socket || !selectedGroup) return;
  const gid = selectedGroup._id || selectedGroup.id;
  const join = () => socket.emit("joinRoom", { groupId: gid });
  if (socket.connected) {
    join();
  } else {
    window.addEventListener("socket:connected", join, { once: true });
    return () => window.removeEventListener("socket:connected", join);
  }
}, [selectedGroup]);
```

---

## Bug 10: Emoji picker auto-switching back to keyboard after emoji selection

**Root Cause:**
`insertEmoji` called `textareaRef.current.focus()` to place the cursor for insertion. This triggered the `onFocus` handler on the contentEditable div, which called `setShowEmojiPicker(false)` — closing the picker. The `queueMicrotask` in `EmojiPickerButton` then tried to reopen it, causing a visible flicker and unreliable state.

**Fix — `src/pages/chat/room/index.jsx`:**
Added `isEmojiInsertRef` to mark programmatic focus events from emoji insertion:
- Set `isEmojiInsertRef.current = true` at the start of `insertEmoji`, reset via `requestAnimationFrame` after insertion.
- `onFocus` and `onClick` on the contentEditable div now check `!isEmojiInsertRef.current` before closing the picker.

---

## Bug 11: Input box and send button hidden behind emoji picker

**Root Cause:**
`.emoji-picker-container` had `position: fixed; z-index: 99999`. `.chat-input-container` had `z-index: 999`. Since both are inside `.chat-layout` (a stacking context), the picker covered the input bar entirely when open.

**Fix — `src/pages/chat/GroupsList.css`:**
Raised `.chat-input-container` z-index from `999` to `100000` so it always renders above the picker.

---

## Bug 12: Flicker when switching between emoji picker and keyboard

**Root Cause:**
Two separate causes:
1. `.emoji-picker-container` used `transform: translateY(100%)` with a `0.25s` CSS transition — the slide-down animation created a visible gap during switch.
2. `{isPickerOpen && <EmojiPicker />}` caused React to unmount/remount the heavy component on every toggle, adding a render-frame delay.

**Fix — `src/components/EmojiPicker/emoji.css`:**
Replaced `transform/opacity/transition` with `visibility: hidden/visible` — toggle is instant, no animation gap.

**Fix — `src/components/EmojiPicker/index.jsx`:**
Added `hasOpened` state. Once the picker opens for the first time it stays mounted in the DOM (`{hasOpened && ...}`). Subsequent toggles only change the CSS class — no React mount/unmount cost.

---

## Bug 13: Layout jumping up/down when switching keyboard ↔ emoji picker

**Root Cause:**
Three compounding issues:
1. `document.body.style.position = "fixed"` — applied when keyboard opened, caused a scroll-to-top visual jump on Android (body scroll reset).
2. `chatLayout.style.paddingBottom = ""` — the emoji picker's reserved space (≈ keyboardHeight px) was cleared all at once on the **first** `visualViewport resize` event, even though the keyboard had only opened a few pixels. This caused the visible content area to expand suddenly.
3. When emoji picker opened while keyboard was closing, `setVvh` incorrectly cleared the emoji padding.

**Fix — `src/pages/chat/room/index.jsx` (`setVvh`):**
- Removed `body.style.position = "fixed"` and `body.style.width = "100vw"` — unnecessary since `.chat-layout` is already `position: fixed`.
- Added `isKeyboardVisibleRef` + `emojiPaddingAtKeyboardStartRef`: on the first keyboard event, capture the current emoji padding. Each subsequent frame, reduce padding by the same amount the keyboard grew — keeping visible content area exactly constant.
- Added `showEmojiPickerRef` (synced via `useEffect`): when emoji is open during keyboard close, `setVvh` skips padding changes entirely and lets the emoji picker manage it.

**Fix — `src/components/EmojiPicker/index.jsx`:**
Added `keepPaddingRef`: when user taps the keyboard icon or taps the input directly, set `keepPaddingRef.current = true` before calling `setIsPickerOpen(false)`. The `isPickerOpen` useEffect cleanup checks this ref and skips resetting `paddingBottom` — letting `setVvh` clear it proportionally once the keyboard is actually open.

---

## Files Changed (Android Session)

| File | Change |
|------|--------|
| `src/utils/analytics.js` | `crypto.randomUUID` → fallback `generateUUID()` for older Android |
| `src/pages/chat/room/index.jsx` | `joinRoom` emit on room open; `isEmojiInsertRef` for onFocus/onClick guards; `setVvh` proportional padding + removed body position hack; `showEmojiPickerRef` sync |
| `src/components/EmojiPicker/index.jsx` | `hasOpened` DOM persistence; `keepPaddingRef` for stable padding during keyboard transition |
| `src/components/EmojiPicker/emoji.css` | `transform/opacity/transition` → `visibility: hidden/visible` (instant, no animation) |
| `src/pages/chat/GroupsList.css` | `.chat-input-container` z-index `999` → `100000` |

## Checked — Confirmed Not an Issue

| Item | Reason |
|------|--------|
| `.groups-header { position: sticky }` | Parent `.groups-container` has `overflow-y: auto` — Safari handles it correctly |
| `localStorage.getItem("mobileNumber")` in `sendMessage` | Metadata only on outgoing messages, not critical for display |
| `window.getSelection()` / contentEditable cursor logic | Works correctly in Safari |
| `env(safe-area-inset-*)` and `--vvh` CSS | Already handled correctly in GroupsList.css |
