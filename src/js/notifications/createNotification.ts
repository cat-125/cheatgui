import Notification from "./Notification";

export default function createNotification(options: {
	title?: string | null,
	message?: string,
	timeout?: number
}) {
	return new Notification(options);
}