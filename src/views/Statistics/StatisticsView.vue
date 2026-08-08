<template>
  <div class="space-y-8 animate-[fade-in_0.6s_ease-out]">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">Dashboard Thống Kê</h1>
        <p class="text-lg text-foreground-muted">Tổng quan số liệu theo thời gian thực</p>
      </div>
      <BaseButton @click="loadData" variant="outline" :loading="loading" class="group">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 group-hover:rotate-180 transition-transform duration-500"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        Đồng bộ dữ liệu
      </BaseButton>
    </div>

    <!-- Asymmetric Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(180px,auto)] gap-4 lg:gap-6">
      
      <!-- Lượt Check-in (Hero metric) - Spans 2 cols, 1 row -->
      <BaseCard class="md:col-span-3 lg:col-span-2 relative overflow-hidden group border-white/10"
                style="background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)">
        <div class="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="h-full flex flex-col justify-between relative z-10">
          <div class="flex items-center gap-2">
            <div class="p-2 bg-accent/20 rounded-lg text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 class="text-sm font-mono tracking-widest text-foreground-subtle uppercase">Tổng Check-in</h3>
          </div>
          <div>
            <p class="text-6xl font-semibold tracking-tighter text-foreground mt-4 group-hover:scale-105 origin-left transition-transform duration-300">
              {{ stats?.totalCheckIns || 0 }}
            </p>
          </div>
        </div>
      </BaseCard>

      <!-- Thiết bị (Hero metric) - Spans 2 cols, 1 row -->
      <BaseCard class="md:col-span-3 lg:col-span-2 relative overflow-hidden group border-white/10"
                style="background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)">
        <div class="absolute inset-0 bg-gradient-to-bl from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="h-full flex flex-col justify-between relative z-10">
          <div class="flex items-center gap-2">
            <div class="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
            </div>
            <h3 class="text-sm font-mono tracking-widest text-foreground-subtle uppercase">Thiết bị đang mượn</h3>
          </div>
          <div>
            <p class="text-6xl font-semibold tracking-tighter text-foreground mt-4 group-hover:scale-105 origin-left transition-transform duration-300">
              {{ stats?.activeBorrowers || 0 }}
            </p>
          </div>
        </div>
      </BaseCard>

      <!-- Trạng thái kho hậu cần - Spans 2 cols on Desktop, 4 cols on XL -->
      <BaseCard title="Kho Hậu Cần" class="md:col-span-6 lg:col-span-2 lg:row-span-2 h-full flex flex-col">
        <div class="space-y-6 mt-2 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="eq in stats?.equipments" :key="eq.id" class="relative group">
            <div class="flex mb-2 items-center justify-between">
              <div>
                <span class="text-sm font-medium text-foreground tracking-wide group-hover:text-accent transition-colors">
                  {{ eq.name }}
                </span>
              </div>
              <div class="text-right text-xs font-mono text-foreground-muted">
                {{ eq.available }} / {{ eq.total }}
              </div>
            </div>
            <div class="overflow-hidden h-1.5 flex rounded-full bg-white/[0.04]">
              <div :style="`width: ${(eq.available / eq.total) * 100}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-out"
                   :class="eq.available < eq.total / 4 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-accent shadow-[0_0_10px_rgba(94,106,210,0.5)]'"></div>
            </div>
          </div>
          
          <div v-if="!stats?.equipments?.length" class="text-center text-foreground-muted py-8 text-sm">
            Không có dữ liệu thiết bị
          </div>
        </div>
      </BaseCard>

      <!-- Log Check-in gần đây - Spans 4 cols, 1 row -->
      <BaseCard title="Hoạt động Check-in" class="md:col-span-6 lg:col-span-4 h-full">
        <div class="overflow-x-auto custom-scrollbar -mx-2 px-2">
          <table class="min-w-full divide-y divide-white/[0.06]">
            <thead>
              <tr>
                <th scope="col" class="py-3 text-left text-xs font-mono tracking-widest text-foreground-subtle uppercase">Thời gian</th>
                <th scope="col" class="py-3 text-left text-xs font-mono tracking-widest text-foreground-subtle uppercase">Người tham gia</th>
                <th scope="col" class="py-3 text-left text-xs font-mono tracking-widest text-foreground-subtle uppercase">Sự kiện</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/[0.04]">
              <tr v-for="log in stats?.checkInLogs.slice().reverse().slice(0,4)" :key="log.id" class="hover:bg-white/[0.02] transition-colors group">
                <td class="py-3 whitespace-nowrap text-sm text-foreground-muted font-mono group-hover:text-foreground-subtle transition-colors">{{ new Date(log.timestamp).toLocaleTimeString() }}</td>
                <td class="py-3 whitespace-nowrap text-sm font-medium text-foreground group-hover:text-accent transition-colors">{{ log.participantName }}</td>
                <td class="py-3 whitespace-nowrap text-sm text-foreground-subtle">
                  <span class="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-xs">
                    {{ log.eventId }}
                  </span>
                </td>
              </tr>
              <tr v-if="!stats?.checkInLogs.length">
                <td colspan="3" class="py-8 text-center text-sm text-foreground-muted">Chưa có hoạt động check-in nào</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import BaseCard from '../../components/common/BaseCard.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import { AppScriptService } from '../../services/appScriptService';

export default defineComponent({
  name: 'StatisticsView',
  components: {
    BaseCard,
    BaseButton
  },
  setup() {
    const stats = ref<any>(null);
    const loading = ref(false);

    const loadData = async () => {
      loading.value = true;
      try {
        stats.value = await AppScriptService.getStatistics();
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadData();
    });

    return {
      stats,
      loading,
      loadData
    };
  }
});
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.2);
}
</style>
