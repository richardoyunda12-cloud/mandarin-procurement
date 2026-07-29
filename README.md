# Mandarin Procurement — Sesi 1–3

## Struktur modular

- `index.html` — shell aplikasi / navigasi
- `assets/app.css` — seluruh styling
- `assets/app.js` — navigasi, timer, audio, latihan, localStorage
- `sessions/session-1.html` — materi Sesi 1
- `sessions/session-2.html` — materi Sesi 2
- `sessions/session-3.html` — materi Sesi 3
- `manifest.webmanifest` + `sw.js` — instalasi PWA dan cache offline

## Deploy GitHub Pages

1. Buat repository Public, contoh `mandarin-procurement`.
2. Upload **isi folder ini** (jangan upload ZIP-nya) ke root repository.
3. Repository → Settings → Pages → Deploy from a branch → `main` + `/(root)` → Save.
4. Buka URL `https://USERNAME.github.io/mandarin-procurement/` melalui Safari/Chrome.
5. iOS: Safari → Share → Add to Home Screen.

> Jangan membuka `index.html` dari Files/Quick Look, karena Quick Look tidak menjalankan JavaScript.

## Audio iOS/iPadOS

Browser iOS memakai voice yang diunduh pada perangkat. Jika status menunjukkan suara Mandarin tidak ada, gunakan pencarian Settings dan ketik `Read & Speak`, `Baca & Bicara`, atau `Voices/Suara`; unduh **Chinese / Mandarin**. Nama menu dapat berbeda menurut versi dan bahasa iOS.

## Audio Android

Di Android, instal/aktifkan Chinese (Mandarin) pada Text-to-speech output (Google Speech Services). Aplikasi otomatis memilih voice `zh-CN` lalu fallback Chinese lain.
