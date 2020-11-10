

function createElement(type, props, ...children){
    return {
        type,
        props: {
            ...props,
            children: children.map(child=>{
                return typeof child === 'object' ? child : createTextElement(child)
            })
        }
    }
}

function createTextElement(text){
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        }
    }
}

function render(element, container) {
    const dom = element.type=="TEXT_ELEMENT" ? document.createTextNode('') :document.createElement(element.type)
    element.props.children.forEach(item => {
        render(item, dom)
    });
    const isProperty = key=> key!== 'children'
    Object.keys(element.props).filter(isProperty).forEach(item=>{
        dom[item] = element.props[item]
    })
    container.appendChild(dom)
}