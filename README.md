# CheatGUI

![Preview](https://github.com/cat-125/cheatgui/assets/106539381/62378702-14b3-4325-9bc0-b7c640cf2310)

CheatGUI is a lightweight JavaScript library that provides a simple way to create draggable, collapsible, and customizable windows with various UI elements. Here are some of its advantages:

1. **Easy to use**: The library provides a straightforward API for creating windows and UI elements.
2. **Lightweight**: The library is small in size, making it suitable for projects where performance is a concern.
3. **Customizable**: You can easily customize the appearance of the windows and UI elements using CSS.
4. **Mobile support**: interacting with UI elements works on mobile devices as well.
5. **Supports various UI elements**: The library includes support for text, buttons, switches, sliders and more.

Live demo: <https://cat-125.github.io/cheatgui/demo>

## Usage

To get started with CheatGUI, you need to include it in your project. Here's a step-by-step guide on how to do it:

1. **Download the library**: Download the CheatGUI library from the Releases page or use the beta builds available in the [GitHub Actions](https://github.com/cat-125/cheatgui/actions/workflows/dev_build.yml).

2. **Include the Library**: First, include CheatGUI in your HTML file by using the following  script and link tags. Make sure you replace `path_to_cheatgui` with the actual path where the CheatGUI library is located.

   ```html
   <link rel="stylesheet" href="path_to_cheatgui/cheatgui.min.css">
   <script src="path_to_cheatgui/cheatgui.min.js"></script>
   ```

3. **Use CheatGUI**: Once the library is included, you can create a new window.

   ```javascript
   const win = new cheatgui.Window({
     x: 50,
     y: 300,
     width: 300,
     height: 200,
     title: "Window"
   });

   win.append(new cheatgui.Text('Hello, world!'));
   ```

4. **Customize**: You can customize CheatGUI by adding custom CSS styles or by modifying the configuration.

   ```javascript
   // Customizing CheatGUI
   cheatgui.utils.loadTheme('path_to_theme.css');
   cheatgui.utils.updateConfig({
     symbols: {
       expanded: '▼',
       collapsed: '◀',
       resize: '◢'
     },
     minWindowWidth: 150,
     minWindowHeight: 100,
     language: {
       'close': 'Close'
     }
   });
   ```

For more detailed examples and advanced usage, please refer to the [Documentation](https://cat-125.github.io/cheatgui).

### File differences

CheatGUI has several files that can be imported. Here are the differences between them:

- `cheatgui.min.js`, `cheatgui.min.css` - compressed versions of the files. Most often they are needed.
- `cheatgui.inj.js` - this file automatically embeds CSS code, and can be used for injection into third-party sites.

## Examples

```javascript
const win = new cheatgui.Window({
  x: 50,
  y: 300,
  width: 300,
  height: 200,
  title: "Window"
});

win.append(new cheatgui.Text('Hello, world!'));

const btn = new cheatgui.Button('Button');
btn.onClick(() => alert('Button clicked'));
win.append(btn);

const tree = new cheatgui.Tree("Tree");
win.append(tree);

tree.append(new cheatgui.Slider({
  label: 'Float',
  max: 1,
  step: 0.01,
  value: 0.5
}));
```

See also [`index.html`](index.html#L56).

## Documentation

Documentation for CheatGUI is available at <https://cat-125.github.io/cheatgui>.

## Features

### Widgets

```javascript
const widget = new cheatgui.WidgetName(...);
```

- Text
- Button
- Input
- Slider
- Switch
- Tree
- Dropdown
- And more

### Themes

```javascript
cheatgui.utils.loadTheme(url);
```

You can download and use themes from the [`themes/` folder](themes/) or create your own.

### Other

- Popup menus (`cheatgui.openPopupMenu({title, items[], closable})`)
- Some utils (`cheatgui.utils`)
- `Widget` class for creating custom widgets
- Mobile device detection (`cheatgui.isMobile`)

## Future plans

- [x] Ability to save & load configurations
- [ ] Shorter way to add widgets
- [ ] Color input
- [ ] Tabs
- [ ] Vertical tabs
- [ ] Input with button
- [ ] Window builder

## Screenshots

![All widgets](https://github.com/cat-125/cheatgui/assets/106539381/8bf5144e-79df-49f5-8a30-4202777ccf02)

![Legacy theme](https://github.com/cat-125/cheatgui/assets/106539381/ba98e21f-8cf7-4410-a0b3-2f7c078576b5)

![Windows theme](https://github.com/cat-125/cheatgui/assets/106539381/9d97b6ea-0294-436b-97ec-3c839fcfec60)

![Pink theme](https://github.com/cat-125/cheatgui/assets/106539381/cfe6c101-a6fe-403b-ae1e-13963813a91c)

![Modern theme](https://github.com/cat-125/cheatgui/assets/106539381/60121372-429c-4f73-8720-2ca720190c71)

![ImGui theme vs. Dear ImGui](https://github.com/cat-125/cheatgui/assets/106539381/e9bfad04-fb7d-4c57-aa9e-7f0630f00f04)

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details.

## License

CheatGUI is open-sourced software licensed under the [MIT license](https://github.com/cat-125/cheatgui/blob/main/LICENSE).

## Stats

![Alt](https://repobeats.axiom.co/api/embed/8680d14e5c563dc7c79526365878c484605670b9.svg)
