# Sipantau Backend Repository

## Pemakaian API

Semua API (kecuali <b>/login</b> dan <b>/register</b>) harus menggunakan Token yang didapat setelah login/register.

<!-- AUTHENTICATION -->
<h3>Authentication</h3>
<li>http://sipantau-simdacloud.id/api/register [<span style="color: orange"><b>POST</b></span>]
<p style="color: red">Hanya Admin yang bisa melakukan registrasi akun baru!!!</p>

```
{
    "name": "username",
    "email": "email",
    "password": "password"
    "role": "role" (optional)
}
```
Pilihan role yang ada: <i>admin, dinas_pertanian, dinas_perdagangan, dinas_ketahanan_pangan,</i> dan <i>user</i>.
</li>
<li>http://sipantau-simdacloud.id/api/login [<span style="color: orange"><b>POST</b></span>]

```
{
    "email": "email",
    "password": "password"
}
```
</li>
<li>http://sipantau-simdacloud.id/api/logout [<span style="color: orange"><b>POST</b></span>]
</li>
<li>http://sipantau-simdacloud.id/api/me [<span style="color: cyan"><b>GET</b></span>]</li>
<hr>

<!-- HARGA PETANI -->
<h3>Harga Petani</h3>
<li>http://sipantau-simdacloud.id/api/harga-petani [<span style="color: orange"><b>POST</b></span>]

```
{
    "komoditas_id": "1",
    "items": [
        {
            "harga_petani": "10000",
            "tanggal": "2026-03-04"
        },
        {
            "harga_petani": "15000",
            "tanggal": "2026-03-05"
        },
        {
            "harga_petani": "12000",
            "tanggal": "2026-03-06"
        },
    ]
}
```
</li>
<li>http://sipantau-simdacloud.id/api/harga-petani [<span style="color: cyan"><b>GET</b></span>]
</li>
<hr>

<!-- HARGA PASAR -->
<h3>Harga Pasar</h3>
<li>http://sipantau-simdacloud.id/api/harga-pasar [<span style="color: orange"><b>POST</b></span>]

```
{
    "komoditas_id": "1",
    "items": [
        {
            "harga_pasar": "10000",
            "tanggal": "2026-03-04",
            "pasar_id": "1"
        },
        {
            "harga_pasar": "15000",
            "tanggal": "2026-03-05",
            "pasar_id": "2"
        },
        {
            "harga_pasar": "12000",
            "tanggal": "2026-03-06",
            "pasar_id": "2"
        },
    ]
}
```
</li>
<li>http://sipantau-simdacloud.id/api/harga-pasar [<span style="color: cyan"><b>GET</b></span>]
</li>
<hr>

<!-- PANEN KOMODITAS -->
<h3>Panen Komoditas</h3>
<li>http://sipantau-simdacloud.id/api/harga-pasar [<span style="color: orange"><b>POST</b></span>]

```
{
    "komoditas_id": "1",
    "items": [
        {
            "perkiraan_tonase": "100",
            "tanggal_prakiraan_panen": "2026-03-04",
        },
        {
            "perkiraan_tonase": "80",
            "tanggal_prakiraan_panen": "2026-03-05",
        },
        {
            "perkiraan_tonase": "87",
            "tanggal_prakiraan_panen": "2026-03-06",
        }
    ]
}
```
</li>
<li>http://sipantau-simdacloud.id/api/harga-pasar [<span style="color: cyan"><b>GET</b></span>]
</li>
<hr>

<!-- KETERSEDIAAN HARIAN -->
<h3>Ketersediaan Harian</h3>
<li>http://sipantau-simdacloud.id/api/ketersediaan [<span style="color: orange"><b>POST</b></span>]

```
{
    "komoditas_id": "1",
    "items": [
        {
            "ketersediaan_harian": "100",
            "kebutuhan_harian": "90",
            "neraca_harian": "10",
            "tanggal": "2026-03-04"
        },
        {
            "ketersediaan_harian": "95",
            "kebutuhan_harian": "93",
            "neraca_harian": "2",
            "tanggal": "2026-03-05"
        },
        {
            "ketersediaan_harian": "85",
            "kebutuhan_harian": "97",
            "neraca_harian": "-12",
            "tanggal": "2026-03-06"
        }
    ]
}
```
</li>
<li>http://sipantau-simdacloud.id/api/ketersediaan [<span style="color: cyan"><b>GET</b></span>]
</li>
<hr>

<!-- KOMODITAS -->
<h3>Komoditas</h3>
<li>http://sipantau-simdacloud.id/api/komoditas [<span style="color: orange"><b>POST</b></span>]

```
{
    "nama_komoditas": "nama komoditas"
}
```
</li>
<li>http://sipantau-simdacloud.id/api/komoditas [<span style="color: cyan"><b>GET</b></span>]
</li>
<hr>

<!-- PASAR -->
<h3>Pasar</h3>
<li>http://sipantau-simdacloud.id/api/pasar [<span style="color: orange"><b>POST</b></span>]

```
{
    "nama_pasar": "nama pasar",
    "daerah": "nama daerah"
}
```
</li>
<li>http://sipantau-simdacloud.id/api/pasar [<span style="color: cyan"><b>GET</b></span>]
</li>
<hr>

## Hak Akses untuk Masing-Masing Role

### Admin
<li>Full akses</li>

### Dinas Pertanian
<li>Melihat data daftar komoditas</li>
<li>Menambah data harga petani</li>
<li>Menambah data panen</li>

### Dinas Perdagangan
<li>Melihat data daftar komoditas</li>
<li>Menambah data harga pasar</li>

### Dinas Ketahanan Pangan
<li>Melihat data daftar komoditas</li>
<li>Menambah data ketersediaan harian</li>

### User
<li>Tidak memiliki akses apapun <span style="color: orange">(Role default saat registrasi)<span></li>