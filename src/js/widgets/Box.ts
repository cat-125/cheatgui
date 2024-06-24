import Widget from "./Widget";
import View from "./View";

/**
 * Just a container where you can put child elements. They will not differ
 * in any way from the ones outside. Can be used as a column in a row.
 * @public
 * @extends Widget
 */
export default class Box extends Widget {
	constructor() {
		super('div');
		this.view = (new View).mount(this.ref);
	}

	/**
	 * Set the content of the container.
	 * @param {string} html
	 * @returns {Box}
	 */
	setContent(html: string): this {
		this.view.setContent(html);
		return this;
	}

	/**
	 * Add a child widget to the container.
	 * @param {Widget} widget
	 * @returns {Box}
	 */
	append(widget: Widget): this {
		this.view.append(widget);
		return this;
	}
}
