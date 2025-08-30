import { DataSource } from 'typeorm';
import { BookGenre } from '../../modules/book-genres/entities/book-genre.entity';
import { BookAuthor } from '../../modules/book-authors/entities/book-author.entity';
import { PublishingHouse } from '../../modules/publishing-houses/entities/publishing-house.entity';
import { BookCatalog } from '../../modules/book-catalog/entities/book-catalog.entity';
import { BookAuthorAssignment } from '../../modules/book-author-assignments/entities/book-author-assignment.entity';

export class PopulateSeed {
  async run(dataSource: DataSource): Promise<void> {
    console.log('📚 Insertando géneros de libros...');
    await this.seedBookGenres(dataSource);
    console.log('✅ Géneros insertados correctamente');

    console.log('✍️ Insertando autores...');
    await this.seedAuthors(dataSource);
    console.log('✅ Autores insertados correctamente');

    console.log('🏢 Insertando editoriales...');
    await this.seedPublishingHouses(dataSource);
    console.log('✅ Editoriales insertadas correctamente');

    console.log('📖 Insertando catálogo de libros...');
    await this.seedBookCatalog(dataSource);
    console.log('✅ Libros insertados correctamente');

    console.log('🔗 Creando asignaciones autor-libro...');
    await this.seedBookAuthorAssignments(dataSource);
    console.log('✅ Asignaciones autor-libro creadas correctamente');
  }

  private async seedBookGenres(dataSource: DataSource): Promise<void> {
    const genreRepository = dataSource.getRepository(BookGenre);

    const genres = [
      { name: 'Ficción', description: 'Historias ficticias' },
      { name: 'No Ficción', description: 'Basados en hechos reales' },
      { name: 'Ciencia', description: 'Libros de ciencia' },
      { name: 'Historia', description: 'Libros históricos' },
      { name: 'Fantasía', description: 'Historias fantásticas' },
      { name: 'Biografía', description: 'Vida de personas' },
      { name: 'Tecnología', description: 'Avances tecnológicos' },
      { name: 'Romance', description: 'Historias románticas' },
      { name: 'Aventura', description: 'Libros de aventuras' },
      { name: 'Misterio', description: 'Libros de misterio' },
      { name: 'Educación', description: 'Textos educativos' },
      { name: 'Arte', description: 'Obras y teoría del arte' },
      { name: 'Infantil', description: 'Cuentos para niños' },
      { name: 'Poesía', description: 'Colección de poemas' },
      { name: 'Autoayuda', description: 'Crecimiento personal' },
    ];

    let genreCount = 0;
    for (const genreData of genres) {
      const existingGenre = await genreRepository.findOne({ where: { name: genreData.name } });
      if (!existingGenre) {
        const genre = genreRepository.create(genreData);
        await genreRepository.save(genre);
        genreCount++;
      }
    }
    console.log(`   💾 ${genreCount} géneros nuevos insertados`);
  }

  private async seedAuthors(dataSource: DataSource): Promise<void> {
    const authorRepository = dataSource.getRepository(BookAuthor);

    const authors = [
      {
        firstName: 'Juan',
        lastName: 'Pérez',
        nationality: 'Colombiana',
        birthDate: new Date('1975-05-12'),
        biography: 'Autor colombiano de ficción.',
      },
      {
        firstName: 'María',
        lastName: 'Gómez',
        nationality: 'Mexicana',
        birthDate: new Date('1980-08-22'),
        biography: 'Escritora de novelas románticas.',
      },
      {
        firstName: 'Luis',
        lastName: 'Martínez',
        nationality: 'Argentina',
        birthDate: new Date('1965-03-15'),
        biography: 'Experto en historia.',
      },
      {
        firstName: 'Ana',
        lastName: 'López',
        nationality: 'Española',
        birthDate: new Date('1990-07-09'),
        biography: 'Poeta contemporánea.',
      },
      {
        firstName: 'Pedro',
        lastName: 'Ramírez',
        nationality: 'Chilena',
        birthDate: new Date('1988-11-30'),
        biography: 'Escritor de ciencia ficción.',
      },
      {
        firstName: 'Laura',
        lastName: 'Torres',
        nationality: 'Peruana',
        birthDate: new Date('1972-06-14'),
        biography: 'Autora infantil.',
      },
      {
        firstName: 'Carlos',
        lastName: 'Fernández',
        nationality: 'Uruguaya',
        birthDate: new Date('1977-02-03'),
        biography: 'Ensayista y periodista.',
      },
      {
        firstName: 'Elena',
        lastName: 'Díaz',
        nationality: 'Colombiana',
        birthDate: new Date('1985-04-25'),
        biography: 'Especialista en biografías.',
      },
      {
        firstName: 'Andrés',
        lastName: 'Castro',
        nationality: 'Venezolana',
        birthDate: new Date('1992-01-17'),
        biography: 'Novelista joven.',
      },
      {
        firstName: 'Sofía',
        lastName: 'Rojas',
        nationality: 'Ecuatoriana',
        birthDate: new Date('1995-09-12'),
        biography: 'Autora de fantasía.',
      },
      {
        firstName: 'Diego',
        lastName: 'Herrera',
        nationality: 'Colombiana',
        birthDate: new Date('1971-12-05'),
        biography: 'Escritor de educación.',
      },
      {
        firstName: 'Valentina',
        lastName: 'Mendoza',
        nationality: 'Boliviana',
        birthDate: new Date('1982-07-07'),
        biography: 'Poeta.',
      },
      {
        firstName: 'Miguel',
        lastName: 'Vega',
        nationality: 'Española',
        birthDate: new Date('1960-10-18'),
        biography: 'Historiador.',
      },
      {
        firstName: 'Camila',
        lastName: 'Morales',
        nationality: 'Chilena',
        birthDate: new Date('1987-02-28'),
        biography: 'Autora de misterio.',
      },
      {
        firstName: 'Jorge',
        lastName: 'Navarro',
        nationality: 'Argentina',
        birthDate: new Date('1993-11-11'),
        biography: 'Novelista emergente.',
      },
    ];

    let authorCount = 0;
    for (const authorData of authors) {
      const existingAuthor = await authorRepository.findOne({
        where: {
          firstName: authorData.firstName,
          lastName: authorData.lastName,
        },
      });
      if (!existingAuthor) {
        const author = authorRepository.create(authorData);
        await authorRepository.save(author);
        authorCount++;
      }
    }
    console.log(`   💾 ${authorCount} autores nuevos insertados`);
  }

