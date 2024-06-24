import Box from './Box';

/**
 * A row that arranges the children horizontally.
 * @public
 * @extends Box
 */
export default class Row extends Box {
	constructor() {
		super();
		this.addClass('cgui-row');
	}
}
