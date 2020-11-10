

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
    //设置单元工作
    nextUnitOfWork = {
        dom: container,
        props:{
            children: [element]
        }
    }
}

function createDom(fiber) {
    const dom = 
    fiber.type == 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)
    const isProperty = key=> key!== 'children'
    Object.keys(fiber.props).filter(isProperty).forEach(item=>{
        dom[item] = fiber.props[item]
    })
    return dom
}

let nextUnitOfWork = null

function workLoop(deadline){
    while(nextUnitOfWork&&deadline.timeRemaining()>1) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        console.log('nextUnitOfWork',nextUnitOfWork)
    }
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function performUnitOfWork(fiber){
    //生成当前fiber的dom
    if(!fiber.dom){
        fiber.dom = createDom(fiber)
    }
    if(fiber.parent){
        fiber.parent.dom.appendChild(fiber.dom)
    }

    const elements = fiber.props.children
    let index=0
    let prevSibling = null
    while(index<elements.length){
        const element = elements[index]
        let newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null
        }

        if (index===0){
            fiber.child = newFiber
        }else{
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
        index++
    }
    //找nextUnitOfWork
    if (fiber.child){
        return fiber.child
    }

    let nextFiber = fiber
    while(nextFiber){
        if(nextFiber.sibling){
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}