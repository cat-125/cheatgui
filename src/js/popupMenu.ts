import { config } from './config';
import { createElem } from './utils';

/**
 * This function opens a pop-up modal window where the user can select one item from the data.
 * @param {object} options - Options
 * @param {string} [options.title] - The title displayed in the selection window.
 * @param {string[]} [options.items] - The items that will be available for the user to select.
 * @param {boolean} [options.closable=true] - Adds one item to the end to close the menu, returning an index of -1.
 * @returns {Promise} A promise that will resolve with the index of the selected item.
 * @public
 */
export function openPopupMenu({
	title,
	items,
	closable = true
}: {
	title: string;
	items: string[];
	closable: boolean;
}): Promise<any> {
	return new Promise((resolve) => {
		const divWrapper = createElem('div');
		const divPopup = createElem('div');
		const divTitle = createElem('div');
		const divMenu = createElem('div');

		divWrapper.className = 'cgui-popup-menu-wrapper cgui-fadein';
		divPopup.className = 'cgui cgui-popup-menu';
		divTitle.className = 'cgui-popup-menu-title';
		divMenu.className = 'cgui-popup-menu-content';

		divPopup.appendChild(divTitle);
		divPopup.appendChild(divMenu);
		divWrapper.appendChild(divPopup);

		divTitle.textContent = title;

		let first = true;

		for (const item in items) {
			const btn = createElem('button');
			btn.className = 'cgui-popup-menu-btn';
			btn.textContent = items[item];
			divMenu.appendChild(btn);
			if (first) {
				first = false;
				setTimeout(() => btn.focus(), 0);
			}
			btn.onclick = () => {
				divWrapper.classList.add('cgui-fadeout');
				setTimeout(() => {
					divWrapper.remove();
					resolve(item);
				}, 150);
			};
		}

		if (closable) {
			const btn = createElem('button');
			btn.className = 'cgui-popup-menu-btn';
			btn.textContent = config.language.close;
			divMenu.appendChild(btn);
			btn.onclick = () => {
				divWrapper.classList.add('cgui-fadeout');
				setTimeout(() => {
					divWrapper.remove();
					resolve(-1);
				}, 150);
			};
		}

		document.body.appendChild(divWrapper);
	});
}
