const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const firstNames = ['Budi', 'Siti', 'Agus', 'Ayu', 'Rudi', 'Dina', 'Eko', 'Rini', 'Hadi', 'Maya', 'Joko', 'Nina', 'Tono', 'Lina', 'Arif', 'Dewi', 'Yudi', 'Sari', 'Iwan', 'Rika', 'Andi', 'Fitri', 'Hendra', 'Nita', 'Doni', 'Ratna', 'Fajar', 'Wati', 'Hasan', 'Yanti'];
const lastNames = ['Santoso', 'Wijaya', 'Kurniawan', 'Setiawan', 'Pratama', 'Putra', 'Saputra', 'Nugroho', 'Hidayat', 'Wahyudi', 'Pangestu', 'Siregar', 'Harahap', 'Suryono', 'Wibowo', 'Kusuma', 'Lestari', 'Rahayu', 'Sari', 'Utami'];

const dummyData = [];

for (let i = 0; i < 30; i++) {
  const gender = Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan';
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  dummyData.push({
    'NIS': `100${String(i + 1).padStart(2, '0')}`,
    'NISN': `0012345${String(i + 1).padStart(3, '0')}`,
    'Nama Lengkap': `${firstName} ${lastName}`,
    'Jenis Kelamin': gender,
    'Tempat Lahir': 'Surabaya',
    'Tanggal Lahir': new Date(2005, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    'Agama': 'Islam',
    'Alamat': `Jl. Mawar No. ${i + 1}`
  });
}

const worksheet = XLSX.utils.json_to_sheet(dummyData);

// Set column widths
const wscols = [
  {wch: 10}, // NIS
  {wch: 15}, // NISN
  {wch: 25}, // Nama Lengkap
  {wch: 15}, // Jenis Kelamin
  {wch: 15}, // Tempat Lahir
  {wch: 15}, // Tanggal Lahir
  {wch: 10}, // Agama
  {wch: 30}  // Alamat
];
worksheet['!cols'] = wscols;

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'DataSiswa');

const outputPath = path.join(__dirname, '..', 'public', 'dummy_30_siswa.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log('File dummy_30_siswa.xlsx berhasil dibuat di folder public!');
