from css_html_js_minify import js_minify, css_minify
from rjsmin import jsmin

# JS_MINIFY_REGEXP = re.compile(r"/\*(.|\n)+?\*/")
# JS_MINIFY_REGEXP2 = re.compile(r"\n\s*//.+")
# JS_MINIFY_REGEXP3 = re.compile(r"\n\s*")
# CSS_MINIFY_REGEXP = re.compile(r"(\n\s*)|(/\*(.|\n)+?\*/)")
# CSS_MINIFY_REGEXP2 = re.compile(r"(\W)\s|\s(\{)")
INJ_TEMPLATE = '{js};cheatgui.utils.includeCSS(`{css}`)'


def read(path: str):
    with open(path, 'r') as f:
        return f.read()


def write(path: str, text: str):
    with open(path, 'w+') as f:
        f.write(text)


# def minify_js(text):
#     text = re.sub(JS_MINIFY_REGEXP, '', text)
#     text = re.sub(JS_MINIFY_REGEXP2, '', text)
#     text = re.sub(JS_MINIFY_REGEXP3, '', text)
#     return text


# def minify_css(text: str):
#     text = re.sub(CSS_MINIFY_REGEXP, '', text)
#     text = re.sub(CSS_MINIFY_REGEXP2, lambda x: x.group(1) or x.group(2), text)
#     return text

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
