<template>
  <div class="min-h-screen flex flex-col relative text-foreground font-sans overflow-hidden bg-bg-base selection:bg-accent/30">
    <!-- Ambient Background System -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <!-- Base Gradient -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]"></div>
      
      <!-- Noise Texture -->
      <div class="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+')]"></div>
      
      <!-- Animated Gradient Blobs -->
      <div class="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-accent/20 rounded-full blur-[150px] animate-float" style="animation-duration: 12s"></div>
      <div class="absolute top-[20%] left-[-10%] w-[600px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] animate-float" style="animation-delay: -3s; animation-duration: 15s"></div>
      <div class="absolute top-[40%] right-[-10%] w-[500px] h-[700px] bg-indigo-500/10 rounded-full blur-[100px] animate-float" style="animation-delay: -7s; animation-duration: 18s"></div>
      
      <!-- Grid Overlay -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>

    <Navbar class="z-50 relative" />
    
    <main class="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full relative z-10">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/layout/Navbar.vue';
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
