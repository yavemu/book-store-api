import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestResult {
  module: string;
  success: boolean;
  duration: number;
  error?: string;
}

class TestRunner {
  private scriptsDir = path.join(__dirname);
  private resultsDir = path.join(__dirname, '..', 'resultados');
  private results: TestResult[] = [];
  private executionLog: string[] = [];

  async run(): Promise<void> {
    this.log('🚀 Iniciando ejecución de todos los módulos de test...\n');
    
    try {
      // Ensure results directory exists
      if (!fs.existsSync(this.resultsDir)) {
        fs.mkdirSync(this.resultsDir, { recursive: true });
      }

      const testFiles = this.findTestFiles();
      this.log(`📁 Encontrados ${testFiles.length} archivos de test:`);
      testFiles.forEach(file => this.log(`   - ${file}`));
      this.log('');

      for (const testFile of testFiles) {
        await this.runTestFile(testFile);
      }

      this.saveExecutionSummary();
      this.saveFullExecutionLog();
      this.showSummary();
      this.generateConsolidatedErrors();
    } catch (error) {
      console.error('❌ Error ejecutando tests:', error);
    }
  }

  private findTestFiles(): string[] {
    const testFiles: string[] = [];
    
    // Buscar archivos test-***.ts en todas las subcarpetas de scripts
    const scanDirectory = (dir: string) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Escanear subdirectorio
          scanDirectory(fullPath);
        } else if (stat.isFile() && item.match(/^test-.*\.ts$/)) {
          // Archivo de test encontrado
          testFiles.push(fullPath);
        }
      }
    };

    scanDirectory(this.scriptsDir);
    return testFiles;
  }

  private async runTestFile(testFile: string): Promise<void> {
    const moduleName = this.extractModuleName(testFile);
    const startTime = Date.now();
    
    this.log(`🧪 Ejecutando test: ${moduleName}...`);
    
    try {
      // Compilar y ejecutar el archivo TypeScript
      const { stdout, stderr } = await execAsync(`npx ts-node "${testFile}"`, {
        cwd: path.dirname(testFile),
        timeout: 120000 // 2 minutos timeout
      });
      
      const duration = Date.now() - startTime;
      
      if (stderr && !stderr.includes('experimental')) {
        this.log(`⚠️  Warnings para ${moduleName}: ${stderr}`);
      }
      
      // Log stdout for detailed execution info
      if (stdout) {
        this.log(`--- Output for ${moduleName} ---`);
        this.log(stdout);
        this.log(`--- End output for ${moduleName} ---`);
      }
      
      this.results.push({
        module: moduleName,
        success: true,
        duration
      });
      
      this.log(`✅ ${moduleName} completado en ${duration}ms\n`);
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        module: moduleName,
        success: false,
        duration,
        error: error.message
      });
      
      this.log(`❌ ${moduleName} falló en ${duration}ms:`);
      this.log(`   Error: ${error.message}\n`);
    }
  }

  private extractModuleName(testFile: string): string {
    const fileName = path.basename(testFile);
    const match = fileName.match(/^test-(.+)-module\.ts$/);
    return match ? match[1] : fileName.replace('.ts', '');
  }

  private showSummary(): void {
    console.log('='.repeat(60));
    console.log('📊 RESUMEN DE EJECUCIÓN');
    console.log('='.repeat(60));
    
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`\n📈 Estadísticas Generales:`);
    console.log(`   • Total de módulos: ${this.results.length}`);
    console.log(`   • Exitosos: ${successful}`);
    console.log(`   • Fallidos: ${failed}`);
    console.log(`   • Tiempo total: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);
    console.log(`   • Promedio por módulo: ${(totalDuration / this.results.length).toFixed(0)}ms`);
    
    console.log(`\n📋 Resultados Detallados:`);
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const duration = `${result.duration}ms`;
      console.log(`   ${status} ${result.module.padEnd(20)} - ${duration}`);
      
      if (!result.success && result.error) {
        console.log(`      └─ Error: ${result.error.split('\n')[0]}`);
      }
    });
    
    if (failed > 0) {
      console.log(`\n⚠️  ${failed} módulo(s) fallaron. Revisa los logs individuales para más detalles.`);
    } else {
      console.log(`\n🎉 ¡Todos los módulos ejecutados exitosamente!`);
    }
    
    console.log('\n' + '='.repeat(60));
  }

  private saveExecutionSummary(): void {
    const summaryData = {
      timestamp: new Date().toISOString(),
      totalModules: this.results.length,
      successfulModules: this.results.filter(r => r.success).length,
      failedModules: this.results.filter(r => !r.success).length,
      totalDuration: this.results.reduce((sum, r) => sum + r.duration, 0),
      results: this.results
    };

    const filename = `execution-summary.json`;
    const filepath = path.join(this.resultsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(summaryData, null, 2));
    this.log(`\n📄 Execution summary saved: ${filepath}`);
  }

  private async generateConsolidatedErrors(): Promise<void> {
    try {
      this.log('\n🔍 Generando reporte consolidado de errores...');
      
      // Import and run the consolidated errors generator
      const { ConsolidatedErrorsGenerator } = await import('./generate-consolidated-errors');
      const generator = new ConsolidatedErrorsGenerator();
      await generator.generate();
      
    } catch (error) {
      this.log('⚠️  No se pudo generar el reporte consolidado de errores: ' + error);
    }
  }

  private log(message: string): void {
    console.log(message);
    this.executionLog.push(`[${new Date().toISOString()}] ${message}`);
  }

  private saveFullExecutionLog(): void {
    const filename = `full-execution-log.log`;
    const filepath = path.join(this.resultsDir, filename);
    
    const logContent = [
      '='.repeat(80),
      '🔍 FULL EXECUTION LOG - ALL MODULES TEST RUNNER',
      '='.repeat(80),
      `📅 Generated: ${new Date().toISOString()}`,
      `📊 Total modules: ${this.results.length}`,
      `✅ Successful: ${this.results.filter(r => r.success).length}`,
      `❌ Failed: ${this.results.filter(r => !r.success).length}`,
      `⏱️  Total duration: ${this.results.reduce((sum, r) => sum + r.duration, 0)}ms`,
      '='.repeat(80),
      '',
      ...this.executionLog,
      '',
      '='.repeat(80),
      'END OF FULL EXECUTION LOG',
      '='.repeat(80)
    ].join('\n');

    fs.writeFileSync(filepath, logContent);
    console.log(`📄 Full execution log saved: ${filepath}`);
  }
}

// Ejecutar el runner si este archivo es llamado directamente
if (require.main === module) {
  const runner = new TestRunner();
  runner.run().catch(console.error);
}

export { TestRunner };