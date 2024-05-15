/**
 * CheatGUI
 * 
 * @module
 * @author Cat-125
 * @license MIT
 * @see https://github.com/Cat-125/CheatGUI
 */

import '../css/cheatgui.css';

import { config, getConfig, updateConfig } from './config';
import * as utils from './utils';
export { utils, getConfig, updateConfig };

export const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);

const { $, createElem, generateId, distance, clamp, range2percentage, snap, countDigitsAfterDecimal } = utils;

/**
 * Class that supports event listeners.
 */
export class EventSupport {
	listeners: { [key: string]: Function[] };

	constructor() {
		this.listeners = {};
	}

	on(event: string, callback: Function) {
		if (!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push(callback);
	}

	off(event: string, callback: Function) {
		if (this.listeners[event]) {
			this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
		}
	}

	trigger(event: string, ...args: any[]) {
		if (this.listeners[event]) {
			this.listeners[event].forEach(callback => callback(...args));
		}
	}
}


/**
 * The base class for all elements in CheatGUI.
 * @public
 * @extends EventSupport
 */
export class GUIElement extends EventSupport {
  view: View;
	ref: HTMLElement | null;

	constructor() {
		super();
		this.ref = null;
	}

	/** Do the necessary initialization. */
	_init() {
		this.addClass('cgui');
	}

	/**
	 * Add one or more classes to an element.
	 * @param {string} classes
	 * @returns {GUIElement}
	 */
	addClass(...classes: string[]): this {
		this.ref?.classList.add(...classes);
		return this;
	}

	/**
	 * Remove one or more classes from an element.
	 * @param {string} classes
	 * @returns {GUIElement}
	 */
	removeClass(...classes: string[]): this {
		this.ref?.classList.remove(...classes);
		return this;
	}

	/**
	 * @returns {HTMLElement|null}
	 */
	getRef(): HTMLElement | null {
		return this.ref;
	}

	/**
	 * Destroy the element
	 */
	destroy() {
		if (typeof this.view !== 'undefined') this.view.destroy();
		this.ref?.remove();
	}
}

/**
 * A class that stores interface elements and displays them on a web page.
 * @public
 */
export class View {
	ref: HTMLElement | null;
	children: GUIElement[];

	constructor() {
		this.ref = null;
		this.children = [];
	}

	/**
	 * Use an existing HTML element for the view.
	 * @param {HTMLElement} target
	 * @returns {View}
	 */
	mount(target: HTMLElement): this {
		this.ref = $(target);
		return this;
	}

	/**
	 * Set the contents of the view.
	 * @param {string} value
	 * @returns {View}
	 */
	setContent(value: string): this {
		if (!this.ref) return this;
		this.ref.innerHTML = value;
		return this;
	}

	/**
	 * Set the contents of the view.
	 * @param {string} value
	 * @returns {View}
	 */
	setText(value: string): this {
		if (!this.ref) return this;
		this.ref.textContent = value;
		return this;
	}

	/**
	 * The `append` function appends a widget to a parent element and updates the list of children.
	 * @param {GUIElement} widget - The widget to append.
	 * @returns {View}
	 */
	append(widget: GUIElement): this {
		if (!this.ref) return this;
		this.ref.appendChild(widget.getRef());
		this.children.push(widget);
		return this;
	}

	/**
	 * Destroy the view and all its children.
	 */
	destroy() {
		this.children.forEach(c => c.destroy());
		this.ref = null;
	}

	/**
	 * Recursively returns a JSON representation of all values in the view.
	 * @returns {Object}
	 */
	getConfig(): object {
		function processView(view: View) {
			const res: { type: string; value: any[] } = {
				type: 'root',
				value: []
			};

			for (let i = 0; i < view.children.length; i++) {
				const child: GUIElement = view.children[i];
				const type = utils.getWidgetName(child);
				const el: { type: string; value: any } = { type, value: null };

				if (['input', 'number-input', 'switch', 'slider', 'select'].includes(type)) {
					// @ts-expect-error
					el.value = child.getValue();
				} else if (type === 'tree') {
					el.value = processView(child.view).value;
				} else if (type === 'has-view') {
					el.value = processView(child.view).value;
					// @ts-expect-error
				} else if (typeof child.getValue === 'function')
					// @ts-expect-error
					el.value = child.getValue();

				res.value[i] = el;
			}

			return res;
		}

		return processView(this);
	}

