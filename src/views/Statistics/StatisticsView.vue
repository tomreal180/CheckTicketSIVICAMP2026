<template>
  <div class="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          Thống kê Sự kiện
        </h1>
        <p class="text-sm text-foreground-muted">Tổng quan về tình trạng check-in, thiết bị và nhân sự</p>
      </div>
      
      <button 
        @click="fetchAllData" 
        :disabled="isRefreshing"
        class="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg :class="{'animate-spin': isRefreshing}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        Đồng bộ dữ liệu
      </button>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <BaseCard class="p-5 flex flex-col justify-between border-white/[0.05] bg-white/[0.01]">
        <div class="flex flex-col gap-3 mb-2">
          <div class="flex justify-between items-center">
            <h3 class="text-foreground-muted font-medium text-sm">Tổng Check-in</h3>
            <div class="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
            </div>
          </div>
          <BaseSelect v-model="selectedEvent" :options="events" class="w-full !py-1.5 !px-2.5 text-xs bg-white/[0.03]" />
        </div>
        
        <div class="space-y-3 mt-auto">
          <!-- Thí sinh -->
          <div class="flex items-center justify-between">
            <div class="flex items-baseline gap-1.5">
              <p class="text-2xl font-bold text-foreground leading-none">{{ checkInStats ? checkInStats.participant.count : 0 }}</p>
              <span class="text-xs font-normal text-foreground-muted">/ {{ checkInStats ? checkInStats.participant.total : 0 }}</span>
            </div>
            <span class="text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Thí sinh</span>
          </div>
          
          <!-- BTC -->
          <div v-if="checkInStats && checkInStats.btc" class="flex items-center justify-between pt-3 border-t border-white/[0.05]">
            <div class="flex items-baseline gap-1.5">
              <p class="text-2xl font-bold text-foreground leading-none">{{ checkInStats.btc.count }}</p>
              <span class="text-xs font-normal text-foreground-muted">/ {{ checkInStats.btc.total }}</span>
            </div>
            <span class="text-[11px] font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">BTC</span>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="p-5 flex flex-col justify-between border-white/[0.05] bg-white/[0.01]">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-foreground-muted font-medium text-sm">Kho hậu cần</h3>
          <div class="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-foreground">{{ totalAvailableEq }} <span class="text-xs font-normal text-foreground-muted ml-1">thiết bị sẵn sàng</span></p>
      </BaseCard>

      <BaseCard class="p-5 flex flex-col justify-between border-white/[0.05] bg-white/[0.01]">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-foreground-muted font-medium text-sm">Thiết bị đang mượn</h3>
          <div class="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-foreground">{{ borrowedEquipments.length }} <span class="text-xs font-normal text-foreground-muted ml-1">lượt mượn</span></p>
      </BaseCard>

      <BaseCard class="p-5 flex flex-col justify-between border-white/[0.05] bg-white/[0.01]">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-foreground-muted font-medium text-sm">Nhân sự BTC (Bận / Rảnh)</h3>
          <div class="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-foreground">
          <span class="text-green-400">{{ activeBtcCount }}</span> 
          <span class="text-xl text-foreground-muted mx-1">/</span> 
          <span class="text-foreground-subtle">{{ standbyBtcCount }}</span>
        </p>
      </BaseCard>
    </div>

    <!-- TRA CỨU NGƯỜI THAM GIA -->
    <div class="space-y-6 mt-2">
      <div class="flex flex-col gap-4">
        <h2 class="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Tra cứu Người tham gia
        </h2>
        
        <!-- Filters row 1: Dropdown & Buttons -->
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <!-- Dropdown Ticket Type -->
          <div class="flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.05]">
            <span class="text-[11px] text-foreground-muted uppercase tracking-wider font-semibold ml-2">Loại vé:</span>
            <BaseSelect v-model="participantTypeFilter" :options="ticketTypeOptions" class="w-48 !py-1.5 !px-2.5 text-xs bg-transparent border-none" />
          </div>

          <!-- Check-in Status Buttons -->
          <div class="flex items-center bg-white/[0.03] rounded-lg border border-white/[0.05] p-1">
            <button @click="participantCheckInFilter = 'all'" :class="['px-4 py-1.5 text-xs font-medium rounded-md transition-colors', participantCheckInFilter === 'all' ? 'bg-white/10 text-white' : 'text-foreground-muted hover:text-white hover:bg-white/5']">
              Tất cả ({{ participantCheckInCounts.all }})
            </button>
            <button @click="participantCheckInFilter = 'checkedIn'" :class="['px-4 py-1.5 text-xs font-medium rounded-md transition-colors', participantCheckInFilter === 'checkedIn' ? 'bg-green-500/20 text-green-400' : 'text-foreground-muted hover:text-white hover:bg-white/5']">
              Đã Check-in ({{ participantCheckInCounts.checkedIn }})
            </button>
            <button @click="participantCheckInFilter = 'notCheckedIn'" :class="['px-4 py-1.5 text-xs font-medium rounded-md transition-colors', participantCheckInFilter === 'notCheckedIn' ? 'bg-red-500/20 text-red-400' : 'text-foreground-muted hover:text-white hover:bg-white/5']">
              Chưa Check-in ({{ participantCheckInCounts.notCheckedIn }})
            </button>
          </div>
        </div>
          
        <!-- Filters row 2: Search bar -->
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-foreground-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input 
            v-model="participantSearchQuery" 
            type="text" 
            class="block w-full pl-10 pr-3 py-2 border border-white/[0.1] rounded-lg leading-5 bg-white/[0.02] text-foreground placeholder-foreground-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-colors" 
            placeholder="Tìm theo Tên hoặc ID..." 
          />
        </div>
      </div>
      
      <BaseCard class="p-0 overflow-hidden border-white/[0.05]">
        <div class="overflow-x-auto max-h-[500px]">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-foreground-muted bg-white/[0.02] border-b border-white/[0.05] sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th class="px-4 py-3 font-medium">ID</th>
                <th class="px-4 py-3 font-medium">Họ và tên</th>
                <th class="px-4 py-3 font-medium">Loại vé</th>
                <th class="px-4 py-3 font-medium text-center">Trạng thái Check-in</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in filteredParticipants" :key="p.id" class="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                <td class="px-4 py-3 font-mono text-xs text-foreground-subtle">{{ p.id }}</td>
                <td class="px-4 py-3 font-medium text-foreground">{{ p.name }}</td>
                <td class="px-4 py-3 text-foreground-subtle">
                  <span class="px-2 py-1 bg-white/[0.05] rounded text-xs border border-white/[0.05]">{{ p.ticketType || 'N/A' }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span v-if="p.checkedIn" class="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Đã vào
                  </span>
                  <span v-else class="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium opacity-70">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Chưa
                  </span>
                </td>
              </tr>
              <tr v-if="filteredParticipants.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-foreground-muted">
                  {{ allParticipants.length === 0 ? 'Đang tải dữ liệu...' : 'Không tìm thấy kết quả nào phù hợp' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      <!-- HẬU CẦN -->
      <div class="space-y-6">
        <h2 class="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          Quản lý Hậu cần
        </h2>
        
        <BaseCard class="p-0 overflow-hidden border-white/[0.05]">
          <div class="p-4 bg-white/[0.02] border-b border-white/[0.05] flex justify-between items-center">
            <h3 class="font-medium text-foreground-subtle text-sm">Thiết bị đang cho mượn</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-foreground-muted bg-white/[0.02] border-b border-white/[0.05]">
                <tr>
                  <th class="px-4 py-3 font-medium">Người mượn</th>
                  <th class="px-4 py-3 font-medium">Thiết bị</th>
                  <th class="px-4 py-3 font-medium">Giờ mượn</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="eq in borrowedEquipments" :key="eq.id" class="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <td class="px-4 py-3 font-medium text-foreground">{{ eq.borrowerName }} <span class="text-xs text-foreground-muted font-mono block">{{ eq.borrowerId }}</span></td>
                  <td class="px-4 py-3 text-foreground-subtle">{{ eq.equipmentName }}</td>
                  <td class="px-4 py-3 font-mono text-foreground-muted text-xs">{{ eq.borrowTime }}</td>
                </tr>
                <tr v-if="borrowedEquipments.length === 0">
                  <td colspan="3" class="px-4 py-6 text-center text-foreground-muted">Không có thiết bị nào đang mượn</td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseCard>

        <BaseCard class="p-0 overflow-hidden border-white/[0.05]">
          <div class="p-4 bg-white/[0.02] border-b border-white/[0.05] flex justify-between items-center">
            <h3 class="font-medium text-foreground-subtle text-sm">Kho thiết bị khả dụng</h3>
          </div>
          <div class="overflow-x-auto max-h-[300px]">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-foreground-muted bg-white/[0.02] border-b border-white/[0.05] sticky top-0 backdrop-blur-md">
                <tr>
                  <th class="px-4 py-3 font-medium">ID</th>
                  <th class="px-4 py-3 font-medium">Tên thiết bị</th>
                  <th class="px-4 py-3 font-medium text-right">Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="eq in availableEquipments" :key="eq.id" class="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <td class="px-4 py-3 font-mono text-foreground-muted text-xs">{{ eq.id }}</td>
                  <td class="px-4 py-3 text-foreground-subtle">{{ eq.name }}</td>
                  <td class="px-4 py-3 text-right">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono" :class="eq.available > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'">
                      {{ eq.available }} / {{ eq.total }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseCard>
      </div>

      <!-- NHÂN SỰ -->
      <div class="space-y-6">
        <div class="flex flex-col gap-4">
          <h2 class="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Quản lý Nhân sự BTC
          </h2>
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-foreground-muted uppercase tracking-wider font-semibold mt-0.5">Sự kiện</span>
              <BaseSelect v-model="selectedPersonnelEvent" :options="personnelEvents" class="w-48 !py-1.5 !px-2.5 text-xs bg-white/[0.03]" />
            </div>
            <div class="flex items-center gap-1">
              <span class="text-[11px] text-foreground-muted uppercase tracking-wider font-semibold mt-0.5 mr-1">Khung giờ</span>
              <BaseSelect v-model="selectedHour" :options="hourOptions" class="w-24" />
              <span class="text-foreground-muted font-bold">:</span>
              <BaseSelect v-model="selectedMinute" :options="minuteOptions" class="w-24" />
            </div>
          </div>
        </div>
        
        <BaseCard class="p-0 overflow-hidden border-white/[0.05]">
          <div class="p-4 bg-accent/10 border-b border-accent/20 flex justify-between items-center">
            <h3 class="font-medium text-accent text-sm flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Đang làm nhiệm vụ (On Duty)
            </h3>
          </div>
          <div class="overflow-x-auto max-h-[400px]">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-foreground-muted bg-white/[0.02] border-b border-white/[0.05] sticky top-0 backdrop-blur-md">
                <tr>
                  <th class="px-4 py-3 font-medium">BTC</th>
                  <th class="px-4 py-3 font-medium">Nhiệm vụ hiện tại</th>
                  <th class="px-4 py-3 font-medium text-center">Điểm danh</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="btc in onDutyBtc" :key="btc.id" class="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <td class="px-4 py-3">
                    <p class="font-medium text-foreground">{{ btc.name }}</p>
                    <p class="text-xs text-foreground-muted font-mono">{{ btc.id }}</p>
                  </td>
                  <td class="px-4 py-3 text-accent font-medium">{{ btc.currentTask }}</td>
                  <td class="px-4 py-3 text-center">
                    <span v-if="btc.checkedIn" class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span v-else class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </span>
                  </td>
                </tr>
                <tr v-if="onDutyBtc.length === 0">
                  <td colspan="3" class="px-4 py-6 text-center text-foreground-muted">Không có ai có nhiệm vụ trong khung giờ này</td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseCard>

        <BaseCard class="p-0 overflow-hidden border-white/[0.05]">
          <div class="p-4 bg-white/[0.02] border-b border-white/[0.05] flex justify-between items-center">
            <h3 class="font-medium text-foreground-subtle text-sm">Đã Check-in & Rảnh việc (Standby)</h3>
          </div>
          <div class="overflow-x-auto max-h-[300px]">
            <table class="w-full text-sm text-left opacity-70 hover:opacity-100 transition-opacity">
              <thead class="text-xs text-foreground-muted bg-white/[0.02] border-b border-white/[0.05] sticky top-0 backdrop-blur-md">
                <tr>
                  <th class="px-4 py-3 font-medium">BTC</th>
                  <th class="px-4 py-3 font-medium">Team</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="btc in standbyBtc" :key="btc.id" class="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <td class="px-4 py-3">
                    <p class="font-medium text-foreground">{{ btc.name }}</p>
                    <p class="text-xs text-foreground-muted font-mono">{{ btc.id }}</p>
                  </td>
                  <td class="px-4 py-3 text-foreground-subtle">{{ btc.team }}</td>
                </tr>
                <tr v-if="standbyBtc.length === 0">
                  <td colspan="2" class="px-4 py-6 text-center text-foreground-muted">Không có nhân sự nào rảnh ở hiện tại</td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseCard>
      </div>
      </div>
    </div>
  
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import BaseCard from '../../components/common/BaseCard.vue';
import BaseSelect from '../../components/common/BaseSelect.vue';
import { AppScriptService } from '../../services/appScriptService';
import type { Equipment } from '../../types';

export default defineComponent({
  name: 'StatisticsView',
  components: {
    BaseCard,
    BaseSelect
  },
  setup() {
    // ---- EVENT CHECK-IN STATE ----
    const selectedEvent = ref('SiviHack');
    const events = [
      { label: 'SiviHack', value: 'SiviHack' },
      { label: 'SiviTour', value: 'SiviTour' },
      { label: 'SiviTa', value: 'SiviTa' },
      { label: 'Hotel', value: 'Hotel' },
    ];

    const allCheckInStats = ref<Record<string, { participant: { count: number, total: number }, btc: { count: number, total: number } | null }>>({});

    const checkInStats = computed(() => {
      if (allCheckInStats.value[selectedEvent.value]) {
        return allCheckInStats.value[selectedEvent.value];
      }
      return { participant: { count: 0, total: 0 }, btc: null };
    });

    const fetchCheckInStats = async () => {
      try {
        const stats = await AppScriptService.getAllCheckInStats();
        allCheckInStats.value = stats;
      } catch (err) {
        console.error("Failed to load check in stats", err);
      }
    };

    // ---- EQUIPMENT STATE ----
    const availableEquipments = ref<Equipment[]>([]);
    const borrowedEquipments = ref<any[]>([]);
    const isRefreshing = ref(false);

    const totalAvailableEq = computed(() => {
      return availableEquipments.value.reduce((sum, eq) => sum + eq.available, 0);
    });

    const fetchAllData = async () => {
      isRefreshing.value = true;
      try {
        fetchCheckInStats();
        fetchParticipants(); // Fetch danh sách người tham gia
        const [available, borrowed, schedules] = await Promise.all([
          AppScriptService.getAvailableEquipments(),
          AppScriptService.getAllBorrowedEquipments(),
          AppScriptService.getAllBtcSchedules()
        ]);
        availableEquipments.value = available;
        borrowedEquipments.value = borrowed;
        allSchedules.value = schedules;
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        isRefreshing.value = false;
      }
    };

    onMounted(() => {
      fetchAllData();
    });

    // ---- SCHEDULE STATE ----
    const selectedPersonnelEvent = ref('SiviHack17');
    const personnelEvents = [
      { label: 'SiviHack 17/09', value: 'SiviHack17' },
      { label: 'SiviHack 18/09', value: 'SiviHack18' },
      { label: 'SiviTour - SiviTa 19/09', value: 'SiviTour' },
    ];
    
    const now = new Date();
    let currentHour = now.getHours();
    let currentMinute = now.getMinutes();
    
    // Giới hạn giờ mặc định nằm trong khoảng 09 đến 22
    if (currentHour < 7) currentHour = 7;
    if (currentHour > 24) currentHour = 24;

    const initialHour = currentHour.toString().padStart(2, '0');
    const initialMinute = currentMinute >= 30 ? '30' : '00';

    const selectedHour = ref(initialHour);
    const selectedMinute = ref(initialMinute);

    const simulatedTime = computed(() => `${selectedHour.value}:${selectedMinute.value}`);
    
    // Tự động sinh mảng giờ từ 09 đến 22
    const hourOptions = (() => {
      const options = [];
      for (let h = 7; h <= 24; h++) {
        const hourStr = h.toString().padStart(2, '0');
        options.push({ label: hourStr, value: hourStr });
      }
      return options;
    })();

    const minuteOptions = [
      { label: '00', value: '00' },
      { label: '30', value: '30' }
    ];

    const allSchedules = ref<Record<string, any[]>>({});

    const currentBtcStatus = computed(() => {
      const scheduleData = allSchedules.value[selectedPersonnelEvent.value] || [];
      return scheduleData.map(btc => {
        // Tìm task ở thời điểm được chọn
        let currentTask = btc.tasks[simulatedTime.value] || null;
        
        return {
          ...btc,
          currentTask
        };
      });
    });

    const onDutyBtc = computed(() => {
      return currentBtcStatus.value.filter(btc => btc.currentTask !== null);
    });

    const standbyBtc = computed(() => {
      // Standby là những người đã check in NHƯNG không có task hiện tại
      return currentBtcStatus.value.filter(btc => btc.currentTask === null && btc.checkedIn);
    });

    const activeBtcCount = computed(() => onDutyBtc.value.length);
    const standbyBtcCount = computed(() => standbyBtc.value.length);

    // ---- PARTICIPANT LOOKUP STATE ----
    const rawAllParticipants = ref<Record<string, any[]>>({});
    const participantSearchQuery = ref('');
    const participantCheckInFilter = ref('all'); // 'all', 'checkedIn', 'notCheckedIn'
    const participantTypeFilter = ref('all');
    
    // Fetch danh sách người tham gia (tất cả các event) 1 lần duy nhất
    const fetchParticipants = async () => {
      try {
        const data = await AppScriptService.getAllParticipants();
        rawAllParticipants.value = data || {};
      } catch (err) {
        console.error("Failed to load participants", err);
        rawAllParticipants.value = {};
      }
    };

    const allParticipants = computed(() => {
      const evt = selectedEvent.value;
      const data = rawAllParticipants.value[evt] || [];
      
      // Lọc người tham gia có thể tham gia event đang chọn
      return data.filter(p => {
        if (!p.ticketType) return true; // Nếu không có loại vé, mặc định cho qua
        const t = String(p.ticketType).toLowerCase();
        
        if (evt === 'SiviHack') {
          return t.includes('full experience pass');
        }
        if (evt === 'SiviTour') {
          return t.includes('day pass') || t.includes('full experience pass');
        }
        if (evt === 'SiviTa') {
          return true; // Tất cả các loại vé đều được tham gia
        }
        if (evt === 'Hotel') {
          return t.includes('khách sạn') || t.includes('khach san');
        }
        return true;
      });
    });

    // Tự động generate các option loại vé từ dữ liệu thực tế
    const ticketTypeOptions = computed(() => {
      const types = new Set<string>();
      allParticipants.value.forEach(p => {
        if (p.ticketType) types.add(p.ticketType);
      });
      
      const options = [{ label: `Tất cả (${allParticipants.value.length})`, value: 'all' }];
      Array.from(types).forEach(type => {
        const count = allParticipants.value.filter(p => p.ticketType === type).length;
        options.push({ label: `${type} (${count})`, value: type });
      });
      return options;
    });

    const participantCheckInCounts = computed(() => {
      let base = allParticipants.value;
      if (participantTypeFilter.value !== 'all') {
        base = base.filter(p => p.ticketType === participantTypeFilter.value);
      }
      if (participantSearchQuery.value) {
        const query = participantSearchQuery.value.toLowerCase().trim();
        base = base.filter(p => 
          (p.name && p.name.toLowerCase().includes(query)) || 
          (p.id && p.id.toLowerCase().includes(query))
        );
      }
      
      const checkedIn = base.filter(p => p.checkedIn === true).length;
      return {
        all: base.length,
        checkedIn: checkedIn,
        notCheckedIn: base.length - checkedIn
      };
    });

    const filteredParticipants = computed(() => {
      let result = allParticipants.value;

      // Filter by Check-in status
      if (participantCheckInFilter.value === 'checkedIn') {
        result = result.filter(p => p.checkedIn === true);
      } else if (participantCheckInFilter.value === 'notCheckedIn') {
        result = result.filter(p => !p.checkedIn);
      }

      // Filter by Ticket Type
      if (participantTypeFilter.value !== 'all') {
        result = result.filter(p => p.ticketType === participantTypeFilter.value);
      }

      // Filter by Search Query
      if (participantSearchQuery.value) {
        const query = participantSearchQuery.value.toLowerCase().trim();
        result = result.filter(p => 
          (p.name && p.name.toLowerCase().includes(query)) || 
          (p.id && p.id.toLowerCase().includes(query))
        );
      }

      return result;
    });

    return {
      selectedEvent,
      events,
      checkInStats,
      availableEquipments,
      totalAvailableEq,
      borrowedEquipments,
      selectedPersonnelEvent,
      personnelEvents,
      simulatedTime,
      selectedHour,
      selectedMinute,
      hourOptions,
      minuteOptions,
      onDutyBtc,
      standbyBtc,
      activeBtcCount,
      standbyBtcCount,
      isRefreshing,
      fetchAllData,
      allParticipants,
      participantSearchQuery,
      participantCheckInFilter,
      participantTypeFilter,
      ticketTypeOptions,
      filteredParticipants,
      participantCheckInCounts
    };
  }
});
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
