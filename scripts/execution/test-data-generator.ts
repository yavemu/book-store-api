/**
 * GENERADOR DE DATOS DE PRUEBA ÚNICOS
 * Genera datos únicos para cada ejecución de tests para evitar conflictos de duplicados
 */

export class TestDataGenerator {
  private static instance: TestDataGenerator;
  public executionId: string;
  private timestamp: string;

  private constructor() {
    // Generar ID único para esta ejecución
    this.timestamp = new Date().getTime().toString();
    this.executionId = Math.random().toString(36).substring(2, 8);
  }

  public static getInstance(): TestDataGenerator {
    if (!TestDataGenerator.instance) {
      TestDataGenerator.instance = new TestDataGenerator();
    }
    return TestDataGenerator.instance;
  }

  /**
   * Genera un email único
   */
  public generateUniqueEmail(prefix: string = 'test'): string {
    return `${prefix}.${this.executionId}.${this.timestamp}@test.com`;
  }

  /**
   * Genera un username único (limitado a tamaños válidos)
   */
  public generateUniqueUsername(prefix: string = 'user'): string {
    const baseUsername = `${prefix}_${this.executionId}`;
    // Limitar a 50 caracteres para cumplir validaciones típicas
    return baseUsername.length > 50 ? baseUsername.substring(0, 50) : baseUsername;
  }

  /**
   * Genera un nombre único
   */
  public generateUniqueName(prefix: string = 'Test'): string {
    return `${prefix} ${this.executionId} ${Date.now()}`;
  }

  /**
   * Genera un ID numérico aleatorio para pruebas de endpoints por ID
   */
  public generateRandomId(): number {
    return Math.floor(Math.random() * 999999) + 100000;
  }

  /**
   * Genera un UUID válido pero inexistente para tests de "not found"
   */
  public generateNonExistentUUID(): string {
    return `99999999-${this.executionId.substring(0, 4)}-4${this.executionId.substring(4, 7)}-9999-${this.timestamp.substring(0, 12)}`;
  }

  /**
   * Genera un UUID válido para tests que requieren IDs existentes
   */
  public generateValidId(): string {
    // UUIDs de entidades que existen en la base de datos de prueba
    const validIds = [
      '12345678-1234-5678-9012-123456789012', // book-genres
      '67890123-4567-8901-2345-678901234567', // book-authors  
      '34567890-3456-7890-1234-567890123456', // publishing-houses
      '56789012-5678-9012-3456-789012345678', // users
      '78901234-7890-1234-5678-901234567890'  // generic valid ID
    ];
    
    return validIds[Math.floor(Math.random() * validIds.length)];
  }

  /**
   * Genera datos de usuario únicos para registro
   */
  public generateUniqueUserData() {
    // Para login, usar credenciales fijas
    return {
      email: 'user@demo.com',
      password: 'demodemo',
      username: 'user@demo.com'  // Username field for login compatibility
    };
  }

  /**
   * Genera datos únicos para registro de nuevos usuarios
   */
  public generateUniqueRegistrationData() {
    const uniqueEmail = this.generateUniqueEmail('register');
    const uniqueUsername = `user_${this.executionId}_${Date.now()}`;
    
    return {
      email: uniqueEmail,
      password: 'TestPassword123!',
      username: uniqueUsername.length > 50 ? uniqueUsername.substring(0, 50) : uniqueUsername
    };
  }

