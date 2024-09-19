import { createElem } from '../utils';
import { GUIElement } from '../widgets';

const notificationContainer = createElem('div');
notificationContainer.className = 'cgui-notification-container';
document.addEventListener('DOMContentLoaded', () => {
	document.body.appendChild(notificationContainer);
});

export default class Notification extends GUIElement {
	title: string | null;
	message: string;
	timeout: number | false;
	timeoutId: any;
	closed: boolean;

	titleRef: HTMLDivElement | null;
	contentRef: HTMLDivElement;

	constructor({
		title = null,
		message = '',
		timeout = 3000
	}: {
		title?: string;
		message?: string;
		timeout?: number | false;
	} = {}) {
		super();
		this.title = title;
		this.message = message;
		this.timeout = timeout;
		this.closed = false;

		this.ref = createElem('div');
		this._init();
		this.addClass('cgui-notification');

		if (title) {
			this.titleRef = createElem('div');
			this.titleRef.className = 'cgui-notification-title';
			this.titleRef.innerHTML = title;
			this.ref.appendChild(this.titleRef);
		}

		this.contentRef = createElem('div');
		this.contentRef.className = 'cgui-notification-content';
		this.contentRef.innerHTML = message;
		this.ref.appendChild(this.contentRef);

		notificationContainer.appendChild(this.ref);
		this.addClass('cgui-fadein');

		if (timeout)
			this.timeoutId = setTimeout(() => {
				this.close();
			}, timeout);
	}

	updateTitle(): this {
		if (this.closed) throw new Error('The notification has already been closed.');
		if (this.titleRef) {
			this.titleRef.innerHTML = this.title;
		} else {
			throw new Error('The notification title must be initialized to use this function.');
		}
		return this;
	}

	updateMessage(message: string): this {
		if (this.closed) throw new Error('The notification has already been closed.');
		this.contentRef.innerHTML = message;
		return this;
	}

	restartTimeout(): this {
		if (this.closed) throw new Error('The notification has already been closed.');
		if (this.timeoutId) clearTimeout(this.timeoutId);
		if (this.timeout) {
			this.timeoutId = setTimeout(() => {
				this.close();
			}, this.timeout);
			this.trigger('timeout-restart');
		} else {
			throw new Error('The notification timeout must be defined to use this function.');
		}
		return this;
	}

	close() {
		if (this.closed) throw new Error('The notification has already been closed.');
		this.addClass('cgui-fadeout');
		this.trigger('fadeout');
		this.closed = true;
		setTimeout(() => {
			this.ref.remove();
			this.trigger('closed');
		}, 150);
	}
}
