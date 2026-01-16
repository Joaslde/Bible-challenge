<template>
  <div v-if="!isAuthorized" class="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-6">
    <button @click="$router.push('/')" class="absolute top-8 left-8 text-white flex items-center gap-2 hover:text-indigo-400 transition-colors">
      <ArrowLeft class="w-6 h-6" />
      <span class="font-medium">Retour</span>
    </button>

    <div class="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl relative">
      <h2 class="text-xl font-black text-slate-800 mb-6 text-center">Administration</h2>
      
      <form @submit.prevent="checkPassword">
        <div class="relative mb-6">
          <input 
            v-model="passwordInput" 
            :type="showPassword ? 'text' : 'password'" 
            id="admin-password"
            name="admin-password"
            placeholder="Mot de passe secret"
            class="w-full px-4 py-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 outline-none pr-12"
          />
          <button 
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
          >
            <Eye v-if="!showPassword" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
        </div>

        <button 
          type="submit"
          class="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold active:scale-95 transition-all shadow-lg shadow-indigo-100"
        >
          Se connecter
        </button>
      </form>
      <p v-if="errorMsg" class="text-red-500 text-sm mt-4 text-center font-semibold animate-bounce">{{ errorMsg }}</p>
    </div>
  </div>

  <div v-else class="max-w-md mx-auto p-6 pb-32">
    <h1 class="text-2xl font-bold text-slate-800 mb-6">Gestion du Groupe</h1>

    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8">
      <form @submit.prevent="addUser" class="flex flex-col sm:flex-row gap-3">
        <input 
          v-model="newUserName" 
          type="text" 
          placeholder="Nom du nouveau membre"
          class="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button 
          type="submit"
          class="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold active:scale-95 transition-all shadow-lg shadow-indigo-100"
        >
          Ajouter
        </button>
      </form>
    </div>

    <div class="space-y-3">
      <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-2">
        Membres ({{ users.length }})
      </h2>
      
      <div v-if="loading" class="text-center py-10 text-slate-400 font-medium">
        Chargement de la liste...
      </div>

      <div 
        v-for="user in users" 
        :key="user.id"
        class="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
      >
        <span class="font-bold text-slate-700">{{ user.nom }}</span>
        <button 
          @click="deleteUser(user.id)"
          class="text-red-400 hover:text-red-600 p-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Eye, EyeOff } from 'lucide-vue-next'
import { supabase } from '../lib/supabaseClient' // On réimporte Supabase

const router = useRouter()
const users = ref([])
const newUserName = ref('')
const loading = ref(false)

// Sécurité
const isAuthorized = ref(false)
const passwordInput = ref('')
const showPassword = ref(false)
const errorMsg = ref('')

// Récupère le mot de passe depuis ton fichier .env
const ADMIN_PWD = import.meta.env.VITE_ADMIN_PASSWORD

const checkPassword = () => {
  if (passwordInput.value === ADMIN_PWD) {
    isAuthorized.value = true
    fetchUsers() // On charge les membres dès que c'est déverrouillé
  } else {
    errorMsg.value = "Code incorrect"
    setTimeout(() => errorMsg.value = '', 3000)
  }
}

// Logique de gestion des membres
const fetchUsers = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('nom', { ascending: true })
  
  if (error) console.error(error)
  else users.value = data
  loading.value = false
}

const addUser = async () => {
  if (!newUserName.value.trim()) return
  
  const { error } = await supabase
    .from('users')
    .insert([{ nom: newUserName.value.trim() }])
  
  if (error) {
    alert("Erreur lors de l'ajout")
  } else {
    newUserName.value = ''
    fetchUsers()
  }
}

const deleteUser = async (id) => {
  if (!confirm("Supprimer ce membre ? Tous ses logs seront effacés.")) return

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) alert("Erreur lors de la suppression")
  else fetchUsers()
}
</script>