	/**
	 * Recursively loads the values of all child elements from the object.
	 * @param {Object} config
	 */
	loadConfig(config: object) {
		function processView(view: View, item: any) {
			const items = item.value;
			const widgets = view.children;
			let offset = 0;
			let warned = false;
			for (let i = 0; i < items.length; i++) {
				if (items[i].type !== utils.getWidgetName(widgets[i + offset])) {
					if (!warned) {
						console.warn(`Configuration mismatch! Trying to merge automatically... (${items[i].type}#${i} != ${utils.getWidgetName(widgets[i + offset])}#${i + offset} with offset ${offset})`);
						warned = true;
					}
					if (items.length === widgets.length) {
						console.warn(`Skipping field "${items[i].type}"`)
						continue;
					} else if (items.length < widgets.length) {
						if (items[i] === utils.getWidgetName(widgets[i + offset + 1])) {
							console.warn(`Assuming that ${utils.getWidgetName(widgets[i + offset - 1])} field has been added`);
						}
						offset++;
					} else if (items.length > widgets.length) {
						if (items[i] === utils.getWidgetName(widgets[i + offset - 1])) {
							console.warn(`Assuming that ${items[i + offset - 1]} field has been removed`);
						}
						offset--;
						continue;
					} else {
						console.warn('Unable to merge automatically; skipping')
						return;
					}
				}
				if (['input', 'number-input', 'switch', 'slider', 'dropdown'].includes(items[i].type))
					// @ts-expect-error
					widgets[i + offset].setValue(items[i].value);
				else if (items[i].type === 'tree' || items[i].type === 'has-view')
					widgets[i + offset].view.loadConfig(items[i]);
			}
		}

		processView(this, config);
	}
}

/**
 * This class represents a window with
 * various settings and the ability to
 * add child elements.
 * @public
 * @extends GUIElement
 */
export class Window extends GUIElement {
	ref: HTMLElement;
	headerRef: HTMLElement;
	titleRef: HTMLElement;
	arrowRef: HTMLElement;
	contentRef: HTMLElement;
	resizeRef: HTMLElement;
	x: number;
	y: number;
	width: number;
	height: number;
	collapsed: boolean;
	isDragging: boolean;
	isResizing: boolean;

	/**
	 * Creates a new window element.
	 * @param {Object} options - The options for the window
	 * @param {number} [options.x=0] - The x position of the window
	 * @param {number} [options.y=0] - The y position of the window
	 * @param {number} [options.width=100] - The width of the window
	 * @param {number} [options.height=100] - The height of the window
	 * @param {string} [options.title=''] - The title of the window
	 * @param {boolean} [options.expanded=true] - Whether the window is initially expanded
	 * @param {boolean} [options.collapsible=true] - Whether the window can be collapsed
	 * @param {number} [options.collapseThreshold=isMobile ? 10 : 3] - The threshold at which the window can be collapsed
	 * @param {boolean} [options.draggable=true] - Whether the window can be dragged
	 * @param {number} [options.dragThreshold=isMobile ? 10 : 3] - The threshold at which the window can be dragged
	 * @param {boolean} [options.resizable=true] - Whether the window can be resized
	 */
	constructor({
		x = 0,
		y = 0,
		width = 100,
		height = 100,
		title = '',
		expanded = true,
		collapsible = true,
		collapseThreshold = isMobile ? 10 : 3,
		draggable = true,
		dragThreshold = isMobile ? 10 : 3,
		resizable = true
	}: { x?: number; y?: number; width?: number; height?: number; title?: string; expanded?: boolean; collapsible?: boolean; collapseThreshold?: number; draggable?: boolean; dragThreshold?: number; resizable?: boolean; }) {
		super();
		// Create window element and set its properties
		this.ref = createElem('div');
		this._init();
		this.addClass('cgui-window');
		this.ref.style.position = 'absolute';
		this.ref.role = 'dialog';

		// Create header element and set its properties
		this.headerRef = createElem('div');
		this.headerRef.classList.add('cgui-window-header');

		// Create title element and set its properties
		const titleId = generateId(16);
		this.titleRef = createElem('span');
		this.titleRef.innerHTML = title;
		this.titleRef.id = titleId;
		this.titleRef.className = 'cgui-window-title';
		this.headerRef.appendChild(this.titleRef);
		this.setTitle(title);
		this.ref.setAttribute('aria-labeledby', titleId);

		// Add space after title
		this.headerRef.innerHTML += '&nbsp;';

		// Create arrow element and set its properties
		this.arrowRef = createElem('span');
		this.arrowRef.className = 'cgui-window-arrow';
		this.arrowRef.innerHTML = config.symbols.expanded;
		this.arrowRef.hidden = !collapsible;
		this.headerRef.appendChild(this.arrowRef);

		// Create content element and set its properties
		const contentId = generateId(16);
		this.contentRef = createElem('div');
		this.contentRef.id = contentId;
		this.contentRef.classList.add('cgui-window-content');
		this.ref.setAttribute('aria-describedby', contentId);

		// Create resize element and set its properties
		this.resizeRef = createElem('span');
		this.resizeRef.className = 'cgui-window-resize';
		this.resizeRef.innerHTML = config.symbols.resize;
		this.resizeRef.hidden = !resizable;

		// Create new View and mount it
		this.view = new View().mount(this.contentRef);

		// Append header and content to the window element
		this.ref.appendChild(this.headerRef);
		this.ref.appendChild(this.contentRef);
		this.ref.appendChild(this.resizeRef);

		// Set window position and size
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.ref.style.left = `${x}px`;
		this.ref.style.top = `${y}px`;
		this.resize(width, height);

		// Set initial collapsed state
		this.collapsed = !expanded;
		if (this.collapsed) this.collapse();

		// Add window to the document body
		document.body.appendChild(this.ref);

		// Initialize draggable, toggle, and activation functionality
		this.isDragging = this.isResizing = false;
		if (draggable) this.initDraggable(dragThreshold);
		if (resizable) this.initResize();
		if (collapsible) this.initToggleOnClick(collapseThreshold);
		this.initActivationOnClick();
	}

	/**
	 * Set the title of the window to the specified HTML string.
	 * @param {string} html - The HTML to set as the title
	 * @returns {Window}
	 */
	setTitle(html: string): this {
		this.titleRef.innerHTML = html;
		return this;
	}

