import View from './View';
import EventSupport from '../EventSupport';

/**
 * The base class for all elements in CheatGUI.
 * @public
 * @extends EventSupport
 */
export default class GUIElement extends EventSupport {
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
