import Inferno from 'inferno'
import store from './store'
import Tetris from './tetris'


document.onkeydown = e=> store.dispatch({type: e.code})

const processFrame = ()=> {
  const elapsedTime = new Date() - store.getState().lastDropTime

  if (elapsedTime > 400) store.dispatch({type: "Drop"})
  requestAnimationFrame(processFrame)
}
processFrame()


const render = ()=> {
  Inferno.render(
    <Tetris {...store.getState().tetris}/>,
    document.getElementById("root")
  )
}

if (window.unsubscribe) window.unsubscribe()
window.unsubscribe = store.subscribe(render)
render()

if (module.hot) {
  module.hot.accept(render)
}
