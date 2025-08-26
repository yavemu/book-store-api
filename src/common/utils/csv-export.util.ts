export class CsvExportUtil {
  static convertToCsv<T>(data: T[], columns: (keyof T)[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = columns.join(',');
    const rows = data.map(item => 
      columns.map(column => {
        const value = item[column];
        return value !== null && value !== undefined ? String(value) : '';
      }).join(',')
    );

    return [headers, ...rows].join('\n');
  }

  static generateCsvResponse<T>(data: T[], filename: string, columns: (keyof T)[]) {
    const csv = this.convertToCsv(data, columns);
    
    return {
      content: csv,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    };
  }
}