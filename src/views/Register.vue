<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1>注册</h1>
        <p>加入方舟与罗盘，开启新文明评估之旅</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-field">
          <label>昵称（选填）</label>
          <input
            v-model="form.nickname"
            type="text"
            placeholder="你的称呼"
            :disabled="loading"
            maxlength="32"
          />
        </div>

        <div class="form-field">
          <label>邮箱</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="your@email.com"
            :disabled="loading"
            autocomplete="email"
          />
        </div>

        <div class="form-field">
          <label>密码</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="至少6位密码"
            :disabled="loading"
            autocomplete="new-password"
          />
        </div>

        <div class="form-field">
          <label>确认密码</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="再输入一次密码"
            :disabled="loading"
            autocomplete="new-password"
          />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>

        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>创建账号</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>
          已有账号？
          <router-link to="/login">立即登录</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/authApi.js'
import { setUser } from '../services/userService.js'

const router = useRouter()

const form = reactive({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleRegister() {
  errorMsg.value = ''
  successMsg.value = ''

  if (!form.email || !form.password) {
    errorMsg.value = '邮箱和密码不能为空'
    return
  }

  if (form.password.length < 6) {
    errorMsg.value = '密码长度不能少于6位'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }

  loading.value = true
  try {
    const data = await register({
      email: form.email,
      password: form.password,
      nickname: form.nickname,
    })
    setUser(data.user)
    successMsg.value = '注册成功，正在跳转...'
    setTimeout(() => {
      router.replace('/')
    }, 800)
  } catch (err) {
    errorMsg.value = err.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--header-height) - 160px);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 48px 40px;
  background: rgba(46, 49, 52, 0.85);
  border: 1px solid rgba(184, 134, 11, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.auth-header {
  text-align: center;
  margin-bottom: 36px;
}

.auth-header h1 {
  font-family: 'Cinzel', serif;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #00B4D8, #FF8C42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.auth-header p {
  font-size: 14px;
  color: #7a7568;
  letter-spacing: 1px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field label {
  font-size: 12px;
  color: #7a7568;
  letter-spacing: 2px;
  font-weight: 600;
}

.form-field input {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(100, 95, 88, 0.3);
  background: rgba(42, 45, 48, 0.8);
  color: #e0dcd0;
  font-size: 15px;
  transition: border-color 0.3s ease;
  outline: none;
}

.form-field input:focus {
  border-color: rgba(0, 180, 216, 0.5);
  box-shadow: 0 0 8px rgba(0, 180, 216, 0.08);
}

.form-field input::placeholder {
  color: #5a5548;
}

.error-msg {
  color: #e05555;
  font-size: 13px;
  text-align: center;
  margin: -4px 0;
}

.success-msg {
  color: #4caf50;
  font-size: 13px;
  text-align: center;
  margin: -4px 0;
}

.btn-submit {
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #FF8C42, #cc6e2e);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}

.btn-submit:hover:not(:disabled) {
  box-shadow: 0 4px 20px rgba(255, 140, 66, 0.25);
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  text-align: center;
  margin-top: 28px;
  font-size: 13px;
  color: #7a7568;
}

.auth-footer a {
  color: #00B4D8;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
