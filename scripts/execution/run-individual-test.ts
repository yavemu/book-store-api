import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';

const execAsync = promisify(exec);

interface TestConfig {
  moduleName: string;
  baseUrl: string;
  endpoints: Record<string, any>;
}

interface TestResult {
  endpointName: string;
  success: boolean;
  expectedStatus: number;
  actualStatus: number;
  duration: number;
  error?: string;
  role: string;
  description: string;
  path?: string;
  requestData?: any;
  expectedFailure?: boolean;
}

class IndividualTestRunner {
  private results: TestResult[] = [];
  private resultsDir = path.join(__dirname, '..', 'resultados');
  private executionLog: string[] = [];
  private adminLog: string[] = [];
  private userLog: string[] = [];
  private tokens = {
    ADMIN: '',
    USER: ''
  };

  async runModule(modulePath: string): Promise<void> {
    try {
      // Ensure results directory exists
      if (!fs.existsSync(this.resultsDir)) {
        fs.mkdirSync(this.resultsDir, { recursive: true });
      }

      // Import the test configuration
      const configModule = require(modulePath);
      const configKey = Object.keys(configModule).find(key => key.includes('TestConfig'));
      
      if (!configKey) {
        throw new Error(`No test configuration found in ${modulePath}`);
      }

      const config: TestConfig = configModule[configKey];
      
      this.log(`🧪 Testing module: ${config.moduleName}`);
      this.log(`🌐 Base URL: ${config.baseUrl}`);
      this.log(`📊 Total endpoints: ${Object.keys(config.endpoints).length}\n`);

      // Get authentication tokens first
      await this.getTokens();

      // Run all endpoint tests
      for (const [endpointName, endpointConfig] of Object.entries(config.endpoints)) {
        await this.runEndpointTest(endpointName, endpointConfig, config.baseUrl);
      }

      // Save results and show summary
      this.saveResults(config.moduleName);
      this.saveExecutionLog(config.moduleName);
      this.saveRoleBasedLogs(config.moduleName);
      this.showResults(config.moduleName);

    } catch (error: any) {
      console.error(`❌ Error running module test: ${error.message}`);
    }
  }

  private async getTokens(): Promise<void> {
    try {
      // Login as ADMIN
      const adminResponse = await axios.post('http://localhost:3000/auth/login', {
        email: 'admin@bookstore.com',
        password: 'admin123'
      });
      this.tokens.ADMIN = adminResponse.data.access_token;

      // Login as USER
      const userResponse = await axios.post('http://localhost:3000/auth/login', {
        email: 'user@bookstore.com',
        password: 'user123'
      });
      this.tokens.USER = userResponse.data.access_token;

    } catch (error) {
      this.log('⚠️  Could not obtain authentication tokens');
    }
  }

