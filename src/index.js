import Inferno from 'inferno'
import store from './store'
import App from './tetris'


document.onkeydown = e=> store.dispatch({type: e.code})

const processFrame = ()=> {
  const {lastDropTime, tetris: {speed}} = store.getState()
  const elapsedTime = new Date() - lastDropTime

  if (elapsedTime > 1000 / speed) store.dispatch({type: "Drop"})
  requestAnimationFrame(processFrame)
}
processFrame()


const render = ()=> {
  Inferno.render(
    <App {...store.getState().tetris}/>,
    document.getElementById("root")
  )
}

if (window.unsubscribe) window.unsubscribe()
window.unsubscribe = store.subscribe(render)
render()

if (module.hot) {
  module.hot.accept(render)
}
