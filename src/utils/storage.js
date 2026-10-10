const STORAGE_KEYS = {
    userName: 'studychamp:userName',
    courses: 'studychamp:courses',
    sessions: 'studychamp:sessions',
    preferences: 'studychamp:preferences',
}

export function getStorageItem(key, fallback = null) {
    try {
        const item = localStorage.getItem(key)

        return item === null ? fallback : JSON.parse(item)
    } catch (error) {
        console.error(`Failed to read ${key} from localStorage:`, error)
        return fallback
    }
}

export function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
    } catch (error) {
        console.error(`Failed to save %{key} to localStorage:`, error)
        return false
    }
}

export function removeStorageItem(key) {
    localStorage.removeItem(key)
}

export { STORAGE_KEYS }