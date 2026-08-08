<template>
  <div class="space-y-8 animate-[fade-in_0.6s_ease-out]">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">Quản lý BTC</h1>
      <p class="text-lg text-foreground-muted">Điểm danh, nhận phần ăn và hệ thống hậu cần</p>
    </div>

    <!-- Toggle Mode -->
    <div class="flex p-1 space-x-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-full max-w-md mx-auto md:mx-0 shadow-inner">
      <button 
        @click="mode = 'attendance'"
        class="w-full rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        :class="mode === 'attendance' ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-white/10' : 'text-foreground-muted hover:text-foreground hover:bg-white/[0.02] border border-transparent'"
      >
        Điểm danh
      </button>
      <button 
        @click="mode = 'equipment'"
        class="w-full rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        :class="mode === 'equipment' ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-white/10' : 'text-foreground-muted hover:text-foreground hover:bg-white/[0.02] border border-transparent'"
      >
        Hậu cần
      </button>
    </div>

    <BaseCard>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Settings & Scanner -->
        <div class="space-y-6 flex flex-col">
          <div class="animate-[slide-up_0.3s_ease-out]" :key="mode">
            <template v-if="mode === 'attendance'">
              <BaseSelect v-model="selectedEvent" :options="events" label="Hoạt động điểm danh" />
            </template>
            
            <template v-else>
              <div class="grid grid-cols-2 gap-4">
                <BaseSelect v-model="selectedEquipment" :options="equipmentOptions" label="Thiết bị" placeholder="Chọn thiết bị..." />
                <BaseSelect v-model="equipmentAction" :options="actions" label="Hành động" />
              </div>
            </template>
          </div>

          <div class="flex-grow flex items-center justify-center border border-white/5 rounded-xl bg-black/40 p-2 shadow-inner relative overflow-hidden mt-2">
            <div class="absolute inset-0 bg-accent/5 blur-[80px] rounded-full pointer-events-none"></div>
             <QRScanner class="z-10 relative" :hasResult="result" @scan-started="result = false" @scan-success="handleScan" />
          </div>
        </div>

        <!-- Result -->
        <div class="space-y-6 flex flex-col">
          <h3 class="text-xl font-semibold tracking-tight text-foreground border-b border-white/[0.06] pb-3">Kết quả</h3>
          
          <div v-if="loading" class="flex-grow flex justify-center items-center min-h-[200px]">
             <div class="relative w-12 h-12">
              <div class="absolute inset-0 rounded-full border-t-2 border-accent animate-spin"></div>
              <div class="absolute inset-2 rounded-full border-t-2 border-indigo-400 animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
            </div>
          </div>

          <ScanResult v-else-if="result" :result="true" :type="resultType" :title="resultTitle" class="animate-[slide-up_0.3s_ease-out]">
            <div v-if="logMessage" class="mt-4 text-foreground-subtle whitespace-pre-line text-sm bg-black/20 p-3 rounded-lg border border-white/5 font-mono">
              {{ logMessage }}
            </div>
            <template #action>
              <!-- Nút tiếp tục đã được chuyển sang QRScanner -->
            </template>
          </ScanResult>
          
          <div v-else class="flex-grow flex flex-col items-center justify-center text-foreground-muted py-16 px-4 text-center bg-white/[0.02] rounded-xl border border-white/[0.04]">
            <div class="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4 shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
            </div>
            <p class="text-sm">Hệ thống sẵn sàng.<br>Vui lòng quét mã QR thành viên BTC.</p>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import BaseCard from '../../components/common/BaseCard.vue';
import BaseSelect from '../../components/common/BaseSelect.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import QRScanner from '../../components/scanner/QRScanner.vue';
import ScanResult from '../../components/scanner/ScanResult.vue';
import { AppScriptService } from '../../services/appScriptService';
import type { Equipment } from '../../types';

export default defineComponent({
  name: 'BtcManagementView',
  components: {
    BaseCard,
    BaseSelect,
    BaseButton,
    QRScanner,
    ScanResult
  },
  setup() {
    const mode = ref<'attendance' | 'equipment'>('attendance');

    // Attendance states
    const selectedEvent = ref('Meal_Day1');
    const events = [
      { label: 'Điểm danh SiviHack', value: 'SiviHack' },
      { label: 'Nhận phần ăn Ngày 1', value: 'Meal_Day1' },
      { label: 'Điểm danh SiviTour', value: 'SiviTour' }
    ];

    // Equipment states
    const equipments = ref<Equipment[]>([]);
    const selectedEquipment = ref('');
    const equipmentAction = ref<'borrow' | 'return'>('borrow');
    const actions = [
      { label: 'Giao đồ (Mượn)', value: 'borrow' },
      { label: 'Thu hồi (Trả)', value: 'return' }
    ];

    const equipmentOptions = computed(() => {
      return equipments.value.map(e => ({
        label: `${e.name} (Còn: ${e.available}/${e.total})`,
        value: e.id
      }));
    });

    // Result states
    const loading = ref(false);
    const result = ref(false);
    const resultType = ref<'success' | 'error'>('success');
    const resultTitle = ref('');
    const logMessage = ref('');

    onMounted(async () => {
      equipments.value = await AppScriptService.getEquipments();
      if (equipments.value.length > 0) {
        selectedEquipment.value = equipments.value[0].id;
      }
    });

    const handleScan = async (qrData: string) => {
      try {
        loading.value = true;
        result.value = false;
        
        if (mode.value === 'attendance') {
          const p = await AppScriptService.checkInParticipant(qrData, selectedEvent.value);
          if (p.ticketType !== 'BTC') throw new Error('Người này không thuộc BTC!');
          
          resultType.value = 'success';
          resultTitle.value = 'Điểm danh thành công';
          logMessage.value = `BTC: ${p.name}\nHoạt động: ${events.find(e => e.value === selectedEvent.value)?.label}`;
        } else {
          if (!selectedEquipment.value) throw new Error('Vui lòng chọn thiết bị');
          
          const res = await AppScriptService.handleEquipment(qrData, selectedEquipment.value, equipmentAction.value);
          
          // Update local equipment state
          const eqIdx = equipments.value.findIndex(e => e.id === res.equipment.id);
          if (eqIdx !== -1) equipments.value[eqIdx] = res.equipment;
          
          resultType.value = 'success';
          resultTitle.value = equipmentAction.value === 'borrow' ? 'Giao đồ thành công' : 'Thu hồi thành công';
          logMessage.value = `Người nhận: ${res.log.borrowerName}\nThiết bị: ${res.log.equipmentName}\nThời gian: ${new Date().toLocaleTimeString()}`;
        }
      } catch (err: any) {
        resultType.value = 'error';
        resultTitle.value = 'Thao tác thất bại';
        logMessage.value = err.message;
      } finally {
        loading.value = false;
        result.value = true;
      }
    };

    return {
      mode,
      selectedEvent,
      events,
      equipments,
      selectedEquipment,
      equipmentAction,
      actions,
      equipmentOptions,
      loading,
      result,
      resultType,
      resultTitle,
      logMessage,
      handleScan
    };
  }
});
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
