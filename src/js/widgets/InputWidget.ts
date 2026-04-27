import Widget from './Widget';
import ValueWidget from './ValueWidget';
import { createElem } from '../utils';

/**
 * A class that represents an input field widget.
 * @public
 * @ extends Widget implements ValueWidget
 */
export default class InputWidget extends Widget implements ValueWidget {
	declare ref: HTMLDivElement;
	inputRef: HTMLInputElement;
	labelRef: HTMLDivElement;

	/**
	 * Create a new input field widget and initialize it.
	 * @param {string} [label=''] - The label text.
	 * @param {string} [val=''] - The initial value.
	 * @param {(value: string) => void} [callback=null] - The function to call when the input is changed.
	 */
	constructor(label: string = '', val: string = '', callback: ((value: string) => void) | null = null) {
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
			const value = this.getValue();
			this.trigger('change', value);
			this.trigger('input', value);
		});

		if (callback) this.onChange(callback);
	}

	/**
	 * Set the label of the input field.
	 * @param {string} label - The new label text.
	 * @returns {InputWidget}
	 */
	setLabel(label: string): this {
		this.labelRef.textContent = label;
		return this;
	}

	/**
	 * Add a change event listener to the input field.
	 * @param {(value: string) => void} f - The function to call when the input is changed.
	 * @returns {InputWidget}
	 */
	onChange(f: (value: string) => void): this {
		this.on('change', f);
		return this;
	}

	/**
	 * Bind an input field to an object property.
	 * @param {Object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {Input}
	 */
	bind(obj: any, prop: string): this {
		this.onChange((val: string) => (obj[prop] = val));
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
