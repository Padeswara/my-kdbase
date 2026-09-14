/**
 * Export site list to Excel spreadsheet (.xlsx) - Dynamically loaded on demand
 * @param {Array} sites - Site data list
 * @param {string} fileName - Output filename prefix
 */
export async function exportSitesToExcel(sites = [], fileName = 'Site_Data') {
  if (!sites || sites.length === 0) {
    alert('No data to export!')
    return
  }

  // Dynamically load XLSX only when user clicks export to save ~400kB on initial page load
  const XLSX = await import('xlsx')

  // Format rows for Excel spreadsheet
  const formattedData = sites.map((site, index) => ({
    'No': index + 1,
    'Company Name': site.company_name || '-',
    'Address': site.address || '-',
    'PIC Name': site.pic_name || '-',
    'PIC Contact': site.pic_phone || '-',
    'Status': site.status || 'Pending',
    'Notes': site.notes || '-',
    'Date Added': site.created_at
      ? new Date(site.created_at).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : '-'
  }))

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(formattedData)

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 28 }, // Company Name
    { wch: 35 }, // Address
    { wch: 20 }, // PIC Name
    { wch: 18 }, // PIC Contact
    { wch: 14 }, // Status
    { wch: 35 }, // Notes
    { wch: 22 }, // Date Added
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Site Data')

  // Generate file name with today's date
  const today = new Date().toISOString().split('T')[0]
  const fullFileName = `${fileName}_${today}.xlsx`

  // Download file
  XLSX.writeFile(workbook, fullFileName)
}
