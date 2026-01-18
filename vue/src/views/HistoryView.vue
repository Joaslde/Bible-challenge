<template>
  <div class="bg-slate-900 text-white overflow-hidden flex flex-col relative" style="height: 525px;">
    <header class="p-6 bg-slate-800/50 backdrop-blur-md border-b border-white/10">
      <h1 class="text-xl font-black tracking-tight">Progression Générale</h1>
      <p class="text-slate-400 text-xs">Standard actuel du jour : <span class="text-indigo-400 font-bold">{{ standardTheorique }} chapitres</span></p>
    </header>

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
    </div>

    <div v-else class="flex-1 overflow-x-auto flex items-stretch gap-0 no-scrollbar snap-x snap-mandatory">
      <div 
        v-for="user in userStats" 
        :key="user.id"
        :id="'user-' + user.id" 
        class="flex-shrink-0 w-[80vw] md:w-[300px] snap-center flex flex-col p-6 border-r border-white/5"
      >
        <div class="text-center mb-8">
          <div class="text-4xl mb-2">{{ getEmoji(user.cumul, standardTheorique) }}</div>
          <h2 class="text-2xl font-bold truncate" style="margin-top: -8px;">{{ user.nom }}</h2>
          <p class="text-indigo-400 font-black text-sm">{{ user.cumul }} / 260</p>
        </div>

        <div class="flex-1 relative bg-slate-800 rounded-full mx-auto overflow-hidden shadow-inner border border-white/5" style="width: 52px;">
          <div 
            class="absolute w-full border-t-2 border-dashed border-indigo-500/50 z-10 transition-all duration-1000"
            :style="{ bottom: `${(standardTheorique / 260) * 100}%` }"
          >
            <span class="absolute -left-12 text-[10px] text-indigo-400 font-bold">BUT</span>
          </div>

          <div 
            class="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-cyan-400 transition-all duration-1000 ease-out flex justify-center pt-2"
            :style="{ height: `${(user.cumul / 260) * 100}%` }"
          >
            <div class="w-1 h-8 bg-white/20 rounded-full"></div>
          </div>
        </div>

        <div class="mt-8 text-center bg-white/5 p-4 rounded-2xl">
          <span class="text-slate-400 text-[10px] uppercase block mb-1">Livre actuel</span>
          <span class="font-bold text-indigo-300">{{ getBibleBook(user.cumul) }}</span>
        </div>
      </div>
    </div>

    <FloatingSearch @search="handleSearch" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabaseClient'
import FloatingSearch from '../components/ui/FloatingSearch.vue'

const userStats = ref([])
const bibleRef = ref([])
const loading = ref(true)



// On définit la date de début (Année, Mois-1, Jour) pour être en local pur
// Note : Janvier est le mois 0 en JS, d'où le (2026, 0, 19)
const startDate = new Date(2026, 0, 19); 

const standardTheorique = computed(() => {
  const today = new Date();
  
  // On remet les deux dates à minuit pile (Heure Locale du Bénin)
  const d1 = new Date(startDate);
  d1.setHours(0, 0, 0, 0);
  
  const d2 = new Date(today);
  d2.setHours(0, 0, 0, 0);

  // Calcul de la différence en millisecondes
  const diffTime = d2 - d1;
  
  // Calcul du nombre de jours (1000ms * 60s * 60m * 24h)
  // On ajoute +1 pour que le jour même du départ soit le "Jour 1"
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  // Si on est avant la date de début, on affiche 0, sinon diffDays * 5
  return diffDays > 0 ? diffDays * 5 : 0;
})


const fetchData = async () => {
  loading.value = true
  const { data: refData } = await supabase.from('chapters_reference').select('*').order('position_globale')
  bibleRef.value = refData
  const { data: users } = await supabase.from('users').select('id, nom')
  const { data: logs } = await supabase.from('daily_logs').select('user_id, chapitres_lus')

  userStats.value = users.map(user => {
    const userLogs = logs.filter(l => l.user_id === user.id)
    const cumul = userLogs.reduce((acc, curr) => acc + curr.chapitres_lus, 0)
    return { ...user, cumul }
  })
  loading.value = false
}

const getBibleBook = (cumul) => {
  if (cumul === 0) return "Matthieu 0 (Attente)"
  const book = bibleRef.value.find(b => b.position_globale === cumul)
  return book ? `${book.livre} ${book.numero_chapitre}` : "Fin du Voyage !"
}

const getEmoji = (cumul, standard) => {
  if (cumul >= standard + 10) return '🔥'
  if (cumul >= standard) return '😇'
  if (cumul >= standard - 5) return '😐'
  return '😴'
}

// FONCTION DE RECHERCHE SPÉCIFIQUE À HISTORY
const handleSearch = (q) => {
  if (!q || q.length < 2) return 
  const found = userStats.value.find(u => u.nom.toLowerCase().includes(q))
  if (found) {
    const el = document.getElementById('user-' + found.id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      el.classList.add('ring-4', 'ring-indigo-500/50')
      setTimeout(() => el.classList.remove('ring-4', 'ring-indigo-500/50'), 2000)
    }
  }
}

onMounted(fetchData)
</script>
<style scoped>
  /* Masquer la barre de défilement sur Chrome, Safari et Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  /* Masquer la barre de défilement sur IE, Edge et Firefox */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  </style>