	/**
	 * The `setContent` function sets the content of a view.
	 * @param value - The `value` parameter in the `setContent` function represents the content that you
	 * want to set for a particular view. It is the data or information that you want to display or
	 * update in the view.
	 * @returns {Window}
	 */
	setContent(value: string): this {
		this.view.setContent(value);
		return this;
	}

	/**
	 * The `setText` function sets the text value of a view element.
	 * @param value - The `value` parameter in the `setText` function represents the text that you want
	 * to set for a particular view. It is the text that you want to display or update in the view.
	 * @returns {Window}
	 */
	setText(value: string): this {
		this.view.setText(value);
		return this;
	}

	/**
	 * The `append` function appends a widget to a parent element and updates the list of children.
	 * @param {GUIElement} widget - The widget to append.
	 * @returns {Window}
	 */
	append(widget: GUIElement): this {
		this.view.append(widget);
		return this;
	}

	/**
	 * The `move` function moves the window to the specified coordinates.
	 * @param {number} x - The x coordinate of the window.
	 * @param {number} y - The y coordinate of the window.
	 * @returns {Window}
	 */
	move(x: number, y: number): this {
		this.ref.style.left = `${x}px`;
		this.ref.style.top = `${y}px`;
		this.x = x;
		this.y = y;
		return this;
	}

	/**
	 * The `setWidth` function sets the width of the window.
	 * @param {number} width
	 * @returns {Window}
	 */
	setWidth(width: number): this {
		width = Math.max(width, config.minWindowWidth);
		this.width = width;
		this.ref.style.width = `${width}px`;
		return this;
	}

	/**
	 * The `setHeight` function sets the height of the window.
	 * @param {number} height
	 * @returns {Window}
	 */
	setHeight(height: number): this {
		height = Math.max(height, config.minWindowHeight);
		this.height = height;
		this.contentRef.style.height = `${height}px`;
		return this;
	}

	/**
	 * The `resize` function sets the width and height of the window.
	 * @param {number} width - The new width of the window
	 * @param {number} height - The new height of the window
	 * @returns {Window}
	 */
	resize(width: number, height: number): this {
		this.setWidth(width);
		this.setHeight(height);
		return this;
	}

	/**
	 * The `collapse` function collapses the window.
	 * @returns {Window}
	 */
	collapse(): this {
		this.collapsed = true;
		this.ref.classList.add('collapsed');
		this.arrowRef.innerHTML = config.symbols.collapsed;
		return this;
	}

	/**
	 * The `expand` function expands the window.
	 * @returns {Window}
	 */
	expand(): this {
		this.collapsed = false;
		this.ref.classList.remove('collapsed');
		this.arrowRef.innerHTML = config.symbols.expanded;
		return this;
	}

	/**
	 * The `toggle` function toggles the window between collapsed and expanded.
	 * @returns {Window}
	 */
	toggle(): this {
		if (this.collapsed) {
			this.expand();
		} else {
			this.collapse();
		}
		return this;
	}

	/**
	 * The `hide` function hides the window.
	 * @returns {Window}
	 */
	hide(): this {
		this.ref.style.display = 'none';
		return this;
	}

	/**
	 * The `show` function shows the window.
	 * @returns {Window}
	 */
	show(): this {
		this.ref.style.display = 'block';
		return this;
	}

	/**
	 * The `destroy` function destroys the window.
	 */
	destroy() {
		this.view.destroy();
		this.ref.remove();
	}

	/**
	 * The `sendToTop` function sends the window to the top of the window stack.
	 * @returns {this}
	 */
	sendToTop(): this {
		if (this.ref.classList.contains('active')) return this;
		Array.from(document.getElementsByClassName('cgui-window')).forEach(win => win.classList.remove('active'));
		this.ref.classList.add('active');
		return this;
	}

	initActivationOnClick() {
		this.ref.addEventListener('pointerdown', () => {
			this.sendToTop();
		});
	}

	initToggleOnClick(threshold: number) {
		let isClick = false, startX: number, startY: number;
		this.headerRef.addEventListener('pointerdown', e => {
			isClick = true;
			startX = e.clientX;
			startY = e.clientY;
		});
		document.addEventListener('pointermove', e => {
			if (distance(startX, startY, e.clientX, e.clientY) > threshold)
				isClick = false;
		});
		this.headerRef.addEventListener('pointerup', () => {
			if (isClick) this.toggle();
		});
	}

	initDraggable(threshold: number) {
		let startX: number, startY: number, offsetX: number, offsetY: number, isMouseDown = false;

		const startDragging = () => {
			this.isDragging = true;
			this.ref.classList.add('cgui-dragging');
		}

		const onMouseDown = (e: any) => {
			e.preventDefault();
			e = e.touches ? e.touches[0] : e;
			isMouseDown = true;
			startX = e.clientX;
			startY = e.clientY;
			offsetX = e.clientX - this.ref.offsetLeft;
			offsetY = e.clientY - this.ref.offsetTop;
		};

		const onMouseMove = (e: any) => {
			e = e.touches ? e.touches[0] : e;
			if (!this.isDragging) {
				if (isMouseDown && distance(startX, startY, e.clientX, e.clientY) > threshold &&
					!this.isResizing) {
					startDragging();
				}
				else return;
			}
			this.move(e.clientX - offsetX, e.clientY - offsetY);
		};

		const onMouseUp = () => {
			this.isDragging = isMouseDown = false;
			if (this.ref.classList.contains('cgui-dragging'))
				this.ref.classList.remove('cgui-dragging');
		};

		this.headerRef.addEventListener('mousedown', onMouseDown);
		this.headerRef.addEventListener('touchstart', onMouseDown);

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('touchmove', onMouseMove);

		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('touchend', onMouseUp);
	}

