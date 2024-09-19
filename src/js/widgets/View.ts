import GUIElement from './GUIElement';
import { $, getWidgetName } from '../utils';

/**
 * A class that stores interface elements and displays them on a web page.
 * @public
 */
export default class View {
	ref: HTMLElement | null;
	children: GUIElement[];

	constructor() {
		this.ref = null;
		this.children = [];
	}

	/**
	 * Use an existing HTML element for the view.
	 * @param {HTMLElement} target
	 * @returns {View}
	 */
	mount(target: HTMLElement): this {
		this.ref = $(target);
		return this;
	}

	/**
	 * Set the contents of the view.
	 * @param {string} value
	 * @returns {View}
	 */
	setContent(value: string): this {
		if (!this.ref) return this;
		this.ref.innerHTML = value;
		return this;
	}

	/**
	 * Set the contents of the view.
	 * @param {string} value
	 * @returns {View}
	 */
	setText(value: string): this {
		if (!this.ref) return this;
		this.ref.textContent = value;
		return this;
	}

	/**
	 * The `append` function appends a widget to a parent element and updates the list of children.
	 * @param {GUIElement} widget - The widget to append.
	 * @returns {View}
	 */
	append(widget: GUIElement): this {
		if (!this.ref) return this;
		this.ref.appendChild(widget.getRef());
		this.children.push(widget);
		return this;
	}

	/**
	 * Destroy the view and all its children.
	 */
	destroy() {
		this.children.forEach((c) => c.destroy());
		this.ref = null;
	}

	/**
	 * Recursively returns a JSON representation of all values in the view.
	 * @returns {Object}
	 */
	getConfig(): object {
		function processView(view: View) {
			const res: { type: string; value: any[] } = {
				type: 'root',
				value: []
			};

			for (let i = 0; i < view.children.length; i++) {
				const child: GUIElement = view.children[i];
				const type = getWidgetName(child);
				const el: { type: string; value: any } = { type, value: null };

				if (['input', 'number-input', 'switch', 'slider', 'select'].includes(type)) {
					// @ts-expect-error
					el.value = child.getValue();
				} else if (type === 'tree') {
					el.value = processView(child.view).value;
				} else if (type === 'has-view') {
					el.value = processView(child.view).value;
					// @ts-expect-error
				} else if (typeof child.getValue === 'function')
					// @ts-expect-error
					el.value = child.getValue();

				res.value[i] = el;
			}

			return res;
		}

		return processView(this);
	}

	/**
	 * Recursively loads the values of all child elements from the object.
	 * @param {Object} config
	 */
	loadConfig(config: object) {
		function processView(view: View, item: any) {
			const items = item.value;
			const widgets = view.children;
			let offset = 0;
			let warned = false;
			for (let i = 0; i < items.length; i++) {
				if (items[i].type !== getWidgetName(widgets[i + offset])) {
					if (!warned) {
						console.warn(
							`Configuration mismatch! Trying to merge automatically... (${items[i].type}#${i} != ${getWidgetName(widgets[i + offset])}#${i + offset} with offset ${offset})`
						);
						warned = true;
					}
					if (items.length === widgets.length) {
						console.warn(`Skipping field "${items[i].type}"`);
						continue;
					} else if (items.length < widgets.length) {
						if (items[i] === getWidgetName(widgets[i + offset + 1])) {
							console.warn(`Assuming that ${getWidgetName(widgets[i + offset - 1])} field has been added`);
						}
						offset++;
					} else if (items.length > widgets.length) {
						if (items[i] === getWidgetName(widgets[i + offset - 1])) {
							console.warn(`Assuming that ${items[i + offset - 1]} field has been removed`);
						}
						offset--;
						continue;
					} else {
						console.warn('Unable to merge automatically; skipping');
						return;
					}
				}
				if (['input', 'number-input', 'switch', 'slider', 'dropdown'].includes(items[i].type))
					// @ts-expect-error
					widgets[i + offset].setValue(items[i].value);
				else if (items[i].type === 'tree' || items[i].type === 'has-view')
					widgets[i + offset].view.loadConfig(items[i]);
			}
		}

		processView(this, config);
	}
}
