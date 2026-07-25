<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1>登录</h1>
        <p>欢迎回到方舟与罗盘</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
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
            autocomplete="current-password"
          />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>进入方舟</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>
          还没有账号？
          <router-link to="/register">立即注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/authApi.js'
import { setUser } from '../services/userService.js'

const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''

  if (!form.email || !form.password) {
    errorMsg.value = '请填写邮箱和密码'
    return
  }

  loading.value = true
  try {
    const data = await login({ email: form.email, password: form.password })
    setUser(data.user)
    router.replace('/')
  } catch (err) {
    errorMsg.value = err.message || '登录失败，请重试'
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

.btn-submit {
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #00B4D8, #0088aa);
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
  box-shadow: 0 4px 20px rgba(0, 180, 216, 0.25);
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
