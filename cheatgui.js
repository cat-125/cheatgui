const cheatgui = (function() {
	function $(selector, parent = document) {
		if (typeof selector !== 'string') return selector;
		return $(parent).querySelector(selector);
	}

	const createElem = document.createElement.bind(document);

	/**
	 * Calculate the distance between two points (x1, y1) and (x2, y2).
	 * @param {number} x1 - The x-coordinate of the first point.
	 * @param {number} y1 - The y-coordinate of the first point.
	 * @param {number} x2 - The x-coordinate of the second point.
	 * @param {number} y2 - The y-coordinate of the second point.
	 * @returns {number} The distance between the two points.
	 */
	function distance(x1, y1, x2, y2) {
		const a = x1 - x2;
		const b = y1 - y2;
		return Math.sqrt(a * a + b * b);
	}

	/**
	 * The function generates a random string of specified length using a given set of characters or a
	 * default set of alphanumeric characters.
	 * @param length - The length parameter is the desired length of the generated ID.
	 * @param [_chars] - The optional parameter `_chars` is a string of characters that can be used to
	 * generate the random ID. If no value is provided for `_chars`, the function will use a default set
	 * of characters that includes lowercase and uppercase letters and numbers.
	 * @returns The function `generateId` returns a string of random characters with the specified length.
	 * The characters used for the string can be either the default set of lowercase and uppercase letters
	 * and digits, or a custom set of characters passed as the second argument `_chars`.
	 */
	function generateId(length, _chars = '') {
		const chars = _chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars[Math.floor(Math.random() * chars.length)];
		}
		return result;
	}

	class View {
		constructor() {
			this.ref = null;
		}
		
		init() {
			this.ref = createElem('div');
			return this;
		}
		
		mount(target) {
			this.ref = $(target);
			return this;
		}
		
		setContent(html) {
			this.ref.innerHTML = html;
			return this;
		}
		
		append(widget) {
			this.ref.appendChild(widget.getRef());
			return this;
		}
	}

	/**
	 * Window class for creating draggable, collapsible windows with custom content.
	 */
	class Window {
		/**
		 * Constructor takes x, y coordinates, optional name, and optional collapsed state.
		 * @param {number} x - The x-coordinate of the window.
		 * @param {number} y - The y-coordinate of the window.
		 * @param {string} [name=''] - The optional name of the window.
		 * @param {boolean} [collapsed=false] - The optional initial collapsed state of the window.
		 */
		constructor(x, y, name = '', collapsed = false) {
			// Create window element and set its properties
			this.windowRef = createElem('div');
			this.windowRef.classList.add('cgui-window');
			this.windowRef.style.position = 'absolute';
			this.windowRef.role = 'dialog';

			// Create header element and set its properties
			this.headerRef = createElem('div');
			this.headerRef.classList.add('header');

			// Create title element and set its properties
			const titleId = generateId(16);
			this.titleRef = createElem('span');
			this.titleRef.innerHTML = name;
			this.titleRef.id = titleId;
			this.headerRef.appendChild(this.titleRef);
			this.setTitle(name);
			this.windowRef.setAttribute('aria-labeledby', titleId);

			// Add space after title
			this.headerRef.innerHTML += '&nbsp;';

			// Create arrow element and set its properties
			this.arrowRef = createElem('span');
			this.arrowRef.innerHTML = '▼';
			this.headerRef.appendChild(this.arrowRef);

			// Create content element and set its properties
			const contentId = generateId(16);
			this.contentRef = createElem('div');
			this.contentRef.id = contentId;
			this.contentRef.classList.add('content');
			this.windowRef.setAttribute('aria-describedby', contentId);
			
			// Create new View and mount it
			this.view = new View().mount(this.contentRef);

			// Append header and content to the window element
			this.windowRef.appendChild(this.headerRef);
			this.windowRef.appendChild(this.contentRef);

			// Set window position
			this.windowRef.style.left = `${x}px`;
			this.windowRef.style.top = `${y}px`;

			// Set initial collapsed state
			if (collapsed) this.close();

			// Add window to the document body
			document.body.appendChild(this.windowRef);

			// Initialize draggable, toggle, and activation functionality
			this.initDraggable();
			this.initToggleOnClick();
			this.initActivationOnClick();
		}

		/**
		 * Set the title of the window.
		 * @param {string} html - The title to be set.
		 */
		setTitle(html) {
			this.titleRef.innerHTML = html;
			return this;
		}

		/**
		 * Set the content of the window.
		 * @param {string} html - The content to be set.
		 */
		setContent(html) {
			this.view.setContent(html);
			return this;
		}

		/**
		 * Move the window to the specified x, y coordinates.
		 * @param {number} x - The x-coordinate to move the window to.
		 * @param {number} y - The y-coordinate to move the window to.
		 */
		move(x, y) {
			this.windowRef.style.left = `${x}px`;
			this.windowRef.style.top = `${y}px`;
			return this;
		}

		/**
		 * Close (collapse) the window.
		 */
		close() {
			this.windowRef.classList.add('collapsed');
			this.arrowRef.innerHTML = '◀';
			return this;
		}

		/**
		 * Open (expand) the window.
		 */
		open() {
			this.windowRef.classList.remove('collapsed');
			this.arrowRef.innerHTML = '▼';
			return this;
		}

		/**
		 * Toggle the window's collapsed state.
		 */
		toggle() {
			this.windowRef.classList.toggle('collapsed');
			if (this.windowRef.classList.contains('collapsed')) {
				this.arrowRef.innerHTML = '◀';
			} else {
				this.arrowRef.innerHTML = '▼';
			}
			return this;
		}

		/**
		 * Hide the window
		 */
		hide() {
			this.windowRef.style.display = 'none';
			return this;
		}

		/**
		 * Show the window
		 */
		show() {
			this.windowRef.style.display = 'block';
			return this;
		}

		/**
		 * The "append" function adds a widget to the content reference.
		 * @param widget - The widget parameter is an object that has a method called getRef() which returns
		 * a reference to the DOM element of the widget. This method is used to retrieve the DOM element of
		 * the widget and append it to the contentRef element.
		 */
		append(widget) {
			this.view.append(widget);
			return this;
		}

		/**
		 * Initialize draggable functionality for the window
		 */
		initDraggable() {
			let offsetX, offsetY, isDragging = false;

			const onMouseDown = (e) => {
				e.preventDefault();
				e = e.touches ? e.touches[0] : e;
				offsetX = e.clientX - this.windowRef.offsetLeft;
				offsetY = e.clientY - this.windowRef.offsetTop;
				isDragging = true;
			};

			const onMouseMove = (e) => {
				if (!isDragging) return;
				e = e.touches ? e.touches[0] : e;
				this.move(e.clientX - offsetX, e.clientY - offsetY);
			};

			const onMouseUp = () => {
				isDragging = false;
			};

			this.headerRef.addEventListener('mousedown', onMouseDown);
			this.headerRef.addEventListener('touchstart', onMouseDown);

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('touchmove', onMouseMove);

			document.addEventListener('mouseup', onMouseUp);
			document.addEventListener('touchend', onMouseUp);
		}

		/**
		 * Initialize toggle functionality on click for the window.
		 * @param {number} [threshold=10] - The distance threshold to differentiate between click and drag.
		 */
		initToggleOnClick(threshold = 10) {
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

		/**
		 * Initialize activation functionality on click for the window
		 */
		initActivationOnClick() {
			this.windowRef.addEventListener('pointerdown', () => {
				[...document.getElementsByClassName('cgui-window')].forEach(win => win.classList.remove('active'));
				this.windowRef.classList.add('active');
			});
		}

		/**
		 * The function returns the window reference.
		 * @returns The function `getRef()` is returning the value of `this.windowRef`.
		 */
		getRef() {
			return this.windowRef;
		}
	}

	/**
	 * The Element class creates a new HTML element, sets its text content, adds
	 * an onClick event listener, and returns a reference to the element. 
	 */
	class Element {
		/**
		 * This is a constructor function that creates a new HTML element with a specified tag name or
		 * defaults to a div element.
		 * @param [elementName=div] - The parameter `elementName` is a string that represents the name of the
		 * HTML element that will be created using the `createElem()` method. By default, if no
		 * value is provided for `elementName`, it will create a `div` element. However, you can pass any
		 * valid HTML element
		 */
		constructor(elementName = 'div') {
			this.ref = createElem(elementName);
			this.addClass('cgui-widget');
		}

		/**
		 * The function sets the innerHTML of a given element to a specified text.
		 * @param text - The text that will be set as the innerHTML of the element referenced by "this.ref".
		 */
		setText(text) {
			this.ref.innerHTML = text;
			return this;
		}

		/**
		 * The function adds a click event listener to a specified element.
		 * @param f - "f" is a function that will be executed when the element that this code is attached to
		 * is clicked. It is a callback function that will be passed as an argument to the `addEventListener`
		 * method.
		 */
		onClick(f) {
			this.ref.addEventListener('click', f);
			return this;
		}

		addClass(className) {
			this.ref.classList.add(className);
			return this;
		}

		setClass(className) {
			this.ref.className = 'cgui-widget ' + className.trim();
			return this;
		}

		/**
		 * The function returns the value of the "ref" property.
		 * @returns The function `getRef()` is returning the value of `this.ref`. It is not clear what
		 * `this.ref` refers to without more context.
		 */
		getRef() {
			return this.ref;
		}
	}

	/**
	 * The Text class extends the Element class and creates a div element with a margin and
	 * sets its text content.
	 */
	class Text extends Element {
		constructor(text = '') {
			super('div');
			this.addClass('cgui-text');
			this.setText(text);
		}
	}

	/**
	 * The Button class is a subclass of the Element class that creates a button element
	 * with a specified text and CSS class. 
	 */
	class Button extends Element {
		constructor(text = '') {
			super('button');
			this.addClass('cgui-btn');
			this.setText(text);
		}
	}

	/**
	 * The Input class is a subclass of the Element class that creates a input element
	 * with a specified text and CSS class.
	 */
	class Input extends Element {
		constructor(text = '') {
			super('input');
			this.addClass('cgui-input');
			this.setText(text);
		}

		onInput(f) {
			this.ref.addEventListener('input', e => f(e, this.getText()));
			return this;
		}

		setText(text) {
			this.ref.value = text;
			return this;
		}

		getText() {
			return this.ref.value;
		}
	}

	/**
	 * The Switch class creates a toggle switch element with customizable text
	 * and an onChange event listener.
	 */
	class Switch extends Element {
		constructor(text = '') {
			// <label for="switch" class="cgui-switch">
			//  <input type="checkbox" id="switch">
			//  <span class="cgui-switch-slider"></span>
			//  <span class="cgui-switch-text">{Text}</span>
			// </label>
			super('label');
			const id = this.id = generateId(16);
			this.ref.for = id;
			this.addClass('cgui-switch');
			this.inputRef = createElem('input');
			this.inputRef.type = 'checkbox';
			this.inputRef.id = id;
			this.ref.appendChild(this.inputRef);
			this.sliderRef = createElem('span');
			this.sliderRef.className = 'cgui-switch-slider';
			this.ref.appendChild(this.sliderRef);
			this.textRef = createElem('span');
			this.textRef.className = 'cgui-switch-text';
			this.textRef.for = id;
			this.ref.appendChild(this.textRef);
			this.setText(text);
		}

		/**
		 * This function adds an event listener to an input element that triggers a callback function when
		 * the input's value changes.
		 * @param func - func is a function that will be called when the 'change' event is triggered on the
		 * input element. The function takes two parameters: the event object and a boolean value indicating
		 * whether the input element is checked or not.
		 */
		onChange(func) {
			this.inputRef.addEventListener('change', e => func(e, this.inputRef.checked));
			return this;
		}

		/**
		 * The function sets the innerHTML of a text reference element to a given text.
		 * @param text - The text parameter is a string that represents the new text content that will be set
		 * to the HTML element referenced by the textRef property.
		 */
		setText(text) {
			this.textRef.innerHTML = text;
			return this;
		}
	}

	const utils = {
		$,
		createElem,
		generateId,
		distance,

		appendToBody(widget) {
			document.body.appendChild(widget.getRef());
		},

		includeCSS(css) {
			const head = document.head;
			if ($(`style{${css}}`, head)) return;
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
		}
	};

	return { Window, Text, Button, Input, Switch, utils };
})();

if (typeof module !== 'undefined' && typeof module.exports == 'object') module.exports = cheatgui;
