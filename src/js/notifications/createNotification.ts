import Notification from './Notification';

export default function createNotification(options: {
	title?: string | null;
	text?: string;
	duration?: number | false;
}) {
	return new Notification(options);
}
