## SimpleChat
Aplikasi ini dibuat menggunakan Nodejs, Express dan Mysql

## Pengujian
- Nodejs v18.16.0
- NPM v9.5.1

## Instalasi
```sh
npm install
cp .env.example .env # edit .env
# import 'databases/db.sql' ke mysql

npm run dev
```

## Fitur
### Admin
- CRUD dan banned user
### User
- Request pertemanan
- Terima, Tolak, Banned pertemanan
- Kirim pesan

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

## Catatan
Aplikasi ini belum pernah di tes ke web/app ui. Masih dalam pengujian menggunakan postman.