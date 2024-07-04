import Widget from "./Widget";
import ValueWidget from "./ValueWidget";
import { createElem } from "../utils";

/**
 * A class that represents an input field widget.
 * @public
 * @ extends Widget implements ValueWidget
 */
export default class Input extends Widget implements ValueWidget {
	ref: HTMLDivElement;
	inputRef: HTMLInputElement;
	labelRef: HTMLDivElement;

	/**
	 * Create a new input field widget and initialize it.
	 * @param {string} [label=''] - The label text.
	 * @param {string} [val=''] - The initial value.
	 * @param {Function} [callback=null] - The function to call when the input is changed.
	 */
	constructor(label: string = '', val: string = '', callback: Function = null) {
		super('div');

		this.addClass('cgui-input-wrapper');

		this.inputRef = createElem('input');
		this.inputRef.classList.add('cgui-input');
		this.inputRef.tabIndex = 0;
		this.ref.appendChild(this.inputRef);

		this.labelRef = createElem('div');
		this.labelRef.classList.add('cgui-input-label');
		this.ref.appendChild(this.labelRef);

		this.setValue(val);
		this.setLabel(label);

		this.inputRef.addEventListener('input', () => {
			this.trigger('change', this.getValue());
			this.trigger('input', this.getValue());
		});

		if (callback) this.onInput(callback);
	}

	/**
	 * Set the label of the input field.
	 * @param {string} label - The new label text.
	 * @returns {Input}
	 */
	setLabel(label: string): this {
		this.labelRef.innerHTML = label;
		return this;
	}

	/**
	 * Add an input event listener to the input field.
	 * @param {Function} f - The function to call when the input is changed.
	 * @returns {Input}
	 */
	onInput(f: Function): this {
		this.on('input', f);
		return this;
	}

	/**
	 * Bind an input field to an object property.
	 * @param {Object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {Input}
	 */
	bind(obj: any, prop: string): this {
		this.onInput((_: any, val: any) => obj[prop] = val);
		return this;
	}

	/**
	 * Set the value of the input field.
	 * @param {string} value 
	 * @returns {Input}
	 */
	setValue(value: string): this {
		this.inputRef.value = value;
		return this;
	}

	/**
	 * Get the value of the input field.
	 * @returns {string} - The value of the input field.
	 */
	getValue(): string {
		return this.inputRef.value;
	}
}