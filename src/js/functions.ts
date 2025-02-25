/**
 * Contains shortcuts for creating widgets
 * @module
 */

import { Widget, Window, Text, Button, Input, NumberInput, Slider, Switch, Dropdown, Tree, Box, Row } from './widgets';
import { isMobile } from './utils';

export function text(text: string): Text {
	return new Text(text);
}

export function button(text: string, callback: () => void): Button {
	return new Button(text, callback);
}

export function input(label: string, value: string, callback: (value: string) => void): Input {
	return new Input(label, value, callback);
}

export function numberInput(label: string, value: number, callback: (value: number) => void): NumberInput {
	return new NumberInput(label, value, callback);
}

export function slider({
	label = '',
	value = 0,
	min = 0,
	max = 100,
	step = 1,
	callback = null
}: {
	label?: string;
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	callback?: null;
}): Slider {
	return new Slider({ label, value, min, max, step, callback });
}

export function toggle(label: string, value: boolean, callback: (value: boolean) => void): Switch {
	return new Switch(label, value, callback);
}

export function dropdown(
	label: string,
	values: { string: string },
	value: string,
	callback: (value: string) => void
): Dropdown {
	return new Dropdown(label, values, value, callback);
}

export function tree(title: string, elements: Widget[], expanded: boolean = false): Tree {
	const tree = new Tree(title, expanded);
	for (const element of elements) tree.append(element);
	return tree;
}

export function box(elements: Widget[]): Box {
	const box = new Box();
	for (const element of elements) box.append(element);
	return box;
}

export function row(elements: Widget[]): Row {
	const row = new Row();
	for (const element of elements) row.append(element);
	return row;
}

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
