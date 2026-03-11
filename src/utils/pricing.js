/**
 * Formats a numeric price into a localized currency string.
 * @param {number|string} price - The price to format.
 * @param {string} currencyCode - The ISO currency code (default: GBP).
 * @returns {string} - The formatted price string.
 */
export const formatPrice = (price, currencyCode = 'GBP') => {
    const num = Number(price);
    if (isNaN(num)) return '£0.00';

    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
    }).format(num);
};

/**
 * Calculates the total of a list of items.
 * @param {Array} items - List of items with price and quantity.
 * @returns {number} - The total sum.
 */
export const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 0)), 0);
};
