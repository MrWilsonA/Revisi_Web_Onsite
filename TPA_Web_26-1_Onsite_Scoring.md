# TPA Web 26-1 — Onsite Scoring Rubric

> Sumber: `_Scoring_Web_26-1_Onsite_-_Zeroed.xlsx` (13 sheet). Dokumen ini adalah hasil rapikan
> dari workbook penilaian onsite aplikasi web "Ice Cream Shop". Semua label, bobot (weight),
> dan catatan (notes/comments) penilai dipertahankan sesuai aslinya.

## Cara Kerja Skema Penilaian

- Setiap kriteria (baris) diberi **Score [1-4]** oleh penilai, mengikuti **Skala Penilaian** di
  bawah.
- **Harvested** pada tiap sub-kategori adalah rata-rata tertimbang: `(Weight × Score) / 4`,
  dijumlahkan lalu dibagi total Weight kategori tersebut.
- Setiap halaman/komponen (Page) memiliki dua sisi penilaian: **Feature** dan **Design**, yang
  digabung memakai **Feature Ratio** dan **Design Ratio** (lihat "Variabel Global").
- Skor akhir tiap Page mengalir ke sheet **Master**, lalu ke sheet **Result** sebagai skor akhir
  peserta (dikali 0.4).

## Skala Penilaian (Score [1-4])

| Skor | Arti |
|---|---|
| 0 | Tidak Buat / Tidak Sentuh |
| 1 | Minim Sekali / Ada Sentuh |
| 2 | Salah / Tidak Lengkap |
| 3 | Hampir Benar / Hampir Lengkap |
| 4 | Benar / Lengkap |

> **Keterangan tambahan (tertulis langsung di sel sheet, bukan berupa comment/note):**
> "Artinya TIDAK boleh diisi langsung." — Skor bukan angka bebas yang diisi langsung, harus
> mengikuti definisi skala 0-4 di atas.

## Variabel Global (sheet `Master`)

| Variabel | Nilai |
|---|---|
| Feature Ratio | 0.9 |
| Design Ratio | 0.1 |

Rasio ini dipakai di setiap Page sebagai bobot penggabung: `Total Harvested Page = (Feature Ratio × Harvested Feature) + (Design Ratio × Harvested Design)`.

## Bobot Komponen Utama (sheet `Master`)

| Scoring Component | Weight |
|---|---|
| General | 10 |
| Components | 5 |
| Register Page | 3 |
| Login Page | 3 |
| Customer Dashboard Page | 4 |
| Cart Page | 4 |
| Customer Profile Page | 4 |
| Order Page | 4 |
| Admin Dashboard | 5 |
| Ice Cream Management | 3 |
| Transaction Management | 5 |
| **Total** | **50** |

Skor akhir = `(Σ Weight × Harvested masing-masing komponen) / Total Weight`, dikonversi ke skala
100, lalu (di sheet `Result`) dikalikan **0.4** untuk menjadi **Score** akhir peserta.

---

## Sheet: General

`General` (bobot 10 di Master) terbagi menjadi 3 sub-kategori. Bobot proporsional tiap
sub-kategori dihitung dari total weight masing-masing dibanding total gabungan ketiganya:
- General (Implementation)
- Containerization
- Web Practices

### General — Implementation

| Kriteria | Weight |
|---|---|
| Frontend Implementation | 4 |
| Backend Implementation | 4 |
| Database Implementation | 6 |
| Redis Implementation | 6 |
| Object Storage Implementation | 6 |
| NGINX Implementation | 6 |
| Git Commit Best Practices | 2 |
| Middleware Implementation | 2 |
| JWT Authentication | 3 |
| Secret Management | 1 |
| Object Storage Security | 3 |

### Containerization

| Kriteria | Weight |
|---|---|
| Services | 2 |
| Env Variables | 2 |
| Dockerfile (Frontend) | 3 |
| Dockerfile (Backend) | 3 |
| Docker Compose (DB) | 5 |
| Docker Compose (NGINX) | 2 |
| Docker Compose (SeaweedFS) | 3 |
| Docker Compose (Redis) | 4 |

