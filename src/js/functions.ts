/**
 * Contains shortcuts for creating widgets
 * @module
 */

import { Widget, Window, Text, Button, Input, NumberInput, Slider, Switch, Dropdown, Tree, Box, Row } from './widgets';
import { isMobile } from './utils';

/**
 * Create a text widget
 * @param text - The text content
 */
export function text(text: string): Text {
	return new Text(text);
}

/**
 * Create a button widget
 * @param options - Button options
 * @param options.label - Button label
 * @param options.onClick - Click callback
 */
export function button(options: { label: string; onClick?: () => void }): Button;
export function button(label: string, onClick?: () => void): Button;
export function button(optionsOrLabel: { label: string; onClick?: () => void } | string, onClick?: () => void): Button {
	const options = typeof optionsOrLabel === 'string' ? { label: optionsOrLabel, onClick } : optionsOrLabel;
	const btn = new Button(options.label);
	if (options.onClick) btn.onClick(options.onClick);
	return btn;
}

/**
 * Create an input widget
 * @param options - Input options
 * @param options.label - Input label
 * @param options.value - Initial value
 * @param options.onChange - Change callback
 */
export function input(options: { label: string; value?: string; onChange?: (value: string) => void }): Input {
	const inp = new Input(options.label, options.value || '');
	if (options.onChange) inp.onChange(options.onChange);
	return inp;
}

/**
 * Create a number input widget
 * @param options - NumberInput options
 * @param options.label - Input label
 * @param options.value - Initial value
 * @param options.onChange - Change callback
 */
export function numberInput(options: { label: string; value?: number; onChange?: (value: number) => void }): NumberInput {
	const inp = new NumberInput(options.label, options.value || 0);
	if (options.onChange) inp.onChange(options.onChange);
	return inp;
}

/**
 * Create a slider widget
 * @param options - Slider options
 */
export function slider({
	label = '',
	value = 0,
	min = 0,
	max = 100,
	step = 1,
	onChange = null
}: {
	label?: string;
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	onChange?: ((value: number) => void) | null;
}): Slider {
	const sl = new Slider({ label, value, min, max, step });
	if (onChange) sl.onChange(onChange);
	return sl;
}

/**
 * Create a switch widget
 * @param options - Switch options
 * @param options.label - Switch label
 * @param options.value - Initial value
 * @param options.onChange - Change callback
 */
export function toggle(options: { label: string; value?: boolean; onChange?: (value: boolean) => void }): Switch {
	const sw = new Switch(options.label, options.value || false);
	if (options.onChange) sw.onChange(options.onChange);
	return sw;
}

/**
 * Create a dropdown widget
 * @param options - Dropdown options
 * @param options.label - Dropdown label
 * @param options.values - Key-value pairs for dropdown options
 * @param options.value - Initial selected value
 * @param options.onChange - Change callback
 */
export function dropdown(options: {
	label: string;
	values: { [key: string]: string };
	value?: string;
	onChange?: (value: string) => void;
}): Dropdown {
	const dd = new Dropdown(options.label, options.values, options.value || '');
	if (options.onChange) dd.onChange(options.onChange);
	return dd;
}

/**
 * Create a tree widget
 * @param title - Tree title
 * @param elements - Child elements
 * @param expanded - Whether the tree is expanded
 */
export function tree(title: string, elements: Widget[], expanded: boolean = false): Tree {
	const tree = new Tree(title, expanded);
	for (const element of elements) tree.append(element);
	return tree;
}

/**
 * Create a box widget
 * @param elements - Child elements
 */
export function box(elements: Widget[]): Box {
	const box = new Box();
	for (const element of elements) box.append(element);
	return box;
}

/**
 * Create a row widget
 * @param elements - Child elements
 */
export function row(elements: Widget[]): Row {
	const row = new Row();
	for (const element of elements) row.append(element);
	return row;
}

/**
 * Create a window
 * @param options - Window options
 */
export function buildWindow({
	x = 100,
	y = 100,
	width = 500,
	height = 300,
	title = '',
	expanded = true,
	collapsible = true,
	collapseThreshold = isMobile ? 10 : 3,
	draggable = true,
	dragThreshold = isMobile ? 10 : 3,
	resizable = true,
	elements = []
}: {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	title?: string;
	expanded?: boolean;
	collapsible?: boolean;
	collapseThreshold?: number;
	draggable?: boolean;
	dragThreshold?: number;
	resizable?: boolean;
	elements: Widget[];
}) {
	const window = new Window({
		x,
		y,
		width,
		height,
		title,
		expanded,
		collapsible,
		collapseThreshold,
		draggable,
		dragThreshold,
		resizable
	});
	for (const element of elements) window.append(element);
	return window;
}
