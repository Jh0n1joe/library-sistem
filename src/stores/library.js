import { defineStore } from 'pinia'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    books: []
  }),

  actions: {

    // 📚 agregar libro
    addBook(book) {

      this.books.push({
        ...book,
        id: Date.now(),
        copies: book.copies || [
          {
            id: Date.now(),
            status: 'available',
            borrower: null,
            cedula: null,
            borrowDate: null,
            dueDate: null
          }
        ]
      })
    },

    // ➕ agregar copia
    addCopy(bookId) {

      const book = this.books.find(b => b.id === bookId)
      if (!book) return

      book.copies.push({
        id: Date.now(),
        status: 'available',
        borrower: null,
        cedula: null,
        borrowDate: null,
        dueDate: null
      })
    },

    // ➖ eliminar copia
    removeCopy(bookId, copyId) {

      const book = this.books.find(b => b.id === bookId)
      if (!book) return

      book.copies = book.copies.filter(c => c.id !== copyId)

      // 📌 eliminar libro si no quedan copias
      if (book.copies.length === 0) {
        this.books = this.books.filter(b => b.id !== bookId)
      }
    },

    // 📕 PRESTAR LIBRO (desde modal)
    loanCopy(bookId, copyId, loanData) {

      const book = this.books.find(b => b.id === bookId)
      if (!book) return

      const copy = book.copies.find(c => c.id === copyId)
      if (!copy) return

      copy.status = 'borrowed'
      copy.borrower = loanData.name
      copy.cedula = loanData.cedula
      copy.borrowDate = new Date().toISOString().split('T')[0]
      copy.dueDate = loanData.dueDate
    },

    // 📤 DEVOLVER LIBRO
    returnCopy(bookId, copyId) {

      const book = this.books.find(b => b.id === bookId)
      if (!book) return

      const copy = book.copies.find(c => c.id === copyId)
      if (!copy) return

      copy.status = 'available'
      copy.borrower = null
      copy.cedula = null
      copy.borrowDate = null
      copy.dueDate = null
    },

    // ⏳ DETECTAR VENCIDOS
    checkOverdue() {

      const today = new Date()

      this.books.forEach(book => {
        book.copies.forEach(copy => {

          if (
            copy.status === 'borrowed' &&
            copy.dueDate
          ) {
            const due = new Date(copy.dueDate.replace(/-/g, '/'))

            if (due < today) {
              copy.status = 'overdue'
            }
          }

        })
      })
    }

  }
})
