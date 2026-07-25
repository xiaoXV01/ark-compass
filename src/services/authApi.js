/**
 * Ark & Compass — Auth API 封装
 *
 * 与后端 /api/auth/* 交互，管理 JWT Token 和用户会话。
 */

const API_BASE = '/api'

// ─── Token 管理 ──────────────────────────────────────────────

const TOKEN_KEY = 'ark_auth_token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// ─── HTTP 封装 ──────────────────────────────────────────────

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `请求失败 (${res.status})`)
  }

  return data
}

// ─── Auth API ────────────────────────────────────────────────

/**
 * 注册新用户
 * @param {{ email: string, password: string, nickname?: string }} params
 */
export async function register({ email, password, nickname }) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, nickname }),
  })
  setToken(data.token)
  return data
}

/**
 * 登录
 * @param {{ email: string, password: string }} params
 */
export async function login({ email, password }) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.token)
  return data
}

/**
 * 获取当前登录用户信息
 */
export async function getMe() {
  return request('/auth/me')
}

/**
 * 修改昵称
 * @param {string} nickname
 */
export async function updateProfile({ nickname }) {
  return request('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify({ nickname }),
  })
}

/**
 * 登出（清除本地 token）
 */
export function logout() {
  clearToken()
}

/**
 * 判断是否已登录（通过检查是否有 token）
 */
export function isLoggedIn() {
  return !!getToken()
}

/**
 * 获取存储的 token（用于调试）
 */
export { getToken }