	initResize() {
		let sx: number, sy: number, dx: number, dy: number, iw: number, ih: number;

		const onMouseDown = (e: any) => {
			if (this.collapsed) return;
			e.preventDefault();
			e.stopPropagation();
			e = e.touches ? e.touches[0] : e;
			this.isResizing = true;
			[sx, sy, iw, ih] = [e.clientX, e.clientY, this.width, this.height];
			this.addClass('cgui-resizing');
		};

		const onMouseMove = (e: any) => {
			if (this.isResizing) {
				e = e.touches ? e.touches[0] : e;
				dx = e.clientX - sx;
				dy = e.clientY - sy;
				const newWidth = iw + dx;
				const newHeight = ih + dy;
				this.setWidth(newWidth);
				this.setHeight(newHeight);
			}
		};

		const onMouseUp = () => {
			this.isResizing = false;
			this.removeClass('cgui-resizing');
		};

		this.resizeRef.addEventListener('mousedown', onMouseDown);
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);

		this.resizeRef.addEventListener('touchstart', onMouseDown);
		document.addEventListener('touchmove', onMouseMove);
		document.addEventListener('touchend', onMouseUp);
	}

	/**
	 * The `getRef` function returns the reference to the window element.
	 * @returns {HTMLElement}
	 */
	getRef(): HTMLElement {
		return this.ref;
	}

	/**
	 * The `children` getter returns the list of children.
	 */
	get children() {
		return this.view.children;
	}

	/**
	 * The `getConfig` function returns a JSON representation of all values in the window.
	 * @returns {Object}
	 */
	getConfig(): object {
		return this.view.getConfig();
	}

	/**
	 * The `loadConfig` function loads a JSON configuration into the window.
	 * @param {Object} config - The JSON configuration.
	 * @returns {Window}
	 */
	loadConfig(config: object): this {
		this.view.loadConfig(config);
		return this;
	}
}

/**
 * A class that represents a user interface widget.
 * @public
 * @extends GUIElement
 */
export class Widget extends GUIElement {
	ref: HTMLElement;
	value: any;
	
	/**
	 * Create a new widget and initialize it.
	 * @param {string} [elementType='div'] - The HTML element type.
	 */
	constructor(elementType: string = 'div') {
		super();
		this.ref = createElem(elementType);
		this._init();
		this.addClass('cgui-widget');
		this.ref.addEventListener('click', () => this.trigger('click'));
	}

	/**
	 * Set the content of the widget.
	 * @param {string} value - The value to set the content to.
	 * @returns {Widget}
	 */
	setContent(value: string): this {
		this.ref.innerHTML = value;
		return this;
	}

	/**
	 * Set the text of the widget.
	 * @param {string} value - The value to set the text to.
	 * @returns {Widget}
	 */
	setText(value: string): this {
		this.ref.textContent = value;
		return this;
	}

	/**
	 * Add a click event listener to the widget.
	 * @param {Function} f - The function to call when the widget is clicked.
	 * @returns {Widget}
	 */
	onClick(f: Function): this {
		this.on('click', f);
		return this;
	}

	bind(obj: object, prop: string) {
		throw new SyntaxError("The `click` event cannot be bound. Use `onClick()` instead.");
	}
}

/**
 * Widget with value
 * @public
 */
interface ValueWidget extends Widget {
	value: any;
	getValue(): any;
	setValue(value: any): ValueWidget;
}


/**
 * A class that represents a text widget.
 * @public
 */
export class Text extends Widget {
	/**
	 * Create a new text widget and initialize it.
	 * @param {string} [text=''] - The text to display.
	 */
	constructor(text: string = '') {
		super('div');
		this.addClass('cgui-text');
		this.setText(text);
	}
}

/**
 * A class that represents a button widget.
 * @public
 * @extends Widget
 */
export class Button extends Widget {
	/**
	 * Create a new button widget and initialize it.
	 * @param {string} [text=''] - Button text.
	 * @param {Function} [callback=null] - The function to call when the button is clicked.
	 */
	constructor(text: string = '', callback: Function = null) {
		super('button');
		this.addClass('cgui-btn');
		this.setText(text);
		if (callback) this.onClick(callback);
	}
}

/**
 * A class that represents an input field widget.
 * @public
 * @ extends Widget implements ValueWidget
 */
export class Input extends Widget implements ValueWidget {
	ref: HTMLDivElement;
	inputRef: HTMLInputElement;
	labelRef: HTMLDivElement;

	/**
	 * Create a new input field widget and initialize it.
	 * @param {string} [label=''] - The label text.
	 * @param {string} [val=''] - The initial value.
	 * @param {Function} [callback=null] - The function to call when the input is changed.
	 */
	constructor(label: string = '', val: string = '', callback: Function = null) {
		super('div');

		this.addClass('cgui-input-wrapper');

		this.inputRef = createElem('input');
		this.inputRef.classList.add('cgui-input');
		this.ref.appendChild(this.inputRef);

		this.labelRef = createElem('div');
		this.labelRef.classList.add('cgui-input-label');
		this.ref.appendChild(this.labelRef);

		this.setValue(val);
		this.setLabel(label);

		this.inputRef.addEventListener('input', () => {
			this.trigger('change', this.getValue());
			this.trigger('input', this.getValue());
		});

		if (callback) this.onInput(callback);
	}

