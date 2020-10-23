//标签头正则 <div
// ^<([a-zA-Z_][\\.\\-0-9_a-zA-Z]*)
const startTagOpen = /^<([a-zA-Z_][0-9_a-zA-Z]*)/
//匹配属性 id="name" ，需要提前出key/value，分三部分，第一部分key，第二部分空格加=,第三部分value
//test case： " id='name' ".match(/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*)(?:"([^"]*)"|'([^']*)')/)
//attribute第一个分组是key，第二个分组是=，第三第四是value
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*)(?:"([^"]*)"|'([^']*)')/

//匹配startTagClose
const startTagClose = /^\s*(\/?)>/

//匹配闭合标签
const endTag = /^<\/[^>]*>/

const stack = []
let root, currentParent;
function parseStartTag(html) {
    const match = html.match(startTagOpen)
    if(match) {
        let len = match[0].length
        //匹配上标签开头，组装标签信息
        const startMatch = {
            tag: match[1], //标签名
            attrs: [],//标签属性数组,
            children: []
        }
        //匹配上<xxx后开始匹配属性
        let tmpl = advance(html, match[0].length)
        let end, attr
        while(!(end=tmpl.match(startTagClose))&&(attr=tmpl.match(attribute))){
            startMatch.attrs.push(attr)
            tmpl = advance(tmpl,attr[0].length)
            len += attr[0].length
        }
        if (end) {
            startMatch.unarySlash = end[1]
            len += end[0].length
            startMatch.length = len
            return startMatch
        }
    }
}
function advance(html, n) {
    return html.substring(n)
}
function isUnaryTag(tag){
    return false// temp for now 
}

function handleStartTag(startMatch, options) {
    const tag = startMatch.tag
    const l = startMatch.attrs.length
    const attrs = new Array(l)
    for (let i = 0;i<l;i++){
        const attr = attrs[i]
        const value = attr[3] || attr[4] || ''
        attrs[i] = {
            name: attr[1],
            value
        }
    }
    const unary = !!startMatch.unarySlash // isUnaryTag()
    if (!unary) {
        stack.push({tag, attrs})
    }

    if (options&& options.start) {
        options.start(tag,attrs,unary)
    }

}


function parseHtml(template, options) {
    // console.log(template)
    let html = template
    while(html) {
        let textEnd = html.indexOf('<') 
        if (textEnd === 0) {
             //匹配标签头
            const startMatch = parseStartTag(html)
            if (startMatch){
                // // createTree
                // if(stack.length) {
                //     stack[stack.length-1].children.push(startMatch)
                //     startMatch.parent = stack[stack.length-1]
                // }

                // //匹配上开头标签，如果当前标签不是单标签，当前parent即为当前匹配元素
                // if(!startMatch.unarySlash) {
                //     stack.push(startMatch)
                //     if(!root) {
                //         root = startMatch
                //     }
                // }
                handleStartTag(startMatch, options)
                

                //截取html，向前匹配
                html = advance(html, startMatch.length)
                continue;
            }

            //匹配标签尾
            const endMatch = html.match(endTag)
            if (endMatch) {
                html = advance(html, endMatch[0].length)

                //不检查是否合法，直接出栈
                stack.pop()
            }
        }

        if (textEnd > 0) {
            html = html.slice(textEnd)
        }
       

    }
    // console.log(root)
}

//parseHtml定义了解析的主流程，通过钩子函数调用来创建虚拟dom树，运用的是模板方法
function parse(template) {
    let root, currentParent;

    parseHtml(template, {
        start(tag, attrs, unary) {
            const ele = createASTElement(tag, attrs, unary)
        }
    })
    return root
}


parseHtml(`<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Document</title>
</head>`)