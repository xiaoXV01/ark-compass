/**
 * Ark & Compass — IndexedDB 持久化存储层
 *
 * 使用 Dexie.js 管理本地数据库，支持四类数据模型：
 *   1. 用户身份 (UserIdentity)
 *   2. Ethos 自由评测记录 (FreeEthosRecord)
 *   3. Ethos 基准测试记录 (BenchmarkRecord)
 *   4. SQ 测评结果 (SQAssessmentRecord)
 *
 * 当 IndexedDB 不可用时自动降级为 localStorage 方案。
 */

import Dexie from 'dexie'

// ─── 数据库定义 ───────────────────────────────────────────────

const DB_NAME = 'ArkCompass'
const DB_VERSION = 1

class ArkCompassDB extends Dexie {
  constructor() {
    super(DB_NAME)

    this.version(DB_VERSION).stores({
      // 用户身份 — 极少记录，使用 userId 为主键
      userIdentity: '++id, userId, createdAt',

      // Ethos 自由评测记录
      freeEthosRecords: '++id, timestamp, overallScore',

      // Ethos 基准测试记录
      benchmarkRecords: '++id, timestamp, modelName, overallScore',

      // SQ 测评结果
      sqAssessments: '++id, timestamp, totalScore',
    })
  }
}

// ─── IndexedDB 实例 ──────────────────────────────────────────

let db = null

function getDB() {
  if (!db) {
    db = new ArkCompassDB()
    db.on('versionchange', () => {
      db.close()
      db = null
    })
  }
  return db
}

// ─── 降级存储 ─────────────────────────────────────────────────

const LS_PREFIX = 'ark_compass_'

function lsk(key) {
  return `${LS_PREFIX}${key}`
}

function lsGet(key) {
  try {
    const raw = localStorage.getItem(lsk(key))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(lsk(key), JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function lsRemove(key) {
  try {
    localStorage.removeItem(lsk(key))
  } catch {
    // ignore
  }
}

function lsGetAll(prefix) {
  const results = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(lsk(prefix))) {
        const val = JSON.parse(localStorage.getItem(key))
        if (val) results.push(val)
      }
    }
  } catch {
    // ignore
  }
  return results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
}

// 自增 ID 用于降级模式
let _lsAutoIncrement = (() => {
  const n = lsGet('_autoInc')
  if (typeof n === 'number') return n
  return 0
})()

function nextLsid() {
  _lsAutoIncrement += 1
  lsSet('_autoInc', _lsAutoIncrement)
  return _lsAutoIncrement
}

// ─── 可用性检测 ───────────────────────────────────────────────

let _idbAvailable = null

function isIDBAvailable() {
  if (_idbAvailable !== null) return _idbAvailable
  _idbAvailable = typeof indexedDB !== 'undefined' && !!indexedDB
  return _idbAvailable
}

/**
 * 选择存储后端：优先 IndexedDB，不可用时降级为 localStorage。
 * 返回 { useIDB: boolean }
 */
function storageBackend() {
  return { useIDB: isIDBAvailable() }
}

// ═══════════════════════════════════════════════════════════════
//  1. 用户身份
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} UserIdentity
 * @property {number} [id]           — IndexedDB 自增主键
 * @property {string}  userId        — 用户唯一标识
 * @property {string}  nickname      — 昵称
 * @property {number}  createdAt     — 创建时间戳 (ms)
 * @property {number}  lastActiveAt  — 最后活跃时间戳 (ms)
 */

export async function createUserIdentity(data) {
  const now = Date.now()
  const record = {
    userId: data.userId,
    nickname: data.nickname || '',
    createdAt: data.createdAt || now,
    lastActiveAt: now,
  }

  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    const id = await d.userIdentity.add(record)
    return { ...record, id }
  }

  // localStorage fallback — 使用 userId 作为标识
  lsSet(`user_${record.userId}`, { ...record, id: 1 })
  return { ...record, id: 1 }
}

export async function getUserIdentity(userId) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    const record = await d.userIdentity.where('userId').equals(userId).first()
    return record || null
  }

  return lsGet(`user_${userId}`)
}

export async function getAllUserIdentities() {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    return d.userIdentity.toArray()
  }

  return lsGetAll('user_')
}

export async function updateUserIdentity(userId, updates) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    const record = await d.userIdentity.where('userId').equals(userId).first()
    if (!record) return null
    const updated = { ...record, ...updates, lastActiveAt: Date.now() }
    await d.userIdentity.put(updated)
    return updated
  }

  const record = lsGet(`user_${userId}`)
  if (!record) return null
  const updated = { ...record, ...updates, lastActiveAt: Date.now() }
  lsSet(`user_${userId}`, updated)
  return updated
}

