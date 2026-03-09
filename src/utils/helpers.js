/**
 * Safely parse a price value to a number.
 * Handles both numeric and string prices (e.g., "£ 1,450").
 */
export function parsePrice(price) {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        const parsed = parseFloat(price.replace(/[^0-9.]/g, ''));
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}

/**
 * Safely parse JSON from localStorage with a fallback value.
 * Prevents app crashes from corrupted localStorage data.
 */
export function safeJsonParse(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw);
    } catch {
        console.warn(`Failed to parse localStorage key "${key}". Using fallback.`);
        return fallback;
    }
}

/**
 * Simple hash function for passwords.
 * NOTE: This is NOT cryptographically secure — for a real app, use bcrypt on a server.
 * But it prevents passwords from being stored in plain text in localStorage.
 */
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if two product identifiers match.
 */
export function isProductMatch(item, product) {
    return (item.id && product.id && item.id === product.id) || item.name === product.name;
}