### Web Practices

| Kriteria | Weight | Catatan |
|---|---|---|
| Project Structure | 3 | **(Nathanael Moses):** Folder structure rapi dan mudah di trace |
| Code Tidiness | 2 | **(Nathanael Moses):** Code tidak spageti, dan tidak ngebloat di satu file (pemisahan logic/komponen) |

---

## Sheet: Components

Bobot gabungan komponen (Total Harvested = jumlah tertimbang dari keempatnya):

| Komponen | Weight |
|---|---|
| Navigation Bar | 0.2 |
| Footer | 0.15 |
| Overall Layout and Design | 0.25 |
| Landing Page | 0.4 |

### Navigation Bar — Feature

| Kriteria | Weight |
|---|---|
| Accessible on All Pages Except Auth Pages | 3 |
| Navigate to Dashboard | 2 |
| Navigate to Order Page | 2 |
| Navigate to Cart Page | 2 |
| Navigate to Profile Page | 2 |

### Navigation Bar — Design

| Kriteria | Weight |
|---|---|
| Aesthetic | 3 |
| Accessibility | 3 |

### Footer — Feature

| Kriteria | Weight |
|---|---|
| Display Footer on Every Page | 4 |
| Footer Content (Links / Copyright / Info) | 2 |

### Footer — Design

| Kriteria | Weight |
|---|---|
| Aesthetic | 3 |
| Accessibility | 3 |

### Overall Layout and Design

*(Kategori tunggal, tidak dipecah Feature/Design.)*

| Kriteria | Weight |
|---|---|
| Design Theme | 4 |
| Colour Pallete | 3 |
| Consistency | 3 |
| User Interface | 4 |
| User Experience | 4 |

### Landing Page (Feature)

*(Kategori tunggal, tidak dipecah Feature/Design.)*

| Kriteria | Weight |
|---|---|
| Show Carousel of Random Ice Cream | 3 |
| Ice Cream Detail | 2 |
| Brief Application Description | 1 |
| Navigate to Login Page | 1 |
| Navigate to Register Page | 1 |

---

## Sheet: Register Page

*(Weight halaman di Master: 3; digabung dengan Feature Ratio 0.9 / Design Ratio 0.1)*

### Register Page (Feature)

| Kriteria | Weight | Catatan |
|---|---|---|
| Register Form Completeness | 3 | **(Nathanael Moses):** - username<br>- email<br>- password<br>- conf password |
| Password and Confirm Password Must Be The Same | 0.5 | |
| Register Action | 5 | **(Nathanael Moses):** Create in DB |
| Redirect to User Dashboard Page | 0.5 | |

### Register Page (Design)

| Kriteria | Weight |
|---|---|
| Aesthetic | 3 |
| Accessibility | 3 |
| Error Message | 4 |

---

## Sheet: Login Page

*(Weight halaman di Master: 3; digabung dengan Feature Ratio 0.9 / Design Ratio 0.1)*

### Login Page (Feature)

| Kriteria | Weight | Catatan |
|---|---|---|
| Login Form Completeness | 1 | **(Nathanael Moses):** email/username<br>password |
| Validation | 1 | **(Paul Tsai):** - user must have a unique email and username<br>- user exists in the database |
| Login Action | 3 | **(Nathanael Moses):** check username/email and password in DB |
| Redirect to Dashboard | 1 | |
| Redirect to Register Page | 1 | |

### Login Page (Design)

| Kriteria | Weight |
|---|---|
| Aesthetic | 3 |
| Accessibility | 3 |
| Error Message | 4 |

---

## Sheet: Customer Dashboard

*(Weight halaman di Master: 4 — "Customer Dashboard Page"; digabung dengan Feature Ratio 0.9 / Design Ratio 0.1)*

### Customer Dashboard Page (Feature)

