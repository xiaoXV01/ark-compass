/**
 * 用户身份服务 — 方舟与罗盘
 *
 * 提供轻量级用户身份管理：
 *   - 启动时自动创建匿名用户
 *   - 支持设置/修改昵称
 *   - 通过 localStorage 缓存当前用户 ID
 *   - 为后续评测记录关联用户身份
 *
 * 注意：不需要注册/登录/密码，一切以匿名 + 昵称为基础。
 */

import {
  createUserIdentity,
  getUserIdentity,
  updateUserIdentity,
} from '../utils/db.js'

// ─── localStorage 键名 ──────────────────────────────────────

const LS_CURRENT_USER_ID = 'ark_compass_current_user_id'

// ─── 运行时缓存 ──────────────────────────────────────────────

/** @type {import('../utils/db.js').UserIdentity|null} */
let _currentUser = null

// ─── 工具函数 — 生成短 ID ────────────────────────────────────

/**
 * 生成一个较短的可读 ID（8位十六进制）
 * 类似 UUID 但更短，适用于本地匿名用户
 */
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
 * 如果 localStorage 中已有缓存 userId，则加载该用户；
 * 如果缓存不存在或加载失败，则创建一个新的匿名用户。
 * 建议在应用启动时调用一次。
 *
 * @returns {Promise<import('../utils/db.js').UserIdentity>}
 */
export async function initUser() {
  // 尝试从 localStorage 恢复当前用户 ID
  const cachedUserId = localStorage.getItem(LS_CURRENT_USER_ID)

  if (cachedUserId) {
    const user = await getUserIdentity(cachedUserId)
    if (user) {
      _currentUser = user
      // 更新最后活跃时间
      await updateUserIdentity(user.userId, {})
      return user
    }
  }

  // 缓存不存在或用户已被删除，创建新匿名用户
  const newUser = await createUserIdentity({
    userId: generateUserId(),
    nickname: '',
  })

  // 缓存 userId 到 localStorage
  localStorage.setItem(LS_CURRENT_USER_ID, newUser.userId)
  _currentUser = newUser

  return newUser
}

/**
 * 获取当前用户对象。
 * 如果尚未初始化，返回 null。
 *
 * @returns {import('../utils/db.js').UserIdentity|null}
 */
export function getCurrentUser() {
  return _currentUser
}

/**
 * 获取当前用户的 ID。
 * 如果尚未初始化，返回 null。
 *
 * @returns {string|null}
 */
export function getUserId() {
  return _currentUser ? _currentUser.userId : null
}

/**
 * 设置/修改当前用户的昵称。
 *
 * @param {string} name - 新昵称（空字符串表示重置为匿名）
 * @returns {Promise<import('../utils/db.js').UserIdentity>}
 */
export async function setNickname(name) {
  if (!_currentUser) {
    throw new Error('用户尚未初始化，请先调用 initUser()')
  }

  const trimmed = (name || '').trim()
  const updated = await updateUserIdentity(_currentUser.userId, {
    nickname: trimmed,
  })

  if (updated) {
    _currentUser = updated
  }

  return _currentUser
}