	/**
	 * Set the label of the input field.
	 * @param {string} label - The new label text.
	 * @returns {Input}
	 */
	setLabel(label: string): this {
		this.labelRef.innerHTML = label;
		return this;
	}

	/**
	 * Add an input event listener to the input field.
	 * @param {Function} f - The function to call when the input is changed.
	 * @returns {Input}
	 */
	onInput(f: Function): this {
		this.on('input', (e: any) => f(e, this.getValue()));
		return this;
	}

	/**
	 * Bind an input field to an object property.
	 * @param {Object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {Input}
	 */
	bind(obj: any, prop: string): this {
		this.onInput((_: any, val: any) => obj[prop] = val);
		return this;
	}

	/**
	 * Set the value of the input field.
	 * @param {string} value 
	 * @returns {Input}
	 */
	setValue(value: string): this {
		this.inputRef.value = value;
		return this;
	}

	/**
	 * Get the value of the input field.
	 * @returns {string} - The value of the input field.
	 */
	getValue(): string {
		return this.inputRef.value;
	}
}

/**
 * A class that represents an input field
 * where only numbers can be entered.
 * @public
 * @ extends Widget implements ValueWidget
 */
export class NumberInput  extends Widget implements ValueWidget {
	ref: HTMLDivElement;
	inputRef: HTMLInputElement;
	labelRef: HTMLDivElement;

	/**
	 * Create a new number input field and initialize it.
	 * @param {string} [label=''] - The label text.
	 * @param {number} [value=0] - The initial value.
	 * @param {Function} [callback=null] - The function to call when the input is changed.
	 */
	constructor(label: string = '', value: number = 0, callback: Function = null) {
		super('div');

		this.addClass('cgui-input-wrapper');

		this.inputRef = createElem('input');
		this.inputRef.classList.add('cgui-input');
		this.inputRef.type = 'number';
		this.ref.appendChild(this.inputRef);

		this.labelRef = createElem('div');
		this.labelRef.classList.add('cgui-input-label');
		this.ref.appendChild(this.labelRef);

		this.setValue(value.toString());
		this.setLabel(label);

		this.inputRef.addEventListener('input', () => {
			this.trigger('change', this.getValue());
			this.trigger('input', this.getValue());
		});

		if (callback) this.onInput(callback);
	}

	/**
	 * Set the label of the input field.
	 * @param {string} label - The new label text.
	 * @returns {NumberInput}
	 */
	setLabel(label: string): this {
		this.labelRef.innerHTML = label;
		return this;
	}

	/**
	 * Add an input event listener to the input field.
	 * @param {Function} f - The function to call when the input is changed.
	 * @returns {NumberInput}
	 */
	onInput(f: Function): this {
		this.on('input', (e: any) => f(e, this.getValue()));
		return this;
	}

	/**
	 * Bind an input field to an object property.
	 * @param {Object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {NumberInput}
	 */
	bind(obj: any, prop: string): this {
		this.onInput((_: any, val: any) => obj[prop] = val);
		return this;
	}

	/**
	 * Set the value of the input field.
	 * @param {string} value 
	 * @returns {NumberInput}
	 */
	setValue(value: string): this {
		this.inputRef.value = this.parse(value).toString();
		return this;
	}

	/**
	 * Get the value of the input field.
	 * @returns {string} - The value of the input field.
	 */
	getValue(): number {
		return this.parse(this.inputRef.value);
	}

	parse(value: string) {
		const p = parseFloat(value);
		return isNaN(p) ? 0 : (p || 0);
	}
}

/**
 * A class representing a slider where you can select a value from a specific range.
 * @public
 * @ extends Widget implements ValueWidget
 */
export class Slider  extends Widget implements ValueWidget {
	ref: HTMLDivElement;
	sliderRef: HTMLDivElement;
	thumbRef: HTMLDivElement;
	labelRef: HTMLDivElement;
	min: number;
	max: number;
	step: number;
	accuracy: number;

	/**
	 * Create a new slider and initialize it.
	 * @param {Object} options - The options for the slider
	 * @param {string} [options.label=''] - The label text
	 * @param {number} [options.value=0] - The initial value
	 * @param {number} [options.min=0] - The minimum value
	 * @param {number} [options.max=100] - The maximum value
	 * @param {number} [options.step=1] - The step size
	 * @param {null} [options.callback=null] - The function to call when the slider is changed
	 */
	constructor({
		label = '',
		value = 0,
		min = 0,
		max = 100,
		step = 1,
		callback = null
	}: { label?: string; value?: number; min?: number; max?: number; step?: number; callback?: null; }) {
		super('div');

		this.addClass('cgui-slider-wrapper');

		this.sliderRef = createElem('div');
		this.sliderRef.classList.add('cgui-slider');
		this.ref.appendChild(this.sliderRef);

		this.thumbRef = createElem('div');
		this.thumbRef.classList.add('cgui-slider-thumb');
		this.sliderRef.appendChild(this.thumbRef);

		this.labelRef = createElem('div');
		this.labelRef.classList.add('cgui-slider-label');
		this.ref.appendChild(this.labelRef);

		this.setMin(min);
		this.setMax(max);
		this.setStep(step);

		this.setValue(value);
		this.setLabel(label);

		this.initSlider();

		if (callback) this.onChange(callback);
	}

