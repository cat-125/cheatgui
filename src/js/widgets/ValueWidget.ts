import Widget from './Widget';

/**
 * Widget with value
 * @public
 */
export default interface ValueWidget extends Widget {
	getValue(): any;
	setValue(value: any): this;
}
