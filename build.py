from css_html_js_minify import css_minify
from rjsmin import jsmin

INJ_TEMPLATE = '{js};cheatgui.utils.includeCSS(`{css}`)'


def read(path: str):
    with open(path, 'r') as f:
        return f.read()


def write(path: str, text: str):
    with open(path, 'w+') as f:
        f.write(text)


def main():
    js = read('cheatgui.js')
    css = read('cheatgui.css')

    mjs = jsmin(js)
    mcss = css_minify(css)

    write('build/cheatgui.min.js', mjs)
    write('build/cheatgui.min.css', mcss)

    write('build/cheatgui.inj.js', INJ_TEMPLATE.format(js=mjs, css=mcss))


if __name__ == '__main__':
    main()
