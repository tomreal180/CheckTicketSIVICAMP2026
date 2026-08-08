<template>
  <nav class="bg-[#050506]/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center group cursor-pointer">
            <span class="text-2xl font-bold tracking-[-0.03em] text-gradient-accent">SiviCamp 2026 - RAMmastic</span>
          </div>
          <div class="hidden sm:ml-10 sm:flex sm:space-x-8">
            <router-link v-for="item in navItems" :key="item.path" :to="item.path"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-all duration-200 border-b-2"
              :class="[$route.path === item.path ? 'border-accent text-foreground' : 'border-transparent text-foreground-muted hover:text-foreground hover:border-white/20']">
              <component :is="item.icon" class="w-4 h-4 mr-2 opacity-80" />
              {{ item.name }}
            </router-link>
          </div>
        </div>
        
        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="inline-flex items-center justify-center p-2 rounded-md text-foreground-muted hover:text-foreground hover:bg-white/[0.05] focus:outline-none transition-colors">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div v-show="isMobileMenuOpen" class="sm:hidden bg-[#050506]/95 backdrop-blur-2xl border-b border-white/[0.06] absolute w-full shadow-2xl">
        <div class="pt-2 pb-4 space-y-1 px-2">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path"
            @click="isMobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200"
            :class="[$route.path === item.path ? 'bg-accent/10 text-accent' : 'text-foreground-muted hover:bg-white/[0.05] hover:text-foreground']">
            <div class="flex items-center">
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              {{ item.name }}
            </div>
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QrCode, Users, LayoutDashboard } from 'lucide-vue-next';

const isMobileMenuOpen = ref(false);

const navItems = [
  { name: 'Check-in', path: '/check-in', icon: QrCode },
  { name: 'Quản lý BTC', path: '/btc', icon: Users },
  { name: 'Thống kê', path: '/statistics', icon: LayoutDashboard },
];
</script>
