import { defineStore } from 'pinia'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    books: []
  }),

  actions: {

    // 📚 agregar libro o sumar copia si ya existe
    addBook(book) {
      const existingBook = this.books.find(
        b => b.title.toLowerCase().trim() === book.title.toLowerCase().trim()
      )

      // 📦 si ya existe → agregar copia
      if (existingBook) {
        existingBook.copies.push({
          id: Date.now(),
          status: 'available',
          borrower: null,
          date: null
        })

        return
      }

      // 📖 crear nuevo libro
      this.books.push({
        ...book,

        copies: [
          {
            id: Date.now(),
            status: 'available',
            borrower: null,
            date: null
          }
        ]
      })
    },

    // ➕ agregar copia manual
    addCopy(bookIndex) {
      this.books[bookIndex].copies.push({
        id: Date.now(),
        status: 'available',
        borrower: null,
        date: null
      })
    },

    // ➖ eliminar SOLO copia disponible
    removeCopy(bookIndex) {
      const book = this.books[bookIndex]

      // 🚫 no eliminar si solo queda 1 copia
      if (book.copies.length === 1) {
        return
      }

      // 🔎 buscar una disponible
      const availableIndex = book.copies.findIndex(
        c => c.status === 'available'
      )

      // 🚫 si no hay disponibles
      if (availableIndex === -1) {
        return
      }

      // 🗑 eliminar copia
      book.copies.splice(availableIndex, 1)
    },

    // 🔄 cambiar estado de copia
    toggleCopyStatus(bookIndex, copyIndex) {
      const book = this.books[bookIndex]

      const copy = book.copies[copyIndex]

      // 🚫 protección
      if (!copy) return

      if (copy.status === 'available') {
        copy.status = 'borrowed'
        copy.borrower = 'Usuario'
        copy.date = new Date().toISOString().split('T')[0]
      } else {
        copy.status = 'available'
        copy.borrower = null
        copy.date = null
      }
    }
  }
})
