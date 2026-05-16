export interface EncryptedFragment {
  iv: string
  data: string
}

export interface VaultRecord {
  id: string
  createdAt: string
  salt: string
  name?: string
  vlx?: string
  vaultBlob: EncryptedFragment
  wrappedVekWithMaster: EncryptedFragment
  wrappedVekWithRecovery: EncryptedFragment
}

const DB_NAME = 'vaulix'
const STORE_NAME = 'vaults'
const DB_VERSION = 1
const LOCAL_VLX_KEY = 'vaulix_vlx'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveVault(record: VaultRecord) {
  const db = await openDatabase()
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(record)

    request.onsuccess = () => {
      if (record.vlx) localStorage.setItem(LOCAL_VLX_KEY, record.vlx)
      resolve()
    }
    request.onerror = () => reject(request.error)
  })
}

export async function loadVault() {
  const db = await openDatabase()
  return new Promise<VaultRecord | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => {
      const result = request.result ?? []
      const first = result.length ? (result[0] as VaultRecord) : null
      if (first && !first.vlx) {
        const localVlx = localStorage.getItem(LOCAL_VLX_KEY)
        if (localVlx) {
          resolve({ ...first, vlx: localVlx })
          return
        }
      }
      resolve(first)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function listVaults(): Promise<VaultRecord[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result as VaultRecord[])
    request.onerror = () => reject(request.error)
  })
}

export function saveVlxLocal(serialized: string) {
  localStorage.setItem(LOCAL_VLX_KEY, serialized)
}

export function loadVlxLocal() {
  return localStorage.getItem(LOCAL_VLX_KEY)
}
