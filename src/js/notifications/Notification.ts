import { createElem } from '../utils';
import { GUIElement } from '../widgets';

const notificationContainer = createElem('div');
notificationContainer.className = 'cgui-notification-container';
document.addEventListener('DOMContentLoaded', () => {
	document.body.appendChild(notificationContainer);
});

export default class Notification extends GUIElement {
	declare ref: HTMLDivElement;
	title: string | null;
	text: string;
	duration: number | false;
	timeoutId: any;
	closed: boolean;

	titleRef: HTMLDivElement | null = null;
	contentRef: HTMLDivElement;
	closeBtn: HTMLDivElement | null = null;

	constructor({
		title = null,
		text = '',
		duration = 5000,
		closable = true
	}: {
		title?: string | null;
		text?: string;
		duration?: number | false;
		closable?: boolean;
	} = {}) {
		super();
		this.title = title;
		this.text = text;
		this.duration = duration;
		this.closed = false;

		this.ref = createElem('div');
		this._init();
		this.addClass('cgui-notification');

		if (title) {
			const titleRef = createElem('div');
			titleRef.className = 'cgui-notification-title';
			titleRef.innerHTML = title;
			this.titleRef = titleRef;
			this.ref.appendChild(titleRef);
		}

		this.contentRef = createElem('div');
		this.contentRef.className = 'cgui-notification-content';
		this.contentRef.innerHTML = text;
		this.ref.appendChild(this.contentRef);

		if (closable) {
			const closeBtn = createElem('div');
			closeBtn.className = 'cgui-notification-close';
			closeBtn.innerHTML = '&times;';
			this.closeBtn = closeBtn;
			this.ref.appendChild(closeBtn);
			closeBtn.addEventListener('click', () => {
				this.close();
			});
		}

		notificationContainer.appendChild(this.ref);

		if (duration)
			this.timeoutId = setTimeout(() => {
				this.close();
			}, duration);
	}

	updateTitle(): this {
		if (this.closed) throw new Error('The notification has already been closed.');
		if (this.titleRef) {
			this.titleRef.innerHTML = this.title ?? '';
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
		if (this.duration) {
			this.timeoutId = setTimeout(() => {
				this.close();
			}, this.duration);
			this.trigger('timeout-restart');
		} else {
			throw new Error('The notification timeout must be defined to use this function.');
		}
		return this;
	}

	close() {
		if (this.closed) return;
		this.addClass('cgui-fadeout');
		this.trigger('fadeout');
		this.closed = true;
		setTimeout(() => {
			this.ref.remove();
			this.trigger('closed');
		}, 150);
	}
}
