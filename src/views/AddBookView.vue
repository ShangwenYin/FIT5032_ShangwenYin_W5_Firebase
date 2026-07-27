    <script setup>
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import BookList from '../components/Booklist.vue'
import { db } from '../Firebase/init.js'

const isbn = ref('')
const name = ref('')
const isSaving = ref(false)
const message = ref('')
const messageType = ref('success')
const bookList = ref(null)

const addBook = async () => {
  message.value = ''
  const isbnNumber = Number(isbn.value)
  const trimmedName = name.value.trim()

  if (!Number.isFinite(isbnNumber) || !trimmedName) {
    messageType.value = 'danger'
    message.value = 'Enter a valid ISBN and book name.'
    return
  }

  isSaving.value = true

  try {
    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: trimmedName,
    })

    isbn.value = ''
    name.value = ''
    messageType.value = 'success'
    message.value = 'Book added successfully.'
    await bookList.value?.fetchBooks()
  } catch (error) {
    console.error('Error adding book:', error)
    messageType.value = 'danger'
    message.value = 'Unable to add the book. Check the Firestore configuration.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <main class="page-shell">
    <div class="container lab-container">
      <header class="page-heading">
        <p class="section-label">Firestore library</p>
        <h1 class="page-title mb-2">Add a book</h1>
        <p class="text-secondary mb-0">Create and manage book records stored in Firestore.</p>
      </header>

      <section class="content-panel add-book-panel" aria-labelledby="add-book-form-title">
        <h2 id="add-book-form-title">Book details</h2>

        <form class="book-form" @submit.prevent="addBook">
          <div>
            <label class="form-label" for="isbn">ISBN</label>
            <input
              id="isbn"
              v-model="isbn"
              class="form-control"
              type="number"
              inputmode="numeric"
              placeholder="e.g. 9780132350884"
              required
            />
          </div>

          <div>
            <label class="form-label" for="name">Book name</label>
            <input
              id="name"
              v-model="name"
              class="form-control"
              type="text"
              placeholder="e.g. Clean Code"
              maxlength="160"
              required
            />
          </div>

          <button class="btn btn-primary submit-button" type="submit" :disabled="isSaving">
            <span v-if="isSaving" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            {{ isSaving ? 'Adding...' : 'Add book' }}
          </button>
        </form>

        <p v-if="message" class="alert mb-0 mt-3" :class="`alert-${messageType}`" role="status">
          {{ message }}
        </p>
      </section>

      <BookList ref="bookList" />
    </div>
  </main>
</template>

<style scoped>
.lab-container {
  max-width: 980px;
}

.page-heading {
  margin-bottom: 1.5rem;
}

.section-label {
  color: #b42318;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}

.add-book-panel {
  margin-bottom: 1.5rem;
}

.add-book-panel h2 {
  font-size: 1.15rem;
  margin-bottom: 1.1rem;
}

.book-form {
  align-items: end;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr) auto;
}

.submit-button {
  min-height: 38px;
  min-width: 112px;
}

@media (max-width: 767px) {
  .book-form {
    align-items: stretch;
    grid-template-columns: 1fr;
  }

  .submit-button {
    width: 100%;
  }
}
</style>
