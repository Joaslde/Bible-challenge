<template>
  <div class="fixed bottom-28 right-6 z-[60] flex items-center justify-end pointer-events-none">
    <div 
      class="flex items-center bg-white shadow-2xl rounded-full border border-slate-100 transition-all duration-500 ease-out pointer-events-auto"
      :class="isOpen ? 'w-[75vw] max-w-[280px] px-4 py-2' : 'w-14 h-14 justify-center'"
    >
      <input 
        v-if="isOpen"
        v-model="query"
        id="search-input"
        name="search-query"
        type="text"
        placeholder="Chercher un nom..."
        class="flex-1 bg-transparent border-none outline-none text-slate-700 font-medium ml-2 text-sm"
        @input="$emit('search', query.toLowerCase())"
        ref="searchInputField"
      />

      <button @click="toggleSearch" class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-indigo-600">
        <X v-if="isOpen" class="w-6 h-6 text-slate-400" />
        <Search v-else class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { Search, X } from 'lucide-vue-next'

const isOpen = ref(false)
const query = ref('')
const searchInput = ref(null)

const toggleSearch = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => searchInput.value?.focus())
  } else {
    query.value = ''
    // Optionnel : émettre une recherche vide pour réinitialiser
  }
}

defineEmits(['search'])
</script>