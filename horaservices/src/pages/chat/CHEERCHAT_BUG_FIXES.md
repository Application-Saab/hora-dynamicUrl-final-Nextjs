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

## Files Changed

| File | Change |
|------|--------|
| `src/pages/chat/GroupsList.css` | `position: sticky` → `flex-shrink: 0` on `.chat-input-container` |
| `src/components/EmojiPicker/index.jsx` | Synchronous focus on keyboard dismiss; `inputmode` lifecycle managed via `useEffect`; removed dead `freezeKeyboardHeight` function |
| `src/hooks/ChatContext.jsx` | One `useEffect` added to sync `loggedinUserId` from localStorage / URL on mount |
| `src/pages/chat/room/index.jsx` | `userId` URL fallback; `setVvh` aligns layout with `vv.offsetTop` and clears emoji picker padding when keyboard opens; `insertEmoji` no longer removes `inputmode` early |
| `src/hooks/ChatProvider.jsx` | `userID` URL fallback — enables socket connection on Safari fresh load |
| `src/pages/chat/index.jsx` | `userId` URL fallback — fixes room navigation from chat list |
| `src/components/pagelayout.jsx` | Bottom nav hidden on `/chat/room` — chat room is full-screen, nav doesn't belong there |

## Checked — Confirmed Not an Issue

| Item | Reason |
|------|--------|
| `.groups-header { position: sticky }` | Parent `.groups-container` has `overflow-y: auto` — Safari handles it correctly |
| `localStorage.getItem("mobileNumber")` in `sendMessage` | Metadata only on outgoing messages, not critical for display |
| `window.getSelection()` / contentEditable cursor logic | Works correctly in Safari |
| `env(safe-area-inset-*)` and `--vvh` CSS | Already handled correctly in GroupsList.css |
