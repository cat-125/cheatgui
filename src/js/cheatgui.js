/*
 * CheatGUI - effortless library for building window-based interfaces.
 * Copyright (C) 2024 Cat-125
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 */

/**
 * CheatGUI
 * 
 * @module
 * @author Cat-125
 * @license MIT
 * @see https://github.com/Cat-125/CheatGUI
 */

const cheatgui = (function (global, factory) {
	"use strict";
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = global.document ?
			factory(global, true) :
			function (w) {
				return factory(w);
			};
	}
	return factory(global);
})(typeof window !== 'undefined' ? window : this, function (window) {

	const document = window.document;

	const config = {
		symbols: {
			expanded: '▼',
			collapsed: '◀',
			resize: '&#9698;' // ◢
		},
		minWindowWidth: 150,
		minWindowHeight: 100,
		language: {
			'close': 'Close'
		}
	};

	const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(window.navigator.userAgent);


	function $(selector, parent = document) {
		if (typeof selector !== 'string') return selector;
		return $(parent).querySelector(selector);
	}

	function createElem(title) {
		return document.createElement(title);
	}

	function distance(x1, y1, x2, y2) {
		const a = x1 - x2;
		const b = y1 - y2;
		return Math.sqrt(a * a + b * b);
	}

	function generateId(length, _chars = '') {
		const chars = _chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars[Math.floor(Math.random() * chars.length)];
		}
		return result;
	}

	function clamp(val, min, max) {
		return Math.max(min, Math.min(val, max));
	}

	function range2percentage(val, min, max) {
		return 100 / (max - min) * val;
	}

	function snap(value, step) {
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

	function getNumberOfDigitsAfterPeriod(number) {
		let stringNumber = number.toString();
		let parts = stringNumber.split(".");

		if (parts.length > 1) {
			return parts[1].length;
		} else {
			return 0;
		}
	}

	/**
	 * Utility functions
	 * @public
	 * @namespace
	 */
	const utils = {
		$,
		createElem,
		generateId,
		distance,
		clamp,
		range2percentage,
		snap,
		getNumberOfDigitsAfterPeriod,

		getWidgetName(widget) {
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
			} else if (typeof widget.view !== 'undefined') {
				return 'has-view';
			} else if (widget instanceof Widget) {
				return 'widget'
			} else if (widget instanceof GUIElement) {
				return 'gui-element';
			} else {
				return 'unknown';
			}
		},

		appendToBody(widget) {
			document.body.appendChild(widget.getRef());
		},

		includeCSS(css) {
			const head = document.head;
			const style = createElem('style');
			style.setAttribute('type', 'text/css');
			style.innerHTML = css;
			head.appendChild(style);
		},

		includeCSSLink(url) {
			const link = createElem('link');
			link.rel = 'stylesheet';
			link.href = url;
			document.head.appendChild(link);
		},

		includeJS(url) {
			const script = createElem('script');
			script.src = url;
			document.body.appendChild(script);
		},

		loadTheme(url) {
			const link = $(`link#cgui-theme`, document.head) || createElem('link');
			link.id = 'cgui-theme'
			link.rel = 'stylesheet';
			link.href = url;
			document.head.appendChild(link);
		},

		updateConfig(newConfig) {
			function updateNestedConfig(config, newConfig) {
				for (const [key, value] of Object.entries(newConfig)) {
					if (typeof value === 'object' && typeof config[key] === 'object') {
						updateNestedConfig(config[key], value);
					} else if (config[key] !== undefined) {
						config[key] = value;
					}
				}
			}

			updateNestedConfig(config, newConfig);
		},

		getConfig() {
			return config;
		}
	};

	/**
	 * The base class for all elements in CheatGUI.
	 * @public
	 */
	class GUIElement {
		constructor() {
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
		addClass(...classes) {
			this.ref.classList.add(...classes);
			return this;
		}

		/**
		 * Set a class for an element with all previous classes deleted.
		 * @param {string} className
		 * @returns {GUIElement}
		 */
		setClass(className) {
			this.ref.className = 'cgui-widget ' + className.trim();
			return this;
		}

		/**
		 * Remove one or more classes from an element.
		 * @param {string} classes
		 * @returns {GUIElement}
		 */
		removeClass(...classes) {
			this.ref.classList.remove(...classes);
			return this;
		}

		/**
		 * @returns {HTMLElement|null}
		 */
		getRef() {
			return this.ref;
		}

		/**
		 * Destroy the element
		 */
		destroy() {
			if (typeof this.view !== 'undefined') this.view.destroy();
			this.ref.remove();
		}
	}

	/**
	 * A class that stores interface elements and displays them on a web page.
	 * @public
	 */
	class View {
		constructor() {
			this.ref = null;
			this.children = [];
		}

		/**
		 * Create an HTML element for the view and don't add it anywhere.
		 * @returns {View}
		 */
		init() {
			this.ref = createElem('div');
			return this;
		}

		/**
		 * Use an existing HTML element for the view.
		 * @param {HTMLElement} target
		 * @returns {View}
		 */
		mount(target) {
			this.ref = $(target);
			return this;
		}

		/**
		 * Set the contents of the view.
		 * @param {string} value
		 * @returns {View}
		 */
		setContent(value) {
			this.ref.innerHTML = value;
			return this;
		}

		/**
		 * Set the contents of the view.
		 * @param {string} value
		 * @returns {View}
		 */
		setText(value) {
			this.ref.textContent = value;
			return this;
		}

		/**
		 * The `append` function appends a widget to a parent element and updates the list of children.
		 * @param {GUIElement} widget - The widget to append.
		 * @returns {View}
		 */
		append(widget) {
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
		getConfig() {
			function processView(view) {
				const res = {
					type: 'root',
					value: []
				};

				for (let i = 0; i < view.children.length; i++) {
					const child = view.children[i];
					const type = utils.getWidgetName(child);
					const el = { type };

					if (['input', 'number-input', 'switch', 'slider', 'select'].includes(type)) {
						el.value = child.getValue();
					} else if (type == 'tree') {
						el.value = processView(child.view).value;
					} else if (type == 'has-view') {
						el.value = processView(child.view).value;
					} else if (typeof child.getValue === 'function')
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
		loadConfig(config) {
			function processView(view, item) {
				const items = item.value;
				const widgets = view.children;
				let offset = 0;
				let warned = false;
				for (let i = 0; i < items.length; i++) {
					if (items[i].type != utils.getWidgetName(widgets[i + offset])) {
						if (!warned) {
							console.warn(`Configuration mismatch! Trying to merge automatically... (${items[i].type}#${i} != ${utils.getWidgetName(widgets[i + offset])}#${i + offset} with offset ${offset})`);
							warned = true;
						}
						if (items.length == widgets.length) {
							console.warn(`Skipping field "${items[i].type}"`)
							continue;
						} else if (items.length < widgets.length) {
							if (items[i] == utils.getWidgetName(widgets[i + offset + 1])) {
								console.warn(`Assuming that ${widgets[i + offset - 1]} field has been added`);
							}
							offset++;
						} else if (items.length > widgets.length) {
							if (items[i] == utils.getWidgetName(widgets[i + offset - 1])) {
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
						widgets[i + offset].setValue(items[i].value);
					else if (items[i].type == 'tree' || items[i].type == 'has-view')
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
	class Window extends GUIElement {
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
		}) {
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
		setTitle(html) {
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
		setContent(value) {
			this.view.setContent(value);
			return this;
		}

		/**
		 * The `setText` function sets the text value of a view element.
		 * @param value - The `value` parameter in the `setText` function represents the text that you want
		 * to set for a particular view. It is the text that you want to display or update in the view.
		 * @returns {Window}
		 */
		setText(value) {
			this.view.setText(value);
			return this;
		}

		/**
		 * The `append` function appends a widget to a parent element and updates the list of children.
		 * @param {GUIElement} widget - The widget to append.
		 * @returns {Window}
		 */
		append(widget) {
			this.view.append(widget);
			return this;
		}

		/**
		 * The `move` function moves the window to the specified coordinates.
		 * @param {number} x - The x coordinate of the window.
		 * @param {number} y - The y coordinate of the window.
		 * @returns {Window}
		 */
		move(x, y) {
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
		setWidth(width) {
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
		setHeight(height) {
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
		resize(width, height) {
			this.setWidth(width);
			this.setHeight(height);
			return this;
		}

		/**
		 * The `collapse` function collapses the window.
		 * @returns {Window}
		 */
		collapse() {
			this.collapsed = true;
			this.ref.classList.add('collapsed');
			this.arrowRef.innerHTML = config.symbols.collapsed;
			return this;
		}

		/**
		 * The `expand` function expands the window.
		 * @returns {Window}
		 */
		expand() {
			this.collapsed = false;
			this.ref.classList.remove('collapsed');
			this.arrowRef.innerHTML = config.symbols.expanded;
			return this;
		}

		/**
		 * The `toggle` function toggles the window between collapsed and expanded.
		 * @returns {Window}
		 */
		toggle() {
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
		hide() {
			this.ref.style.display = 'none';
			return this;
		}

		/**
		 * The `show` function shows the window.
		 * @returns {Window}
		 */
		show() {
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
		 * @returns {Window}
		 */
		sendToTop() {
			if (this.ref.classList.contains('active')) return;
			[...document.getElementsByClassName('cgui-window')].forEach(win => win.classList.remove('active'));
			this.ref.classList.add('active');
		}

		initActivationOnClick() {
			this.ref.addEventListener('pointerdown', () => {
				this.sendToTop();
			});
		}

		initToggleOnClick(threshold) {
			let isClick = false,
				startX, startY;
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

		initDraggable(threshold) {
			let startX, startY, offsetX, offsetY,
				isMouseDown = false;

			const startDragging = (e) => {
				this.isDragging = true;
				this.ref.classList.add('cgui-dragging');
			}

			const onMouseDown = (e) => {
				e.preventDefault();
				e = e.touches ? e.touches[0] : e;
				isMouseDown = true;
				startX = e.clientX;
				startY = e.clientY;
				offsetX = e.clientX - this.ref.offsetLeft;
				offsetY = e.clientY - this.ref.offsetTop;
			};

			const onMouseMove = (e) => {
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
			let sx, sy, dx, dy, iw, ih;

			const onMouseDown = (e) => {
				if (this.collapsed) return;
				e.preventDefault();
				e.stopPropagation();
				e = e.touches ? e.touches[0] : e;
				this.isResizing = true;
				[sx, sy, iw, ih] = [e.clientX, e.clientY, this.width, this.height];
				this.addClass('cgui-resizing');
			};

			const onMouseMove = (e) => {
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
		getRef() {
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
		getConfig() {
			return this.view.getConfig();
		}

		/**
		 * The `loadConfig` function loads a JSON configuration into the window.
		 * @param {Object} config - The JSON configuration.
		 * @returns {Window}
		 */
		loadConfig(config) {
			this.view.loadConfig(config);
			return this;
		}
	}

	/**
	 * A class that represents a user interface widget.
	 * @public
	 * @extends GUIElement
	 */
	class Widget extends GUIElement {
		/**
		 * Create a new widget and initialize it.
		 * @param {string} [elementType='div'] - The HTML element type.
		 */
		constructor(elementType = 'div') {
			super();
			this.ref = createElem(elementType);
			this._init();
			this.addClass('cgui-widget');
		}

		/**
		 * Set the content of the widget.
		 * @param {string} value - The value to set the content to.
		 * @returns {Widget}
		 */
		setContent(value) {
			this.ref.innerHTML = value;
			return this;
		}

		/**
		 * Set the text of the widget.
		 * @param {string} value - The value to set the text to.
		 * @returns {Widget}
		 */
		setText(value) {
			this.ref.textContent = value;
			return this;
		}

		/**
		 * Add a click event listener to the widget.
		 * @param {Function} f - The function to call when the widget is clicked.
		 * @returns {Widget}
		 */
		onClick(f) {
			this.ref.addEventListener('click', f);
			return this;
		}

		bind(obj, prop) {
			throw new SyntaxError("The `click` event cannot be bound. Use `onClick()` instead.");
		}
	}

	/**
	 * A class that represents a text widget.
	 * @public
	 */
	class Text extends Widget {
		/**
		 * Create a new text widget and initialize it.
		 * @param {string} [text=''] - The text to display.
		 */
		constructor(text = '') {
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
	class Button extends Widget {
		/**
		 * Create a new button widget and initialize it.
		 * @param {string} [text=''] - Button text.
		 * @param {Function} [callback=null] - The function to call when the button is clicked.
		 */
		constructor(text = '', callback = null) {
			super('button');
			this.addClass('cgui-btn');
			this.setText(text);
			if (callback) this.onClick(callback);
		}
	}

	/**
	 * A class that represents an input field widget.
	 * @public
	 * @extends Widget
	 */
	class Input extends Widget {
		/**
		 * Create a new input field widget and initialize it.
		 * @param {string} [label=''] - The label text.
		 * @param {string} [val=''] - The initial value.
		 * @param {Function} [callback=null] - The function to call when the input is changed.
		 */
		constructor(label = '', val = '', callback = null) {
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

			if (callback) this.onInput(callback);
		}

		/**
		 * Set the label of the input field.
		 * @param {string} label - The new label text.
		 * @returns {Input}
		 */
		setLabel(label) {
			this.labelRef.innerHTML = label;
			return this;
		}

		/**
		 * Add an input event listener to the input field.
		 * @param {Function} f - The function to call when the input is changed.
		 * @returns {Input}
		 */
		onInput(f) {
			this.inputRef.addEventListener('input', e => f(e, this.getValue()));
			return this;
		}

		/**
		 * Bind an input field to an object property.
		 * @param {Object} obj - The object to bind the property to.
		 * @param {string} prop - The property to bind.
		 * @returns {Input}
		 */
		bind(obj, prop) {
			this.onInput((_, val) => obj[prop] = val);
			return this;
		}

		/**
		 * Set the value of the input field.
		 * @param {string} value 
		 * @returns {Input}
		 */
		setValue(value) {
			this.inputRef.value = value;
			return this;
		}

		/**
		 * Get the value of the input field.
		 * @returns {string} - The value of the input field.
		 */
		getValue() {
			return this.inputRef.value;
		}
	}

	/**
	 * A class that represents an input field
	 * where only numbers can be entered.
	 * @public
	 * @extends Widget
	 */
	class NumberInput extends Widget {
		/**
		 * Create a new number input field and initialize it.
		 * @param {string} [label=''] - The label text.
		 * @param {number} [value=0] - The initial value.
		 * @param {Function} [callback=null] - The function to call when the input is changed.
		 */
		constructor(label = '', value = 0, callback = null) {
			super('div');

			this.addClass('cgui-input-wrapper');

			this.inputRef = createElem('input');
			this.inputRef.classList.add('cgui-input');
			this.inputRef.type = 'number';
			this.ref.appendChild(this.inputRef);

			this.labelRef = createElem('div');
			this.labelRef.classList.add('cgui-input-label');
			this.ref.appendChild(this.labelRef);

			this.setValue(value);
			this.setLabel(label);

			if (callback) this.onInput(callback);
		}

		/**
		 * Set the label of the input field.
		 * @param {string} label - The new label text.
		 * @returns {NumberInput}
		 */
		setLabel(label) {
			this.labelRef.innerHTML = label;
			return this;
		}

		/**
		 * Add an input event listener to the input field.
		 * @param {Function} f - The function to call when the input is changed.
		 * @returns {NumberInput}
		 */
		onInput(f) {
			this.inputRef.addEventListener('input', e => f(e, this.getValue()));
			return this;
		}

		/**
		 * Bind an input field to an object property.
		 * @param {Object} obj - The object to bind the property to.
		 * @param {string} prop - The property to bind.
		 * @returns {NumberInput}
		 */
		bind(obj, prop) {
			this.onInput((_, val) => obj[prop] = val);
			return this;
		}

		/**
		 * Set the value of the input field.
		 * @param {string} value 
		 * @returns {NumberInput}
		 */
		setValue(value) {
			const p = parseFloat(value);
			this.inputRef.value = isNaN(p) ? 0 : (p || 0);
			return this;
		}

		/**
		 * Get the value of the input field.
		 * @returns {string} - The value of the input field.
		 */
		getValue() {
			const p = parseFloat(this.inputRef.value);
			return isNaN(p) ? 0 : (p || 0);
		}
	}

	/**
	 * A class representing a slider where you can select a value from a specific range.
	 * @public
	 * @extends Widget
	 */
	class Slider extends Widget {
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
		}) {
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
		setLabel(text) {
			this.labelRef.innerHTML = text;
			return this;
		}

		/**
		 * Add a change event listener to the slider.
		 * @param {Function} f - The function to call when the slider is changed.
		 * @returns {Slider}
		 */
		onChange(f) {
			this.ref.addEventListener('change', e => f(e, this.getValue()));
			return this;
		}

		/**
		 * Bind a slider to an object property.
		 * @param {Object} obj - The object to bind the property to.
		 * @param {string} prop - The property to bind.
		 * @returns {Slider}
		 */
		bind(obj, prop) {
			this.onChange((_, val) => obj[prop] = val);
			return this;
		}

		/**
		 * Set the minimum value of the slider.
		 * @param {number} min - The new minimum value.
		 * @returns {Slider}
		 */
		setMin(min) {
			this.min = min;
			return this;
		}

		/**
		 * Set the maximum value of the slider.
		 * @param {number} max - The new maximum value.
		 * @returns {Slider}
		 */
		setMax(max) {
			this.max = max;
			return this;
		}

		/**
		 * Set the step size of the slider.
		 * @param {number} step - The new step size.
		 * @returns {Slider}
		 */
		setStep(step) {
			this.step = step;
			this.accuracy = getNumberOfDigitsAfterPeriod(step);
			return this;
		}

		/**
		 * Set the value of the slider.
		 * @param {number} value - The new value.
		 */
		setValue(value) {
			value = parseFloat(clamp(snap(value, this.step), this.min, this.max).toFixed(this.accuracy));
			this.value = value;
			const displayValue = 100 / (this.max - this.min) * (value - this.min);
			this.thumbRef.style.marginLeft = displayValue + '%';
			this.thumbRef.style.transform = `translateX(-${displayValue}%)`;
			this.thumbRef.textContent = value;
			return this;
		}


		initSlider() {
			let isDragging = false;
			let listeners = new Array(2);
			const onMouseDown = e => {
				isDragging = true;
				updateSlider(e);
				listeners[0] = document.addEventListener('mousemove', updateSlider);
				listeners[1] = document.addEventListener('touchmove', updateSlider);
			};
			const onMouseUp = () => {
				if (!isDragging) return;
				isDragging = false;
				this.ref.dispatchEvent(new CustomEvent('change'));
				document.removeEventListener('mousemove', listeners[0]);
				document.removeEventListener('touchmove', listeners[1]);
			};
			const updateSlider = e => {
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
		getValue() {
			return this.value;
		}
	}

	/**
	 * A class that represents a switch that can be turned on and off.
	 * @public
	 * @extends Widget
	 */
	class Switch extends Widget {
		/**
		 * Create a new switch.
		 * @param {string} [label=''] - The label text.
		 * @param {boolean} [checked=false] - Whether the switch is initially checked.
		 * @param {function} [callback=null] - The callback function to call when the switch is changed.
		 */
		constructor(label = '', checked = false, callback = null) {
			super('label');
			const id = this.id = generateId(16);
			this.ref.for = id;
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
			this.labelRef.for = id;
			this.ref.appendChild(this.labelRef);
			this.ref.tabIndex = 0;
			this.setLabel(label);

			if (callback) this.onChange(callback);
		}

		/**
		 * Set the callback function to call when the switch is changed.
		 * @param {Function} func - The callback function to call when the switch is changed.
		 * @returns {Switch}
		 */
		onChange(func) {
			this.inputRef.addEventListener('change', e => func(e, this.inputRef.checked));
			return this;
		}

		/**
		 * Bind a property to the switch.
		 * @param {Object} obj - The object to bind the property to.
		 * @param {string} prop - The property to bind.
		 * @returns {Switch}
		 */
		bind(obj, prop) {
			this.onChange((_, val) => obj[prop] = val);
			return this;
		}

		/**
		 * Get whether the switch is checked.
		 * @returns {boolean}
		 */
		isChecked() {
			return this.inputRef.checked;
		}

		/**
		 * Get whether the switch is checked.
		 * @returns {boolean}
		 */
		getValue() {
			return this.isChecked();
		}

		/**
		 * Set whether the switch is checked.
		 * @param {boolean} val
		 * @returns {Switch}
		 */
		setValue(val) {
			this.inputRef.checked = val;
			return this;
		}

		/**
		 * Set the label of the switch.
		 * @param {string} label
		 * @returns {Switch}
		 */
		setLabel(label) {
			this.labelRef.innerHTML = label;
			return this;
		}
	}

	/**
	 * A class that represents a menu for selecting one of several values.
	 * @public
	 * @extends Widget
	 */
	class Dropdown extends Widget {
		/**
		 * Create a new dropdown.
		 * 
		 * The values parameter should be an object where the keys are the display text and
		 * the values are the actual values.
		 * 
		 * @param {string} [label=''] - The label text.
		 * @param {Object} [values={}] - The values to display in the dropdown.
		 * @param {string} [value=null] - The initial value of the dropdown.
		 * @param {function} [callback=null] - The callback function to call when the dropdown
		 * is changed.
		 */
		constructor(label = '', values = {}, value = null, callback = null) {
			super('label');
			const id = this.id = generateId(16);
			this.ref.for = id;
			this.addClass('cgui-input-wrapper');
			this.selRef = createElem('select');
			this.selRef.id = id;
			this.selRef.classList.add('cgui-input');
			this.ref.appendChild(this.selRef);
			for (const [k, v] of Object.entries(values)) {
				const opt = createElem('option');
				opt.textContent = k;
				opt.value = v;
				if (v == value) opt.selected = true;
				this.selRef.appendChild(opt);
			}
			this.labelRef = createElem('span');
			this.labelRef.className = 'cgui-input-label';
			this.labelRef.for = id;
			this.ref.appendChild(this.labelRef);
			this.ref.tabIndex = 0;
			this.setLabel(label);

			if (callback) this.onChange(callback);
		}

		/**
		 * Set the callback function to call when the value is changed.
		 * @param {Function} func - The callback function to call when the value is changed.
		 * @returns {Select}
		 */
		onChange(func) {
			this.selRef.addEventListener('change', e => func(e, this.getValue()));
			return this;
		}

		/**
		 * Bind a property to the dropdown.
		 * @param {Object} obj - The object to bind the property to.
		 * @param {string} prop - The property to bind.
		 * @returns {Select}
		 */
		bind(obj, prop) {
			this.onChange((_, val) => obj[prop] = val);
			return this;
		}

		/**
		 * Get the value of the dropdown.
		 * @returns {string}
		 */
		getValue() {
			return this.selRef.options[this.selRef.selectedIndex].value;
		}

		/**
		 * Set the value of the dropdown.
		 * @param {string} val
		 * @returns {Select}
		 */
		setValue(val) {
			this.selRef.value = val;
			return this;
		}

		/**
		 * Set the label of the dropdown.
		 * @param {string} label
		 * @returns {Select}
		 */
		setLabel(label) {
			this.labelRef.innerHTML = label;
			return this;
		}
	}

	/**
	 * A tree that can be expanded and collapsed, and can also have children.
	 * @public
	 * @extends Widget
	 */
	class Tree extends Widget {
		/**
		 * Create a new tree that can be expanded and collapsed. You can add children to the tree
		 * with the `addChild` method so that they appear in the tree.
		 * @param {string} [title=''] - The title of the tree.
		 * @param {boolean} [expanded=false] - Whether the tree is expanded.
		 */
		constructor(title = '', expanded = false) {
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
		setTitle(html) {
			this.titleRef.innerHTML = html;
			return this;
		}

		/**
		 * Set the content of the tree.
		 * @param {string} html
		 * @returns {Tree}
		 */
		setContent(html) {
			this.view.setContent(html);
			return this;
		}

		/**
		 * Collapse the tree.
		 * @returns {Tree}
		 */
		collapse() {
			this.ref.classList.add('collapsed');
			this.arrowRef.innerHTML = config.symbols.collapsed;
			return this;
		}

		/**
		 * Expand the tree.
		 * @returns {Tree}
		 */
		expand() {
			this.ref.classList.remove('collapsed');
			this.arrowRef.innerHTML = config.symbols.expanded;
			return this;
		}

		/**
		 * Toggle the tree between collapsed and expanded.
		 * @returns {Tree}
		 */
		toggle() {
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
		append(widget) {
			this.view.append(widget);
			return this;
		}

		initToggleOnClick(threshold = 10) {
			this.headerRef.addEventListener('click', e => {
				this.toggle();
			});
		}

		/**
		 * The `getConfig` function returns a JSON representation of all values in the tree.
		 * @returns {Object}
		 */
		getConfig() {
			return this.view.getConfig();
		}

		/**
		 * The `loadConfig` function loads a JSON object into the tree.
		 */
		loadConfig(config) {
			this.view.loadConfig(config);
			return this;
		}
	}

	/**
	 * Just a container where you can put
	 * child elements. They will not differ
	 * in any way from the ones outside. Can
	 * be used as a column in a row.
	 * @public
	 * @extends Widget
	 */
	class Container extends Widget {
		constructor() {
			super('div');
			this.view = (new View).mount(this.ref);
		}

		/**
		 * Set the content of the container.
		 * @param {string} html
		 * @returns {Container}
		 */
		setContent(html) {
			this.view.setContent(html);
			return this;
		}

		/**
		 * Add a child widget to the container.
		 * @param {Widget} widget
		 * @returns {Container}
		 */
		append(widget) {
			this.view.append(widget);
			return this;
		}
	}

	/**
	 * A row that arranges the children horizontally.
	 * @public
	 * @extends Container
	 */
	class Row extends Container {
		constructor() {
			super();
			this.addClass('cgui-row')
		}
	}

	/**
	 * This function opens a pop-up modal window where the user can select one item from the data.
	 * @param {string} title - The title displayed in the selection window.
	 * @param {String[]} items - The items that will be available for the user to select.
	 * @param {boolean} closable - Adds one item to the end to close the menu, returning an index of -1.
	 * @returns {Promise} A promise that will resolve with the index of the selected item.
	 * @async
	 * @public
	 */
	function openPopupMenu({
		title,
		items,
		closable = true
	}) {
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

	return { GUIElement, View, Window, Element, Text, Button, Input, NumberInput, Slider, Switch, Dropdown, Tree, Container, Row, openPopupMenu, utils, isMobile };
});