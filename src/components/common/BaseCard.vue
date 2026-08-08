<template>
  <div 
    ref="cardRef"
    class="relative bg-surface rounded-2xl shadow-card hover:shadow-card-hover border border-border-default hover:border-border-hover transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden group"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Spotlight Effect -->
    <div 
      class="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
      :style="{
        background: `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, var(--color-accent-glow), transparent 40%)`
      }"
    ></div>

    <!-- Inner Highlight -->
    <div class="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] z-0"></div>

    <div v-if="$slots.header || title" class="relative px-6 py-5 border-b border-white/[0.04] bg-white/[0.01] z-10">
      <slot name="header">
        <h3 class="text-xl font-semibold tracking-tight text-foreground">{{ title }}</h3>
      </slot>
    </div>
    <div class="relative p-6 z-10">
      <slot />
    </div>
    <div v-if="$slots.footer" class="relative px-6 py-5 border-t border-white/[0.04] bg-black/20 z-10">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title?: string;
}>();

const cardRef = ref<HTMLElement | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return;
  const rect = cardRef.value.getBoundingClientRect();
  mouseX.value = e.clientX - rect.left;
  mouseY.value = e.clientY - rect.top;
};

const handleMouseLeave = () => {
  mouseX.value = 0;
  mouseY.value = 0;
};
</script>
