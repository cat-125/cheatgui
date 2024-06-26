import Widget from "./Widget";
import ValueWidget from "./ValueWidget";
import { createElem, generateId } from "../utils";

/**
 * A class that represents a menu for selecting one of several values.
 * @public
 * @extends Widget
 */
export default class Dropdown extends Widget implements ValueWidget {
	ref: HTMLLabelElement;
	selRef: HTMLSelectElement;
	labelRef: HTMLSpanElement;
	id: string;

	/**
	 * Create a new dropdown.
	 *
	 * The values parameter should be an object where the keys are the display text and
	 * the values are the actual values.
	 *
	 * @param {string} [label=''] - The label text.
	 * @param {Object} [values={}] - The values to display in the dropdown.
	 * @param {string} [value=null] - The initial value of the dropdown.
	 * @param {Function} [callback=null] - The callback function to call when the value
	 * is changed.
	 */
	constructor(label: string = '', values: object = {}, value: string = null, callback: Function = null) {
		super('label');
		const id = this.id = generateId(16);
		this.ref.htmlFor = id;
		this.ref.tabIndex = -1;
		this.addClass('cgui-dropdown-wrapper');
		this.selRef = createElem('select');
		this.selRef.id = id;
		this.selRef.classList.add('cgui-dropdown');
		this.ref.appendChild(this.selRef);
		for (const [k, v] of Object.entries(values)) {
			const opt = createElem('option');
			opt.textContent = k;
			opt.value = v;
			if (v === value) opt.selected = true;
			this.selRef.appendChild(opt);
		}
		this.labelRef = createElem('span');
		this.labelRef.className = 'cgui-dropdown-label';
		this.ref.appendChild(this.labelRef);
		this.setLabel(label);

		this.ref.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				e.preventDefault();
				this.selRef.focus();
			}
		})

		if (callback) this.onChange(callback);
	}

	/**
	 * Set the callback function to call when the value is changed.
	 * @param {Function} func - The callback function to call when the value is changed.
	 * @returns {Dropdown}
	 */
	onChange(func: Function): this {
		this.selRef.addEventListener('change', e => func(e, this.getValue()));
		return this;
	}

	/**
	 * Bind a property to the dropdown.
	 * @param {object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {Dropdown}
	 */
	bind(obj: any, prop: string): this {
		this.onChange((_: any, val: any) => obj[prop] = val);
		return this;
	}

	/**
	 * Get the value of the dropdown.
	 * @returns {string}
	 */
	getValue(): string {
		return this.selRef.options[this.selRef.selectedIndex].value;
	}

	/**
	 * Set the value of the dropdown.
	 * @param {string} val
	 * @returns {Dropdown}
	 */
	setValue(val: string): this {
		this.selRef.selectedIndex = Array.from(this.selRef.options).findIndex(o => o.value === val);
		return this;
	}

	/**
	 * Set the label of the dropdown.
	 * @param {string} label
	 * @returns {Dropdown}
	 */
	setLabel(label: string): this {
		this.labelRef.innerHTML = label;
		return this;
	}
}
