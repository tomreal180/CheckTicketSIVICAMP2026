<template>
  <button 
    :class="computedClasses" 
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <!-- Shine pseudo element handled by CSS in some cases, or inline here -->
    <div v-if="variant === 'primary'" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0"></div>
    
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="relative z-10 font-medium tracking-wide flex items-center justify-center w-full">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (val: string) => ['primary', 'secondary', 'ghost', 'danger', 'outline'].includes(val)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);

const computedClasses = computed(() => {
  const base = "relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg-base overflow-hidden group";
  const sizeClass = props.block ? "w-full" : "";
  const stateClass = (props.disabled || props.loading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-[0.98] hover:-translate-y-0.5";
  
  let variantClass = "";
  switch(props.variant) {
    case 'primary':
      variantClass = "bg-accent text-white shadow-glow hover:bg-accent-bright";
      break;
    case 'secondary':
      variantClass = "bg-white/[0.05] text-foreground border border-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]";
      break;
    case 'ghost':
      variantClass = "bg-transparent text-foreground-muted hover:bg-white/[0.05] hover:text-foreground";
      break;
    case 'danger':
      variantClass = "bg-red-600/90 text-white shadow-[0_0_0_1px_rgba(220,38,38,0.5),0_4px_12px_rgba(220,38,38,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:bg-red-500";
      break;
    case 'outline':
      variantClass = "bg-transparent border border-white/10 text-foreground hover:bg-white/[0.05] hover:border-white/20";
      break;
  }
  return `${base} ${sizeClass} ${stateClass} ${variantClass}`;
});
</script>
