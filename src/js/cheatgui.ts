/**
 * CheatGUI
 *
 * @module
 * @author Cat-125
 * @see https://github.com/Cat-125/CheatGUI
 */

import '../css/cheatgui.scss';

// Version
export const version = '0.14.0';

// GUI elements
export {
	GUIElement,
	View,
	Window,
	Widget,
	TextWidget,
	ButtonWidget,
	InputWidget,
	NumberInputWidget,
	SliderWidget,
	ToggleWidget,
	DropdownWidget,
	TreeWidget,
	BoxWidget,
	RowWidget
} from './widgets';

export type { ValueWidget } from './widgets';

// Configuration
export { getConfig, updateConfig } from './config';

// Notifications
import Notification from './notifications/Notification';
import createNotification from './notifications/createNotification';
import notify from './notifications/notify';
export { Notification, createNotification, notify };

// Utils
import * as utils from './utils';
export { utils };

// Shortcuts
import * as functions from './functions';
export { functions };

// Popup menu
export { openPopupMenu } from './popupMenu';
