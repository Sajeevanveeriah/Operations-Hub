import type { AppData } from '../types'
import { generateDemoData } from './demoData'

const STORAGE_KEY = 'operations-hub-data'
const CURRENT_VERSION = 1

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      const demoData = generateDemoData()
      saveData(demoData)
      return demoData
    }

    const data: AppData = JSON.parse(stored)

    // Handle migrations
    if (data.version < CURRENT_VERSION) {
      return migrateData(data)
    }

    return data
  } catch (error) {
    console.error('Failed to load data:', error)
    return generateDemoData()
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save data:', error)
  }
}

export function resetDemoData(): AppData {
  const demoData = generateDemoData()
  saveData(demoData)
  return demoData
}

export function exportData(): string {
  const data = loadData()
  return JSON.stringify(data, null, 2)
}

export function importData(jsonString: string): AppData {
  try {
    const data: AppData = JSON.parse(jsonString)
    data.version = CURRENT_VERSION
    saveData(data)
    return data
  } catch (error) {
    console.error('Failed to import data:', error)
    throw new Error('Invalid JSON data')
  }
}

export function initializeStorage(): void {
  loadData()
}

function migrateData(data: AppData): AppData {
  // Add migration logic here when version changes
  let migrated = { ...data }

  // Example: if (data.version === 1) { ... }

  migrated.version = CURRENT_VERSION
  saveData(migrated)
  return migrated
}
