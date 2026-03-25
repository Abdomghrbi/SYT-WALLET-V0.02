<template>
  <div class="p-4 pb-20">
    <h2 class="text-xl font-bold mb-4">المحفظة</h2>

    <!-- الرصيد الكلي -->
    <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 mb-4">
      <p class="text-blue-200 text-sm mb-1">الرصيد المتاح</p>
      <h2 class="text-4xl font-bold text-white mb-2">
        {{ formatBalance(user?.balance) }} <span class="text-xl">SYT</span>
      </h2>
      <div class="flex items-center gap-4 text-sm text-blue-200">
        <span>إجمالي الأرباح: {{ formatBalance(user?.total_earned) }}</span>
      </div>
    </div>

    <!-- أزرار سريعة -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <button 
        @click="showDeposit = true"
        class="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
      >
        إيداع
      </button>
      <button 
        @click="showWithdraw = true"
        class="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors"
      >
        سحب
      </button>
    </div>

    <!-- عنوان المحفظة -->
    <div class="bg-gray-900 rounded-xl p-4 mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-gray-400 text-sm">عنوان المحفظة</span>
        <button @click="copyAddress" class="text-blue-400 text-sm">
          نسخ
        </button>
      </div>
      <p class="text-white font-mono text-sm break-all">
        {{ user?.wallet_address || '0x...' }}
      </p>
    </div>

    <!-- سجل المعاملات -->
    <h3 class="font-bold mb-3">آخر المعاملات</h3>
    <div v-if="transactions.length === 0" class="text-gray-500 text-center py-8">
      لا توجد معاملات بعد
    </div>
    <div v-else class="space-y-2">
      <div 
        v-for="tx in transactions" 
        :key="tx.id"
        class="bg-gray-900 rounded-xl p-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="tx.type === 'deposit' || tx.type === 'task_earning' ? 'bg-green-500/20' : 'bg-red-500/20'"
          >
            <ArrowDownIcon 
              v-if="tx.type === 'deposit' || tx.type === 'task_earning'" 
              size="20" 
              class="text-green-400" 
            />
            <ArrowUpIcon 
              v-else 
              size="20" 
              class="text-red-400" 
            />
          </div>
          <div>
            <p class="font-medium text-sm">
              {{ tx.type === 'deposit' ? 'إيداع' : tx.type === 'withdrawal' ? 'سحب' : 'مكافأة' }}
            </p>
            <p class="text-gray-500 text-xs">{{ formatDate(tx.created_at) }}</p>
          </div>
        </div>
        <span 
          class="font-bold"
          :class="tx.type === 'deposit' || tx.type === 'task_earning' ? 'text-green-400' : 'text-red-400'"
        >
          {{ tx.type === 'deposit' || tx.type === 'task_earning' ? '+' : '-' }}{{ tx.amount }} SYT
        </span>
      </div>
    </div>

    <!-- نافذة الإيداع (مؤقتة) -->
    <div v-if="showDeposit" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-900 rounded-2xl p-6 w-full max-w-sm">
        <h3 class="font-bold text-xl mb-4">إيداع</h3>
        <p class="text-gray-400 text-sm mb-4">
          أرسل SYT إلى عنوان محفظتك:
        </p>
        <p class="bg-gray-800 p-3 rounded-lg font-mono text-sm break-all mb-4">
          {{ user?.wallet_address }}
        </p>
        <button 
          @click="showDeposit = false"
          class="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
        >
          إغلاق
        </button>
      </div>
    </div>

    <!-- نافذة السحب (مؤقتة) -->
    <div v-if="showWithdraw" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-900 rounded-2xl p-6 w-full max-w-sm">
        <h3 class="font-bold text-xl mb-4">سحب</h3>
        <p class="text-gray-400 text-sm mb-4">
          قريباً...
        </p>
        <button 
          @click="showWithdraw = false"
          class="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from '../config/supabase.js'
import { ArrowDown as ArrowDownIcon, ArrowUp as ArrowUpIcon } from 'lucide-vue-next'

export default {
  name: 'Wallet',
  components: { ArrowDownIcon, ArrowUpIcon },
  props: {
    user: { type: Object, required: true }
  },
  setup(props) {
    const transactions = ref([])
    const showDeposit = ref(false)
    const showWithdraw = ref(false)

    const fetchTransactions = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', props.user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      transactions.value = data || []
    }

    onMounted(() => {
      fetchTransactions()
    })

    const formatBalance = (balance) => {
      return balance ? parseFloat(balance).toFixed(4) : '0.0000'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ar-SA')
    }

    const copyAddress = () => {
      navigator.clipboard.writeText(props.user?.wallet_address)
    }

    return {
      transactions,
      showDeposit,
      showWithdraw,
      formatBalance,
      formatDate,
      copyAddress
    }
  }
}
</script>
