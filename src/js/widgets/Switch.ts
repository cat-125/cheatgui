import Widget from './Widget';
import ValueWidget from './ValueWidget';
import { createElem, generateId } from '../utils';

/**
 * A class that represents a switch that can be turned on and off.
 * @public
 * @ extends Widget implements ValueWidget
 */
export default class Switch extends Widget implements ValueWidget {
	declare ref: HTMLLabelElement;
	inputRef: HTMLInputElement;
	sliderRef: HTMLSpanElement;
	labelRef: HTMLSpanElement;
	id: string;

	/**
	 * Create a new switch.
	 * @param {string} [label=''] - The label text.
	 * @param {boolean} [checked=false] - Whether the switch is initially checked.
	 * @param {Function} [callback=null] - The callback function to call when the switch is changed.
	 */
	constructor(label: string = '', checked: boolean = false, callback: Function = null) {
		super('label');
		const id = (this.id = generateId(16));
		this.ref.htmlFor = id;
		this.addClass('cgui-switch');
		this.inputRef = createElem('input');
		this.inputRef.type = 'checkbox';
		this.inputRef.id = id;
		this.ref.appendChild(this.inputRef);
		this.inputRef.checked = checked;
		this.sliderRef = createElem('span');
		this.sliderRef.className = 'cgui-switch-slider';
		this.ref.appendChild(this.sliderRef);
		this.labelRef = createElem('span');
		this.labelRef.className = 'cgui-switch-label';
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
	 * Set the callback function to call when the switch is changed.
	 * @param {Function} func - The callback function to call when the switch is changed.
	 * @returns {Switch}
	 */
	onChange(func: Function): this {
		this.on('change', func);
		return this;
	}

	/**
	 * Bind a property to the switch.
	 * @param {object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {Switch}
	 */
	bind(obj: any, prop: string): this {
		this.onChange((_: any, val: any) => (obj[prop] = val));
		return this;
	}

	/**
	 * Get whether the switch is checked.
	 * @returns {boolean}
	 */
	isChecked(): boolean {
		return this.inputRef.checked;
	}

	/**
	 * Get whether the switch is checked.
	 * @returns {boolean}
	 */
	getValue(): boolean {
		return this.isChecked();
	}

	/**
	 * Set whether the switch is checked.
	 * @param {boolean} val
	 * @returns {Switch}
	 */
	setValue(val: boolean): this {
		this.inputRef.checked = val;
		return this;
	}

	/**
	 * Set the label of the switch.
	 * @param {string} label
	 * @returns {Switch}
	 */
	setLabel(label: string): this {
		this.labelRef.innerHTML = label;
		return this;
	}
}