	/**
	 * Set the label of the slider.
	 * @param {string} text - The new label text.
	 * @returns {Slider}
	 */
	setLabel(text: string): this {
		this.labelRef.innerHTML = text;
		return this;
	}

	/**
	 * Add a change event listener to the slider.
	 * @param {Function} f - The function to call when the slider is changed.
	 * @returns {Slider}
	 */
	onChange(f: Function): this {
		this.on('change', (e: any) => f(e, this.getValue()));
		return this;
	}

	/**
	 * Bind a slider to an object property.
	 * @param {Object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {Slider}
	 */
	bind(obj: any, prop: string): this {
		this.onChange((_: any, val: any) => obj[prop] = val);
		return this;
	}

	/**
	 * Set the minimum value of the slider.
	 * @param {number} min - The new minimum value.
	 * @returns {Slider}
	 */
	setMin(min: number): this {
		this.min = min;
		return this;
	}

	/**
	 * Set the maximum value of the slider.
	 * @param {number} max - The new maximum value.
	 * @returns {Slider}
	 */
	setMax(max: number): this {
		this.max = max;
		return this;
	}

	/**
	 * Set the step size of the slider.
	 * @param {number} step - The new step size.
	 * @returns {Slider}
	 */
	setStep(step: number): this {
		this.step = step;
		this.accuracy = countDigitsAfterDecimal(step);
		return this;
	}

	/**
	 * Set the value of the slider.
	 * @param {number} value - The new value.
	 */
	setValue(value: number) {
		value = parseFloat(clamp(snap(value, this.step), this.min, this.max).toFixed(this.accuracy));
		this.value = value;
		const displayValue = 100 / (this.max - this.min) * (value - this.min);
		this.thumbRef.style.marginLeft = displayValue + '%';
		this.thumbRef.style.transform = `translateX(-${displayValue}%)`;
		this.thumbRef.textContent = value.toString();
		return this;
	}


	initSlider() {
		let isDragging = false;
		const onMouseDown = (e: any) => {
			isDragging = true;
			updateSlider(e);
			document.addEventListener('mousemove', updateSlider);
			document.addEventListener('touchmove', updateSlider);
		};
		const onMouseUp = () => {
			if (!isDragging) return;
			isDragging = false;
			this.trigger('change');
			document.removeEventListener('mousemove', updateSlider);
			document.removeEventListener('touchmove', updateSlider);
		};
		const updateSlider = (e: any) => {
			if (!isDragging) return;
			e.preventDefault();
			e = e.touches ? e.touches[0] : e;
			const bb = this.sliderRef.getBoundingClientRect();
			const style1 = getComputedStyle(this.sliderRef);
			const style2 = getComputedStyle(this.thumbRef);
			this.setValue(range2percentage(
				(e.clientX - bb.left - (parseFloat(getComputedStyle(this.thumbRef).getPropertyValue('width')) / 1.6)),
				bb.left + parseFloat(style1.getPropertyValue('padding-left')) +
				parseInt(style2.getPropertyValue('width')) / 2,
				bb.right - parseFloat(style1.getPropertyValue('padding-right')) -
				parseInt(style2.getPropertyValue('width')) / 2
			) / 100 * (this.max - this.min) + this.min);
		};
		this.sliderRef.addEventListener('mousedown', onMouseDown);
		document.addEventListener('mouseup', onMouseUp);
		this.sliderRef.addEventListener('touchstart', onMouseDown);
		document.addEventListener('touchend', onMouseUp);
	}

	/**
	 * Get the current value of the slider.
	 * @returns {number}
	 */
	getValue(): number {
		return this.value;
	}
}

/**
 * A class that represents a switch that can be turned on and off.
 * @public
 * @ extends Widget implements ValueWidget
 */
export class Switch  extends Widget implements ValueWidget {
	ref: HTMLLabelElement;
	inputRef: HTMLInputElement;
	sliderRef: HTMLSpanElement;
	labelRef: HTMLSpanElement;
	id: string;

	/**
	 * Create a new switch.
	 * @param {string} [label=''] - The label text.
	 * @param {boolean} [checked=false] - Whether the switch is initially checked.
	 * @param {Function} [callback=null] - The callback function to call when the switch is changed.
	 */
	constructor(label: string = '', checked: boolean = false, callback: Function = null) {
		super('label');
		const id = this.id = generateId(16);
		this.ref.htmlFor = id;
		this.addClass('cgui-switch');
		this.inputRef = createElem('input');
		this.inputRef.type = 'checkbox';
		this.inputRef.id = id;
		this.ref.appendChild(this.inputRef);
		this.inputRef.checked = checked;
		this.sliderRef = createElem('span');
		this.sliderRef.className = 'cgui-switch-slider';
		this.ref.appendChild(this.sliderRef);
		this.labelRef = createElem('span');
		this.labelRef.className = 'cgui-switch-label';
		this.ref.appendChild(this.labelRef);
		this.ref.tabIndex = 0;
		this.setLabel(label);

		this.inputRef.addEventListener('change', () => {
			this.trigger('change', this.getValue());
			this.trigger('input', this.getValue());
		});

		if (callback) this.onChange(callback);
	}

