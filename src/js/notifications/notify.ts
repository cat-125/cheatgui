import createNotification from './createNotification';
import Notification from './Notification';

const notificationsById: Map<string, Notification> = new Map();

/**
 * Create or update a notification with a tracking ID.
 * If a notification with the same ID exists and is not closed,
 * it will be updated. Otherwise, a new notification is created.
 * @param options - Notification options
 * @param options.id - Optional ID to track the notification
 * @param options.title - Notification title
 * @param options.text - Notification text
 * @param options.duration - Auto-close duration in ms, or false to disable
 * @returns The notification instance
 */
export default function notify(options: {
	id?: string;
	title?: string | null;
	text?: string;
	duration?: number | false;
}): Notification {
	const { id, ...notificationOptions } = options;

	if (id && notificationsById.has(id)) {
		const existing = notificationsById.get(id)!;
		if (!existing.closed) {
			if (notificationOptions.text !== undefined) {
				existing.updateMessage(notificationOptions.text);
			}
			if (notificationOptions.title !== undefined) {
				existing.title = notificationOptions.title;
				existing.updateTitle();
			}
			if (notificationOptions.duration !== undefined) {
				existing.duration = notificationOptions.duration;
				existing.restartTimeout();
			}
			return existing;
		} else {
			notificationsById.delete(id);
		}
	}

	const notification = createNotification(notificationOptions);

	if (id) {
		notificationsById.set(id, notification);
		notification.on('closed', () => {
			notificationsById.delete(id);
		});
	}

	return notification;
}
