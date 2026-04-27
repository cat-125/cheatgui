import Widget from './Widget';
import ValueWidget from './ValueWidget';
import { createElem } from '../utils';

/**
 * A class that represents an input field
 * where only numbers can be entered.
 * @public
 * @ extends Widget implements ValueWidget
 */
export default class NumberInputWidget extends Widget implements ValueWidget {
	declare ref: HTMLDivElement;
	inputRef: HTMLInputElement;
	labelRef: HTMLDivElement;

	/**
	 * Create a new number input field and initialize it.
	 * @param {string} [label=''] - The label text.
	 * @param {number} [value=0] - The initial value.
	 * @param {Function} [callback=null] - The function to call when the input is changed.
	 */
	constructor(label: string = '', value: number = 0, callback: Function | null = null) {
		super('div');

		this.addClass('cgui-input-wrapper');

		this.inputRef = createElem('input');
		this.inputRef.classList.add('cgui-input');
		this.inputRef.type = 'number';
		this.inputRef.tabIndex = 0;
		this.ref.appendChild(this.inputRef);

		this.labelRef = createElem('div');
		this.labelRef.classList.add('cgui-input-label');
		this.ref.appendChild(this.labelRef);

		this.setValue(value.toString());
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
	 * @returns {NumberInputWidget}
	 */
	setLabel(label: string): this {
		this.labelRef.innerHTML = label;
		return this;
	}

	/**
	 * Add a change event listener to the input field.
	 * @param {Function} f - The function to call when the input is changed.
	 * @returns {NumberInputWidget}
	 */
	onChange(f: Function): this {
		this.on('change', f);
		return this;
	}

	/**
	 * Add an input event listener to the input field.
	 * @param {Function} f - The function to call when the input is changed.
	 * @returns {NumberInputWidget}
	 * @deprecated Use onChange instead
	 */
	onInput(f: Function): this {
		return this.onChange(f);
	}

	/**
	 * Bind an input field to an object property.
	 * @param {Object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {NumberInput}
	 */
	bind(obj: any, prop: string): this {
		this.onInput((_: any, val: any) => (obj[prop] = val));
		return this;
	}

	/**
	 * Set the value of the input field.
	 * @param {string} value
	 * @returns {NumberInputWidget}
	 */
	setValue(value: string): this {
		this.inputRef.value = this.parse(value).toString();
		return this;
	}

	/**
	 * Get the value of the input field.
	 * @returns {string} - The value of the input field.
	 */
	getValue(): number {
		return this.parse(this.inputRef.value);
	}

	parse(value: string) {
		const p = parseFloat(value);
		return isNaN(p) ? 0 : p || 0;
	}
}
