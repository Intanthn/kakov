# Birthday Gift — Deploy ke GitHub

## ⚠️ Kalau di GitHub animasi tidak jalan

Animasi butuh **JavaScript**. Cek repo kamu harus punya **semua file ini**:

```
nama-repo/
├── index.html          ← wajib
├── config.js           ← wajib
├── .nojekyll           ← wajib (file kosong, supaya GitHub tidak rusak JS)
├── css/
│   └── style.css       ← wajib
├── js/
│   ├── cake.js         ← wajib (bukan di root!)
│   └── main.js         ← wajib (bukan di root!)
└── photos/
    ├── photo1.jpg
    ├── photo2.jpg
    ... photo9.jpg
```

**Salah umum:** cuma upload `index.html` + foto, tapi **lupa folder `js/`** → halaman tampil tapi **tanpa animasi**.

---

## Langkah GitHub Pages

1. Upload **semua file** di atas ke repo
2. Settings → **Pages** → Source: Deploy from branch
3. Branch: `main` → Folder: **/ (root)** → Save
4. Buka: `https://USERNAME.github.io/NAMA-REPO/`
5. **Tap kotak kado** dulu — animasi baru mulai setelah itu!

---

## Cek apakah JS ke-load

1. Buka halaman GitHub Pages
2. Tekan **F12** → tab **Console**
3. Kalau ada error merah `404` untuk `main.js` atau `config.js` → file belum benar di GitHub

---

## Foto tidak muncul?

- Folder harus `photos/` (huruf kecil semua)
- Nama file: `photo1.jpg` … `photo9.jpg` (sama persis)
