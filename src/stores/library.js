import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    books: []
  }),

  actions: {
    // 📥 1. CARGAR LIBROS Y SUS COPIAS DESDE SUPABASE
    async fetchBooks() {
      const { data, error } = await supabase
        .from('books')
        .select(`
          id, title, editor, category, shelf,
          copies ( id, book_id, status, borrower, cedula, borrow_date, due_date )
        `)

      if (error) {
        console.error('Error cargando libros:', error.message)
        return
      }

      this.books = data.map(book => ({
        id: book.id,
        title: book.title,
        editor: book.editor,
        category: book.category,
        shelf: book.shelf,
        copies: book.copies ? book.copies.map(c => ({
          id: c.id,
          status: c.status,
          borrower: c.borrower,
          cedula: c.cedula,
          borrowDate: c.borrow_date,
          dueDate: c.due_date
        })) : []
      }))
    },

    // ➕ 2. AGREGAR UN NUEVO LIBRO (Y SU COPIA INICIAL)
    async addBook(bookData) {
      // Insertamos en la tabla 'books'
      const { data: newBook, error: bookError } = await supabase
        .from('books')
        .insert([{
          title: bookData.title,
          editor: bookData.editor,
          category: bookData.category,
          shelf: bookData.shelf
        }])
        .select()

      if (bookError) {
        console.error('Error crítico al crear libro en Supabase:', bookError.message)
        alert('Error al crear libro: ' + bookError.message)
        return
      }

      // Supabase select() devuelve un array, tomamos el primer elemento
      const createdBook = newBook[0]

      // Insertamos automáticamente su primera copia física usando el ID del libro creado
      const { data: newCopy, error: copyError } = await supabase
        .from('copies')
        .insert([{
          book_id: createdBook.id,
          status: 'available'
        }])
        .select()

      if (copyError) {
        console.error('Error crítico al crear copia inicial en Supabase:', copyError.message)
        alert('Error al crear la copia física: ' + copyError.message)
        return
      }

      const createdCopy = newCopy[0]

      // Empujamos el objeto formateado al estado local de Pinia
      this.books.push({
        id: createdBook.id,
        title: createdBook.title,
        editor: createdBook.editor,
        category: createdBook.category,
        shelf: createdBook.shelf,
        copies: [{
          id: createdCopy.id,
          status: createdCopy.status,
          borrower: null,
          cedula: null,
          borrowDate: null,
          dueDate: null
        }]
      })
    },

    // ➕ 3. AGREGAR UNA COPIA EXTRA
    async addCopy(bookId) {
      const { data, error } = await supabase
        .from('copies')
        .insert([{ book_id: bookId, status: 'available' }])
        .select()

      if (error) {
        console.error('Error al añadir copia:', error.message)
        return
      }

      const book = this.books.find(b => b.id === bookId)
      if (book) {
        const createdCopy = data[0]
        book.copies.push({
          id: createdCopy.id,
          status: createdCopy.status,
          borrower: null,
          cedula: null,
          borrowDate: null,
          dueDate: null
        })
      }
    },

    // ➖ 4. ELIMINAR COPIA
    async removeCopy(bookId, copyId) {
      const { error } = await supabase
        .from('copies')
        .delete()
        .eq('id', copyId)

      if (error) {
        console.error('Error al remover copia:', error.message)
        return
      }

      const book = this.books.find(b => b.id === bookId)
      if (!book) return

      book.copies = book.copies.filter(c => c.id !== copyId)

      if (book.copies.length === 0) {
        await supabase.from('books').delete().eq('id', bookId)
        this.books = this.books.filter(b => b.id !== bookId)
      }
    },

    // 📕 5. REGISTRAR UN PRÉSTAMO
    async loanCopy(bookId, copyId, loanData) {
      const borrowDateStr = new Date().toISOString().split('T')[0]

      const { error } = await supabase
        .from('copies')
        .update({
          status: 'borrowed',
          borrower: loanData.name,
          cedula: loanData.cedula,
          borrow_date: borrowDateStr,
          due_date: loanData.dueDate
        })
        .eq('id', copyId)

      if (error) {
        console.error('Error en préstamo:', error.message)
        return
      }

      const book = this.books.find(b => b.id === bookId)
      if (!book) return
      const copy = book.copies.find(c => c.id === copyId)
      if (!copy) return

      copy.status = 'borrowed'
      copy.borrower = loanData.name
      copy.cedula = loanData.cedula
      copy.borrowDate = borrowDateStr
      copy.dueDate = loanData.dueDate
    },

    // 📤 6. DEVOLVER LIBRO
    async returnCopy(bookId, copyId) {
      const { error } = await supabase
        .from('copies')
        .update({
          status: 'available',
          borrower: null,
          cedula: null,
          borrow_date: null,
          due_date: null
        })
        .eq('id', copyId)

      if (error) {
        console.error('Error al devolver copia:', error.message)
        return
      }

      const book = this.books.find(b => b.id === bookId)
      if (!book) return
      const copy = book.copies.find(c => c.id === copyId)
      if (!copy) return

      copy.status = 'available'
      copy.borrower = null
      copy.cedula = null
      copy.borrowDate = null
      copy.dueDate = null
    }
  }
})
