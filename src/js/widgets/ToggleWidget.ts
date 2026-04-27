import Widget from './Widget';
import type ValueWidget from './ValueWidget';
import { createElem, generateId } from '../utils';

/**
 * A class that represents a toggle that can be turned on and off.
 * @public
 * @ extends Widget implements ValueWidget
 */
export default class ToggleWidget extends Widget implements ValueWidget {
	declare ref: HTMLLabelElement;
	inputRef: HTMLInputElement;
	sliderRef: HTMLSpanElement;
	labelRef: HTMLSpanElement;
	id: string;

	/**
	 * Create a new toggle.
	 * @param {string} [label=''] - The label text.
	 * @param {boolean} [checked=false] - Whether the toggle is initially checked.
	 * @param {(value: boolean) => void} [callback=null] - The callback function to call when the toggle is changed.
	 */
	constructor(label: string = '', checked: boolean = false, callback: ((value: boolean) => void) | null = null) {
		super('label');
		const id = (this.id = generateId(16));
		this.ref.htmlFor = id;
		this.addClass('cgui-toggle');
		this.inputRef = createElem('input');
		this.inputRef.type = 'checkbox';
		this.inputRef.id = id;
		this.ref.appendChild(this.inputRef);
		this.inputRef.checked = checked;
		this.sliderRef = createElem('span');
		this.sliderRef.className = 'cgui-toggle-slider';
		this.ref.appendChild(this.sliderRef);
		this.labelRef = createElem('span');
		this.labelRef.className = 'cgui-toggle-label';
		this.ref.appendChild(this.labelRef);
		this.ref.tabIndex = 0;
		this.setLabel(label);

		this.ref.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				e.preventDefault();
				this.inputRef.click();
				this.ref.focus();
			}
		});

		this.inputRef.addEventListener('change', () => {
			this.trigger('change', this.getValue());
			this.trigger('input', this.getValue());
		});

		if (callback) this.onChange(callback);
	}

	/**
	 * Set the callback function to call when the toggle is changed.
	 * @param {(value: boolean) => void} func - The callback function to call when the toggle is changed.
	 * @returns {ToggleWidget}
	 */
	onChange(func: (value: boolean) => void): this {
		this.on('change', func);
		return this;
	}

	/**
	 * Bind a property to the toggle.
	 * @param {object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {Toggle}
	 */
	bind(obj: any, prop: string): this {
		this.onChange((_: any, val: any) => (obj[prop] = val));
		return this;
	}

	/**
	 * Get whether the toggle is checked.
	 * @returns {boolean}
	 */
	isChecked(): boolean {
		return this.inputRef.checked;
	}

	/**
	 * Get whether the toggle is checked.
	 * @returns {boolean}
	 */
	getValue(): boolean {
		return this.isChecked();
	}

	/**
	 * Set whether the toggle is checked.
	 * @param {boolean} val
	 * @returns {ToggleWidget}
	 */
	setValue(val: boolean): this {
		this.inputRef.checked = val;
		return this;
	}

	/**
	 * Set the label of the toggle.
	 * @param {string} label
	 * @returns {Toggle}
	 */
	setLabel(label: string): this {
		this.labelRef.innerHTML = label;
		return this;
	}
}