export async function deleteUserIdentity(userId) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    const record = await d.userIdentity.where('userId').equals(userId).first()
    if (record) await d.userIdentity.delete(record.id)
    return !!record
  }

  lsRemove(`user_${userId}`)
  return true
}

// ═══════════════════════════════════════════════════════════════
//  2. Ethos 自由评测记录
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} FreeEthosRecord
 * @property {number}  [id]              — 自增主键
 * @property {number}  timestamp         — 记录时间戳
 * @property {string}  inputText         — 输入文本
 * @property {Object}  scores            — 五维度分数
 * @property {number}  scores.ethics     — 伦理
 * @property {number}  scores.fairness   — 公平
 * @property {number}  scores.transparency — 透明度
 * @property {number}  scores.accountability — 问责
 * @property {number}  scores.inclusivity   — 包容性
 * @property {number}  overallScore      — 综合评分
 * @property {string}  [feedback]        — 反馈文本
 */

export async function createFreeEthosRecord(data) {
  const now = Date.now()
  const record = {
    timestamp: now,
    inputText: data.inputText || '',
    scores: {
      ethics: data.scores?.ethics ?? 0,
      fairness: data.scores?.fairness ?? 0,
      transparency: data.scores?.transparency ?? 0,
      accountability: data.scores?.accountability ?? 0,
      inclusivity: data.scores?.inclusivity ?? 0,
    },
    overallScore: data.overallScore ?? 0,
    feedback: data.feedback || '',
  }

  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    const id = await d.freeEthosRecords.add(record)
    return { ...record, id }
  }

  const id = nextLsid()
  lsSet(`freeEthos_${id}`, { ...record, id })
  return { ...record, id }
}

export async function getFreeEthosRecord(id) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    return (await d.freeEthosRecords.get(id)) || null
  }

  return lsGet(`freeEthos_${id}`)
}

export async function getAllFreeEthosRecords() {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    return d.freeEthosRecords.orderBy('timestamp').reverse().toArray()
  }

  return lsGetAll('freeEthos_')
}

export async function updateFreeEthosRecord(id, updates) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    const record = await d.freeEthosRecords.get(id)
    if (!record) return null
    const updated = { ...record, ...updates }
    await d.freeEthosRecords.put(updated)
    return updated
  }

  const record = lsGet(`freeEthos_${id}`)
  if (!record) return null
  const updated = { ...record, ...updates }
  lsSet(`freeEthos_${id}`, updated)
  return updated
}

export async function deleteFreeEthosRecord(id) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    await d.freeEthosRecords.delete(id)
    return true
  }

  lsRemove(`freeEthos_${id}`)
  return true
}

// ═══════════════════════════════════════════════════════════════
//  3. Ethos 基准测试记录
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} BenchmarkResultItem
 * @property {string} question    — 题目
 * @property {string} answer      — 模型回答
 * @property {number} score       — 单题评分
 *
 * @typedef {Object} BenchmarkRecord
 * @property {number}  [id]             — 自增主键
 * @property {number}  timestamp        — 记录时间戳
 * @property {string}  modelName        — AI 模型名称
 * @property {string}  testSize         — 题库规模 ('small' | 'standard')
 * @property {BenchmarkResultItem[]} results — 测试结果数组
 * @property {number}  overallScore     — 综合评分
 */

export async function createBenchmarkRecord(data) {
  const now = Date.now()
  const record = {
    timestamp: now,
    modelName: data.modelName || '',
    testSize: data.testSize || 'small',
    results: Array.isArray(data.results) ? data.results : [],
    overallScore: data.overallScore ?? 0,
  }

  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    const id = await d.benchmarkRecords.add(record)
    return { ...record, id }
  }

  const id = nextLsid()
  lsSet(`benchmark_${id}`, { ...record, id })
  return { ...record, id }
}

export async function getBenchmarkRecord(id) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    return (await d.benchmarkRecords.get(id)) || null
  }

  return lsGet(`benchmark_${id}`)
}

export async function getAllBenchmarkRecords() {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    return d.benchmarkRecords.orderBy('timestamp').reverse().toArray()
  }

  return lsGetAll('benchmark_')
}

