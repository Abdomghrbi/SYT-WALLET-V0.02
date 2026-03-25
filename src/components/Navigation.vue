<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-2">
    <div class="flex items-center justify-around max-w-md mx-auto">
      <button 
        @click="$emit('change-tab', 'home')"
        class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
        :class="activeTab === 'home' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'"
      >
        <HomeIcon size="24" />
        <span class="text-xs">الرئيسية</span>
      </button>

      <button 
        @click="$emit('change-tab', 'tasks')"
        class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
        :class="activeTab === 'tasks' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'"
      >
        <CheckSquareIcon size="24" />
        <span class="text-xs">المهام</span>
      </button>

      <button 
        @click="$emit('change-tab', 'wallet')"
        class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
        :class="activeTab === 'wallet' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'"
      >
        <WalletIcon size="24" />
        <span class="text-xs">المحفظة</span>
      </button>

      <button 
        @click="$emit('change-tab', 'referrals')"
        class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
        :class="activeTab === 'referrals' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'"
      >
        <UsersIcon size="24" />
        <span class="text-xs">الإحالات</span>
      </button>
    </div>
  </nav>
</template>

<script>
import { Home as HomeIcon, CheckSquare as CheckSquareIcon, Wallet as WalletIcon, Users as UsersIcon } from 'lucide-vue-next'

export default {
  name: 'Navigation',
  components: { HomeIcon, CheckSquareIcon, WalletIcon, UsersIcon },
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  emits: ['change-tab']
}
</script>
