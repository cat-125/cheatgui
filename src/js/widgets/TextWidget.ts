import Widget from './Widget';

/**
 * A class that represents a text widget.
 * @public
 */

export default class TextWidget extends Widget {
	/**
	 * Create a new text widget and initialize it.
	 * @param {string} [text=''] - The text to display.
	 * @returns {TextWidget}
	 */
	constructor(text: string = '') {
		super('div');
		this.addClass('cgui-text');
		this.setText(text);
	}
}
