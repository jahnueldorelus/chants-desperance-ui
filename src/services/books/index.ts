import { Book } from "@app-types/entities/books";
import { apiService } from "@services/api";
import { isAxiosError } from "axios";

class BookService {
  /**
   * Retrieves the list of all books.
   */
  async getAllBooks() {
    const response = await apiService.request<Book[]>(
      apiService.routes.get.books.all
    );

    if (isAxiosError(response)) {
      return null;
    } else {
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
  getBookLanguage = (book: Book) => {
    if (book.lang === "fr") {
      return "French";
    } else if (book.lang === "kr") {
      return "Kreyol";
    } else {
      return "Kreyol and French";
    }
  };
}

export const bookService = new BookService();
