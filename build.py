import re

JS_MINIFY_REGEXP = re.compile(r"/\*(.|\n)+?\*/")
JS_MINIFY_REGEXP2 = re.compile(r"\n\s*//.+")
JS_MINIFY_REGEXP3 = re.compile(r"\n\s*")
CSS_MINIFY_REGEXP = re.compile(r"(\n\s*)|(/\*(.|\n)+?\*/)")
CSS_MINIFY_REGEXP2 = re.compile(r"(\W)\s|\s(\{)")
INJ_TEMPLATE = '{js};cheatgui.utils.includeCSS(`{css}`)'


def read(path: str):
    with open(path, 'r') as f:
        return f.read()


def write(path: str, text: str):
    with open(path, 'w+') as f:
        f.write(text)


def minify_js(text):
    text = re.sub(JS_MINIFY_REGEXP, '', text)
    text = re.sub(JS_MINIFY_REGEXP2, '', text)
    text = re.sub(JS_MINIFY_REGEXP3, '', text)
    return text


def minify_css(text: str):
    text = re.sub(CSS_MINIFY_REGEXP, '', text)
    text = re.sub(CSS_MINIFY_REGEXP2, lambda x: x.group(1) or x.group(2), text)
    return text


def build_js(src: str, dest: str):
    print('Building %s as JS...' % src)
    write(dest, minify_js(read(src)))


def build_css(src: str, dest: str):
    print('Building %s as CSS...' % src)
    write(dest, minify_css(read(src)))


def build():
    build_js('cheatgui.js', 'cheatgui.min.js')
    build_css('cheatgui.css', 'cheatgui.min.css')
    js, css = read('cheatgui.min.js'), read('cheatgui.min.css')
    write('cheatgui.inj.js', INJ_TEMPLATE.format(js=js, css=css))


if __name__ == '__main__':
    build()
