import Widget from "./Widget";

/**
 * Widget with value
 * @public
 */
export default interface ValueWidget extends Widget {
	value: any;
	getValue(): any;
	setValue(value: any): ValueWidget;
}