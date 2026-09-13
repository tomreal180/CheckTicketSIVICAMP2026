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
          <h3 v-if="mode === 'equipment'" class="text-xl font-semibold tracking-tight text-foreground border-b border-white/[0.06] pb-3">Vui lòng quét mã QR của BTC</h3>
          
          <div v-if="mode === 'attendance'" class="animate-[slide-up_0.3s_ease-out]" :key="mode">
            <BaseSelect v-model="selectedEvent" :options="events" label="Hoạt động điểm danh" />
          </div>

          <div class="flex-grow flex items-center justify-center border border-white/5 rounded-xl bg-black/40 p-2 shadow-inner relative overflow-hidden mt-2">
            <div class="absolute inset-0 bg-accent/5 blur-[80px] rounded-full pointer-events-none"></div>
             <QRScanner class="z-10 relative" :hasResult="result" @scan-started="reset" @scan-success="handleScan" />
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
            
            <!-- Organizer Info for Attendance Mode -->
            <div v-if="mode === 'attendance' && organizer" class="space-y-3 mt-4">
              <!-- ... existing code ... -->
              <div class="flex justify-between items-center border-b border-white/[0.04] pb-2">
                <span class="text-foreground-muted text-sm">Mã BTC</span>
                <span class="font-mono text-foreground">{{ organizer.id }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-white/[0.04] pb-2">
                <span class="text-foreground-muted text-sm">Họ và tên</span>
                <span class="font-medium text-foreground">{{ organizer.name }}</span>
              </div>
              <div v-if="organizer.status" class="flex justify-between items-center border-b border-white/[0.04] pb-2">
                <span class="text-foreground-muted text-sm">Trạng thái</span>
                <span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono tracking-wider uppercase border"
                        :class="organizer.status === 'active' ? 'bg-green-500/10 text-green-300 border-green-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'">
                    {{ organizer.status }}
                  </span>
                </span>
              </div>
              <div v-if="organizer.mission" class="flex justify-between items-center border-b border-white/[0.04] pb-2">
                <span class="text-foreground-muted text-sm">Nhiệm vụ</span>
                <span class="font-medium text-foreground">{{ organizer.mission }}</span>
              </div>
              <div v-if="organizer.size" class="flex justify-between items-center border-b border-white/[0.04] pb-2">
                <span class="text-foreground-muted text-sm">Size Áo</span>
                <span class="font-medium text-foreground">{{ organizer.size }}</span>
              </div>
              <div v-if="organizer.hotel_room" class="flex justify-between items-center border-b border-white/[0.04] pb-2">
                <span class="text-foreground-muted text-sm">Phòng khách sạn</span>
                <span class="font-medium text-foreground">{{ organizer.hotel_room }}</span>
              </div>
              <div v-if="organizer.message" class="text-sm mt-4 pt-3 border-t border-white/[0.06] text-foreground-subtle italic">
                {{ organizer.message }}
              </div>
            </div>

            <!-- Default error text for attendance -->
            <div v-if="mode === 'attendance' && resultType === 'error' && logMessage" class="mt-4 text-foreground-subtle text-sm">
              {{ logMessage }}
            </div>

            <!-- UI for Equipment Mode -->
            <div v-if="mode === 'equipment'">
              <!-- Always show error if there is one -->
              <div v-if="resultType === 'error' && logMessage" class="mt-4 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-sm whitespace-pre-line">
                {{ logMessage }}
              </div>

              <!-- Step 1: Select Equipment -->
              <div v-if="equipmentStep === 'select' && verifiedBtc" class="space-y-4 mt-4">
                <div class="p-3 bg-accent/10 border border-accent/20 rounded-xl flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-accent"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <p class="font-medium text-foreground text-sm">{{ verifiedBtc.name }}</p>
                    <p class="text-foreground-muted text-xs font-mono">{{ verifiedBtc.id }}</p>
                  </div>
                </div>

                <div v-if="actions.length > 0" class="grid grid-cols-1 gap-4">
                  <BaseSelect v-model="selectedEquipment" :options="equipmentOptions" label="Thiết bị" placeholder="Chọn thiết bị..." />
                  <BaseSelect v-model="equipmentAction" :options="actions" label="Hành động" />
                </div>
                <div v-else class="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                   <p class="text-foreground-subtle text-sm">Không có thiết bị khả dụng để giao/nhận.</p>
                </div>
                
                <BaseButton v-if="actions.length > 0" @click="handleEquipmentSubmit" variant="primary" class="w-full">Xác nhận giao dịch</BaseButton>
              </div>

              <!-- Step 2: Done -->
              <div v-else-if="equipmentStep === 'done' && resultType === 'success' && logMessage" class="mt-4 text-foreground-subtle whitespace-pre-line text-sm bg-black/20 p-3 rounded-lg border border-white/5 font-mono">
                {{ logMessage }}
              </div>
            </div>

            <template #action>
              <!-- Uses QRScanner's Continue button inherently when hasResult=true -->
            </template>
          </ScanResult>
          
          <div v-else class="flex-grow flex flex-col items-center justify-center text-foreground-muted py-16 px-4 text-center bg-white/[0.02] rounded-xl border border-white/[0.04]">
            <div class="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4 shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
            </div>
            
            <template v-if="mode === 'attendance'">
              <p class="text-sm">Hệ thống điểm danh sẵn sàng.<br>Vui lòng quét mã QR thành viên BTC.</p>
            </template>
            <template v-else>
              <p class="text-sm font-medium mb-1 text-foreground">Quy trình Hậu cần</p>
              <p class="text-sm text-foreground-subtle">Bước 1. Quét thẻ BTC để xác thực.<br>Bước 2. Chọn thiết bị & hành động.</p>
            </template>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import BaseCard from '../../components/common/BaseCard.vue';
import BaseSelect from '../../components/common/BaseSelect.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import QRScanner from '../../components/scanner/QRScanner.vue';
import ScanResult from '../../components/scanner/ScanResult.vue';
import { AppScriptService } from '../../services/appScriptService';
import type { Equipment, Organizer } from '../../types';

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
    const selectedEvent = ref('SiviHack17');
    const events = [
      { label: 'Điểm danh SiviHack ngày 17/9', value: 'SiviHack17' },
      { label: 'Điểm danh SiviHack ngày 18/9', value: 'SiviHack18' },
      { label: 'Điểm danh SiviTour', value: 'SiviTour' },
      { label: 'Điểm danh SiviTa', value: 'SiviTa' },
      { label: 'Check in Hotel', value: 'Hotel' },
    ];

    // Equipment states
    const availableEquipments = ref<Equipment[]>([]);
    const borrowedEquipments = ref<{id: string, name: string}[]>([]);
    const selectedEquipment = ref('');
    const equipmentAction = ref<'borrow' | 'return' | ''>('');

    const actions = computed(() => {
      const opts = [];
      if (availableEquipments.value.length > 0) {
        opts.push({ label: 'Giao đồ (Mượn)', value: 'borrow' });
      }
      if (borrowedEquipments.value.length > 0) {
        opts.push({ label: 'Thu hồi (Trả)', value: 'return' });
      }
      return opts;
    });

    watch(actions, (newActions) => {
      if (newActions.length > 0) {
        if (!newActions.find(a => a.value === equipmentAction.value)) {
           equipmentAction.value = newActions[0].value as 'borrow' | 'return';
        }
      } else {
        equipmentAction.value = '';
      }
    });

    const equipmentOptions = computed(() => {
      if (equipmentAction.value === 'borrow') {
        return availableEquipments.value.map(e => ({
          label: `${e.name} (Còn: ${e.available}/${e.total})`,
          value: e.id
        }));
      } else if (equipmentAction.value === 'return') {
        return borrowedEquipments.value.map(e => ({
          label: `${e.name}`,
          value: e.id
        }));
      }
      return [];
    });

    watch(equipmentOptions, (newOpts) => {
      if (newOpts.length > 0) {
        if (!newOpts.find(o => o.value === selectedEquipment.value)) {
           selectedEquipment.value = newOpts[0].value;
        }
      } else {
        selectedEquipment.value = '';
      }
    });

    // Result states
    const loading = ref(false);
    const result = ref(false);
    const resultType = ref<'success' | 'error'>('success');
    const resultTitle = ref('');
    const logMessage = ref('');
    const organizer = ref<Organizer | null>(null);

    const verifiedBtc = ref<Organizer | null>(null);
    const verifiedQrData = ref('');
    const equipmentStep = ref<'scan' | 'select' | 'done'>('scan');

    const handleScan = async (qrData: string) => {
      try {
        loading.value = true;
        result.value = false;
        organizer.value = null;
        logMessage.value = '';
        equipmentStep.value = 'scan';
        
        if (mode.value === 'attendance') {
          const p = await AppScriptService.checkInParticipant(qrData, selectedEvent.value, true);
          
          organizer.value = p as Organizer;
          
          resultType.value = 'success';
          resultTitle.value = 'Điểm danh thành công';
          logMessage.value = ''; // Clear log message since we show structured UI
        } else {
          // Chỉ kiểm tra BTC
          const p = await AppScriptService.checkBTC(qrData);
          verifiedBtc.value = p;
          verifiedQrData.value = qrData;

          // Load equipment data
          const [avail, borrowed] = await Promise.all([
            AppScriptService.getAvailableEquipments(),
            AppScriptService.getBorrowedEquipments(p.id)
          ]);
          availableEquipments.value = avail;
          borrowedEquipments.value = borrowed;

          equipmentStep.value = 'select';
          resultType.value = 'success';
          resultTitle.value = 'Hợp lệ';
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

    const handleEquipmentSubmit = async () => {
      try {
        loading.value = true;
        result.value = false;

        if (!selectedEquipment.value) throw new Error('Vui lòng chọn thiết bị');
        if (!equipmentAction.value) throw new Error('Hành động không hợp lệ');
        
        const res = await AppScriptService.handleEquipment(
          verifiedBtc.value!.id,
          verifiedBtc.value!.name,
          selectedEquipment.value,
          equipmentAction.value
        );
        
        resultType.value = 'success';
        resultTitle.value = equipmentAction.value === 'borrow' ? 'Giao đồ thành công' : 'Thu hồi thành công';
        logMessage.value = `Người nhận: ${res.log.borrowerName}\nThiết bị: ${res.log.equipmentName}\nThời gian: ${new Date().toLocaleTimeString()}`;
        equipmentStep.value = 'done';
      } catch (err: any) {
        resultType.value = 'error';
        resultTitle.value = 'Giao dịch thất bại';
        logMessage.value = err.message;
      } finally {
        loading.value = false;
        result.value = true; // Show ScanResult component
      }
    };

    const reset = () => {
      result.value = false;
      organizer.value = null;
      logMessage.value = '';
      verifiedBtc.value = null;
      verifiedQrData.value = '';
      equipmentStep.value = 'scan';
    };

    watch(mode, () => {
      reset();
    });

    return {
      mode,
      selectedEvent,
      events,
      selectedEquipment,
      equipmentAction,
      actions,
      equipmentOptions,
      loading,
      result,
      resultType,
      resultTitle,
      logMessage,
      organizer,
      verifiedBtc,
      equipmentStep,
      handleScan,
      handleEquipmentSubmit,
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
