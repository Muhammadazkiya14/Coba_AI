# pesut.ai

`pesut.ai` adalah web chat AI personal assistant berbasis `React + Express + OpenRouter`.

## Fitur MVP

- chat dua arah antara pengguna dan AI
- tampilan web modern dengan riwayat percakapan
- backend proxy agar API key tidak bocor ke browser
- tombol reset sesi chat
- siap dikembangkan ke memory, persona, dan fitur tambahan lain

## Setup Lokal

1. Install dependency:

```bash
npm install
```

2. Buat file `.env` dari contoh:

```bash
cp .env.example .env
```

3. Isi `OPENROUTER_API_KEY` dengan key baru yang aman.

4. Jalankan project:

```bash
npm run dev
```

Frontend berjalan di `http://localhost:5173` dan backend API di `http://localhost:3001`.

## Variabel Environment

```env
OPENROUTER_API_KEY=sk-or-v1-ganti-dengan-key-baru
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

## Keamanan API Key

- jangan commit file `.env`
- jangan simpan API key di frontend
- jangan pakai key yang pernah dikirim di chat atau tempat publik
- untuk deploy, simpan key di environment variable platform

## Deploy Gratis

Rekomendasi utama: [Render](https://render.com/)

Alasan:
- bisa deploy full-stack kecil langsung dari GitHub
- environment variable mudah diatur
- tidak perlu token deploy tambahan
- cocok untuk MVP seperti `pesut.ai`