  private async runEndpointTest(
    endpointName: string,
    endpointConfig: any,
    baseUrl: string
  ): Promise<void> {
    const startTime = Date.now();
    const endpoint = typeof endpointConfig.endpoint === 'function' ? 
      endpointConfig.endpoint() : endpointConfig.endpoint;
    const url = `${baseUrl}${endpoint}`;
    
    this.log(`Testing: ${endpointName} (${endpointConfig.role}) - ${endpointConfig.description}`);

    try {
      const headers: any = {};
      
      // Add authentication headers based on role
      if (endpointConfig.role === 'ADMIN' && this.tokens.ADMIN) {
        headers.Authorization = `Bearer ${this.tokens.ADMIN}`;
      } else if (endpointConfig.role === 'USER' && this.tokens.USER) {
        headers.Authorization = `Bearer ${this.tokens.USER}`;
      }

      // Prepare request data
      const requestData = typeof endpointConfig.data === 'function' ? 
        endpointConfig.data() : endpointConfig.data;

      let response;
      
      // Make the HTTP request
      switch (endpointConfig.method.toLowerCase()) {
        case 'get':
          response = await axios.get(url, { headers, validateStatus: () => true });
          break;
        case 'post':
          response = await axios.post(url, requestData, { headers, validateStatus: () => true });
          break;
        case 'put':
          response = await axios.put(url, requestData, { headers, validateStatus: () => true });
          break;
        case 'delete':
          response = await axios.delete(url, { headers, validateStatus: () => true });
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${endpointConfig.method}`);
      }

      const duration = Date.now() - startTime;
      const success = response.status === endpointConfig.expectedStatus;

      this.results.push({
        endpointName,
        success,
        expectedStatus: endpointConfig.expectedStatus,
        actualStatus: response.status,
        duration,
        role: endpointConfig.role,
        description: endpointConfig.description,
        path: url,
        requestData: requestData,
        expectedFailure: endpointConfig.expectedFailure || false
      });

      const status = success ? '✅' : '❌';
      const statusText = success ? 'PASS' : 'FAIL';
      const resultMsg = `   ${status} ${statusText} - Expected: ${endpointConfig.expectedStatus}, Got: ${response.status} (${duration}ms)`;
      this.log(resultMsg);
      
      // Log to role-specific logs
      this.logByRole(endpointConfig.role, `${endpointName}: ${resultMsg}`);

    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        endpointName,
        success: false,
        expectedStatus: endpointConfig.expectedStatus,
        actualStatus: 0,
        duration,
        role: endpointConfig.role,
        description: endpointConfig.description,
        path: url,
        requestData: typeof endpointConfig.data === 'function' ? endpointConfig.data() : endpointConfig.data,
        error: error.message,
        expectedFailure: endpointConfig.expectedFailure || false
      });

      const errorMsg = `   ❌ ERROR - ${error.message} (${duration}ms)`;
      this.log(errorMsg);
      
      // Log to role-specific logs
      this.logByRole(endpointConfig.role, `${endpointName}: ${errorMsg}`);
    }
  }

  private saveResults(moduleName: string): void {
    const reportData = {
      module: moduleName,
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passedTests: this.results.filter(r => r.success).length,
      failedTests: this.results.filter(r => !r.success).length,
      results: this.results
    };

    const filename = `${moduleName.toLowerCase()}-module-test-report.json`;
    const filepath = path.join(this.resultsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(reportData, null, 2));
    this.log(`\n📄 Report saved: ${filepath}`);
  }

  private showResults(moduleName: string): void {
    console.log('\n' + '='.repeat(80));
    console.log(`📊 RESULTS FOR ${moduleName.toUpperCase()} MODULE`);
    console.log('='.repeat(80));

    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;
    const successRate = total > 0 ? ((successful / total) * 100).toFixed(1) : '0.0';

    console.log(`\n📈 Summary:`);
    console.log(`   • Total tests: ${total}`);
    console.log(`   • Passed: ${successful}`);
    console.log(`   • Failed: ${failed}`);
    console.log(`   • Success rate: ${successRate}%`);

    if (failed > 0) {
      console.log(`\n❌ Failed tests:`);
      this.results
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`   • ${result.endpointName} (${result.role})`);
          console.log(`     └─ Expected: ${result.expectedStatus}, Got: ${result.actualStatus}`);
          if (result.error) {
            console.log(`     └─ Error: ${result.error.split('\n')[0]}`);
          }
        });
    }

    console.log('\n' + '='.repeat(80));
  }

  private log(message: string): void {
    console.log(message);
    this.executionLog.push(`[${new Date().toISOString()}] ${message}`);
  }

  private saveExecutionLog(moduleName: string): void {
    const filename = `${moduleName.toLowerCase()}-execution-log.log`;
    const filepath = path.join(this.resultsDir, filename);
    
    const logContent = [
      '='.repeat(80),
      `🔍 EXECUTION LOG FOR ${moduleName.toUpperCase()} MODULE`,
      '='.repeat(80),
      `📅 Generated: ${new Date().toISOString()}`,
      `📊 Total tests: ${this.results.length}`,
      `✅ Passed: ${this.results.filter(r => r.success).length}`,
      `❌ Failed: ${this.results.filter(r => !r.success).length}`,
      '='.repeat(80),
      '',
      ...this.executionLog,
      '',
      '='.repeat(80),
      'END OF EXECUTION LOG',
      '='.repeat(80)
    ].join('\n');

    fs.writeFileSync(filepath, logContent);
    console.log(`📄 Execution log saved: ${filepath}`);
  }

  private logByRole(role: string, message: string): void {
    const timestampedMsg = `[${new Date().toISOString()}] ${message}`;
    
    if (role === 'ADMIN') {
      this.adminLog.push(timestampedMsg);
    } else if (role === 'USER') {
      this.userLog.push(timestampedMsg);
    }
  }

  private saveRoleBasedLogs(moduleName: string): void {
    // Save ADMIN endpoints log
    if (this.adminLog.length > 0) {
      const adminFilename = `${moduleName.toLowerCase()}-admin-endpoints.log`;
      const adminFilepath = path.join(this.resultsDir, adminFilename);
      
      const adminLogContent = [
        '='.repeat(80),
        `🔒 ADMIN ENDPOINTS LOG FOR ${moduleName.toUpperCase()} MODULE`,
        '='.repeat(80),
        `📅 Generated: ${new Date().toISOString()}`,
        `📊 Total ADMIN tests: ${this.results.filter(r => r.role === 'ADMIN').length}`,
        `✅ ADMIN passed: ${this.results.filter(r => r.role === 'ADMIN' && r.success).length}`,
        `❌ ADMIN failed: ${this.results.filter(r => r.role === 'ADMIN' && !r.success).length}`,
        '='.repeat(80),
        '',
        ...this.adminLog,
        '',
        '='.repeat(80),
        'END OF ADMIN ENDPOINTS LOG',
        '='.repeat(80)
      ].join('\n');

      fs.writeFileSync(adminFilepath, adminLogContent);
      console.log(`📄 Admin endpoints log saved: ${adminFilepath}`);
    }

    // Save USER endpoints log
    if (this.userLog.length > 0) {
      const userFilename = `${moduleName.toLowerCase()}-user-endpoints.log`;
      const userFilepath = path.join(this.resultsDir, userFilename);
      
      const userLogContent = [
        '='.repeat(80),
        `👤 USER ENDPOINTS LOG FOR ${moduleName.toUpperCase()} MODULE`,
        '='.repeat(80),
        `📅 Generated: ${new Date().toISOString()}`,
        `📊 Total USER tests: ${this.results.filter(r => r.role === 'USER').length}`,
        `✅ USER passed: ${this.results.filter(r => r.role === 'USER' && r.success).length}`,
        `❌ USER failed: ${this.results.filter(r => r.role === 'USER' && !r.success).length}`,
        '='.repeat(80),
        '',
        ...this.userLog,
        '',
        '='.repeat(80),
        'END OF USER ENDPOINTS LOG',
        '='.repeat(80)
      ].join('\n');

      fs.writeFileSync(userFilepath, userLogContent);
      console.log(`📄 User endpoints log saved: ${userFilepath}`);
    }
  }
}

// Export for use in other scripts
export { IndividualTestRunner };

// Run if called directly with module path argument
if (require.main === module) {
  const modulePath = process.argv[2];
  if (!modulePath) {
    console.error('❌ Usage: ts-node run-individual-test.ts <module-config-path>');
    process.exit(1);
  }

  const runner = new IndividualTestRunner();
  const fullPath = path.resolve(modulePath);
  runner.runModule(fullPath).catch(console.error);
}