import Widget from "./Widget";

/**
 * A class that represents a button widget.
 * @public
 * @extends Widget
 */
export default class Button extends Widget {
	/**
	 * Create a new button widget and initialize it.
	 * @param {string} [text=''] - Button text.
	 * @param {Function} [callback=null] - The function to call when the button is clicked.
	 */
	constructor(text: string = '', callback: Function = null) {
		super('button');
		this.addClass('cgui-btn');
		this.ref.tabIndex = 0;
		this.setText(text);
		if (callback) this.onClick(callback);
	}
}