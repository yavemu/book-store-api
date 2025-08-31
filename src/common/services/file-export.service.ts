import { Injectable } from '@nestjs/common';
import { Response } from 'express';

export interface FileExportData {
  content: string;
  filename: string;
  type: 'csv' | 'excel';
}

@Injectable()
export class FileExportService {
  exportToCsv(res: Response, data: FileExportData): void {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${data.filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Add BOM for UTF-8 to ensure proper encoding in Excel
    const csvWithBom = '\uFEFF' + data.content;
    res.send(csvWithBom);
  }

  exportToExcel(res: Response, data: FileExportData): void {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${data.filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.send(data.content);
  }

  generateDateBasedFilename(prefix: string, extension: string): string {
    const date = new Date().toISOString().split('T')[0];
    return `${prefix}_${date}.${extension}`;
  }
}
