<template>
  <div class="space-y-8 animate-[fade-in_0.6s_ease-out]">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">Check-in Người tham gia</h1>
      <p class="text-lg text-foreground-muted">Quét mã QR để điểm danh các sự kiện SiviCAMP 2026</p>
    </div>

    <BaseCard>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Scanner Column -->
        <div class="space-y-6 flex flex-col">
          <BaseSelect 
            v-model="selectedEvent" 
            :options="events" 
            label="Chọn sự kiện Check-in" 
          />
          
          <div class="flex-grow flex items-center justify-center border border-white/5 rounded-xl bg-black/40 p-2 shadow-inner relative overflow-hidden">
             <!-- Scanner Glow -->
            <div class="absolute inset-0 bg-accent/5 blur-[80px] rounded-full pointer-events-none"></div>
            <QRScanner class="z-10 relative" :hasResult="result" @scan-started="reset" @scan-success="handleScan" @scan-error="handleError" />
          </div>
        </div>

        <!-- Result Column -->
        <div class="space-y-6 flex flex-col">
          <h3 class="text-xl font-semibold tracking-tight text-foreground border-b border-white/[0.06] pb-3">Kết quả quét</h3>
          
          <div v-if="loading" class="flex-grow flex justify-center items-center min-h-[200px]">
            <div class="relative w-12 h-12">
              <div class="absolute inset-0 rounded-full border-t-2 border-accent animate-spin"></div>
              <div class="absolute inset-2 rounded-full border-t-2 border-indigo-400 animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
            </div>
          </div>

          <ScanResult 
            v-else-if="result" 
            :result="true" 
            :type="resultType" 
            :title="resultTitle"
            class="animate-[slide-up_0.3s_ease-out]"
          >
            <div v-if="participant" class="space-y-3 mt-4">
              <div class="flex justify-between items-center border-b border-white/[0.04] pb-2">
                <span class="text-foreground-muted text-sm">Mã tham gia</span>
                <span class="font-mono text-foreground">{{ participant.id }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-white/[0.04] pb-2">
                <span class="text-foreground-muted text-sm">Họ và tên</span>
                <span class="font-medium text-foreground">{{ participant.name }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-white/[0.04] pb-2">
                <span class="text-foreground-muted text-sm">Loại vé</span>
                <span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono tracking-wider uppercase border"
                        :class="participant.ticketType !== 'DAY PASS' ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' : 'bg-white/5 text-gray-300 border-white/10'">
                    {{ participant.ticketType }}
                  </span>
                </span>
              </div>
              <div class="flex justify-between items-center border-b border-white/[0.04] pb-2">
                <span class="text-foreground-muted text-sm">Size Áo</span>
                <span class="font-medium text-foreground">{{ participant.size }}</span>
              </div>
              <div v-if="participant.message" class="text-sm mt-4 pt-3 border-t border-white/[0.06] text-foreground-subtle italic">
                {{ participant.message }}
              </div>
            </div>
            <div v-else class="text-foreground-subtle">{{ errorMessage }}</div>
            
            <template #action>
              <!-- Nút "Tiếp tục quét" đã được chuyển sang QRScanner -->
            </template>
          </ScanResult>

          <div v-else class="flex-grow flex flex-col items-center justify-center text-foreground-muted py-16 px-4 text-center bg-white/[0.02] rounded-xl border border-white/[0.04]">
            <div class="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
            </div>
            <p class="text-sm">Chưa có dữ liệu. Vui lòng quét mã QR để kiểm tra vé.</p>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseCard from '../../components/common/BaseCard.vue';
import BaseSelect from '../../components/common/BaseSelect.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import QRScanner from '../../components/scanner/QRScanner.vue';
import ScanResult from '../../components/scanner/ScanResult.vue';
import { AppScriptService } from '../../services/appScriptService';
import type { Participant } from '../../types';

export default defineComponent({
  name: 'ParticipantCheckInView',
  components: {
    BaseCard,
    BaseSelect,
    BaseButton,
    QRScanner,
    ScanResult
  },
  setup() {
    const selectedEvent = ref('SiviHack');
    const events = [
      { label: 'Hotel', value: 'Hotel' },
      { label: 'Hackathon SiviHack', value: 'SiviHack' },
      { label: 'Tour tham quan SiviTour', value: 'SiviTour' },
      { label: 'GALA SiviTa', value: 'SiviTa' }
    ];

    const loading = ref(false);
    const result = ref(false);
    const resultType = ref<'success' | 'error' | 'info'>('info');
    const resultTitle = ref('');
    const participant = ref<Participant | null>(null);
    const errorMessage = ref('');

    const handleScan = async (qrData: string) => {
      try {
        loading.value = true;
        result.value = false;
        participant.value = null;
        
        const res = await AppScriptService.checkInParticipant(qrData, selectedEvent.value);
        
        participant.value = res;
        resultType.value = 'success';
        resultTitle.value = 'Check-in hợp lệ';
      } catch (error: any) {
        resultType.value = 'error';
        resultTitle.value = 'Từ chối Check-in';
        errorMessage.value = error.message;
      } finally {
        loading.value = false;
        result.value = true;
      }
    };

    const handleError = (error: string) => {
      console.log('Lỗi quét:', error);
    };

    const reset = () => {
      result.value = false;
      participant.value = null;
    };

    return {
      selectedEvent,
      events,
      loading,
      result,
      resultType,
      resultTitle,
      participant,
      errorMessage,
      handleScan,
      handleError,
      reset
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
