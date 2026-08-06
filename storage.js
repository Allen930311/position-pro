/**
 * StorageManager - Environment-adaptive Storage Adapter
 * Smoothly handles the difference between chrome.storage and localStorage.
 */
const StorageManager = {
    // Detect if running in a Chrome Extension environment
    isExtension: () => typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local,

    /**
     * Save a value to storage
     * @param {string} key 
     * @param {any} value 
     */
    async save(key, value) {
        if (this.isExtension()) {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [key]: value }, resolve);
            });
        } else {
            localStorage.setItem(key, JSON.stringify(value));
            return Promise.resolve();
        }
    },

    /**
     * Get a value from storage
     * @param {string} key 
     * @param {any} defaultValue 
     */
    async get(key, defaultValue = null) {
        if (this.isExtension()) {
            return new Promise((resolve) => {
                chrome.storage.local.get([key], (result) => {
                    resolve(result[key] !== undefined ? result[key] : defaultValue);
                });
            });
        } else {
            const val = localStorage.getItem(key);
            try {
                return val !== null ? JSON.parse(val) : defaultValue;
            } catch (e) {
                return val !== null ? val : defaultValue;
            }
        }
    }
};

// Export for use in calculator.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
} else {
    window.StorageManager = StorageManager;
}
