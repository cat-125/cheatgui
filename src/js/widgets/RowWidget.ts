import BoxWidget from './BoxWidget';

/**
 * A row that arranges the children horizontally.
 * @public
 * @extends Box
 */
export default class RowWidget extends BoxWidget {
	constructor() {
		super();
		this.addClass('cgui-row');
	}
}
