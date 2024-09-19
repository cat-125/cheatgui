import GUIElement from './GUIElement';
import View from './View';
import { config } from '../config';
import { isMobile, createElem, generateId } from '../utils';
import { initActivationOnClick, initToggleOnClick, initDraggable, initResize } from '../wintools';

let activeWindow: Window | null = null;

/**
 * This class represents a window with
 * various settings and the ability to
 * add child elements.
 * @public
 * @extends GUIElement
 */
export default class Window extends GUIElement {
	declare ref: HTMLElement;
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
	 *
	 * @param {object} options - The options for the window
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
	}: {
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		title?: string;
		expanded?: boolean;
		collapsible?: boolean;
		collapseThreshold?: number;
		draggable?: boolean;
		dragThreshold?: number;
		resizable?: boolean;
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
		this.headerRef.tabIndex = 0;
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
		if (draggable) initDraggable(this, dragThreshold);
		if (resizable) initResize(this);
		if (collapsible) initToggleOnClick(this, collapseThreshold);
		initActivationOnClick(this);
	}

	get isFocused(): boolean {
		return this === activeWindow;
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
	 * The `focus` function sends the window to the top of the window stack and adds `active` class.
	 * @returns {this}
	 */
	focus(): this {
		if (this.isFocused) return this;
		Array.from(document.getElementsByClassName('cgui-window')).forEach((win) => win.classList.remove('active'));
		this.ref.classList.add('active');
		activeWindow = this;
		return this;
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
