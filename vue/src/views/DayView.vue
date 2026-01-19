<template>
    <div class="max-w-md mx-auto p-4 pb-32">
      <header class="mb-8 mt-4 text-center">
        <p class="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-1">Challenge Quotidien</p>
        <h1 class="text-2xl font-black text-slate-900 capitalize">{{ formattedDate }}</h1>
      </header>
  
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="h-16 w-full bg-slate-100 animate-pulse rounded-2xl"></div>
      </div>
  
      <div v-else class="space-y-6">
        <div v-for="user in userScores" 
             :key="user.id"
             :id="'user-' + user.id" 
             class="relative scroll-mt-28">
          <div class="flex justify-between items-end mb-2 px-1">
            <span class="font-bold text-slate-700">{{ user.nom }}</span>
            <span class="text-sm font-black text-slate-400">
              {{ user.today_count }} / 5
            </span>
          </div>
  
          <div class="relative h-10 w-full bg-slate-100 rounded-xl overflow-hidden shadow-inner">
            <div class="absolute left-[50%] top-0 bottom-0 border-l-2 border-dashed border-slate-300 z-10"></div>
  
            <div 
              class="h-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
              :class="getBarColor(user.today_count)"
              :style="{ width: `${Math.min((user.today_count / 10) * 100, 100)}%` }"
            >
              <span v-if="user.today_count > 0" class="text-white text-xs font-bold">
                {{ user.today_count }}
              </span>
            </div>
          </div>
        </div>
        <FloatingSearch @search="handleSearch" /> <br>

      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { supabase } from '../lib/supabaseClient'
  import FloatingSearch from '../components/ui/FloatingSearch.vue' 
  
  const userScores = ref([])
  const loading = ref(true)
  
  // Formater la date en français (ex: Vendredi 16 Janvier)
  const formattedDate = computed(() => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    })
  })
  
  const fetchTodayScores = async () => {
  loading.value = true
  
  // Correction ici : On récupère la date locale au format YYYY-MM-DD
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const todayLocal = `${year}-${month}-${day}`

  // 1. On récupère tous les utilisateurs
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, nom')
    .order('nom')

  // 2. On récupère les logs du jour (avec la date locale !)
  const { data: logs, error: logError } = await supabase
    .from('daily_logs')
    .select('user_id, chapitres_lus')
    .eq('date', todayLocal)

  if (userError || logError) {
    console.error("Erreur de récupération")
  } else {
    // 3. Fusion des données
    userScores.value = users.map(user => {
      const log = logs.find(l => l.user_id === user.id)
      return {
        ...user,
        today_count: log ? log.chapitres_lus : 0
      }
    })
  }
  loading.value = false
}  
  // Logique des couleurs
  const getBarColor = (count) => {
    if (count === 0) return 'bg-slate-200'
    if (count < 5) return 'bg-amber-400'
    if (count === 5) return 'bg-emerald-500'
    if (count < 10) return 'bg-cyan-500'
    return 'bg-indigo-600'
  }
  
  onMounted(fetchTodayScores)

  const handleSearch = (q) => {
  if (!q || q.length < 2) return // Attend au moins 2 lettres
  
  const found = userScores.value.find(u => 
    u.nom.toLowerCase().includes(q)
  )

  if (found) {
    const el = document.getElementById('user-' + found.id)
    if (el) {
      el.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center', 
        inline: 'center' 
      })
      
      // Petit feedback visuel : on peut ajouter une classe temporaire
      el.classList.add('ring-2', 'ring-indigo-500', 'rounded-2xl')
      setTimeout(() => el.classList.remove('ring-2', 'ring-indigo-500'), 2000)
    }
  }
}  </script>
  
  <style scoped>
  /* Petit effet de brillance sur les barres */
  .bg-emerald-500, .bg-cyan-500, .bg-indigo-600 {
    background-image: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.2));
  }
  </style>