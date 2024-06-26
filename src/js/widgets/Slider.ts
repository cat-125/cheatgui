import Widget from "./Widget";
import ValueWidget from "./ValueWidget";
import { createElem, countDigitsAfterDecimal, clamp, snap, range2percentage } from "../utils";

/**
 * A class representing a slider where you can select a value from a specific range.
 * @public
 * @ extends Widget implements ValueWidget
 */
export default class Slider extends Widget implements ValueWidget {
	ref: HTMLDivElement;
	sliderRef: HTMLDivElement;
	thumbRef: HTMLDivElement;
	labelRef: HTMLDivElement;
	min: number;
	max: number;
	step: number;
	accuracy: number;

	/**
	 * Create a new slider and initialize it.
	 * @param {Object} options - The options for the slider
	 * @param {string} [options.label=''] - The label text
	 * @param {number} [options.value=0] - The initial value
	 * @param {number} [options.min=0] - The minimum value
	 * @param {number} [options.max=100] - The maximum value
	 * @param {number} [options.step=1] - The step size
	 * @param {null} [options.callback=null] - The function to call when the slider is changed
	 */
	constructor({
		label = '', value = 0, min = 0, max = 100, step = 1, callback = null
	}: { label?: string; value?: number; min?: number; max?: number; step?: number; callback?: null; }) {
		super('div');

		this.addClass('cgui-slider-wrapper');

		this.sliderRef = createElem('div');
		this.sliderRef.classList.add('cgui-slider');
		this.sliderRef.tabIndex = 0;
		this.ref.appendChild(this.sliderRef);

		this.thumbRef = createElem('div');
		this.thumbRef.classList.add('cgui-slider-thumb');
		this.sliderRef.appendChild(this.thumbRef);

		this.labelRef = createElem('div');
		this.labelRef.classList.add('cgui-slider-label');
		this.ref.appendChild(this.labelRef);

		this.setMin(min);
		this.setMax(max);
		this.setStep(step);

		this.setValue(value);
		this.setLabel(label);

		this.initSlider();

		this.sliderRef.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.ctrlKey) {
				if (e.code == "ArrowLeft") {
					this.setValue(this.value - this.step * 10);
					this.trigger('change', this.getValue());
				} else if (e.code == "ArrowRight") {
					this.setValue(this.value + this.step * 10);
					this.trigger('change', this.getValue());
				}
			} else {
				if (e.code == "ArrowLeft") {
					this.setValue(this.value - this.step);
					this.trigger('change', this.getValue());
				} else if (e.code == "ArrowRight") {
					this.setValue(this.value + this.step);
					this.trigger('change', this.getValue());
				}
			}
		});

		this.sliderRef.addEventListener('mouseup', (e: MouseEvent) => {
			this.sliderRef.focus();
		})

		if (callback) this.onChange(callback);
	}

	/**
	 * Set the label of the slider.
	 * @param {string} text - The new label text.
	 * @returns {Slider}
	 */
	setLabel(text: string): this {
		this.labelRef.innerHTML = text;
		return this;
	}

	/**
	 * Add a change event listener to the slider.
	 * @param {Function} f - The function to call when the slider is changed.
	 * @returns {Slider}
	 */
	onChange(f: Function): this {
		this.on('change', (e: any) => f(e, this.getValue()));
		return this;
	}

	/**
	 * Bind a slider to an object property.
	 * @param {Object} obj - The object to bind the property to.
	 * @param {string} prop - The property to bind.
	 * @returns {Slider}
	 */
	bind(obj: any, prop: string): this {
		this.onChange((_: any, val: any) => obj[prop] = val);
		return this;
	}

	/**
	 * Set the minimum value of the slider.
	 * @param {number} min - The new minimum value.
	 * @returns {Slider}
	 */
	setMin(min: number): this {
		this.min = min;
		return this;
	}

	/**
	 * Set the maximum value of the slider.
	 * @param {number} max - The new maximum value.
	 * @returns {Slider}
	 */
	setMax(max: number): this {
		this.max = max;
		return this;
	}

	/**
	 * Set the step size of the slider.
	 * @param {number} step - The new step size.
	 * @returns {Slider}
	 */
	setStep(step: number): this {
		this.step = step;
		this.accuracy = countDigitsAfterDecimal(step);
		return this;
	}

	/**
	 * Set the value of the slider.
	 * @param {number} value - The new value.
	 */
	setValue(value: number) {
		value = parseFloat(clamp(snap(value, this.step), this.min, this.max).toFixed(this.accuracy));
		this.value = value;
		const displayValue = 100 / (this.max - this.min) * (value - this.min);
		this.thumbRef.style.marginLeft = displayValue + '%';
		this.thumbRef.style.transform = `translateX(-${displayValue}%)`;
		this.thumbRef.textContent = value.toString();
		return this;
	}


	initSlider() {
		let isDragging = false;
		const onMouseDown = (e: any) => {
			isDragging = true;
			updateSlider(e);
			document.addEventListener('mousemove', updateSlider);
			document.addEventListener('touchmove', updateSlider);
		};
		const onMouseUp = () => {
			if (!isDragging) return;
			isDragging = false;
			this.trigger('change');
			document.removeEventListener('mousemove', updateSlider);
			document.removeEventListener('touchmove', updateSlider);
		};
		const updateSlider = (e: any) => {
			if (!isDragging) return;
			e.preventDefault();
			e = e.touches ? e.touches[0] : e;
			const bb = this.sliderRef.getBoundingClientRect();
			const style1 = getComputedStyle(this.sliderRef);
			const style2 = getComputedStyle(this.thumbRef);
			this.setValue(range2percentage(
				(e.clientX - bb.left - (parseFloat(getComputedStyle(this.thumbRef).getPropertyValue('width')) / 1.6)),
				bb.left + parseFloat(style1.getPropertyValue('padding-left')) +
				parseInt(style2.getPropertyValue('width')) / 2,
				bb.right - parseFloat(style1.getPropertyValue('padding-right')) -
				parseInt(style2.getPropertyValue('width')) / 2
			) / 100 * (this.max - this.min) + this.min);
		};
		this.sliderRef.addEventListener('mousedown', onMouseDown);
		document.addEventListener('mouseup', onMouseUp);
		this.sliderRef.addEventListener('touchstart', onMouseDown);
		document.addEventListener('touchend', onMouseUp);
	}

	/**
	 * Get the current value of the slider.
	 * @returns {number}
	 */
	getValue(): number {
		return this.value;
	}
}
