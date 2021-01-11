

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
    wipRoot = {
        dom: container,
        props:{
            children: [element],
        },
        alternate: currentRoot
    }
    nextUnitOfWork=wipRoot
    deletions = []
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
let wipRoot = null
let currentRoot = null
let deletions = null
let wipFiber = null
let hookIndex = null

function workLoop(deadline){
    while(nextUnitOfWork&&deadline.timeRemaining()>1) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        console.log('nextUnitOfWork',nextUnitOfWork)
    }
    if (!nextUnitOfWork &&wipRoot){
        commitRoot()
    }
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function performUnitOfWork(fiber){

    const isFunctionComponent = fiber.type instanceof Function
    if(isFunctionComponent){
        updateFunctionComponent(fiber)
    }else{
        updateHostComponent(fiber)
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
function updateFunctionComponent(fiber){
    wipFiber = fiber
    hookIndex = 0
    wipFiber.hooks=[]
    const children = [fiber.type(fiber.props)]
    reconcileChildren(fiber,children)
}

function useState(initial){

    const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex]

    const hook ={
        state: oldHook? oldHook.state : initial,
        queue: []
    }

    const actions = oldHook ? oldHook.queue : []
    actions.forEach(action=>{
        hook.state = action(hook.state)
    })
    const setState = action =>{
        hook.queue.push(action)
        wipRoot = {
            dom: currentRoot.dom,
            props: currentRoot.props,
            alternate: currentRoot
        }
        nextUnitOfWork=wipRoot
        deletions = []

    }
    wipFiber.hooks.push(hook)
    hookIndex++
    return []
}

function updateHostComponent(fiber){
        //生成当前fiber的dom
        if(!fiber.dom){
            fiber.dom = createDom(fiber)
        }
        const elements = fiber.props.children
        reconcileChildren(fiber, elements)
}
function reconcileChildren(wipFiber, elements){
    let index=0
    let prevSibling = null
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child
    while(index<elements.length || oldFiber){
        const element = elements[index]
        let sameType = oldFiber&&element&& oldFiber.type === element.type
        let newFiber =null
        if(sameType){
            newFiber = {
                type: element.type,
                props: element.props,
                parent: wipFiber,
                dom: oldFiber.dom,
                alternate: oldFiber,
                effectTag: 'UPDATE'
            }
        }
        if(!sameType&&element) {
            newFiber = {
                type: element.type,
                props: element.props,
                parent: wipFiber,
                dom: null,
                alternate: null,
                effectTag: 'PLACEMENT'
            }
        }

        if(!sameType&&oldFiber){
            oldFiber.effectTag = 'DELETE'
            deletions.push(oldFiber)
        }
      
        if (oldFiber){
            oldFiber = oldFiber.sibling
        }
        if (index===0){
            wipFiber.child = newFiber
        }else{
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
        index++
    }
}
function commitRoot(){
    deletions.map(commitWork)
    commitWork(wipRoot.child)
    currentRoot=wipRoot
    wipRoot = null
    
}

function commitWork(fiber){
    if(!fiber){
        return
    }

    let parentFIber = fiber.parent
    while(!parentFIber.dom){
        parentFIber = parentFIber.parent
    }
    const parent = parentFIber.dom
    if (fiber.effectTag==='PLACEMENT'&&fiber.dom)
     {
         parent.appendChild(fiber.dom)
     }else if (fiber.effectTag==='UPDATE'&&fiber.dom){
         updateDom(fiber.dom,fiber.alternate.props, fiber.props)
     }else if(fiber.effectTag==='DELETION'){
         commitDeletion(fiber,parent)
     }
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function commitDeletion(fiber, parent){
    if(fiber.dom){
        parent.removeChild(fiber.dom)
    }else{
        commitDeletion(fiber.child,parent)
    }
}

const isEvent = key => key.startsWith("on")
const isProperty = key =>
  key !== "children" && !isEvent(key)
const isNew = (prev, next) => key =>
  prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)
function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })
// ​// Set new or changed properties
Object.keys(nextProps)
.filter(isProperty)
.filter(isNew(prevProps, nextProps))
.forEach(name => {
  dom[name] = nextProps[name]
})

// Add event listeners
Object.keys(nextProps)
.filter(isEvent)
.filter(isNew(prevProps, nextProps))
.forEach(name => {
  const eventType = name
    .toLowerCase()
    .substring(2)
  dom.addEventListener(
    eventType,
    nextProps[name]
  )
})
}
