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
	Container,
	Row
} from './cheatgui.js';

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
	}
	return 0;
}

export function getWidgetName(widget) {
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
	} else if (widget instanceof Container) {
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

export function appendToBody(widget) {
	document.body.appendChild(widget.getRef());
}

export function includeCSS(css) {
	const head = document.head;
	const style = createElem('style');
	style.setAttribute('type', 'text/css');
	style.innerHTML = css;
	head.appendChild(style);
}

export function includeCSSLink(url) {
	const link = createElem('link');
	link.rel = 'stylesheet';
	link.href = url;
	document.head.appendChild(link);
}

export function includeJS(url) {
	const script = createElem('script');
	script.src = url;
	document.body.appendChild(script);
}

export function loadTheme(url) {
	const link = $(`link#cgui-theme`, document.head) || createElem('link');
	link.id = 'cgui-theme'
	link.rel = 'stylesheet';
	link.href = url;
	document.head.appendChild(link);
}