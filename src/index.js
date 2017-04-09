import React from 'react'
import ReactDOM from 'react-dom'
import store from './store'
import Tetris from './tetris'


document.onkeydown = e=> store.dispatch({type: e.code})

let lastDrop = new Date()
const processFrame = ()=> {
  const elapsedTime = new Date() - lastDrop
  if (elapsedTime > 500) {
    store.dispatch({type: "Drop"})
    lastDrop = new Date()
  }
  requestAnimationFrame(processFrame)
}
processFrame()


const render = ()=> {
  ReactDOM.render(
    <Tetris state={store.getState().tetris}/>,
    document.getElementById("root")
  )
}

if (window.unsubscribe) window.unsubscribe()
window.unsubscribe = store.subscribe(render)
render()

if (module.hot) {
  module.hot.accept(render)
}
