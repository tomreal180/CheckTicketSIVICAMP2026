<template>
  <div v-if="result" class="p-5 rounded-2xl border bg-[#0a0a0c] relative overflow-hidden group shadow-lg"
       :class="{
         'border-green-500/30': type === 'success',
         'border-red-500/30': type === 'error',
         'border-blue-500/30': type === 'info'
       }">
       
    <!-- Ambient Glow based on type -->
    <div class="absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-20 pointer-events-none"
         :class="{
           'bg-green-500': type === 'success',
           'bg-red-500': type === 'error',
           'bg-blue-500': type === 'info'
         }"></div>

    <div class="flex items-start relative z-10">
      <div class="flex-shrink-0 mt-0.5">
        <svg v-if="type === 'success'" class="h-6 w-6 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="type === 'error'" class="h-6 w-6 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else class="h-6 w-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="ml-3 w-full">
        <h3 class="text-base font-semibold tracking-tight" 
            :class="{
              'text-green-300': type === 'success',
              'text-red-300': type === 'error',
              'text-blue-300': type === 'info'
            }">
          {{ title }}
        </h3>
        <div class="mt-2 text-sm text-foreground-muted leading-relaxed">
          <slot></slot>
        </div>
        <div class="mt-5" v-if="$slots.action">
          <slot name="action"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  result: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
}>();
</script>