	/**
	 * Set the callback function to call when the switch is changed.
	 * @param {Function} func - The callback function to call when the switch is changed.
	 * @returns {Switch}
	 */
	onChange(func: Function): this {
		this.on('change', (e: any) => func(e, this.inputRef.checked));
		return this;
	}

	/**
	 * Bind a property to the switch.
	 * @param {object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {Switch}
	 */
	bind(obj: any, prop: string): this {
		this.onChange((_: any, val: any) => obj[prop] = val);
		return this;
	}

	/**
	 * Get whether the switch is checked.
	 * @returns {boolean}
	 */
	isChecked(): boolean {
		return this.inputRef.checked;
	}

	/**
	 * Get whether the switch is checked.
	 * @returns {boolean}
	 */
	getValue(): boolean {
		return this.isChecked();
	}

	/**
	 * Set whether the switch is checked.
	 * @param {boolean} val
	 * @returns {Switch}
	 */
	setValue(val: boolean): this {
		this.inputRef.checked = val;
		return this;
	}

	/**
	 * Set the label of the switch.
	 * @param {string} label
	 * @returns {Switch}
	 */
	setLabel(label: string): this {
		this.labelRef.innerHTML = label;
		return this;
	}
}

/**
 * A class that represents a menu for selecting one of several values.
 * @public
 * @ extends Widget implements ValueWidget
 */
export class Dropdown  extends Widget implements ValueWidget {
	ref: HTMLLabelElement;
	selRef: HTMLSelectElement;
	labelRef: HTMLSpanElement;
	id: string;

	/**
	 * Create a new dropdown.
	 * 
	 * The values parameter should be an object where the keys are the display text and
	 * the values are the actual values.
	 * 
	 * @param {string} [label=''] - The label text.
	 * @param {Object} [values={}] - The values to display in the dropdown.
	 * @param {string} [value=null] - The initial value of the dropdown.
	 * @param {Function} [callback=null] - The callback function to call when the value
	 * is changed.
	 */
	constructor(label: string = '', values: object = {}, value: string = null, callback: Function = null) {
		super('label');
		const id = this.id = generateId(16);
		this.ref.htmlFor = id;
		this.addClass('cgui-input-wrapper');
		this.selRef = createElem('select');
		this.selRef.id = id;
		this.selRef.classList.add('cgui-input');
		this.ref.appendChild(this.selRef);
		for (const [k, v] of Object.entries(values)) {
			const opt = createElem('option');
			opt.textContent = k;
			opt.value = v;
			if (v === value) opt.selected = true;
			this.selRef.appendChild(opt);
		}
		this.labelRef = createElem('span');
		this.labelRef.className = 'cgui-input-label';
		this.ref.appendChild(this.labelRef);
		this.ref.tabIndex = 0;
		this.setLabel(label);

		if (callback) this.onChange(callback);
	}

	/**
	 * Set the callback function to call when the value is changed.
	 * @param {Function} func - The callback function to call when the value is changed.
	 * @returns {Dropdown}
	 */
	onChange(func: Function): this {
		this.selRef.addEventListener('change', e => func(e, this.getValue()));
		return this;
	}

	/**
	 * Bind a property to the dropdown.
	 * @param {object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {Dropdown}
	 */
	bind(obj: any, prop: string): this {
		this.onChange((_: any, val: any) => obj[prop] = val);
		return this;
	}

	/**
	 * Get the value of the dropdown.
	 * @returns {string}
	 */
	getValue(): string {
		return this.selRef.options[this.selRef.selectedIndex].value;
	}

	/**
	 * Set the value of the dropdown.
	 * @param {string} val
	 * @returns {Dropdown}
	 */
	setValue(val: string): this {
		this.selRef.value = val;
		return this;
	}

	/**
	 * Set the label of the dropdown.
	 * @param {string} label
	 * @returns {Dropdown}
	 */
	setLabel(label: string): this {
		this.labelRef.innerHTML = label;
		return this;
	}
}

/**
 * A tree that can be expanded and collapsed, and can also have children.
 * @public
 * @extends Widget
 */
export class Tree extends Widget {
	ref: HTMLDivElement;
	headerRef: HTMLDivElement;
	titleRef: HTMLSpanElement;
	arrowRef: HTMLSpanElement;
	contentRef: HTMLDivElement;

	/**
	 * Create a new tree that can be expanded and collapsed. You can add children to the tree
	 * with the `addChild` method so that they appear in the tree.
	 * @param {string} [title=''] - The title of the tree.
	 * @param {boolean} [expanded=false] - Whether the tree is expanded.
	 */
	constructor(title: string = '', expanded: boolean = false) {
		super('div');
		this.addClass('cgui-tree');

		// Create header element and set its properties
		this.headerRef = createElem('div');
		this.headerRef.classList.add('cgui-tree-header');

		// Create title element and set its properties
		const titleId = generateId(16);
		this.titleRef = createElem('span');
		this.titleRef.id = titleId;
		this.titleRef.className = 'cgui-tree-title';
		this.headerRef.appendChild(this.titleRef);
		this.headerRef.tabIndex = 0;
		this.setTitle(title);

		// Add space after title
		this.headerRef.innerHTML += '&nbsp;';

		// Create arrow element and set its properties
		this.arrowRef = createElem('span');
		this.arrowRef.className = 'cgui-tree-arrow';
		this.arrowRef.innerHTML = config.symbols.expanded;
		this.headerRef.appendChild(this.arrowRef);

		// Create content element and set its properties
		const contentId = generateId(16);
		this.contentRef = createElem('div');
		this.contentRef.id = contentId;
		this.contentRef.classList.add('cgui-tree-content');

		// Create new View and mount it
		this.view = new View().mount(this.contentRef);

		// Append header and content to the tree element
		this.ref.appendChild(this.headerRef);
		this.ref.appendChild(this.contentRef);

		// Set initial collapsed state
		if (!expanded) this.collapse();

		// Initialize toggle functionality
		this.initToggleOnClick();
	}