  /**
   * Genera datos de autor únicos (cumpliendo validaciones de tamaño)
   */
  public generateUniqueAuthorData() {
    const names = ['Gabriel', 'Isabel', 'Mario', 'Elena', 'Carlos', 'Ana'];
    const lastNames = ['García', 'Márquez', 'Vargas', 'Llosa', 'Cortázar', 'Borges'];
    const nationalities = ['Colombian', 'Peruvian', 'Argentine', 'Mexican', 'Spanish', 'Chilean'];
    
    const firstName = names[Math.floor(Math.random() * names.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
    
    // Generar nombres que cumplan validaciones (no muy largos)
    const uniqueFirstName = `${firstName} ${this.executionId.substring(0, 3)}`;
    const uniqueLastName = `${lastName} ${this.executionId.substring(3, 6)}`;
    
    return {
      firstName: uniqueFirstName.length > 50 ? uniqueFirstName.substring(0, 50) : uniqueFirstName,
      lastName: uniqueLastName.length > 50 ? uniqueLastName.substring(0, 50) : uniqueLastName,
      nationality: nationality,
      biography: `Test biography for ${firstName} ${lastName} - Generated ${this.executionId}`.length > 500 ? 
        `Test author biography - ID: ${this.executionId}` : 
        `Test biography for ${firstName} ${lastName} - Generated ${this.executionId}`,
      birthDate: '1970-01-01' // Fecha fija válida
    };
  }

  /**
   * Genera datos de género únicos
   */
  public generateUniqueGenreData() {
    const genres = ['Fiction', 'Mystery', 'Romance', 'Thriller', 'Fantasy', 'Drama'];
    const baseGenre = genres[Math.floor(Math.random() * genres.length)];
    
    return {
      name: `${baseGenre} Test ${this.executionId}`,
      description: `Test description for ${baseGenre} genre - Generated at ${new Date().toISOString()}`
    };
  }

  /**
   * Genera datos de editorial únicos (version anterior removida)
   */

  /**
   * Genera datos de libro únicos
   */
  public generateUniqueBookData() {
    const titles = ['The Great', 'Mystery of', 'Adventures of', 'Tales of', 'Chronicles of'];
    const subjects = ['Tomorrow', 'the Unknown', 'the Past', 'Wonder', 'Dreams'];
    
    const titlePrefix = titles[Math.floor(Math.random() * titles.length)];
    const titleSuffix = subjects[Math.floor(Math.random() * subjects.length)];
    
    // Generar ISBN único (formato simple para tests)
    const isbn = `978-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9) + 1}`;
    
    return {
      isbn: isbn,
      title: `${titlePrefix} ${titleSuffix} Test ${this.executionId}`,
      description: `Test book description - Generated at ${new Date().toISOString()}`,
      publicationDate: new Date().toISOString().split('T')[0],
      pages: Math.floor(Math.random() * 500) + 100,
      price: (Math.random() * 50 + 10).toFixed(2),
      stock: Math.floor(Math.random() * 100) + 1
    };
  }

  /**
   * Genera datos únicos para editoriales
   */
  public generateUniquePublishingHouseData() {
    const names = [
      'Random House', 'Penguin Books', 'HarperCollins', 'Simon & Schuster',
      'Macmillan Publishers', 'Pearson Education', 'Scholastic',
      'Hachette Book Group', 'Springer', 'Wiley'
    ];
    
    const countries = [
      'United States', 'United Kingdom', 'Germany', 'France',
      'Canada', 'Australia', 'Netherlands', 'Spain'
    ];
    
    const baseName = names[Math.floor(Math.random() * names.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    
    const uniqueName = `${baseName} Test ${this.executionId.substring(0, 6)}`;
    
    return {
      name: uniqueName.length > 100 ? uniqueName.substring(0, 100) : uniqueName,
      country: country,
      websiteUrl: `https://www.${uniqueName.toLowerCase().replace(/\s+/g, '')}.com`
    };
  }

  /**
   * Genera datos de admin predefinidos
   */
  public generateUniqueAdminData() {
    return {
      email: 'admin@demo.com',
      password: 'demodemo',
      username: 'admin@demo.com'  // Username field for login compatibility
    };
  }

  /**
   * Genera datos únicos para creación de usuarios
   */
  public generateUniqueUserCreationData() {
    const baseUsername = `testuser_${this.executionId}`;
    const email = this.generateUniqueEmail('user');
    
    return {
      username: baseUsername.length > 50 ? baseUsername.substring(0, 50) : baseUsername,
      email: email,
      password: 'TestPassword123!'
    };
  }

  /**
   * Genera datos únicos para actualización de usuarios
   */
  public generateUniqueUserUpdateData() {
    const baseUsername = `updated_${this.executionId}`;
    const email = this.generateUniqueEmail('updated');
    
    return {
      username: baseUsername.length > 50 ? baseUsername.substring(0, 50) : baseUsername,
      email: email
    };
  }

  /**
   * Genera datos de búsqueda exacta únicos
   */
  public generateUniqueSearchData(searchField: string) {
    const searchValues: { [key: string]: string } = {
      'name': `Test Search ${this.executionId}`,
      'firstName': `Gabriel Test ${this.executionId}`,
      'lastName': `García Test ${this.executionId}`,
      'title': `Book Test ${this.executionId}`,
      'isbn': `978-${this.executionId}`,
      'nationality': 'Colombian'
    };

    return {
      searchField: searchField,
      searchValue: searchValues[searchField] || `Test ${this.executionId}`
    };
  }

  /**
   * Genera filtros simples únicos
   */
  public generateUniqueSimpleFilter() {
    return {
      name: `Test Filter ${this.executionId}`,
      page: 1,
      limit: 10
    };
  }

  /**
   * Genera filtros avanzados únicos
   */
  public generateUniqueAdvancedFilter() {
    return {
      name: `Advanced Test ${this.executionId}`,
      createdAfter: '2024-01-01',
      createdBefore: new Date().toISOString().split('T')[0],
      page: 1,
      limit: 10
    };
  }

  /**
   * Obtiene el execution ID para logging
   */
  public getExecutionId(): string {
    return this.executionId;
  }

  /**
   * Obtiene el timestamp para logging
   */
  public getTimestamp(): string {
    return this.timestamp;
  }

  /**
   * Genera datos inválidos para tests de validación
   */
  public generateInvalidData() {
    return {
      // Datos vacíos
      empty: {
        email: '',
        username: '',
        password: '',
        name: '',
        firstName: '',
        lastName: ''
      },
      
      // Datos demasiado cortos
      tooShort: {
        email: 'a',
        username: 'a',
        password: '1',
        name: 'a',
        firstName: 'a',
        lastName: 'a'
      },
      
      // Datos demasiado largos
      tooLong: {
        email: 'a'.repeat(300) + '@test.com',
        username: 'a'.repeat(300),
        password: 'a'.repeat(300),
        name: 'a'.repeat(300),
        firstName: 'a'.repeat(300),
        lastName: 'a'.repeat(300)
      },
      
      // Formatos inválidos
      invalidFormat: {
        email: 'not-an-email',
        isbn: 'invalid-isbn',
        date: 'not-a-date',
        number: 'not-a-number'
      }
    };
  }

  /**
   * Limpia los datos generados (para logging)
   */
  public logExecutionInfo(): void {
    console.log(`🎲 Test Data Generator - Execution ID: ${this.executionId}`);
    console.log(`📅 Timestamp: ${this.timestamp}`);
    console.log(`📧 Sample Email: ${this.generateUniqueEmail('sample')}`);
    console.log(`👤 Sample Username: ${this.generateUniqueUsername('sample')}\n`);
  }
}

// Export singleton instance
export const testDataGenerator = TestDataGenerator.getInstance();