| Kriteria | Weight |
|---|---|
| Accessible to Logged-In User Only | 1 |
| Display Random Ice Cream | 2 |
| Search Bar with Debounce | 2 |
| Loading Skeleton | 2 |
| Pagination | 4 |
| Show Ice Cream Modal | 2 |
| Add Ice Cream to Cart | 1 |
| Ice Cream Detail Modal | 4 |

**Sub-kriteria "Ice Cream Detail Modal"** (skor gabungan dari isi modal):

| Sub-kriteria | Weight |
|---|---|
| Ice Cream Title | 1 |
| Ice Cream Description | 1 |
| Ice Cream Price | 1 |
| Ice Cream Photo | 1 |

### Customer Dashboard Page (Design)

| Kriteria | Weight |
|---|---|
| Aesthetic | 3 |
| Accessibility | 3 |
| Error Message | 2 |

---

## Sheet: Order Page

*(Weight halaman di Master: 4; digabung dengan Feature Ratio 0.9 / Design Ratio 0.1)*

### Order Page (Feature)

| Kriteria | Weight |
|---|---|
| Show Customer Transaction | 1 |
| Pagination | 4 |
| Transaction Detail | 7 |
| Change State | 2 |

**Sub-kriteria "Transaction Detail"** (skor gabungan):

| Sub-kriteria | Weight | Catatan |
|---|---|---|
| Transaction Date and Time | 2 | |
| Username of the Customer | 2 | |
| Final Payment Amount | 2 | |
| The Transaction State | 1 | |
| Display Detail Modal | 4 | **(Nathanael Moses):** Name<br>Photo<br>Price<br>Amount |

### Order Page (Design)

| Kriteria | Weight |
|---|---|
| Aesthetic | 3 |
| Accessibility | 3 |

---

## Sheet: Cart Page

*(Weight halaman di Master: 4 — "Cart Page"; digabung dengan Feature Ratio 0.9 / Design Ratio 0.1)*

### Cart and Payment Page (Feature)

| Kriteria | Weight |
|---|---|
| List Every Item | 1 |
| Change Quantity of Item | 2 |
| Select Item for Checkout | 2 |
| Checkout All Item | 2 |
| Create Transaction Action | 2 |

### Cart and Payment Page (Design)

| Kriteria | Weight |
|---|---|
| Aesthetic | 3 |
| Accessibility | 3 |
| Error Message | 2 |

---

## Sheet: Profile Page

*(Weight halaman di Master: 4 — "Customer Profile Page"; digabung dengan Feature Ratio 0.9 / Design Ratio 0.1)*

### Profile Page (Feature)

| Kriteria | Weight |
|---|---|
| Accessible to Logged-In User Only | 1 |
| Customer Username | 1 |
| Customer Email | 1 |
| Customer Profile Picture | 2 |
| Show 5 Most Recent Ice Cream | 2 |
| Edit Profile Page | 3 |

### Profile Page (Design)

| Kriteria | Weight |
|---|---|
| Aesthetic | 3 |
| Accessibility | 3 |

---

## Sheet: Admin Dashboard

*(Weight halaman di Master: 5; digabung dengan Feature Ratio 0.9 / Design Ratio 0.1)*

### Admin Dashboard (Feature)

| Kriteria | Weight |
|---|---|
| Accessible to Logged-In Admin Only | 1 |
| Transaction Analytics | 1 |
| Display Ice Cream Cards | 2 |
| Search Bar with Debounce | 2 |
| Loading Skeleton | 2 |
| Pagination | 4 |
| Show Ice Cream Detail Modal | 2 |
| Ice Cream Detail Modal | 5 |

**Sub-kriteria "Ice Cream Detail Modal"** (skor gabungan):

| Sub-kriteria | Weight | Catatan |
|---|---|---|
| Ice Cream Title | 1 | **(Nathanael Moses):** hardcode |
| Ice Cream Description | 1 | **(Nathanael Moses):** hardcode |
| Ice Cream Price | 1 | **(Nathanael Moses):** hardcode |
| Ice Cream Photo | 1 | |

