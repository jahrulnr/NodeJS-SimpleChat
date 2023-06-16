## SimpleChat
Aplikasi ini dibuat menggunakan Nodejs, Express dan Mysql<br>
<br>
<br>
## Pengujian
- Nodejs v18.16.0
- NPM v9.5.1
<br>

## Instalasi
```sh
npm install
cp .env.example .env # edit .env
# import 'databases/db.sql' ke mysql

npm run dev
```
<br>

## Fitur
### Admin
- CRUD dan banned user
### User
- Request pertemanan
- Terima, Tolak, Banned pertemanan
- Kirim pesan
<br>

## Postman
- Set method menjadi "POST" dan inputkan url ```http://localhost:3000/api/login```. <br>
Klik tab ```body``` dan pilih option ```raw```
```json
{
    "email": "superadmin@demo.com", // atau admin@demo.com
    "password": "123456"
}
```
- Salin value ```token```
- Buka tab ```Authorization```, pilih type ```Bearer Token```
- Pastekan ke field token.
<br>

## Catatan
Aplikasi ini belum pernah di tes ke web/app ui. Masih dalam pengujian menggunakan postman.