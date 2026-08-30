# 🎵 VIBE — Music Discovery Platform

VIBE is a responsive music-discovery website built collaboratively by a team of five.

# DEMO LINK

https://vibe-music-platform.vercel.app/

## Pages

- **Home** — personalized discovery, trending music, genres, artists, Vibe of the Day and recently played.
- **Explore** — search, genre filtering, sorting and interactive song discovery.
- **Artist** — artist profile, statistics, popular songs, albums and artist interactions.
- **Favorites** — favorite songs, search, sorting, statistics and persistent LocalStorage state.
- **Playlists** — create, edit, delete and manage playlists with persistent LocalStorage state.

## Shared functionality

- HTML5 audio player
- Play / pause
- Previous / next
- Progress and seeking
- Volume control
- Favorites
- Recently played
- Search
- Genre filtering
- Sorting
- Dynamic playlist CRUD
- Light / dark mode
- LocalStorage
- Responsive Bootstrap layout
- Form validation
- Keyboard shortcuts
- Empty states and user feedback toasts

## Design system

All members use the same VIBE palette:

```css
--vibe-bg: #070711;
--vibe-card: #11111f;
--vibe-card-hover: #18182a;

--vibe-primary: #a855f7;
--vibe-secondary: #ec4899;
--vibe-accent: #6366f1;

--vibe-text: #ffffff;
--vibe-text-secondary: #e5e7eb;
--vibe-muted: #9ca3af;
```

The shared theme system is:

- `CSS/colors.css`
- `JS/theme.js`
- LocalStorage key: `vibeTheme`

Every page uses the same theme controller.

## JavaScript rubric coverage

| Requirement      | Where it appears                                                            |
| ---------------- | --------------------------------------------------------------------------- |
| Conditions       | search states, empty states, validation, player states, playlist validation |
| Loops            | `forEach`, rendering collections, event binding                             |
| Functions        | player, storage, rendering, filtering, validation and UI functions          |
| Array Methods    | `map`, `filter`, `find`, `some`, `includes`, `sort`, `flatMap`              |
| Objects          | songs, artists, genres, vibe objects, playlists and application state       |
| DOM Manipulation | dynamic cards, lists, counters, player UI, messages and theme               |
| Events           | click, input, submit, change, keyboard, audio events                        |
| Form Validation  | newsletter and playlist creation validation                                 |
| Arrays           | songs, artists, genres, favorites, recently played and playlist song IDs    |

## Responsive design

Bootstrap 5 is used heavily for:

- containers
- grid columns
- responsive spacing
- flex utilities
- buttons
- forms
- modals
- responsive navigation

Page-specific CSS provides the VIBE visual identity and custom responsive behavior.

## Team Git workflow

Each member should work on a feature branch:

```text
feature/home
feature/explore
feature/artist
feature/favorites
feature/playlists
```

Do not work directly on `main`.

Recommended workflow:

```bash
git checkout main
git pull origin main
git checkout feature/home
git merge main

git add .
git commit -m "feat: add home trending section"
git push origin feature/home
```

Then open a Pull Request and review before merging.

## Contribution plan

| Member   | Main responsibility | Branch              |
| -------- | ------------------- | ------------------- |
| Member 1 | Home                | `feature/home`      |
| Member 2 | Explore             | `feature/explore`   |
| Member 3 | Artist              | `feature/artist`    |
| Member 4 | Favorites           | `feature/favorites` |
| Member 5 | Playlists           | `feature/playlists` |

Replace the generic member labels with the real team names before submission.

## Code quality rules

1. Reuse the shared VIBE colors.
2. Reuse the shared theme controller.
3. Do not create a second LocalStorage key for an existing feature.
4. Do not create a second music-player architecture.
5. Use semantic HTML and real `<button>` elements.
6. Add meaningful `alt` text to images.
7. Avoid unnecessary inline JavaScript.
8. Keep functions focused and named clearly.
9. Test every page on mobile and desktop.
10. Check the browser console before submission.

## Final testing checklist

