<template>
  <div class="relative w-full bg-[#050506] rounded-xl overflow-hidden aspect-square md:aspect-[4/3] flex items-center justify-center shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border border-white/[0.04]">
    <div v-if="!isScanning && !cameraError" class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] mb-4 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-accent opacity-80"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
      </div>
      <p class="font-medium text-sm text-foreground mb-4 tracking-wide">
        {{ hasResult ? 'Nhấn để tiếp tục quét mã tiếp theo' : 'Nhấn Bắt đầu để quét mã QR' }}
      </p>
      <BaseButton @click="startScanner" variant="primary">
        {{ hasResult ? 'Tiếp tục quét' : 'Bắt đầu quét' }}
      </BaseButton>
    </div>

    <div v-if="cameraError" class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 bg-black/80 backdrop-blur-md">
      <p class="text-red-400 font-medium mb-4 text-sm">{{ cameraError }}</p>
      <BaseButton @click="startScanner" variant="secondary">Thử lại</BaseButton>
    </div>

    <!-- Container for HTML5-QRCode -->
    <div id="qr-reader" class="w-full h-full" :class="{ 'opacity-0 scale-95': !isScanning, 'opacity-100 scale-100': isScanning }" style="transition: opacity 0.5s ease, transform 0.5s ease;"></div>
    
    <div v-if="isScanning" class="absolute bottom-6 left-0 right-0 flex justify-center z-20">
      <BaseButton @click="stopScanner" variant="danger" class="shadow-2xl shadow-red-900/50 backdrop-blur-md bg-red-600/90 border border-red-500/50">Dừng quét</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';
import BaseButton from '../common/BaseButton.vue';

const props = defineProps({
  hasResult: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['scanSuccess', 'scanError', 'scanStarted']);

const isScanning = ref(false);
const cameraError = ref('');
let html5QrCode: Html5Qrcode | null = null;

const startScanner = async () => {
  cameraError.value = '';
  
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("qr-reader");
  }

  try {
    emit('scanStarted');
    isScanning.value = true;
    await html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      (decodedText) => {
        stopScanner();
        emit('scanSuccess', decodedText);
      },
      (errorMessage) => {
        // Parse error, ignore usually
        console.warn("QR Code scan error:", errorMessage);
      }
    );
  } catch (err: any) {
    isScanning.value = false;
    cameraError.value = "Không thể truy cập camera. Vui lòng cấp quyền và thử lại.";
    console.error(err);
  }
};

const stopScanner = async () => {
  if (html5QrCode && html5QrCode.isScanning) {
    await html5QrCode.stop();
    isScanning.value = false;
  }
};

onBeforeUnmount(() => {
  stopScanner();
});
</script>

<style>
#qr-reader {
  border: none !important;
}
#qr-reader video {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
}
#qr-reader__scan_region {
  height: 100% !important;
}
#qr-reader__dashboard {
  display: none !important;
}
/* Override html5-qrcode border color if possible */
#qr-reader__scan_region > img {
  opacity: 0.2; /* Dims the default overlay if it's an image */
}
</style>
