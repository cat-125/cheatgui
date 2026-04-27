/**
 * Class that supports event listeners.
 */
type EventCallback = (...args: any[]) => void;

export default class EventSupport {
	listeners: { [key: string]: EventCallback[] };

	constructor() {
		this.listeners = {};
	}

	on(event: string, callback: EventCallback) {
		if (!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push(callback);
	}

	off(event: string, callback: EventCallback) {
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
