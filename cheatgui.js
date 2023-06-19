const cheatgui = (function() {

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

	function generateId(length, _chars = '') {
		const chars = _chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars[Math.floor(Math.random() * chars.length)];
		}
		return result;
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
			this.windowRef = document.createElement('div');
			this.windowRef.classList.add('cgui-window');
			this.windowRef.style.position = 'absolute';
			this.windowRef.role = 'dialog';

			// Create header element and set its properties
			this.headerRef = document.createElement('div');
			this.headerRef.classList.add('header');

			// Create title element and set its properties
			const titleId = generateId(16);
			this.titleRef = document.createElement('span');
			this.titleRef.innerHTML = name;
			this.titleRef.id = titleId;
			this.headerRef.appendChild(this.titleRef);
			this.setTitle(name);
			this.windowRef.setAttribute('aria-labeledby', titleId);

			// Add space after title
			this.headerRef.innerHTML += '&nbsp;';

			// Create arrow element and set its properties
			this.arrowRef = document.createElement('span');
			this.arrowRef.innerHTML = '▼';
			this.headerRef.appendChild(this.arrowRef);

			// Create content element and set its properties
			const contentId = generateId(16);
			this.contentRef = document.createElement('div');
			this.contentRef.id = contentId;
			this.contentRef.classList.add('content');
			this.windowRef.setAttribute('aria-describedby', contentId);

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
		}

		/**
		 * Set the content of the window.
		 * @param {string} html - The content to be set.
		 */
		setContent(html) {
			this.contentRef.innerHTML = html;
		}

		/**
		 * Move the window to the specified x, y coordinates.
		 * @param {number} x - The x-coordinate to move the window to.
		 * @param {number} y - The y-coordinate to move the window to.
		 */
		move(x, y) {
			this.windowRef.style.left = `${x}px`;
			this.windowRef.style.top = `${y}px`;
		}

		/**
		 * Close (collapse) the window.
		 */
		close() {
			this.windowRef.classList.add('collapsed');
			this.arrowRef.innerHTML = '◀';
		}

		/**
		 * Open (expand) the window.
		 */
		open() {
			this.windowRef.classList.remove('collapsed');
			this.arrowRef.innerHTML = '▼';
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
		}

		/**
		 * Hide the window
		 */
		hide() {
			this.windowRef.style.display = 'none';
		}

		/**
		 * Show the window
		 */
		show() {
			this.windowRef.style.display = 'block';
		}

		append(widget) {
			this.contentRef.appendChild(widget.getRef());
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
		
		getRef() {
			return this.windowRef;
		}
	}
	
	class Element {
		constructor(elementName = 'div') {
			this.ref = document.createElement(elementName);
		}
		
		setText(text) {
			this.ref.innerHTML = text;
		}

		onClick(f) {
			this.ref.addEventListener('click', f);
		}
		
		getRef() {
			return this.ref;
		}
	}
	
	class Text extends Element {
		constructor(text = '') {
			super('div');
			this.ref.style.margin = '8px 0 8px 0';
			this.setText(text);
		}
	}

	class Button extends Element {
		constructor(text = '') {
			super('button');
			this.ref.className = 'cgui-btn';
			this.setText(text);
		}
	}

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
			this.ref.className = 'cgui-switch';
			this.inputRef = document.createElement('input');
			this.inputRef.type = 'checkbox';
			this.inputRef.id = id;
			this.ref.appendChild(this.inputRef);
			this.sliderRef = document.createElement('span');
			this.sliderRef.className = 'cgui-switch-slider';
			this.ref.appendChild(this.sliderRef);
			this.textRef = document.createElement('span');
			this.textRef.className = 'cgui-switch-text';
			this.textRef.for = id;
			this.ref.appendChild(this.textRef);
			this.setText(text);
		}

		onChange(func) {
			this.inputRef.addEventListener('change', e => func(e, this.inputRef.checked));
		}

		setText(text) {
			this.textRef.innerHTML = text;
		}
	}

	return { Window, Text, Button, Switch };
})();

if (typeof module !== 'undefined' && typeof module.exports == 'object') module.exports = cheatgui;