<template>
  <div class="flex flex-col space-y-1.5">
    <label v-if="label" class="text-xs font-mono tracking-widest text-foreground-muted uppercase">{{ label }}</label>
    <div class="relative group">
      <select
        class="block w-full pl-4 pr-10 py-2.5 text-sm bg-[#0F0F12] border border-white/10 text-gray-100 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 appearance-none transition-colors shadow-inner"
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        :disabled="disabled"
      >
        <option v-if="placeholder" value="" disabled selected class="text-gray-500">{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value" class="bg-[#0F0F12] text-gray-100 py-2">
          {{ opt.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-gray-300 transition-colors">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | number;
  options: { label: string, value: string | number }[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}>();

defineEmits(['update:modelValue']);
</script>
