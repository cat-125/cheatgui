/**
 * Useful utilities
 * @module
 */

import {
	GUIElement,
	Widget,
	Text,
	Button,
	Input,
	NumberInput,
	Slider,
	Switch,
	Dropdown,
	Tree,
	Box,
	Row
} from './widgets';

export type WidgetName = 'text' | 'button' | 'input' | 'number-input' | 'switch' | 'slider' | 'dropdown' | 'tree' | 'row' | 'container' | 'has-view' | 'widget' | 'gui-element' | 'unknown';

export const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);

/**
 * Shortcut for `parent.querySelector(selector)`.
 * @param {any} selector - CSS selector
 * @param {any} [parent=document] - Parent element
 * @returns {any}
 * @public
 */
export function $(selector: string | Element | Document, parent: Element | Document = document): any {
	if (typeof selector !== 'string') return selector;
	return $(parent).querySelector(selector);
}

/**
 * Create an HTML element
 * @param {string} type - HTML element 
 * @returns {any}
 * @public
 */
export function createElem(type: string): any {
	return document.createElement(type);
}

/**
 * Get the distance between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 * @public
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
	const a = x1 - x2;
	const b = y1 - y2;
	return Math.sqrt(a * a + b * b);
}

/**
 * Generate a random string
 * @param {number} length
 * @param {string} _chars - List of characters to use in the random string
 * @returns {string}
 * @public
 */
export function generateId(length: number, _chars: string = ''): string {
	const chars = _chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}

/**
 * Clamp a value between a minimum and a maximum
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 * @public
 */
export function clamp(val: number, min: number, max: number): number {
	return Math.max(min, Math.min(val, max));
}

/**
 * Convert a value between a minimum and a maximum to a percentage
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 * @public
 */
export function range2percentage(val: number, min: number, max: number): number {
	return 100 / (max - min) * val;
}

/**
 * Snap a value to the nearest multiple of a step
 * @param {number} value
 * @param {number} step
 * @returns {number}
 * @public
 */
export function snap(value: number, step: number): number {
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

/**
 * Get the number of digits after the decimal point
 * @param {number} number
 * @returns {number}
 * @deprecated use getNumberOfDigitsAfterPeriod instead
 * @public
 */
export function getNumberOfDigitsAfterPeriod(number: number): number {
	let stringNumber = number.toString();
	let parts = stringNumber.split(".");

	if (parts.length > 1) {
		return parts[1].length;
	}
	return 0;
}

/**
 * Get the number of digits after the decimal point
 * @param {number} number
 * @returns {number}
 * @public
 */
export function countDigitsAfterDecimal(number: number): number {
	const numberString = number.toString();
	const indexOfDecimal = numberString.indexOf('.');

	if (indexOfDecimal === -1) return 0;
	return numberString.length - indexOfDecimal - 1;
}

/**
 * Get the name of a widget
 * @param {GUIElement} widget
 * @returns {string}
 * @public
 */
export function getWidgetName(widget: GUIElement): WidgetName {
	if (typeof widget == 'string' || widget instanceof Text) {
		return 'text';
	} else if (widget instanceof Button) {
		return 'button'
	} else if (widget instanceof Input) {
		return 'input';
	} else if (widget instanceof NumberInput) {
		return 'number-input';
	} else if (widget instanceof Switch) {
		return 'switch';
	} else if (widget instanceof Slider) {
		return 'slider';
	} else if (widget instanceof Dropdown) {
		return 'dropdown';
	} else if (widget instanceof Tree) {
		return 'tree';
	} else if (widget instanceof Box) {
		return 'container';
	} else if (widget instanceof Row) {
		return 'row';
	} else if (typeof widget.view !== 'undefined') {
		return 'has-view';
	} else if (widget instanceof Widget) {
		return 'widget'
	} else if (widget instanceof GUIElement) {
		return 'gui-element';
	} else {
		return 'unknown';
	}
}

/**
 * Append a widget to the body
 * @param {Widget} widget
 * @public
 */
export function appendToBody(widget: Widget) {
	document.body.appendChild(widget.getRef());
}

/**
 * Include a CSS code
 * @param {string} css
 * @public
 */
export function includeCSS(css: string) {
	const head = document.head;
	const style = createElem('style');
	style.setAttribute('type', 'text/css');
	style.innerHTML = css;
	head.appendChild(style);
}

/**
 * Include a CSS link
 * @param {string} url
 * @public
 */
export function includeCSSLink(url: string) {
	const link: HTMLLinkElement = createElem('link');
	link.rel = 'stylesheet';
	link.href = url;
	document.head.appendChild(link);
}

/**
 * Include a JS file
 * @param {string} url
 * @public
 */
export function includeJS(url: string) {
	const script = createElem('script');
	script.src = url;
	document.body.appendChild(script);
}

/**
 * Load a CSS theme
 * @param {string} url
 * @public
 */
export function loadTheme(url: string) {
	const link = $(`link#cgui-theme`, document.head) ?? createElem('link');
	link.id = 'cgui-theme'
	link.rel = 'stylesheet';
	link.href = url;
	document.head.appendChild(link);
}