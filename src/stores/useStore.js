import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../config/supabase.js'

export const useStore = defineStore('main', () => {
  // ═══════════════════════════════════════
  // الحالة (State)
  // ═══════════════════════════════════════
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ═══════════════════════════════════════
  // الخصائص المحسوبة (Getters)
  // ═══════════════════════════════════════
  const isAuthenticated = computed(() => !!user.value)
  const userBalance = computed(() => user.value?.balance || 0)

  // ═══════════════════════════════════════
  // الإجراءات (Actions)
  // ═══════════════════════════════════════
  
  // التحقق من حالة تسجيل الدخول
  const checkAuth = async () => {
    // جلب الجلسة الحالية
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      await fetchUser(session.user.id)
    }
  }

  // جلب بيانات المستخدم من جدول users
  const fetchUser = async (userId) => {
    loading.value = true
    
    const { data, error: err } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (err) {
      error.value = err.message
    } else {
      user.value = data
    }
    
    loading.value = false
  }

  // تسجيل الدخول/إنشاء حساب باستخدام Telegram
  const signInWithTelegram = async (telegramUser) => {
    loading.value = true
    error.value = null

    try {
      // التحقق إذا المستخدم موجود
      let { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramUser.id)
        .single()

      if (existingUser) {
        // تحديث آخر دخول
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', existingUser.id)
        
        user.value = existingUser
      } else {
        // إنشاء مستخدم جديد
        const referralCode = 'SYT' + Math.floor(100000 + Math.random() * 900000)
        
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            telegram_id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name || '',
            username: telegramUser.username || '',
            referral_code: referralCode,
            balance: 0,
            total_earned: 0,
            tasks_completed: 0,
            is_active: true
          })
          .select()
          .single()

        if (createError) throw createError
        
        user.value = newUser
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // تسجيل الخروج
  const logout = () => {
    user.value = null
    supabase.auth.signOut()
  }

  // تحديث الرصيد
  const updateBalance = async (amount) => {
    if (!user.value) return
    
    const newBalance = parseFloat(user.value.balance || 0) + amount
    
    const { error: err } = await supabase
      .from('users')
      .update({ 
        balance: newBalance,
        total_earned: parseFloat(user.value.total_earned || 0) + amount
      })
      .eq('id', user.value.id)

    if (!err) {
      user.value.balance = newBalance
    }
  }

  // ═══════════════════════════════════════
  // تصدير كل شيء
  // ═══════════════════════════════════════
  return {
    user,
    loading,
    error,
    isAuthenticated,
    userBalance,
    checkAuth,
    fetchUser,
    signInWithTelegram,
    logout,
    updateBalance
  }
})
