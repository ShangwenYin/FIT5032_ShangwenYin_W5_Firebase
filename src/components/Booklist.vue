<script setup>
import { onMounted, ref } from 'vue'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../Firebase/init.js'

const books = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const editingId = ref(null)
const editIsbn = ref('')
const editName = ref('')
const busyId = ref(null)

const fetchBooks = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const booksQuery = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', 'asc'),
      limit(5),
    )
    const querySnapshot = await getDocs(booksQuery)

    books.value = querySnapshot.docs.map((bookDocument) => ({
      id: bookDocument.id,
      ...bookDocument.data(),
    }))
  } catch (error) {
    console.error('Error fetching books:', error)
    errorMessage.value = 'Unable to load books. Check the Firestore configuration.'
  } finally {
    isLoading.value = false
  }
}

const startEdit = (book) => {
  editingId.value = book.id
  editIsbn.value = String(book.isbn)
  editName.value = book.name
}

const cancelEdit = () => {
  editingId.value = null
  editIsbn.value = ''
  editName.value = ''
}

const saveBook = async (bookId) => {
  const isbnNumber = Number(editIsbn.value)
  const trimmedName = editName.value.trim()

  if (!Number.isFinite(isbnNumber) || !trimmedName) {
    errorMessage.value = 'Enter a valid ISBN and book name before saving.'
    return
  }

  busyId.value = bookId
  errorMessage.value = ''

  try {
    await updateDoc(doc(db, 'books', bookId), {
      isbn: isbnNumber,
      name: trimmedName,
    })
    cancelEdit()
    await fetchBooks()
  } catch (error) {
    console.error('Error updating book:', error)
    errorMessage.value = 'Unable to update the book.'
  } finally {
    busyId.value = null
  }
}

const removeBook = async (book) => {
  if (!window.confirm(`Delete "${book.name}"?`)) return

  busyId.value = book.id
  errorMessage.value = ''

  try {
    await deleteDoc(doc(db, 'books', book.id))
    await fetchBooks()
  } catch (error) {
    console.error('Error deleting book:', error)
    errorMessage.value = 'Unable to delete the book.'
  } finally {
    busyId.value = null
  }
}

onMounted(fetchBooks)

defineExpose({ fetchBooks })
</script>

<template>
  <section class="content-panel" aria-labelledby="book-list-title">
    <div class="list-heading">
      <div>
        <h2 id="book-list-title">Books with ISBN &gt; 1000</h2>
        <p class="text-secondary mb-0">First five records, ordered by ISBN.</p>
      </div>
      <button class="btn btn-outline-secondary btn-sm" type="button" :disabled="isLoading" @click="fetchBooks">
        Refresh
      </button>
    </div>

    <p v-if="errorMessage" class="alert alert-danger mt-3 mb-0" role="alert">
      {{ errorMessage }}
    </p>

    <div v-if="isLoading" class="loading-state" role="status">
      <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
      Loading books...
    </div>

    <p v-else-if="books.length === 0" class="empty-state mb-0">
      No books with an ISBN greater than 1000 have been added yet.
    </p>

    <div v-else class="table-responsive mt-3">
      <table class="table align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">ISBN</th>
            <th scope="col">Book name</th>
            <th class="actions-column" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <template v-if="editingId === book.id">
              <td>
                <input v-model="editIsbn" class="form-control form-control-sm" type="number" aria-label="Edit ISBN" />
              </td>
              <td>
                <input v-model="editName" class="form-control form-control-sm" type="text" aria-label="Edit book name" maxlength="160" />
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-success btn-sm" type="button" :disabled="busyId === book.id" @click="saveBook(book.id)">
                    Save
                  </button>
                  <button class="btn btn-outline-secondary btn-sm" type="button" :disabled="busyId === book.id" @click="cancelEdit">
                    Cancel
                  </button>
                </div>
              </td>
            </template>
            <template v-else>
              <td>{{ book.isbn }}</td>
              <td class="book-name">{{ book.name }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-outline-primary btn-sm" type="button" :disabled="busyId !== null" @click="startEdit(book)">
                    Edit
                  </button>
                  <button class="btn btn-outline-danger btn-sm" type="button" :disabled="busyId !== null" @click="removeBook(book)">
                    Delete
                  </button>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.list-heading {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.list-heading h2 {
  font-size: 1.15rem;
  margin-bottom: 0.25rem;
}

.loading-state,
.empty-state {
  color: #64748b;
  padding: 2.5rem 0 1rem;
  text-align: center;
}

.loading-state {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.actions-column {
  width: 180px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.book-name {
  font-weight: 600;
}

@media (max-width: 575px) {
  .actions-column {
    width: 150px;
  }

  .action-buttons {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