	/**
	 * Set the title of the tree.
	 * @param {string} html
	 * @returns {Tree}
	 */
	setTitle(html: string): this {
		this.titleRef.innerHTML = html;
		return this;
	}

	/**
	 * Set the content of the tree.
	 * @param {string} html
	 * @returns {Tree}
	 */
	setContent(html: string): this {
		this.view.setContent(html);
		return this;
	}

	/**
	 * Collapse the tree.
	 * @returns {Tree}
	 */
	collapse(): this {
		this.ref.classList.add('collapsed');
		this.arrowRef.innerHTML = config.symbols.collapsed;
		return this;
	}

	/**
	 * Expand the tree.
	 * @returns {Tree}
	 */
	expand(): this {
		this.ref.classList.remove('collapsed');
		this.arrowRef.innerHTML = config.symbols.expanded;
		return this;
	}

	/**
	 * Toggle the tree between collapsed and expanded.
	 * @returns {Tree}
	 */
	toggle(): this {
		this.ref.classList.toggle('collapsed');
		if (this.ref.classList.contains('collapsed')) {
			this.arrowRef.innerHTML = config.symbols.collapsed;
		} else {
			this.arrowRef.innerHTML = config.symbols.expanded;
		}
		return this;
	}

	/**
	 * Add a child widget to the tree.
	 * @param {Widget} widget
	 * @returns {Tree}
	 */
	append(widget: Widget): this {
		this.view.append(widget);
		return this;
	}

	initToggleOnClick() {
		this.headerRef.addEventListener('click', () => {
			this.toggle();
		});
	}

	/**
	 * The `getConfig` function returns a JSON representation of all values in the tree.
	 * @returns {Object}
	 */
	getConfig(): object {
		return this.view.getConfig();
	}

	/**
	 * The `loadConfig` function loads a JSON object into the tree.
	 */
	loadConfig(config: object) {
		this.view.loadConfig(config);
		return this;
	}
}

/**
 * Just a container where you can put child elements. They will not differ
 * in any way from the ones outside. Can be used as a column in a row.
 * @public
 * @extends Widget
 */
export class Box extends Widget {
	constructor() {
		super('div');
		this.view = (new View).mount(this.ref);
	}

	/**
	 * Set the content of the container.
	 * @param {string} html
	 * @returns {Box}
	 */
	setContent(html: string): this {
		this.view.setContent(html);
		return this;
	}

	/**
	 * Add a child widget to the container.
	 * @param {Widget} widget
	 * @returns {Box}
	 */
	append(widget: Widget): this {
		this.view.append(widget);
		return this;
	}
}

/**
 * A row that arranges the children horizontally.
 * @public
 * @extends Box
 */
export class Row extends Box {
	constructor() {
		super();
		this.addClass('cgui-row')
	}
}

/**
 * This function opens a pop-up modal window where the user can select one item from the data.
 * @param {string} title - The title displayed in the selection window.
 * @param {string[]} items - The items that will be available for the user to select.
 * @param {boolean} closable - Adds one item to the end to close the menu, returning an index of -1.
 * @returns {Promise} A promise that will resolve with the index of the selected item.
 * @async
 * @public
 */
export function openPopupMenu({
	title,
	items,
	closable = true
}: {
	title: string,
	items: string[],
	closable?: boolean
}): Promise<any> {
	return new Promise(resolve => {
		let divWrapper = createElem('div');
		let divPopup = createElem('div');
		let divTitle = createElem('div');
		let divMenu = createElem('div');

		divWrapper.className = 'cgui-popup-menu-wrapper cgui-fadein';
		divPopup.className = 'cgui cgui-popup-menu';
		divTitle.className = 'cgui-popup-menu-title';
		divMenu.className = 'cgui-popup-menu-content';

		divPopup.appendChild(divTitle);
		divPopup.appendChild(divMenu);
		divWrapper.appendChild(divPopup);

		divTitle.innerHTML = title;

		let first = true;

		for (const item in items) {
			const btn = createElem('button');
			btn.className = 'cgui-popup-menu-btn';
			btn.innerHTML = items[item];
			divMenu.appendChild(btn);
			if (first) {
				first = false;
				setTimeout(() => btn.focus(), 0);
			}
			btn.onclick = () => {
				divWrapper.classList.add('cgui-fadeout');
				setTimeout(() => {
					divWrapper.remove();
					resolve(item);
				}, 150);
			};
		}

		if (closable) {
			const btn = createElem('button');
			btn.className = 'cgui-popup-menu-btn';
			btn.innerHTML = config.language.close;
			divMenu.appendChild(btn);
			btn.onclick = () => {
				divWrapper.classList.add('cgui-fadeout');
				setTimeout(() => {
					divWrapper.remove();
					resolve(-1);
				}, 150);
			};
		}

		document.body.appendChild(divWrapper);
	});
}
