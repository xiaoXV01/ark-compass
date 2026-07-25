/**
 * 用户身份服务 — 方舟与罗盘 (v2)
 *
 * 支持两种模式：
 *   - 匿名模式：启动时自动创建匿名用户（向后兼容，无需后端）
 *   - 登录模式：通过 JWT Token 连接后端账户系统
 *
 * 通过 localStorage 缓存当前用户状态。
 */

import {
  createUserIdentity,
  getUserIdentity,
  updateUserIdentity,
} from '../utils/db.js'
import { getToken, isLoggedIn, getMe } from './authApi.js'

// ─── localStorage 键 ────────────────────────────────────────

const LS_CURRENT_USER_ID = 'ark_compass_current_user_id'
const LS_ANON_USER_ID = 'ark_compass_anon_user_id'

// ─── 运行时缓存 ──────────────────────────────────────────────

/** @type {Object|null} */
let _currentUser = null

// ─── 工具函数 — 生成短 ID ────────────────────────────────────

function generateUserId() {
  const chars = '0123456789abcdef'
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * 16)]
  }
  return `user_${id}`
}

// ─── 核心 API ───────────────────────────────────────────────

/**
 * 初始化当前用户。
 *
 * 优先级：
 *   1. JWT Token 存在 → 调用 /api/auth/me 恢复登录用户
 *   2. 否则走匿名模式
 *
 * 建议在应用启动时调用一次。
 *
 * @returns {Promise<Object>}
 */
export async function initUser() {
  // 尝试从 token 恢复
  if (isLoggedIn()) {
    try {
      const data = await getMe()
      if (data && data.user) {
        _currentUser = {
          ...data.user,
          isAnonymous: false,
        }
        localStorage.setItem(LS_CURRENT_USER_ID, `auth_${data.user.id}`)
        return _currentUser
      }
    } catch {
      // token 无效，清除并回退匿名
      const { logout } = await import('./authApi.js')
      logout()
    }
  }

  // 匿名模式
  return initAnonymous()
}

/**
 * 初始化匿名用户（向后兼容）
 */
async function initAnonymous() {
  const anonId = localStorage.getItem(LS_ANON_USER_ID)

  if (anonId) {
    const user = await getUserIdentity(anonId)
    if (user) {
      _currentUser = { ...user, isAnonymous: true }
      localStorage.setItem(LS_CURRENT_USER_ID, user.userId)
      await updateUserIdentity(user.userId, {})
      return user
    }
  }

  const newUser = await createUserIdentity({
    userId: generateUserId(),
    nickname: '',
  })

  localStorage.setItem(LS_ANON_USER_ID, newUser.userId)
  localStorage.setItem(LS_CURRENT_USER_ID, newUser.userId)
  _currentUser = { ...newUser, isAnonymous: true }

  return newUser
}

/**
 * 外部调用：登录成功后设置当前用户
 * @param {Object} user - 后端返回的 user 对象 { id, email, nickname, role }
 */
export function setUser(user) {
  _currentUser = {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    role: user.role,
    isAnonymous: false,
  }
  localStorage.setItem(LS_CURRENT_USER_ID, `auth_${user.id}`)
}

/**
 * 登出：清除登录态，回退匿名模式
 */
export async function doLogout() {
  const { logout } = await import('./authApi.js')
  logout()
  _currentUser = null
  localStorage.removeItem(LS_CURRENT_USER_ID)
  return initAnonymous()
}

/**
 * 获取当前用户对象
 */
export function getCurrentUser() {
  return _currentUser
}

/**
 * 获取当前用户 ID
 */
export function getUserId() {
  return _currentUser
    ? _currentUser.userId || `auth_${_currentUser.id}`
    : null
}

/**
 * 设置/修改当前用户的昵称
 */
export async function setNickname(name) {
  if (!_currentUser) {
    throw new Error('用户尚未初始化，请先调用 initUser()')
  }

  const trimmed = (name || '').trim()

  // 登录用户走后端 API
  if (!_currentUser.isAnonymous) {
    const { updateProfile } = await import('./authApi.js')
    const data = await updateProfile({ nickname: trimmed })
    if (data && data.user) {
      _currentUser = { ..._currentUser, nickname: data.user.nickname }
    }
    return _currentUser
  }

  // 匿名用户走本地存储
  const updated = await updateUserIdentity(_currentUser.userId, {
    nickname: trimmed,
  })
  if (updated) {
    _currentUser = { ...updated, isAnonymous: true }
  }
  return _currentUser
}
