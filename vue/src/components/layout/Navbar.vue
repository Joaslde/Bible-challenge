<template>
    <div class="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-4">
      <nav class="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-6 py-3 flex items-center gap-8 md:gap-12 transition-all duration-300">
        
        <router-link to="/" class="nav-link" active-class="active">
          <Clock class="w-6 h-6" />
          <span class="text-[10px] font-medium mt-1">Jour</span>
        </router-link>
  
        <router-link to="/history" class="nav-link" active-class="active">
          <Calendar class="w-6 h-6" />
          <span class="text-[10px] font-medium mt-1">Progrès</span>
        </router-link>
  
        <router-link to="/log" class="flex items-center justify-center bg-indigo-600 text-white w-12 h-12 rounded-2xl shadow-lg shadow-indigo-200 active:scale-90 transition-transform" active-class="active-plus">
          <Plus class="w-8 h-8" />
        </router-link>
  
        <router-link to="/admin" class="nav-link" active-class="active">
          <Settings class="w-6 h-6" />
          <span class="text-[10px] font-medium mt-1">Admin</span>
        </router-link>
  
      </nav>
    </div>
  </template>
  
  <script setup>
  import { Clock, Calendar, Plus, Settings } from 'lucide-vue-next'
  </script>
  
  <style scoped>
  .nav-link {
    @reference "../../assets/main.css";
    @apply flex flex-col items-center text-slate-400 transition-colors duration-200;
  }
  
  .active {
    @apply text-indigo-600;
  }
  
  .active-plus {
    @apply ring-4 ring-indigo-100;
  }
  </style>