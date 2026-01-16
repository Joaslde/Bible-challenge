<template>
  <div class="max-w-md mx-auto p-4 pb-32 relative">
    <Transition name="fade">
      <div v-if="notification.show" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm relative animate-in zoom-in duration-300">
          <button @click="notification.show = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X class="w-6 h-6" />
          </button>

          <div class="text-center">
            <div :class="['w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4', notification.isError ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500']">
              <CheckCircle v-if="!notification.isError" class="w-10 h-10" />
              <AlertCircle v-else class="w-10 h-10" />
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">
              {{ notification.isError ? 'Oups !' : 'Félicitations !' }}
            </h3>
            <p class="text-slate-500 mb-6">{{ notification.message }}</p>
            
            <button 
              @click="notification.show = false"
              :class="['w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95', notification.isError ? 'bg-red-500' : 'bg-indigo-600']"
            >
              D'accord
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <header class="mb-8 mt-4">
      <h1 class="text-3xl font-bold text-slate-900">Saisie du jour</h1>
      <p class="text-slate-500">Sélectionnez un membre et enregistrez sa lecture.</p>
    </header>

    <div class="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
      <button 
        v-for="user in users" 
        :key="user.id"
        :id="'user-' + user.id" 
        @click="selectUser(user)"
        :class="[
          'flex-shrink-0 px-5 py-3 rounded-2xl font-semibold transition-all duration-200 border-2',
          selectedUser?.id === user.id 
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
            : 'bg-white border-transparent text-slate-600 hover:border-slate-200'
        ]"
      >
        {{ user.nom }}
      </button>
    </div>

    <div v-if="selectedUser" class="mt-8 flex flex-col items-center">
      <div class="text-center mb-6">
        <span class="text-sm font-medium text-slate-400 uppercase tracking-widest">Chapitres lus aujourd'hui</span>
        <h2 class="text-xl font-bold text-slate-800">{{ selectedUser.nom }}</h2>
      </div>

      <button @click="increment" :class="['w-48 h-48 rounded-full border-[12px] flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-90', counterColorClass]">
        <span class="text-6xl font-black mb-1">{{ count }}</span>
        <span class="text-sm font-bold opacity-80 uppercase">Chapitres</span>
      </button>

      <div class="mt-8 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
        <BookOpen class="w-4 h-4 text-indigo-500" />
        <span class="text-slate-700 font-medium">Position : {{ currentPositionLabel }}</span>
      </div>

      <div class="flex gap-4 mt-12 w-full">
        <button @click="resetCounter" class="flex-1 py-4 rounded-2xl bg-slate-200 text-slate-600 font-bold active:scale-95 transition-transform">Effacer</button>
        <button @click="saveToSupabase" :disabled="isSaving || count === 0" class="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50">
          <span v-if="!isSaving">Valider la lecture</span>
          <span v-else>Enregistrement...</span>
        </button>
      </div>
    </div>

    <div v-else class="mt-20 text-center text-slate-400 italic">
      <ArrowUp class="w-6 h-6 mx-auto mb-2 animate-bounce" />
      Choisissez un nom pour commencer
    </div>

    <FloatingSearch @search="handleSearch" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { BookOpen, ArrowUp, X, CheckCircle, AlertCircle } from 'lucide-vue-next'
import confetti from 'canvas-confetti'
import FloatingSearch from '../components/ui/FloatingSearch.vue'

const users = ref([])
const selectedUser = ref(null)
const count = ref(0)
const isSaving = ref(false)

// État de la notification
const notification = reactive({
  show: false,
  message: '',
  isError: false
})

const counterColorClass = computed(() => {
  if (count.value === 0) return 'bg-white border-slate-100 text-slate-300'
  if (count.value < 5) return 'bg-amber-50 border-amber-200 text-amber-600'
  if (count.value === 5) return 'bg-emerald-50 border-emerald-400 text-emerald-600'
  return 'bg-indigo-50 border-indigo-400 text-indigo-600'
})

const currentPositionLabel = computed(() => count.value === 0 ? "En attente" : `+${count.value} chapitres`)

const fetchUsers = async () => {
  const { data } = await supabase.from('users').select('*').order('nom')
  users.value = data
}

const selectUser = (user) => {
  selectedUser.value = user
  count.value = 0
}

const increment = () => {
  count.value++
  if (count.value === 5) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
}

const resetCounter = () => count.value = 0

const showPopup = (msg, error = false) => {
  notification.message = msg
  notification.isError = error
  notification.show = true
}

const saveToSupabase = async () => {
  isSaving.value = true
  const { error } = await supabase.from('daily_logs').upsert({ 
    user_id: selectedUser.value.id, 
    date: new Date().toISOString().split('T')[0],
    chapitres_lus: count.value 
  }, { onConflict: 'user_id, date' })

  if (error) {
    showPopup("Erreur lors de l'enregistrement. Vérifie ta connexion.", true)
  } else {
    showPopup(`Bravo ${selectedUser.value.nom} ! Ta lecture a été enregistrée.`)
    selectedUser.value = null
    count.value = 0
  }
  isSaving.value = false
}

const handleSearch = (q) => {
  if (!q || q.length < 2) return 
  const found = users.value.find(u => u.nom.toLowerCase().includes(q))
  if (found) {
    const el = document.getElementById('user-' + found.id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      el.classList.add('ring-4', 'ring-indigo-500/50')
      setTimeout(() => el.classList.remove('ring-4', 'ring-indigo-500/50'), 2000)
    }
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Animation de transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>