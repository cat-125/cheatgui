import GUIElement from "./GUIElement";
import { createElem } from "../utils";

/**
 * A class that represents a user interface widget.
 * @public
 * @extends GUIElement
 */
export default class Widget extends GUIElement {
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