  private async seedPublishingHouses(dataSource: DataSource): Promise<void> {
    const publishingHouseRepository = dataSource.getRepository(PublishingHouse);

    const publishers = [
      { name: 'Planeta', country: 'España', website_url: 'https://www.planetadelibros.com' },
      { name: 'Alfaguara', country: 'México', website_url: 'https://www.alfaguara.com' },
      { name: 'Norma', country: 'Colombia', website_url: 'https://www.norma.com' },
      { name: 'Santillana', country: 'Argentina', website_url: 'https://www.santillana.com' },
      { name: 'Siglo XXI', country: 'México', website_url: 'https://www.sigloxxieditores.com' },
      { name: 'Anagrama', country: 'España', website_url: 'https://www.anagrama-ed.es' },
      { name: 'SM', country: 'España', website_url: 'https://www.grupo-sm.com' },
      { name: 'Random House', country: 'EEUU', website_url: 'https://www.penguinrandomhouse.com' },
      { name: 'Oceano', country: 'México', website_url: 'https://www.oceano.com' },
      { name: 'Debolsillo', country: 'España', website_url: 'https://www.debolsillo.com' },
      { name: 'Ariel', country: 'España', website_url: 'https://www.ariel.com' },
      { name: 'Paidós', country: 'Argentina', website_url: 'https://www.paidos.com' },
      { name: 'Universidad Nacional', country: 'Colombia', website_url: 'https://unal.edu.co' },
      { name: 'Taurus', country: 'México', website_url: 'https://www.taurus.com' },
      { name: 'McGraw Hill', country: 'EEUU', website_url: 'https://www.mheducation.com' },
    ];

    let publisherCount = 0;
    for (const publisherData of publishers) {
      const existingPublisher = await publishingHouseRepository.findOne({
        where: { name: publisherData.name },
      });
      if (!existingPublisher) {
        const publisher = publishingHouseRepository.create(publisherData);
        await publishingHouseRepository.save(publisher);
        publisherCount++;
      }
    }
    console.log(`   💾 ${publisherCount} editoriales nuevas insertadas`);
  }

