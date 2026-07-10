<template>
  <div class="user-badge-wrapper">
    <!-- 用户浮标 -->
    <div class="user-badge" @click="showDialog = true" :title="displayName">
      <svg class="badge-avatar-icon" viewBox="0 0 24 24" width="16" height="16">
        <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="none" stroke="currentColor" stroke-width="1.5"/>
      </svg>
      <span class="badge-name">{{ displayName }}</span>
      <span class="badge-gear">⚙</span>
    </div>

    <!-- 修改昵称弹窗 -->
    <el-dialog
      v-model="showDialog"
      title="✦ 旅行者印记"
      width="400px"
      :close-on-click-modal="true"
      custom-class="steampunk-dialog"
    >
      <div class="dialog-body">
        <!-- 当前身份展示 -->
        <div class="identity-display">
          <div class="identity-icon">
            <svg viewBox="0 0 100 100" width="60" height="60">
              <defs>
                <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#00B4D8"/>
                  <stop offset="100%" style="stop-color:#FF8C42"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="38" r="20" fill="none" stroke="currentColor" stroke-width="2.5"/>
              <path d="M16 88c0-18.8 15.2-34 34-34s34 15.2 34 34" fill="none" stroke="currentColor" stroke-width="2.5"/>
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#iconGrad)" stroke-width="1.5" opacity="0.3"/>
              <circle cx="50" cy="50" r="4" fill="url(#iconGrad)"/>
            </svg>
          </div>
          <div class="identity-info">
            <div class="identity-nickname">{{ displayName }}</div>
            <div class="identity-id">ID: {{ currentUserId }}</div>
          </div>
        </div>

        <!-- 昵称输入 -->
        <div class="nickname-section">
          <label class="nickname-label">✦ 更改你的旅行者之名</label>
          <div class="input-group">
            <input
              ref="nicknameInput"
              v-model="nickname"
              class="steampunk-input"
              placeholder="输入昵称..."
              maxlength="20"
              @keyup.enter="saveNickname"
            />
            <div class="input-decoration left">❮</div>
            <div class="input-decoration right">❯</div>
          </div>
          <p class="nickname-hint">留空则保持匿名状态 · 最多 20 字符</p>
        </div>
      </div>

      <!-- 底部操作 -->
      <template #footer>
        <div class="dialog-footer">
          <button class="steampunk-btn secondary" @click="showDialog = false">
            ◈ 取消
          </button>
          <button
            class="steampunk-btn primary"
            @click="saveNickname"
            :disabled="saving"
          >
            <span v-if="saving">⚙ 镌刻中...</span>
            <span v-else>⚙ 镌刻印记</span>
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/**
 * UserBadge.vue — 用户身份迷你浮标组件
 *
 * 蒸汽朋克风格右上角小控件：
 *   - 显示当前用户昵称/匿名标识
 *   - 点击弹出对话框修改昵称
 *   - 数据持久化到 IndexedDB
 */
import { ref, computed, onMounted, nextTick } from 'vue'
import {
  getCurrentUser,
  getUserId,
  setNickname,
} from '../services/userService.js'

// ─── 响应式状态 ──────────────────────────────────────────────

const showDialog = ref(false)
const nickname = ref('')
const saving = ref(false)
const nicknameInput = ref(null)

// ─── 计算属性 ────────────────────────────────────────────────

/** 用户显示名称：有昵称显示昵称，否则显示匿名占位 */
const displayName = computed(() => {
  const user = getCurrentUser()
  if (user && user.nickname) {
    return user.nickname
  }
  return '匿名·方舟旅行者'
})

/** 当前用户 ID 简短展示 */
const currentUserId = computed(() => {
  const id = getUserId()
  return id ? id.substring(0, 12) + '...' : '—'
})

// ─── 生命周期 ────────────────────────────────────────────────

onMounted(() => {
  // 从当前用户预填当前昵称
  const user = getCurrentUser()
  if (user && user.nickname) {
    nickname.value = user.nickname
  }
})

// 每次弹窗打开时聚焦输入框和重置昵称
// 使用 watch 不方便，通过在 dialog 的 open 事件处理
// 但 el-dialog 无原生 @open 事件；在点击按钮时提前填充

// ─── 方法 ────────────────────────────────────────────────────

