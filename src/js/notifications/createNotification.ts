import Notification from './Notification';

export default function createNotification(options: {
	title?: string | null;
	text?: string;
	duration?: number | false;
	closable?: boolean;
}) {
	return new Notification(options);
}
