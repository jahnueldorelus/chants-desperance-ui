import { Book } from "@app-types/entities/books";
import { apiService } from "@services/api";
import { isAxiosError } from "axios";

class BookService {
  private books: Book[] | null;

  constructor() {
    this.books = null;
  }

  /**
   * Retrieves the list of all books.
   */
  async getAllBooks() {
    if (this.books) {
      return this.books;
    }

    const response = await apiService.request<Book[]>(
      apiService.routes.get.books.all
    );

    if (isAxiosError(response)) {
      return null;
    } else {
      this.books = response.data;
      return response.data;
    }
  }

  /**
   * Retrieves a single book.
   */
  async getBookById(bookId: string) {
    const response = await apiService.request<Book>(
      apiService.routes.get.books.byId.concat(bookId)
    );

    if (isAxiosError(response)) {
      return null;
    } else {
      return response.data;
    }
  }

  /**
   * Retrieves the language of a book.
   */
  getBookLanguage(book: Book) {
    if (book.lang === "fr") {
      return "French";
    } else if (book.lang === "kr") {
      return "Kreyol";
    } else {
      return "Kreyol and French";
    }
  }

  /**
   * Finds a book by book id.
   */
  findBookById(
    books: Book[] | null | undefined,
    bookId: string | null
  ): Book | null {
    if (!books) {
      return null;
    }

    const foundBook = books.find((book) => book._id === bookId);
    return foundBook || null;
  }
}

export const bookService = new BookService();
