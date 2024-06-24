import Widget from './Widget';
import View from './View';
import { config } from '../config';
import { createElem, generateId } from '../utils';

/**
 * A tree that can be expanded and collapsed, and can also have children.
 * @public
 * @extends Widget
 */
export default class Tree extends Widget {
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
