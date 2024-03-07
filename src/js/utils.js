export function $(selector, parent = document) {
	if (typeof selector !== 'string') return selector;
	return $(parent).querySelector(selector);
}

export function createElem(title) {
	return document.createElement(title);
}

export function distance(x1, y1, x2, y2) {
	const a = x1 - x2;
	const b = y1 - y2;
	return Math.sqrt(a * a + b * b);
}

export function generateId(length, _chars = '') {
	const chars = _chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}

export function clamp(val, min, max) {
	return Math.max(min, Math.min(val, max));
}

export function range2percentage(val, min, max) {
	return 100 / (max - min) * val;
}

export function snap(value, step) {
	if (step === 0) {
		throw new Error("Step cannot be zero");
	}

	const remainder = value % step;
	let result;

	if (remainder <= step / 2) {
		result = value - remainder;
	} else {
		result = value + step - remainder;
	}

	return result;
}

export function getNumberOfDigitsAfterPeriod(number) {
	let stringNumber = number.toString();
	let parts = stringNumber.split(".");

	if (parts.length > 1) {
		return parts[1].length;
	} else {
		return 0;
	}
}