import Widget from './Widget';

/**
 * A class that represents a button widget.
 * @public
 * @extends Widget
 */
export default class ButtonWidget extends Widget {
	/**
	 * Create a new button widget and initialize it.
	 * @param {string} [text=''] - Button text.
	 * @param {() => void} [callback=null] - The function to call when the button is clicked.
	 * @returns {ButtonWidget}
	 */
	constructor(text: string = '', callback: (() => void) | null = null) {
		super('button');
		this.addClass('cgui-btn');
		this.ref.tabIndex = 0;
		this.setText(text);
		if (callback) this.onClick(callback);
	}
}
