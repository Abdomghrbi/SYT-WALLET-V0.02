<template>
  <div class="p-4 pb-20">
    <h2 class="text-xl font-bold mb-4">الإحالات</h2>

    <!-- كود الإحالة -->
    <div class="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 mb-4">
      <p class="text-green-200 text-sm mb-2">كود إحالتك الشخصي</p>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-3xl font-bold text-white tracking-wider">
          {{ user?.referral_code || '...' }}
        </h2>
        <button 
          @click="copyCode"
          class="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
        >
          <CopyIcon size="20" class="text-white" />
        </button>
      </div>
      <p class="text-green-200 text-sm mb-4">
        شارك هذا الكود مع أصدقائك واحصل على 10% من أرباحهم
      </p>
      <button 
        @click="shareReferral"
        class="w-full bg-white text-green-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
      >
        <ShareIcon size="20" />
        مشاركة الكود
      </button>
    </div>

    <!-- إحصائيات -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-gray-900 rounded-xl p-4">
        <div class="flex items-center gap-2 mb-2">
          <UsersIcon size="20" class="text-blue-400" />
          <span class="text-gray-400 text-sm">عدد الإحالات</span>
        </div>
        <p class="text-2xl font-bold text-white">{{ referrals.length }}</p>
      </div>
      
      <div class="bg-gray-900 rounded-xl p-4">
        <div class="flex items-center gap-2 mb-2">
          <DollarSignIcon size="20" class="text-green-400" />
          <span class="text-gray-400 text-sm">أرباح الإحالات</span>
        </div>
        <p class="text-2xl font-bold text-white">{{ formatBalance(user?.referral_earnings) }} SYT</p>
      </div>
    </div>

    <!-- قائمة الإحالات -->
    <h3 class="font-bold mb-3">الأصدقاء المدعوين</h3>
    <div v-if="referrals.length === 0" class="text-gray-500 text-center py-8">
      <p>لم تدعُ أصدقاء بعد</p>
      <p class="text-sm mt-2">شارك كودك لبدء الربح!</p>
    </div>
    <div v-else class="space-y-2">
      <div 
        v-for="referral in referrals" 
        :key="referral.id"
        class="bg-gray-900 rounded-xl p-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <UserIcon size="20" class="text-blue-400" />
          </div>
          <div>
            <p class="font-medium text-sm">{{ referral.referred_username || 'مستخدم' }}</p>
            <p class="text-gray-500 text-xs">{{ formatDate(referral.created_at) }}</p>
          </div>
        </div>
        <span 
          class="text-xs px-2 py-1 rounded-full"
          :class="referral.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'"
        >
          {{ referral.status === 'completed' ? 'مكتمل' : 'معلق' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from '../config/supabase.js'
import { Copy as CopyIcon, Share2 as ShareIcon, Users as UsersIcon, DollarSign as DollarSignIcon, User as UserIcon } from 'lucide-vue-next'

export default {
  name: 'Referrals',
  components: { CopyIcon, ShareIcon, UsersIcon, DollarSignIcon, UserIcon },
  props: {
    user: { type: Object, required: true }
  },
  setup(props) {
    const referrals = ref([])

    const fetchReferrals = async () => {
      const { data } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_code', props.user?.referral_code)
        .order('created_at', { ascending: false })

      referrals.value = data || []
    }

    onMounted(() => {
      fetchReferrals()
    })

    const formatBalance = (balance) => {
      return balance ? parseFloat(balance).toFixed(4) : '0.0000'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ar-SA')
    }

    const copyCode = () => {
      navigator.clipboard.writeText(props.user?.referral_code)
    }

    const shareReferral = () => {
      const text = `انضم لـ SYT Wallet واحصل على 250 SYT مجاناً!\nكود الدعوة: ${props.user?.referral_code}`
      
      if (navigator.share) {
        navigator.share({
          title: 'SYT Wallet',
          text: text
        })
      } else {
        navigator.clipboard.writeText(text)
        alert('تم نسخ الكود!')
      }
    }

    return {
      referrals,
      formatBalance,
      formatDate,
      copyCode,
      shareReferral
    }
  }
}
</script>
