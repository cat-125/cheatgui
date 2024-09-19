/**
 * Class that supports event listeners.
 */
export default class EventSupport {
	listeners: { [key: string]: Function[] };

	constructor() {
		this.listeners = {};
	}

	on(event: string, callback: Function) {
		if (!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push(callback);
	}

	off(event: string, callback: Function) {
		if (this.listeners[event]) {
			this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
		}
	}

	trigger(event: string, ...args: any[]) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((callback) => callback(...args));
		}
	}
}