- [ ] Home works
- [ ] Explore search works
- [ ] Genre filter works
- [ ] Artist page works
- [ ] Favorites persist after refresh
- [ ] Playlists persist after refresh
- [ ] Music player works
- [ ] Light mode works on every page
- [ ] Dark mode works on every page
- [ ] Theme survives refresh
- [ ] Navbar links work
- [ ] Footer links work
- [ ] Forms validate correctly
- [ ] Mobile layout works
- [ ] No console errors
- [ ] Every teammate has meaningful Git commits
- [ ] README is complete

# VIBE — Home Page

## Ownership

- **Page:** `index.html`
- **JavaScript:** `JS/home.js`
- **CSS:** `CSS/Home.css`

## Responsibility

Hero, trending songs, genres, popular artists, Vibe of the Day, recently played, search, newsletter validation, favorites and player entry points.

## Shared rules

- Use the VIBE global palette from `CSS/colors.css`.
- Use `JS/theme.js` for light/dark mode.
- Keep existing LocalStorage keys.
- Reuse the shared navigation, player and data architecture where applicable.
- Use Bootstrap 5 for responsive layout and common UI.
- Do not change another teammate's page without communicating first.

## Rubric focus

This page should demonstrate DOM manipulation, events, functions, arrays, objects, array methods and conditions. Add meaningful comments around non-obvious logic and keep commits small and descriptive.

## Git

Work from the page's feature branch, pull the latest `main` before integration, commit meaningful changes, push the branch and open a Pull Request.

# VIBE — Favorites Page

## Ownership

- **Page:** `favorite.html`
- **JavaScript:** `JS/favorite.js`
- **CSS:** `CSS/favorite.css`

## Responsibility

Persistent favorite songs, search, sorting, statistics, empty states and playback controls.

## Shared rules

- Use the VIBE global palette from `CSS/colors.css`.
- Use `JS/theme.js` for light/dark mode.
- Keep existing LocalStorage keys.
- Reuse the shared navigation, player and data architecture where applicable.
- Use Bootstrap 5 for responsive layout and common UI.
- Do not change another teammate's page without communicating first.

## Rubric focus

This page should demonstrate DOM manipulation, events, functions, arrays, objects, array methods and conditions. Add meaningful comments around non-obvious logic and keep commits small and descriptive.

## Git

Work from the page's feature branch, pull the latest `main` before integration, commit meaningful changes, push the branch and open a Pull Request.

# VIBE — Explore Page

## Ownership

- **Page:** `explore.html`
- **JavaScript:** `JS/explore.js`
- **CSS:** `CSS/explore.css`

## Responsibility

Search, genre filtering, sorting, dynamic song cards, favorite actions and responsive discovery UI.

## Shared rules

- Use the VIBE global palette from `CSS/colors.css`.
- Use `JS/theme.js` for light/dark mode.
- Keep existing LocalStorage keys.
- Reuse the shared navigation, player and data architecture where applicable.
- Use Bootstrap 5 for responsive layout and common UI.
- Do not change another teammate's page without communicating first.

## Rubric focus

This page should demonstrate DOM manipulation, events, functions, arrays, objects, array methods and conditions. Add meaningful comments around non-obvious logic and keep commits small and descriptive.

## Git

Work from the page's feature branch, pull the latest `main` before integration, commit meaningful changes, push the branch and open a Pull Request.

# VIBE — Artist Page

## Ownership

- **Page:** `Artist.html`
- **JavaScript:** `JS/Artist.js`
- **CSS:** `CSS/Artist.css`

## Responsibility

Artist profile, statistics, popular songs, albums, related content and interactive song selection.

## Shared rules

- Use the VIBE global palette from `CSS/colors.css`.
- Use `JS/theme.js` for light/dark mode.
- Keep existing LocalStorage keys.
- Reuse the shared navigation, player and data architecture where applicable.
- Use Bootstrap 5 for responsive layout and common UI.
- Do not change another teammate's page without communicating first.

## Rubric focus

This page should demonstrate DOM manipulation, events, functions, arrays, objects, array methods and conditions. Add meaningful comments around non-obvious logic and keep commits small and descriptive.

## Git

Work from the page's feature branch, pull the latest `main` before integration, commit meaningful changes, push the branch and open a Pull Request.