  private async seedBookCatalog(dataSource: DataSource): Promise<void> {
    const bookRepository = dataSource.getRepository(BookCatalog);
    const genreRepository = dataSource.getRepository(BookGenre);
    const publisherRepository = dataSource.getRepository(PublishingHouse);

    const genres = await genreRepository.find();
    const publishers = await publisherRepository.find();

    const books = [
      {
        title: 'El viaje de la vida',
        isbnCode: '9780000000011',
        price: 19000.99,
        stockQuantity: 50,
        coverImageUrl: 'https://picsum.photos/200?1',
        publicationDate: new Date('2015-01-10'),
        pageCount: 320,
        summary: 'Una historia inspiradora.',
      },
      {
        title: 'La ciencia del futuro',
        isbnCode: '9780000000022',
        price: 25000.5,
        stockQuantity: 30,
        coverImageUrl: 'https://picsum.photos/200?2',
        publicationDate: new Date('2018-05-22'),
        pageCount: 280,
        summary: 'Libro sobre avances científicos.',
      },
      {
        title: 'Historias perdidas',
        isbnCode: '9780000000033',
        price: 15000.75,
        stockQuantity: 40,
        coverImageUrl: 'https://picsum.photos/200?3',
        publicationDate: new Date('2020-11-11'),
        pageCount: 200,
        summary: 'Relatos históricos.',
      },
      {
        title: 'Amor eterno',
        isbnCode: '9780000000044',
        price: 18000.2,
        stockQuantity: 60,
        coverImageUrl: 'https://picsum.photos/200?4',
        publicationDate: new Date('2019-02-14'),
        pageCount: 250,
        summary: 'Novela romántica.',
      },
      {
        title: 'El misterio de la cueva',
        isbnCode: '9780000000055',
        price: 22000.1,
        stockQuantity: 35,
        coverImageUrl: 'https://picsum.photos/200?5',
        publicationDate: new Date('2016-09-05'),
        pageCount: 300,
        summary: 'Misterio en un pueblo pequeño.',
      },
      {
        title: 'Fantasía en el bosque',
        isbnCode: '9780000000066',
        price: 21000.4,
        stockQuantity: 45,
        coverImageUrl: 'https://picsum.photos/200?6',
        publicationDate: new Date('2021-03-03'),
        pageCount: 280,
        summary: 'Aventura fantástica.',
      },
      {
        title: 'La mente creativa',
        isbnCode: '9780000000077',
        price: 30000.0,
        stockQuantity: 20,
        coverImageUrl: 'https://picsum.photos/200?7',
        publicationDate: new Date('2017-07-20'),
        pageCount: 350,
        summary: 'Ensayo sobre creatividad.',
      },
      {
        title: 'Biografía de un soñador',
        isbnCode: '9780000000088',
        price: 24000.9,
        stockQuantity: 25,
        coverImageUrl: 'https://picsum.photos/200?8',
        publicationDate: new Date('2014-04-04'),
        pageCount: 270,
        summary: 'Vida de un autor famoso.',
      },
      {
        title: 'Arte y cultura',
        isbnCode: '9780000000099',
        price: 28000.0,
        stockQuantity: 15,
        coverImageUrl: 'https://picsum.photos/200?9',
        publicationDate: new Date('2013-12-01'),
        pageCount: 310,
        summary: 'Exploración del arte moderno.',
      },
      {
        title: 'Educación para todos',
        isbnCode: '9780000000100',
        price: 20000.0,
        stockQuantity: 55,
        coverImageUrl: 'https://picsum.photos/200?10',
        publicationDate: new Date('2022-01-01'),
        pageCount: 290,
        summary: 'Manual educativo.',
      },
      {
        title: 'El poder de la mente',
        isbnCode: '9780000000111',
        price: 23000.75,
        stockQuantity: 33,
        coverImageUrl: 'https://picsum.photos/200?11',
        publicationDate: new Date('2016-08-19'),
        pageCount: 240,
        summary: 'Libro de autoayuda.',
      },
      {
        title: 'Poemas del alma',
        isbnCode: '9780000000122',
        price: 14000.9,
        stockQuantity: 38,
        coverImageUrl: 'https://picsum.photos/200?12',
        publicationDate: new Date('2019-09-21'),
        pageCount: 180,
        summary: 'Colección de poesía.',
      },
      {
        title: 'Cuentos mágicos',
        isbnCode: '9780000000133',
        price: 16000.8,
        stockQuantity: 42,
        coverImageUrl: 'https://picsum.photos/200?13',
        publicationDate: new Date('2018-06-06'),
        pageCount: 210,
        summary: 'Relatos infantiles.',
      },
      {
        title: 'Historia universal',
        isbnCode: '9780000000144',
        price: 27000.6,
        stockQuantity: 28,
        coverImageUrl: 'https://picsum.photos/200?14',
        publicationDate: new Date('2012-10-30'),
        pageCount: 400,
        summary: 'Libro histórico.',
      },
      {
        title: 'Tecnología y futuro',
        isbnCode: '9780000000155',
        price: 26000.5,
        stockQuantity: 22,
        coverImageUrl: 'https://picsum.photos/200?15',
        publicationDate: new Date('2021-12-25'),
        pageCount: 330,
        summary: 'Innovaciones tecnológicas.',
      },
    ];

    let bookCount = 0;
    for (const bookData of books) {
      const existingBook = await bookRepository.findOne({ where: { isbnCode: bookData.isbnCode } });
      if (!existingBook) {
        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        const randomPublisher = publishers[Math.floor(Math.random() * publishers.length)];

        const book = bookRepository.create({
          ...bookData,
          isAvailable: true,
          genre: randomGenre,
          publisher: randomPublisher,
        });

        await bookRepository.save(book);
        bookCount++;
      }
    }
    console.log(`   💾 ${bookCount} libros nuevos insertados`);
  }

  private async seedBookAuthorAssignments(dataSource: DataSource): Promise<void> {
    const assignmentRepository = dataSource.getRepository(BookAuthorAssignment);
    const bookRepository = dataSource.getRepository(BookCatalog);
    const authorRepository = dataSource.getRepository(BookAuthor);

    const books = await bookRepository.find({ take: 15 });
    const authors = await authorRepository.find();

    let assignmentCount = 0;
    for (const book of books) {
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];

      const existingAssignment = await assignmentRepository.findOne({
        where: {
          book: { id: book.id },
          author: { id: randomAuthor.id },
        },
      });

      if (!existingAssignment) {
        const assignment = assignmentRepository.create({
          book: book,
          author: randomAuthor,
        });

        await assignmentRepository.save(assignment);
        assignmentCount++;
      }
    }
    console.log(`   💾 ${assignmentCount} asignaciones nuevas creadas`);
  }
}
