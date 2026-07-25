/**
 * Ark & Compass — 后端 API 服务器
 *
 * 提供用户注册/登录（JWT）能力。
 * 使用 better-sqlite3 存储用户数据，零外部依赖数据库服务。
 */

import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ─── 路径 ─────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ─── 配置 ─────────────────────────────────────────────────────

const PORT = process.env.ARK_PORT || 3120
const JWT_SECRET =
  process.env.ARK_JWT_SECRET || 'ark-compass-jwt-secret-change-in-production'
const JWT_EXPIRES_IN = '7d'
const BCRYPT_ROUNDS = 10

// ─── 数据库初始化 ─────────────────────────────────────────────

const db = new Database(join(__dirname, 'data', 'users.db'))

// 自动创建 data 目录
import { mkdirSync, existsSync } from 'fs'
if (!existsSync(join(__dirname, 'data'))) {
  mkdirSync(join(__dirname, 'data'), { recursive: true })
}

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    nickname    TEXT    NOT NULL DEFAULT '',
    role        TEXT    NOT NULL DEFAULT 'user',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    last_login  TEXT
  )
`)

// ─── Express 初始化 ──────────────────────────────────────────

const app = express()

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', 'http://arskq.cn'],
    credentials: true,
  })
)
app.use(express.json())

// ─── JWT 工具 ─────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

// ─── 认证中间件 ───────────────────────────────────────────────

function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录，请先登录' })
  }

  try {
    const payload = verifyToken(header.slice(7))
    req.user = payload
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '登录已过期，请重新登录' })
    }
    return res.status(401).json({ error: '无效的登录凭证' })
  }
}

// ─── 健康检查 ─────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── 注册 ─────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body

    // 参数校验
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度不能少于6位' })
    }

    if (password.length > 64) {
      return res.status(400).json({ error: '密码长度不能超过64位' })
    }

    // 检查邮箱是否已注册
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) {
      return res.status(409).json({ error: '该邮箱已被注册' })
    }

    // 密码哈希
    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS)
    const displayName = (nickname || '').trim() || email.split('@')[0]

    // 写入数据库
    const result = db
      .prepare(
        'INSERT INTO users (email, password, nickname, created_at, updated_at) VALUES (?, ?, ?, datetime(\'now\'), datetime(\'now\'))'
      )
      .run(email, hashed, displayName)

    const user = {
      id: result.lastInsertRowid,
      email,
      nickname: displayName,
      role: 'user',
    }

    const token = signToken(user)

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('注册失败:', err)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

// ─── 登录 ─────────────────────────────────────────────────────

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' })
    }

    // 查找用户
    const user = db
      .prepare('SELECT id, email, password, nickname, role FROM users WHERE email = ?')
      .get(email)

    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    // 验证密码
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    // 更新最后登录时间
    db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(
      user.id
    )

    const token = signToken(user)

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('登录失败:', err)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

// ─── 获取当前用户信息 ─────────────────────────────────────────

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db
    .prepare('SELECT id, email, nickname, role, created_at FROM users WHERE id = ?')
    .get(req.user.id)

  if (!user) {
    return res.status(404).json({ error: '用户不存在' })
  }

  res.json({ user })
})

// ─── 修改昵称 ─────────────────────────────────────────────────

app.patch('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { nickname } = req.body

    if (!nickname || !nickname.trim()) {
      return res.status(400).json({ error: '昵称不能为空' })
    }

    const trimmed = nickname.trim()
    if (trimmed.length > 32) {
      return res.status(400).json({ error: '昵称长度不能超过32个字符' })
    }

    db.prepare(
      "UPDATE users SET nickname = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(trimmed, req.user.id)

    const user = db
      .prepare('SELECT id, email, nickname, role FROM users WHERE id = ?')
      .get(req.user.id)

    res.json({ user })
  } catch (err) {
    console.error('更新昵称失败:', err)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

// ─── 启动 ─────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🔐 Ark & Compass API 已启动 → http://localhost:${PORT}`)
  console.log(`   路径: POST /api/auth/register  — 注册`)
  console.log(`         POST /api/auth/login     — 登录`)
  console.log(`         GET  /api/auth/me        — 当前用户`)
  console.log(`         PATCH /api/auth/profile   — 修改昵称`)
  console.log(`         GET  /api/health          — 健康检查`)
})
