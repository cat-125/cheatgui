import GUIElement from './widgets/GUIElement';
import { $, getWidgetName } from './utils';

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
		const ref = widget.getRef();
		if (!ref) return this;
		this.ref.appendChild(ref);
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
				const child = view.children[i];
				if (!child) continue;
				const type = getWidgetName(child);
				const el: { type: string; value: any } = { type, value: null };

				if (['input', 'number-input', 'toggle', 'slider', 'select'].includes(type)) {
					// @ts-expect-error
					el.value = child.getValue();
				} else if (type === 'tree') {
					el.value = processView(child.view).value;
				} else if (type === 'has-view') {
					el.value = processView(child.view).value;
					// @ts-expect-error
				} else if (typeof child.getValue === 'function') {
					// @ts-expect-error
					el.value = child.getValue();
				}

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
				const configItem = items[i];
				if (!configItem) continue;
				const widget = widgets[i + offset];
				if (configItem.type !== getWidgetName(widget)) {
					if (!warned) {
						console.warn(
							`Configuration mismatch! Trying to merge automatically... (${configItem.type}#${i} != ${getWidgetName(widget)}#${i + offset} with offset ${offset})`
						);
						warned = true;
					}
					if (items.length === widgets.length) {
						console.warn(`Skipping field "${configItem.type}"`);
						continue;
					} else if (items.length < widgets.length) {
						if (configItem.type === getWidgetName(widgets[i + offset + 1])) {
							console.warn(`Assuming that ${getWidgetName(widgets[i + offset - 1])} field has been added`);
						}
						offset++;
					} else if (items.length > widgets.length) {
						if (configItem.type === getWidgetName(widgets[i + offset - 1])) {
							console.warn(`Assuming that ${items[i + offset - 1]?.type ?? 'unknown'} field has been removed`);
						}
						offset--;
						continue;
					} else {
						console.warn('Unable to merge automatically; skipping');
						return;
					}
				}
				const targetWidget = widgets[i + offset];
				if (!targetWidget) continue;
				if (['input', 'number-input', 'toggle', 'slider', 'dropdown'].includes(configItem.type)) {
					// @ts-expect-error
					targetWidget.setValue(configItem.value);
				} else if (configItem.type === 'tree' || configItem.type === 'has-view') {
					targetWidget.view.loadConfig(configItem);
				}
			}
		}

		processView(this, config);
	}
}
