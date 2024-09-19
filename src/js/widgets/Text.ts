import Widget from './Widget';

/**
 * A class that represents a text widget.
 * @public
 */

export default class Text extends Widget {
	/**
	 * Create a new text widget and initialize it.
	 * @param {string} [text=''] - The text to display.
	 */
	constructor(text: string = '') {
		super('div');
		this.addClass('cgui-text');
		this.setText(text);
	}
}