/** 保存昵称 */
async function saveNickname() {
  saving.value = true
  try {
    await setNickname(nickname.value)
    showDialog.value = false
  } catch (err) {
    console.error('保存昵称失败：', err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* ====== 用户浮标 ====== */
.user-badge-wrapper {
  display: flex;
  align-items: center;
  margin-left: 12px;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid rgba(100, 95, 88, 0.25);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  font-size: 12px;
  font-family: 'Cinzel', serif;
  letter-spacing: 0.5px;
  background: rgba(42, 45, 48, 0.6);
  user-select: none;
}

.user-badge:hover {
  border-color: var(--brass);
  color: var(--brass-light);
  box-shadow: 0 0 10px rgba(184, 134, 11, 0.15);
  background: rgba(184, 134, 11, 0.05);
}

.badge-avatar-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.badge-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge-gear {
  font-size: 10px;
  opacity: 0.4;
  animation: spin 4s linear infinite;
  transition: opacity 0.3s;
}

.user-badge:hover .badge-gear {
  opacity: 0.7;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ====== 弹窗内容 ====== */
.dialog-body {
  padding: 8px 0;
}

/* 身份展示区 */
.identity-display {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 20px;
  background: rgba(42, 45, 48, 0.5);
  border: 1px solid rgba(100, 95, 88, 0.15);
  border-radius: 10px;
}

.identity-icon {
  flex-shrink: 0;
  color: var(--text-muted);
}

.identity-info {
  flex: 1;
  min-width: 0;
}

.identity-nickname {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.identity-id {
  font-size: 11px;
  color: var(--text-muted);
  font-family: monospace;
  letter-spacing: 0.5px;
}

/* 昵称输入区 */
.nickname-section {
  padding: 0 4px;
}

.nickname-label {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.input-group {
  position: relative;
}

.steampunk-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(42, 45, 48, 0.7);
  border: 1px solid rgba(100, 95, 88, 0.25);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: 'Cinzel', serif;
  font-size: 14px;
  letter-spacing: 1px;
  outline: none;
  transition: all 0.3s ease;
}

.steampunk-input:focus {
  border-color: var(--brass);
  box-shadow: 0 0 12px rgba(184, 134, 11, 0.15);
}

.steampunk-input::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

.input-decoration {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--text-muted);
  opacity: 0.3;
  pointer-events: none;
  transition: opacity 0.3s;
}

.steampunk-input:focus ~ .input-decoration {
  opacity: 0.6;
}

.input-decoration.left {
  left: -18px;
}

.input-decoration.right {
  right: -18px;
}

.nickname-hint {
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

/* ====== 弹窗底部按钮 ====== */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.steampunk-btn {
  padding: 10px 24px;
  border-radius: var(--radius-sm);
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  background: transparent;
}

.steampunk-btn.primary {
  background: linear-gradient(135deg, var(--compass-dark), var(--compass));
  border-color: rgba(126, 200, 227, 0.3);
  color: #FFF;
}

.steampunk-btn.primary:hover:not(:disabled) {
  box-shadow: 0 0 14px var(--compass-glow);
  transform: translateY(-1px);
}

.steampunk-btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.steampunk-btn.secondary {
  color: var(--text-secondary);
  border-color: rgba(100, 95, 88, 0.2);
}

.steampunk-btn.secondary:hover {
  border-color: var(--text-muted);
  color: var(--text-primary);
}
</style>

<style>
/* ====== 全局覆盖 — Element Plus Dialog 工业风格 ====== */
.steampunk-dialog {
  background: linear-gradient(180deg, #323538 0%, #2A2D30 100%) !important;
  border: 1px solid rgba(100, 95, 88, 0.3) !important;
  border-radius: 14px !important;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(184, 134, 11, 0.06),
    inset 0 1px 0 rgba(160, 165, 170, 0.06) !important;
}

.steampunk-dialog .el-dialog__header {
  padding: 20px 24px 12px;
  border-bottom: 1px solid rgba(100, 95, 88, 0.12);
}

.steampunk-dialog .el-dialog__title {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-primary) !important;
}

.steampunk-dialog .el-dialog__headerbtn {
  color: var(--text-muted);
  font-size: 18px;
}

.steampunk-dialog .el-dialog__headerbtn:hover {
  color: var(--brass-light);
}

.steampunk-dialog .el-dialog__body {
  padding: 16px 24px 20px;
  color: var(--text-primary);
}

.steampunk-dialog .el-dialog__footer {
  padding: 12px 24px 20px;
  border-top: 1px solid rgba(100, 95, 88, 0.08);
}

/* 弹窗遮罩层 */
.el-overlay {
  background: rgba(20, 22, 24, 0.7) !important;
  backdrop-filter: blur(4px);
}
</style>

/* ====== 响应式移动端 ====== */
@media (max-width: 768px) {
  .user-badge-wrapper {
    margin-left: 6px;
  }
  .user-badge {
    padding: 4px 8px;
    gap: 4px;
  }
  .badge-name {
    max-width: 60px;
    font-size: 10px;
  }
  .badge-avatar-icon {
    width: 12px;
    height: 12px;
  }
  .badge-gear {
    display: none;
  }
}
