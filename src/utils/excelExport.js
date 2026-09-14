import * as XLSX from 'xlsx'

/**
 * Mengekspor daftar sites ke dalam file Excel (.xlsx)
 * @param {Array} sites - Data list site
 * @param {string} fileName - Nama file output
 * Export site list to Excel spreadsheet (.xlsx)
 * @param {Array} sites - Site data list
 * @param {string} fileName - Output filename prefix
 */
export function exportSitesToExcel(sites = [], fileName = 'Data_Site_Perusahaan') {
export function exportSitesToExcel(sites = [], fileName = 'Site_Data') {
  if (!sites || sites.length === 0) {
    alert('Tidak ada data yang dapat diekspor!')
    alert('No data to export!')
    return
  }

  // Format baris untuk spreadsheet Excel
  // Format rows for Excel spreadsheet
  const formattedData = sites.map((site, index) => ({
    'No': index + 1,
    'Nama Perusahaan': site.company_name || '-',
    'Alamat': site.address || '-',
    'Nama PIC': site.pic_name || '-',
    'Nomor PIC': site.pic_phone || '-',
    'Company Name': site.company_name || '-',
    'Address': site.address || '-',
    'PIC Name': site.pic_name || '-',
    'PIC Contact': site.pic_phone || '-',
    'Status': site.status || 'Pending',
    'Keterangan': site.notes || '-',
    'Link Foto': site.image_url || '-',
    'Tanggal Ditambahkan': site.created_at
      ? new Date(site.created_at).toLocaleString('id-ID', {
    'Notes': site.notes || '-',
    'Photo Link': site.image_url || '-',
    'Date Added': site.created_at
      ? new Date(site.created_at).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : '-'
  }))

  // Buat worksheet dan workbook
  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(formattedData)

  // Atur lebar kolom otomatis agar rapi
  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 28 }, // Nama Perusahaan
    { wch: 35 }, // Alamat
    { wch: 20 }, // Nama PIC
    { wch: 18 }, // Nomor PIC
    { wch: 28 }, // Company Name
    { wch: 35 }, // Address
    { wch: 20 }, // PIC Name
    { wch: 18 }, // PIC Contact
    { wch: 14 }, // Status
    { wch: 35 }, // Keterangan
    { wch: 30 }, // Link Foto
    { wch: 22 }, // Tanggal
    { wch: 35 }, // Notes
    { wch: 30 }, // Photo Link
    { wch: 22 }, // Date Added
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Sites')
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Site Data')

  // Generate nama file dengan tanggal hari ini
  // Generate file name with today's date
  const today = new Date().toISOString().split('T')[0]
  const fullFileName = `${fileName}_${today}.xlsx`

  // Unduh file
  // Download file
  XLSX.writeFile(workbook, fullFileName)
}