### Admin Dashboard (Design)

| Kriteria | Weight |
|---|---|
| Aesthetic | 3 |
| Accessibility | 3 |

---

## Sheet: Ice Cream Management

*(Weight halaman di Master: 3; digabung dengan Feature Ratio 0.9 / Design Ratio 0.1)*

### Ice Cream Management (Feature)

| Kriteria | Weight | Catatan |
|---|---|---|
| Accessible to Logged-In Admin Only | 1 | |
| Create New Ice Cream Variant | 4 | **(Nathanael Moses):** Name, Desc, photo, Price |
| Upload to bucket storage | 2 | |

### Ice Cream Management (Design)

| Kriteria | Weight |
|---|---|
| Accessibility | 4 |
| Aesthetic | 3 |
| Error Message | 3 |

---

## Sheet: Transaction Management

*(Weight halaman di Master: 5; digabung dengan Feature Ratio 0.9 / Design Ratio 0.1)*

### Transaction Management Page (Feature)

| Kriteria | Weight |
|---|---|
| Accessible to Logged-In Admin Only | 1 |
| Show Maximum 25 Transaction | 3 |
| Paginate 25 Transaction | 3 |
| Transaction Detail | 4 |
| Filter Transaction Table | 4 |
| Reset Filter | 2 |
| Transaction Date Range Filter | 2 |
| Use more than one filter | 2 |
| Change Transaction State | 1 |

**Sub-kriteria "Transaction Detail"** (skor gabungan):

| Sub-kriteria | Weight |
|---|---|
| Transaction date and time | 1 |
| Username of the customer | 3 |
| Final payment amount | 3 |
| The transaction state | 2 |
| Filter Transaction Table | 2 |
| Display a modal for detail | 2 |

### Transaction Management Page (Design)

| Kriteria | Weight |
|---|---|
| Aesthetic | 3 |
| Accessibility | 3 |

---

## Sheet: Result

Sheet ringkasan skor akhir peserta.

| Field | Isi |
|---|---|
| Judul | TPA Web Score |
| Assistant | *Group X* — **Catatan (Nathanael Moses):** Fill with assistant's initial |
| Score | `= Master!D24 × 0.4` (Harvested Master, skala 100, dikali 0.4) |

---

## Ringkasan Seluruh Catatan (Notes) Penilai

Untuk referensi cepat, berikut seluruh catatan/komentar asli dari file sumber:

| Sheet | Sel / Kriteria | Penulis | Isi Catatan |
|---|---|---|---|
| Result | Assistant | Nathanael Moses | Fill with assistant's initial |
| General | Project Structure | Nathanael Moses | Folder structure rapi dan mudah di trace |
| General | Code Tidiness | Nathanael Moses | Code tidak spageti, dan tidak ngebloat di satu file (pemisahan logic/komponen) |
| Register Page | Register Form Completeness | Nathanael Moses | - username<br>- email<br>- password<br>- conf password |
| Register Page | Register Action | Nathanael Moses | Create in DB |
| Login Page | Login Form Completeness | Nathanael Moses | email/username<br>password |
| Login Page | Validation | Paul Tsai | - user must have a unique email and username<br>- user exists in the database |
| Login Page | Login Action | Nathanael Moses | check username/email and password in DB |
| Order Page | Display Detail Modal | Nathanael Moses | Name<br>Photo<br>Price<br>Amount |
| Admin Dashboard | Ice Cream Title (Modal) | Nathanael Moses | hardcode |
| Admin Dashboard | Ice Cream Description (Modal) | Nathanael Moses | hardcode |
| Admin Dashboard | Ice Cream Price (Modal) | Nathanael Moses | hardcode |
| Ice Cream Management | Create New Ice Cream Variant | Nathanael Moses | Name, Desc, photo, Price |
