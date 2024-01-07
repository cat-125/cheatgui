# CheatGUI

![image](https://github.com/cat-125/cheatgui/assets/106539381/bcde44ad-6a85-44cb-ac34-7536362b1327)

CheatGUI is a lightweight JavaScript library that provides a simple way to create draggable, collapsible, and customizable windows with various UI elements. Here are some of its advantages:

1. Easy to use: The library provides a straightforward API for creating windows and UI elements.
2. Lightweight: The library is small in size, making it suitable for projects where performance is a concern.
3. Customizable: You can easily customize the appearance of the windows and UI elements using CSS.
4. Draggable, resizable and collapsible windows: The windows can be easily dragged around the screen, resized by dragging from their edge and collapsed to save space.
5. Supports various UI elements: The library includes support for text, buttons, and switches.

# Getting Started

Here's a brief guide on how to use CheatGUI:

1. Include CheatGUI CSS and JS files:
```html
<link rel="stylesheet" href="path/to/cheatgui.css">
<script src="path/to/cheatgui.js"></script>
```
2. Start creating GUI:
```javascript
// Create a new window
const myWindow = new cheatgui.Window(100, 100, 300, 200, 'My Window'); // x, y, width, height, title

// Add a text element
const myText = new cheatgui.Text('Hello, world!');
myWindow.append(myText);

// Add a button element
const myButton = new cheatgui.Button('Click me!');
myButton.onClick(() => alert('Button clicked!'));
myWindow.append(myButton);

// Add a switch element
const mySwitch = new cheatgui.Switch('My Switch');
mySwitch.onChange((event, isChecked) => console.log('Switch value: ' + isChecked));
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

# File differences

CheatGUI has several files that can be imported. Here are the differences between them:
- `cheatgui.js`, `cheatgui.css` - source files. They weight more and are not recommended.
- `cheatgui.min.js`, `cheatgui.min.css` - compressed versions of the files. Most often they are needed.
- `cheatgui.inj.js` - this file automatically embeds CSS code, and can be used for injection into third-party sites.

# Gallery

![image](https://github.com/cat-125/cheatgui/assets/106539381/ba98e21f-8cf7-4410-a0b3-2f7c078576b5)
Legacy Demo

![image](https://github.com/cat-125/cheatgui/assets/106539381/9d97b6ea-0294-436b-97ec-3c839fcfec60)
Windows Theme

![image](https://github.com/cat-125/cheatgui/assets/106539381/cfe6c101-a6fe-403b-ae1e-13963813a91c)
Pink Theme

![image](https://github.com/cat-125/cheatgui/assets/106539381/60121372-429c-4f73-8720-2ca720190c71)
Modern Theme

![image](https://github.com/cat-125/cheatgui/assets/106539381/e9bfad04-fb7d-4c57-aa9e-7f0630f00f04)
CheatGUI and Dear ImGui

![image](https://github.com/cat-125/cheatgui/assets/106539381/2fc29fb7-f1bd-4c2b-bce1-7afb4d2797b0)
Legacy Popup

# Stats

![Alt](https://repobeats.axiom.co/api/embed/8680d14e5c563dc7c79526365878c484605670b9.svg "Repobeats analytics image")
