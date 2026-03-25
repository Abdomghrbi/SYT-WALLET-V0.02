<template>
  <div class="min-h-screen bg-black flex flex-col items-center justify-center p-4">
    <!-- الشعار -->
    <div class="mb-8 text-center">
      <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
        <WalletIcon size="40" class="text-white" />
      </div>
      <h1 class="text-3xl font-bold text-white mb-2">SYT Wallet</h1>
      <p class="text-gray-400">محفظتك الرقمية للتحويلات والإحالات</p>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex flex-col items-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
      <p class="text-gray-400">جاري تسجيل الدخول...</p>
    </div>

    <!-- خطأ -->
    <div v-else-if="error" class="bg-red-900/50 border border-red-500 rounded-xl p-4 mb-4 max-w-sm w-full text-center">
      <p class="text-red-400">{{ error }}</p>
      <button @click="retry" class="mt-2 text-red-300 underline text-sm">إعادة المحاولة</button>
    </div>

    <!-- زر تسجيل الدخول -->
    <div v-else class="w-full max-w-sm">
      <button
        @click="loginWithTelegram"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors"
      >
        <SendIcon size="24" />
        <span>تسجيل الدخول بـ Telegram</span>
      </button>
      
      <p class="text-gray-500 text-sm text-center mt-4">
        سيتم فتح Telegram للمتابعة
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from '../stores/useStore.js'
import { Wallet as WalletIcon, Send as SendIcon } from 'lucide-vue-next'

export default {
  name: 'Auth',
  components: { WalletIcon, SendIcon },
  setup() {
    const store = useStore()
    const loading = ref(false)
    const error = ref(null)

    // التحقق من Telegram WebApp عند التحميل
    onMounted(() => {
      checkTelegramAuth()
    })

    const checkTelegramAuth = async () => {
      // التحقق إذا المستخدم جاي من Telegram WebApp
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const tgUser = window.Telegram.WebApp.initDataUnsafe.user
        loading.value = true
        
        await store.signInWithTelegram(tgUser)
        
        if (store.error) {
          error.value = store.error
        }
        
        loading.value = false
      }
    }

    const loginWithTelegram = () => {
      if (window.Telegram?.WebApp) {
        // إذا موجودين داخل Telegram، نستخدم البيانات الموجودة
        checkTelegramAuth()
      } else {
        // إذا خارج Telegram، نفتح البوت
        window.location.href = 'https://t.me/SYT_Wallet_bot'
      }
    }

    const retry = () => {
      error.value = null
      checkTelegramAuth()
    }

    return {
      loading,
      error,
      loginWithTelegram,
      retry
    }
  }
}
</script>
