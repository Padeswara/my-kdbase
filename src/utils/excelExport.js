import * as XLSX from 'xlsx'

/**
 * Mengekspor daftar sites ke dalam file Excel (.xlsx)
 * @param {Array} sites - Data list site
 * @param {string} fileName - Nama file output
 */
export function exportSitesToExcel(sites = [], fileName = 'Data_Site_Perusahaan') {
  if (!sites || sites.length === 0) {
    alert('Tidak ada data yang dapat diekspor!')
    return
  }

  // Format baris untuk spreadsheet Excel
  const formattedData = sites.map((site, index) => ({
    'No': index + 1,
    'Nama Perusahaan': site.company_name || '-',
    'Alamat': site.address || '-',
    'Nama PIC': site.pic_name || '-',
    'Nomor PIC': site.pic_phone || '-',
    'Status': site.status || 'Pending',
    'Keterangan': site.notes || '-',
    'Link Foto': site.image_url || '-',
    'Tanggal Ditambahkan': site.created_at
      ? new Date(site.created_at).toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : '-'
  }))

  // Buat worksheet dan workbook
  const worksheet = XLSX.utils.json_to_sheet(formattedData)

  // Atur lebar kolom otomatis agar rapi
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 28 }, // Nama Perusahaan
    { wch: 35 }, // Alamat
    { wch: 20 }, // Nama PIC
    { wch: 18 }, // Nomor PIC
    { wch: 14 }, // Status
    { wch: 35 }, // Keterangan
    { wch: 30 }, // Link Foto
    { wch: 22 }, // Tanggal
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Sites')

  // Generate nama file dengan tanggal hari ini
  const today = new Date().toISOString().split('T')[0]
  const fullFileName = `${fileName}_${today}.xlsx`

  // Unduh file
  XLSX.writeFile(workbook, fullFileName)
}

