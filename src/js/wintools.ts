import Window from './widgets/Window';
import { distance } from './utils';

export function initActivationOnClick(win: Window) {
	win.headerRef.addEventListener('pointerdown', () => {
		win.focus();
	});
	win.headerRef.addEventListener('focus', (e: FocusEvent) => {
		win.focus();
	});
}

export function initToggleOnClick(win: Window, threshold: number) {
	let isClick = false, startX: number, startY: number;
	win.headerRef.addEventListener('pointerdown', e => {
		isClick = true;
		startX = e.clientX;
		startY = e.clientY;
	});
	document.addEventListener('pointermove', e => {
		if (distance(startX, startY, e.clientX, e.clientY) > threshold)
			isClick = false;
	});
	win.headerRef.addEventListener('pointerup', () => {
		if (isClick) win.toggle();
	});

	win.headerRef.addEventListener('keydown', (e: KeyboardEvent) => {
		if (e.code == 'Space' || e.code == 'Enter') win.toggle();
	});
}

export function initDraggable(win: Window, threshold: number) {
	let startX: number, startY: number, offsetX: number, offsetY: number, isMouseDown = false;

	const startDragging = () => {
		win.isDragging = true;
		win.ref.classList.add('cgui-dragging');
	}

	const onMouseDown = (e: any) => {
		e.preventDefault();
		e = e.touches ? e.touches[0] : e;
		isMouseDown = true;
		startX = e.clientX;
		startY = e.clientY;
		offsetX = e.clientX - win.ref.offsetLeft;
		offsetY = e.clientY - win.ref.offsetTop;
	};

	const onMouseMove = (e: any) => {
		e = e.touches ? e.touches[0] : e;
		if (!win.isDragging) {
			if (isMouseDown && distance(startX, startY, e.clientX, e.clientY) > threshold &&
				!win.isResizing) {
				startDragging();
			}
			else return;
		}
		win.move(e.clientX - offsetX, e.clientY - offsetY);
	};

	const onMouseUp = () => {
		win.isDragging = isMouseDown = false;
		if (win.ref.classList.contains('cgui-dragging'))
			win.ref.classList.remove('cgui-dragging');
	};

	win.headerRef.addEventListener('mousedown', onMouseDown);
	win.headerRef.addEventListener('touchstart', onMouseDown);

	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('touchmove', onMouseMove);

	document.addEventListener('mouseup', onMouseUp);
	document.addEventListener('touchend', onMouseUp);

	win.headerRef.addEventListener('keydown', (e: KeyboardEvent) => {
		if (!e.shiftKey) {
			if (e.code == 'ArrowLeft') win.move(win.x - 10, win.y);
			else if (e.code == 'ArrowRight') win.move(win.x + 10, win.y);
			else if (e.code == 'ArrowUp') win.move(win.x, win.y - 10);
			else if (e.code == 'ArrowDown') win.move(win.x, win.y + 10);
		}
	});
}

export function initResize(win: Window) {
	let sx: number, sy: number, dx: number, dy: number, iw: number, ih: number;

	const onMouseDown = (e: any) => {
		if (win.collapsed) return;
		e.preventDefault();
		e.stopPropagation();
		e = e.touches ? e.touches[0] : e;
		win.isResizing = true;
		[sx, sy, iw, ih] = [e.clientX, e.clientY, win.width, win.height];
		win.addClass('cgui-resizing');
	};

	const onMouseMove = (e: any) => {
		if (win.isResizing) {
			e = e.touches ? e.touches[0] : e;
			dx = e.clientX - sx;
			dy = e.clientY - sy;
			const newWidth = iw + dx;
			const newHeight = ih + dy;
			win.setWidth(newWidth);
			win.setHeight(newHeight);
		}
	};

	const onMouseUp = () => {
		win.isResizing = false;
		win.removeClass('cgui-resizing');
	};

	win.resizeRef.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);

	win.resizeRef.addEventListener('touchstart', onMouseDown);
	document.addEventListener('touchmove', onMouseMove);
	document.addEventListener('touchend', onMouseUp);

	win.ref.addEventListener('keydown', (e: KeyboardEvent) => {
		if (e.shiftKey) {
			if (e.code == 'ArrowLeft') win.setWidth(win.width - 10);
			else if (e.code == 'ArrowRight') win.setWidth(win.width + 10);
			else if (e.code == 'ArrowUp') win.setHeight(win.height - 10);
			else if (e.code == 'ArrowDown') win.setHeight(win.height + 10);
		}
	});
}