export async function getBenchmarkRecordsByModel(modelName) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    return d.benchmarkRecords
      .where('modelName')
      .equals(modelName)
      .reverse()
      .toArray()
  }

  const all = lsGetAll('benchmark_')
  return all.filter((r) => r.modelName === modelName)
}

export async function updateBenchmarkRecord(id, updates) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    const record = await d.benchmarkRecords.get(id)
    if (!record) return null
    const updated = { ...record, ...updates }
    await d.benchmarkRecords.put(updated)
    return updated
  }

  const record = lsGet(`benchmark_${id}`)
  if (!record) return null
  const updated = { ...record, ...updates }
  lsSet(`benchmark_${id}`, updated)
  return updated
}

export async function deleteBenchmarkRecord(id) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    await d.benchmarkRecords.delete(id)
    return true
  }

  lsRemove(`benchmark_${id}`)
  return true
}

// ═══════════════════════════════════════════════════════════════
//  4. SQ 测评结果
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} SQAnswer
 * @property {number} questionId   — 题目索引
 * @property {number} optionId     — 选项索引 (0-based)
 *
 * @typedef {Object} SQAssessmentRecord
 * @property {number}  [id]        — 自增主键
 * @property {number}  timestamp   — 记录时间戳
 * @property {SQAnswer[]} answers  — 答案数组
 * @property {Object}  scores      — 各维度分数
 * @property {number}  totalScore  — 综合评分
 * @property {string}  title       — 称号名称
 */

export async function createSQAssessment(data) {
  const now = Date.now()
  const record = {
    timestamp: now,
    answers: Array.isArray(data.answers) ? data.answers : [],
    scores: data.scores || {},
    totalScore: data.totalScore ?? 0,
    title: data.title || '',
  }

  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    const id = await d.sqAssessments.add(record)
    return { ...record, id }
  }

  const id = nextLsid()
  lsSet(`sqAssessment_${id}`, { ...record, id })
  return { ...record, id }
}

export async function getSQAssessment(id) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    return (await d.sqAssessments.get(id)) || null
  }

  return lsGet(`sqAssessment_${id}`)
}

export async function getAllSQAssessments() {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    return d.sqAssessments.orderBy('timestamp').reverse().toArray()
  }

  return lsGetAll('sqAssessment_')
}

export async function updateSQAssessment(id, updates) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    const record = await d.sqAssessments.get(id)
    if (!record) return null
    const updated = { ...record, ...updates }
    await d.sqAssessments.put(updated)
    return updated
  }

  const record = lsGet(`sqAssessment_${id}`)
  if (!record) return null
  const updated = { ...record, ...updates }
  lsSet(`sqAssessment_${id}`, updated)
  return updated
}

export async function deleteSQAssessment(id) {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    await d.sqAssessments.delete(id)
    return true
  }

  lsRemove(`sqAssessment_${id}`)
  return true
}

// ═══════════════════════════════════════════════════════════════
//  通用工具
// ═══════════════════════════════════════════════════════════════

/**
 * 删除所有本地数据（IndexedDB + localStorage）
 * 返回成功/失败状态
 */
export async function clearAllData() {
  const { useIDB } = storageBackend()
  if (useIDB) {
    const d = getDB()
    await Promise.all([
      d.userIdentity.clear(),
      d.freeEthosRecords.clear(),
      d.benchmarkRecords.clear(),
      d.sqAssessments.clear(),
    ])
  }

  // 清除所有带前缀的 localStorage key
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(LS_PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k))

  _lsAutoIncrement = 0
  return true
}

/**
 * 获取各表的记录数量及存储后端类型
 */
export async function getStorageStats() {
  const { useIDB } = storageBackend()
  let userCount = 0
  let freeCount = 0
  let benchmarkCount = 0
  let sqCount = 0

  if (useIDB) {
    const d = getDB()
    ;[userCount, freeCount, benchmarkCount, sqCount] = await Promise.all([
      d.userIdentity.count(),
      d.freeEthosRecords.count(),
      d.benchmarkRecords.count(),
      d.sqAssessments.count(),
    ])
  } else {
    userCount = lsGetAll('user_').length
    freeCount = lsGetAll('freeEthos_').length
    benchmarkCount = lsGetAll('benchmark_').length
    sqCount = lsGetAll('sqAssessment_').length
  }

  return {
    backend: useIDB ? 'indexeddb' : 'localStorage',
    counts: {
      userIdentity: userCount,
      freeEthosRecords: freeCount,
      benchmarkRecords: benchmarkCount,
      sqAssessments: sqCount,
    },
  }
}
