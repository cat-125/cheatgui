# CheatGUI

CheatGUI is a lightweight JavaScript library that provides a simple way to create draggable, collapsible, and customizable windows with various UI elements. Here are some of its advantages:

1. Easy to use: The library provides a straightforward API for creating windows and UI elements.
2. Lightweight: The library is small in size, making it suitable for projects where performance is a concern.
3. Customizable: You can easily customize the appearance of the windows and UI elements using CSS.
4. Draggable and collapsible windows: The windows can be easily dragged around the screen and collapsed to save space.
5. Supports various UI elements: The library includes support for text, buttons, and switches.

Here's a brief guide on how to use CheatGUI:

1. Include CheatGUI CSS and JS files:
```html
<link rel="stylesheet" href="path/to/cheatgui.css">
<script src="path/to/cheatgui.js"></script>
```
2. Start creating GUI:
```javascript
// Create a new window
const myWindow = new cheatgui.Window(100, 100, 'My Window');

// Add a text element
const myText = new cheatgui.Text('Hello, world!');
myWindow.append(myText);

// Add a button element
const myButton = new cheatgui.Button('Click me!');
myButton.onClick(() => alert('Button clicked!'));
myWindow.append(myButton);

// Add a switch element
const mySwitch = new cheatgui.Switch('Toggle me!');
mySwitch.onChange((e, isChecked) => console.log('Switch toggled:', isChecked));
myWindow.append(mySwitch);
```

In this example, we first include the CheatGUI
CSS and JS files in the HTML file. Then, we
create a new window with the `cheatgui.Window`
constructor, passing the initial position and
title as arguments. We add a text element, a
button element, and a switch element to the
window using the `append` method. Finally, we
add event listeners to the button and switch
elements to handle user interactions.