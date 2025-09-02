import * as fs from 'fs';
import * as path from 'path';

interface TestError {
  endpointName: string;
  expectedStatus: number;
  actualStatus: number;
  error?: string;
  role: string;
  description: string;
  path?: string;
  requestData?: any;
}

interface ModuleReport {
  module: string;
  totalTests: number;
  failedTests: number;
  errors: TestError[];
}

class ConsolidatedErrorsGenerator {
  private resultsDir = path.join(__dirname, '..', 'resultados');

  async generate(): Promise<void> {
    console.log('🔍 Generando log consolidado de errores...\n');
    
    try {
      // Ensure results directory exists
      if (!fs.existsSync(this.resultsDir)) {
        fs.mkdirSync(this.resultsDir, { recursive: true });
      }

      const reports = this.findReportFiles();
      console.log(`📁 Encontrados ${reports.length} archivos de reporte:`);
      reports.forEach(report => console.log(`   - ${path.basename(report)}`));
      console.log('');

      const moduleReports: ModuleReport[] = [];
      let totalRealErrors = 0;

      for (const reportFile of reports) {
        const moduleReport = this.processReportFile(reportFile);
        moduleReports.push(moduleReport);
        totalRealErrors += moduleReport.errors.length;

        console.log(`📋 Procesando ${moduleReport.module}:`);
        console.log(`   • Tests totales: ${moduleReport.totalTests}`);
        console.log(`   • Tests fallidos: ${moduleReport.failedTests}`);
        console.log(`   • Errores reales: ${moduleReport.errors.length}`);
      }

      this.generateConsolidatedLog(moduleReports, totalRealErrors);

      console.log(`\n📊 Procesamiento completado:`);
      console.log(`   • Total de tests con errores reales: ${totalRealErrors}`);
      console.log(`   • Archivo generado: ${path.join(this.resultsDir, 'consolidated-errors.log')}`);

    } catch (error) {
      console.error('❌ Error generando log consolidado:', error);
    }
  }

  private findReportFiles(): string[] {
    const reportFiles: string[] = [];
    
    // Search in results directory first
    if (fs.existsSync(this.resultsDir)) {
      const resultsFiles = fs.readdirSync(this.resultsDir)
        .filter(file => file.endsWith('-module-test-report.json'))
        .map(file => path.join(this.resultsDir, file));
      reportFiles.push(...resultsFiles);
    }

    // If no files found in results, search in scripts directory
    if (reportFiles.length === 0) {
      const scriptsFiles = fs.readdirSync(__dirname)
        .filter(file => file.endsWith('-module-test-report.json'))
        .map(file => path.join(__dirname, file));
      reportFiles.push(...scriptsFiles);
    }

    return reportFiles;
  }

  private processReportFile(reportFile: string): ModuleReport {
    const content = fs.readFileSync(reportFile, 'utf8');
    const data = JSON.parse(content);
    
    const moduleName = data.module || path.basename(reportFile).replace('-module-test-report.json', '');
    const tests = data.results || data.tests || [];
    
    const realErrors: TestError[] = [];

    for (const test of tests) {
      // Only include tests that failed unexpectedly (not validation errors)
      if (!test.success && !this.isExpectedFailure(test)) {
        realErrors.push({
          endpointName: test.endpointName || test.name || 'Unknown',
          expectedStatus: test.expectedStatus || 0,
          actualStatus: test.actualStatus || test.status || 0,
          error: test.error || test.message || 'Unknown error',
          role: test.role || 'Unknown',
          description: test.description || 'No description',
          path: test.path,
          requestData: test.requestData
        });
      }
    }

    return {
      module: moduleName.toUpperCase(),
      totalTests: tests.length,
      failedTests: tests.filter((t: any) => !t.success).length,
      errors: realErrors
    };
  }

  private isExpectedFailure(test: any): boolean {
    // Check if this is a validation test that should fail
    if (test.expectedFailure) return true;
    
    // Check if the test received the expected error status
    if (test.expectedStatus && test.actualStatus === test.expectedStatus) {
      return true;
    }

    // Check for validation error patterns
    const validationStatuses = [400, 401, 403, 404, 409, 422];
    if (validationStatuses.includes(test.expectedStatus) && 
        test.actualStatus === test.expectedStatus) {
      return true;
    }

    return false;
  }

  private generateConsolidatedLog(moduleReports: ModuleReport[], totalRealErrors: number): void {
    const timestamp = new Date().toISOString();
    let content = '';

    content += '='.repeat(80) + '\n';
    content += '🚨 REPORTE CONSOLIDADO DE ERRORES REALES - MÓDULOS DE TEST\n';
    content += '='.repeat(80) + '\n';
    content += `📅 Generado: ${timestamp}\n`;
    content += `📊 Total de tests con errores reales: ${totalRealErrors}\n`;
    content += '='.repeat(80) + '\n\n';

    if (totalRealErrors === 0) {
      content += '🎉 ¡EXCELENTE! No se encontraron errores reales en ningún módulo.\n';
      content += 'Todos los fallos son validaciones correctas o errores esperados.\n\n';
    } else {
      for (const moduleReport of moduleReports) {
        if (moduleReport.errors.length > 0) {
          content += `🔴 MÓDULO: ${moduleReport.module}\n`;
          content += `├── Total de tests: ${moduleReport.totalTests}\n`;
          content += `├── Tests fallidos: ${moduleReport.failedTests}\n`;
          content += `└── Errores reales: ${moduleReport.errors.length}\n\n`;

          for (let i = 0; i < moduleReport.errors.length; i++) {
            const error = moduleReport.errors[i];
            const isLast = i === moduleReport.errors.length - 1;
            const prefix = isLast ? '└──' : '├──';

            content += `${prefix} ERROR #${i + 1}: ${error.endpointName}\n`;
            content += `    ├── 👤 ROLE: ${error.role}\n`;
            content += `    ├── 📝 DESCRIPTION: ${error.description}\n`;
            content += `    ├── ❌ EXPECTED: ${error.expectedStatus}, GOT: ${error.actualStatus}\n`;
            
            if (error.path && error.path.includes('?')) {
              const [basePath, queryString] = error.path.split('?');
              content += `    ├── 🔍 QUERY PARAMS: ${queryString}\n`;
            }
            
            if (error.requestData) {
              content += `    ├── 📤 REQUEST DATA: ${JSON.stringify(error.requestData)}\n`;
            }
            
            content += `    └── 🐛 ERROR: ${error.error?.split('\n')[0] || 'Unknown error'}\n\n`;
          }
        }
      }
    }

    content += '='.repeat(80) + '\n';
    content += '📝 NOTAS:\n';
    content += '• Solo se incluyen tests que fallaron de forma inesperada\n';
    content += '• Los tests de validación que reciben 4xx correctamente NO aparecen aquí\n';
    content += '• Los tests de error que reciben el código esperado NO aparecen aquí\n';
    content += '• Este log ayuda a identificar problemas reales que necesitan corrección\n';
    content += '='.repeat(80) + '\n';

    fs.writeFileSync(path.join(this.resultsDir, 'consolidated-errors.log'), content);
  }
}

// Execute if called directly
if (require.main === module) {
  const generator = new ConsolidatedErrorsGenerator();
  generator.generate().catch(console.error);
}

export { ConsolidatedErrorsGenerator };