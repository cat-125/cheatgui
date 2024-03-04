const cheatgui = (function() {

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

	const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);


	/**
	 * The function $ is a shorthand for document.querySelector that allows for specifying a parent
	 * element.
	 * 
	 * @param {String} selector - The selector parameter is a string that represents a CSS selector. It is used to
	 * select elements from the DOM.
	 * @param {String} [parent] - The parent parameter is an optional parameter that specifies the parent element
	 * within which the selector should be searched. If no parent element is provided, the default value
	 * is the document object, which represents the entire HTML document.
	 * @returns the result of calling `querySelector` on the `parent` element with the given `selector`.
	 */
	function $(selector, parent = document) {
		if (typeof selector !== 'string') return selector;
		return $(parent).querySelector(selector);
	}

	/**
	 * The function "createElem" creates a new HTML element with the specified name.
	 * 
	 * @param {String} name - The name parameter is a string that represents the name of the HTML element you want
	 * to create.
	 * @returns a newly created HTML element with the specified name.
	 */
	function createElem(name) {
		return document.createElement(name);
	}

	/**
	 * The function calculates the distance between two points in a two-dimensional plane.
	 * 
	 * @param {Number} x1 - The x-coordinate of the first point.
	 * @param {Number} y1 - The y-coordinate of the first point.
	 * @param {Number} x2 - The x-coordinate of the second point.
	 * @param {Number} y2 - The y-coordinate of the second point.
	 * @returns the distance between two points in a two-dimensional plane.
	 */
	function distance(x1, y1, x2, y2) {
		const a = x1 - x2;
		const b = y1 - y2;
		return Math.sqrt(a * a + b * b);
	}

	/**
	 * The function generates a random string of a specified length using a given set of characters.
	 * 
	 * @param {Number} length - The length parameter specifies the length of the generated ID.
	 * @param {String} [_chars] - The `_chars` parameter is an optional parameter that allows you to specify a
	 * custom set of characters to use for generating the ID. If you don't provide a value for `_chars`,
	 * the function will use the default set of characters which includes lowercase letters, uppercase
	 * letters, and digits.
	 * @returns a randomly generated string of characters with the specified length.
	 */
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

		var remainder = value % step;
		var result;

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
		let numberOfDigitsAfterPeriod;

		if (parts.length > 1) {
			numberOfDigitsAfterPeriod = parts[1].length;
		} else {
			numberOfDigitsAfterPeriod = 0;
		}

		return numberOfDigitsAfterPeriod;
	}

	/**
	 * Some useful utilites.
	 * 
	 * Includes:
	 * - `$(selector, parent)` - simplest jQuery analog
	 * - `createElem(type)` - shortcut for `document.createElement()`
	 * - `generateId(length, [_chars])` for generating random strings
	 * - `distance(x1, y1, x2, y2)` for finding distance between two points
	 * - `appendToBody(widget)`
	 * - `includeCSS(css)`, `includeCSSLink(url)` for dynamically loading CSS
	 * - `includeJS(url)`  for dynamically loading JS scripts
	 * - `loadTheme(url)` for loading CheatGUI themes.
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

		/**
		 * The function appends a widget to the body of a web page.
		 * 
		 * @param {GUIElement} widget - The "widget" parameter is an object that represents
		 * an UI element or component.
		 */
		appendToBody(widget) {
			document.body.appendChild(widget.getRef());
		},

		/**
		 * The function `includeCSS` is used to dynamically add CSS styles to a web page.
		 * 
		 * @param {String} css - The `css` parameter is a string that represents the CSS code
		 * that you want to include.
		 */
		includeCSS(css) {
			const head = document.head;
			const style = createElem('style');
			style.setAttribute('type', 'text/css');
			style.innerHTML = css;
			head.appendChild(style);
		},

		/**
		 * The function `includeCSSLink` is used to dynamically add a CSS stylesheet
		 * to the HTML document.
		 * 
		 * @param {String} url - The `url` parameter is a string that represents the URL of the
		 * CSS file that you want to include.
		 */
		includeCSSLink(url) {
			const link = createElem('link');
			link.rel = 'stylesheet';
			link.href = url;
			document.head.appendChild(link);
		},

		/**
		 * The function `includeJS` is used to dynamically include an external JavaScript file in a web page.
		 * 
		 * @param {String} url - The URL of the JavaScript file that you want to include in your HTML document.
		 */
		includeJS(url) {
			const script = createElem('script');
			script.src = url;
			document.body.appendChild(script);
		},

		/**
		 * The function `loadTheme` is used to dynamically load a CheatGUI theme.
		 * 
		 * @param {String} url - The `url` parameter is a string that represents the URL of the theme stylesheet that
		 * you want to load.
		 */
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
	 * Base class for everything in CheatGUI.
	 */
	class GUIElement {
		constructor() {
			this.ref = null;
		}

		/**
		 * Initialize GUI element.
		 */
		_init() {
			this.addClass('cgui');
		}

		/**
		 * The addClass function adds a specified class name to the element's class list.
		 * 
		 * @param {String} className - The className parameter is a string that represents the class name you want to
		 * add to the element.
		 * @returns The "this" keyword is being returned.
		 */
		addClass(...classes) {
			this.ref.classList.add(...classes);
			return this;
		}

		setClass(className) {
			this.ref.className = 'cgui-widget ' + className.trim();
			return this;
		}

		removeClass(...classes) {
			this.ref.classList.remove(...classes);
			return this;
		}

		/**
		 * @returns The widget HTML reference element
		 */
		getRef() {
			return this.ref;
		}
		
		destroy() {
			if (typeof this.view !== 'undefined') this.view.destroy();
			this.ref.remove();
		}
	}

	/**
	 * Transparent class that allows to manage HTML container.
	 * 
	 * You must call one of `init()` or `mount(target)` before doing something.
	 */
	class View {
		constructor() {
			this.ref = null;
			this.children = [];
		}

		/**
		 * Initialize View as a new HTML element.
		 * 
		 * Must be called before appending sub-elements.
		 */
		init() {
			this.ref = createElem('div');
			return this;
		}

		/**
		 * Mount View to an HTML element that already exists.
		 * 
		 * Must be called before appending sub-elements.
		 * 
		 * @param target - an HTML element to mount view into.
		 */
		mount(target) {
			this.ref = $(target);
			return this;
		}

		/**
		 * Set the View content.
		 * 
		 * @param {String} html - a new content.
		 */
		setContent(html) {
			this.ref.innerHTML = html;
			return this;
		}

		/**
		 * Append sub-element to View.
		 * 
		 * @param {GUIElement} widget - sub-element.
		 */
		append(widget) {
			this.ref.appendChild(widget.getRef());
			this.children.append(widget.getRef());
			return this;
		}
		
		destroy() {
			this.children.forEach(c => c.destroy());
		}
	}

	/**
	 * Class for creating windows.
	 * 
	 * Example:
	 * ```
	 * const window = new cheatgui.Window(100, 200, "My Window", false);
	 * ```
	 * 
	 * @param {Number} x - The initial x-coordinate of the window.
	 * @param {Number} y - The initial y-coordinate of the window.
	 * @param {String} name - Initial window title.
	 * @param {Boolean} collapsed - should be window initially collapsed.
	 */
	class Window extends GUIElement {
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
		 * Set the window title.
		 * 
		 * @param {String} html - HTML-formatted title.
		 */
		setTitle(html) {
			this.titleRef.innerHTML = html;
			return this;
		}

		/**
		 * Set the window content.
		 * 
		 * Shortcut for `window.view.setContent(html)`.
		 * 
		 * @param {String} html - HTML-formatted content.
		 */
		setContent(html) {
			this.view.setContent(html);
			return this;
		}

		/**
		 * Append the new element to the window.
		 * 
		 * Shortcut for `window.view.append(widget)`.
		 * 
		 * @param {GUIElement} widget - element to be added.
		 */
		append(widget) {
			this.view.append(widget);
			return this;
		}

		move(x, y) {
			this.ref.style.left = `${x}px`;
			this.ref.style.top = `${y}px`;
			this.x = x;
			this, y = y;
			return this;
		}

		setWidth(width) {
			width = Math.max(width, config.minWindowWidth);
			this.width = width;
			this.ref.style.width = `${width}px`;
			return this;
		}

		setHeight(height) {
			height = Math.max(height, config.minWindowHeight);
			this.height = height;
			this.contentRef.style.height = `${height}px`;
			return this;
		}

		resize(width, height) {
			this.setWidth(width);
			this.setHeight(height);
			return this;
		}

		collapse() {
			this.collapsed = true;
			this.ref.classList.add('collapsed');
			this.arrowRef.innerHTML = config.symbols.collapsed;
			return this;
		}

		expand() {
			this.collapsed = false;
			this.ref.classList.remove('collapsed');
			this.arrowRef.innerHTML = config.symbols.expanded;
			return this;
		}

		toggle() {
			if (this.collapsed) {
				this.expand();
			} else {
				this.collapse();
			}
			return this;
		}

		hide() {
			this.ref.style.display = 'none';
			return this;
		}

		show() {
			this.ref.style.display = 'block';
			return this;
		}

		destroy() {
			this.view.destroy();
			this.ref.remove();
		}

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

		/** Init draggable functionality for window. */
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

		/** Get window HTML reference. */
		getRef() {
			return this.ref;
		}
		
		get children() {
			return this.view.children;
		}
	}

	/**
	 * Base class for elements.
	 */
	class Widget extends GUIElement {
		constructor(elementName = 'div') {
			super();
			this.ref = createElem(elementName);
			this._init();
			this.addClass('cgui-widget');
		}

		/**
		 * Set the element text
		 * 
		 * @param {String} text - HTML-formatted text to be set
		 */
		setText(text) {
			this.ref.innerHTML = text;
			return this;
		}

		/**
		 * Add click event listener.
		 * 
		 * @param f - event listener.
		 */
		onClick(f) {
			this.ref.addEventListener('click', f);
			return this;
		}

		bind(obj, param) {
			console.warn("Can't bind 'click' event. Use onClick() instead.");
			return this;
		}
	}

	/**
	 * The Text class is a subclass of the Element class that represents a text element
	 * with a default value of an empty string.
	 */
	class Text extends Widget {
		constructor(text = '') {
			super('div');
			this.addClass('cgui-text');
			this.setText(text);
		}
	}

	/**
	 * Button that can be clicked.
	 */
	class Button extends Widget {
		constructor(text = '', callback = null) {
			super('button');
			this.addClass('cgui-btn');
			this.setText(text);
			if (callback) this.onClick(callback);
		}
	}

	/**
	 * Input where you can enter text.
	 */
	class Input extends Widget {
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
		 * Set the input label
		 * 
		 * @param {String} label - label to be set
		 */
		setLabel(label) {
			this.labelRef.innerHTML = label;
			return this;
		}

		/**
		 * Add input event listener.
		 * 
		 * @param f - event listener.
		 */
		onInput(f) {
			this.inputRef.addEventListener('input', e => f(e, this.getValue()));
			return this;
		}

		bind(obj, param) {
			this.onInput((_, val) => obj[param] = val);
			return this;
		}

		/**
		 * Set the input value
		 * 
		 * @param {String} value - value to be set
		 */
		setValue(value) {
			this.inputRef.value = value;
			return this;
		}

		/**
		 * Get the input value
		 * 
		 * @returns {String} input's value
		 */
		getValue() {
			return this.inputRef.value;
		}
	}

	/**
	 * Input where you can enter numbers.
	 */
	class NumberInput extends Widget {
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
		 * Set the input label
		 * 
		 * @param {String} label - label to be set
		 */
		setLabel(label) {
			this.labelRef.innerHTML = label;
			return this;
		}

		/**
		 * Add input event listener.
		 * 
		 * @param f - event listener.
		 */
		onInput(f) {
			this.inputRef.addEventListener('input', e => f(e, this.getValue()));
			return this;
		}

		bind(obj, param) {
			this.onInput((_, val) => obj[param] = val);
			return this;
		}

		/**
		 * Set the input value
		 * 
		 * @param {Number} value - value to be set
		 */
		setValue(value) {
			const p = parseFloat(value);
			this.inputRef.value = isNaN(p) ? 0 : (p || 0);
			return this;
		}

		/**
		 * Get the input value
		 * 
		 * @returns {String} input's value
		 */
		getValue() {
			const p = parseFloat(this.inputRef.value);
			return isNaN(p) ? 0 : (p || 0);
		}
	}

	/**
	 * Slider allows you to select value in a range.
	 */
	class Slider extends Widget {
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

		setLabel(text) {
			this.labelRef.innerHTML = text;
			return this;
		}

		onChange(f) {
			this.ref.addEventListener('change', e => f(e, this.getValue()));
			return this;
		}

		bind(obj, param) {
			this.onChange((_, val) => obj[param] = val);
			return this;
		}

		setMin(min) {
			this.min = min;
			return this;
		}

		setMax(max) {
			this.max = max;
			return this;
		}
		
		setStep(step) {
			this.step = step;
			this.accuracy = getNumberOfDigitsAfterPeriod(step);
			return this;
		}

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
		 * Get the slider value
		 * 
		 * @returns {Number} value
		 */
		getValue() {
			return this.value;
		}
	}

	/**
	 * Switch that can be toggled.
	 */
	class Switch extends Widget {
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
		 * Add change event listener
		 * 
		 * @param {Function} func - event listener
		 */
		onChange(func) {
			this.inputRef.addEventListener('change', e => func(e, this.inputRef.checked));
			return this;
		}

		bind(obj, param) {
			this.onChange((_, val) => obj[param] = val);
			return this;
		}

		/**
		 * @return {boolean} Whether the switch is currently on
		 */
		isChecked() {
			return this.inputRef.checked;
		}
		
		getValue() {
			return this.isChecked();
		}

		setValue(val) {
			this.inputRef.checked = val;
			return this;
		}

		/**
		 * Set new text for the switch
		 * 
		 * @param {String} text - text to be set
		 */
		setLabel(label) {
			this.labelRef.innerHTML = label;
			return this;
		}
	}

	class Select extends Widget {
		constructor(label = '', values, value = null, callback = null) {
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
		 * Add change event listener
		 * 
		 * @param {Function} func - event listener
		 */
		onChange(func) {
			this.selRef.addEventListener('change', e => func(e, this.getValue()));
			return this;
		}

		bind(obj, param) {
			this.onChange((_, val) => obj[param] = val);
			return this;
		}

		/**
		 * @return {boolean} Whether the switch is currently on
		 */
		getValue() {
			return this.selRef.options[this.selRef.selectedIndex].value;
		}

		setValue(val) {
			this.selRef.value = val;
			return this;
		}

		/**
		 * Set new text for the switch
		 * 
		 * @param {String} text - text to be set
		 */
		setLabel(label) {
			this.labelRef.innerHTML = label;
			return this;
		}
	}

	class Tree extends Widget {
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
		 * Set the tree title.
		 * 
		 * @param {String} html - HTML-formatted title.
		 */
		setTitle(html) {
			this.titleRef.innerHTML = html;
			return this;
		}

		/**
		 * Set the tree content.
		 * 
		 * Shortcut for `tree.view.setContent(html)`.
		 * 
		 * @param {String} html - HTML-formatted content.
		 */
		setContent(html) {
			this.view.setContent(html);
			return this;
		}

		/**
		 * Collapse the tree.
		 */
		collapse() {
			this.ref.classList.add('collapsed');
			this.arrowRef.innerHTML = config.symbols.collapsed;
			return this;
		}

		/**
		 * Expand the tree.
		 */
		expand() {
			this.ref.classList.remove('collapsed');
			this.arrowRef.innerHTML = config.symbols.expanded;
			return this;
		}

		/**
		 * Toggle the tree's collapsed state.
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
		 * Append the new element to the tree.
		 * 
		 * Shortcut for `tree.view.append(widget)`.
		 * 
		 * @param {GUIElement} widget - element to be added.
		 */
		append(widget) {
			this.view.append(widget);
			return this;
		}

		/**
		 * Init toggle on click for tree.
		 */
		initToggleOnClick(threshold = 10) {
			this.headerRef.addEventListener('click', e => {
				this.toggle();
			});
		}
	}
	
	class Container extends Widget {
		constructor() {
			super('div');
			this.view = (new View).mount(this.ref);
		}

		setContent(html) {
			this.view.setContent(html);
			return this;
		}
		
		append(widget) {
			this.view.append(widget);
			return this;
		}
	}
	
	class Row extends Container {
		constructor() {
			super();
			this.addClass('cgui-row')
		}
	}

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

	return { GUIElement, View, Window, Element, Text, Button, Input, NumberInput, Slider, Switch, Select, Tree, Container, Row, openPopupMenu, utils, isMobile };
})();

if (typeof module !== 'undefined' && typeof module.exports == 'object') module.exports = cheatgui;
if (typeof globalThis !== 'undefined') globalThis.cheatgui = cheatgui;