import React from 'react'
import ReactDOM from 'react-dom'
import Tetris from './tetris'


const WIDTH  = 11
const HEIGHT = 22

const PIECES = [
  {
    color:  "#0066FF",
    blocks: [[-1, 0],  [0, 0],  [1, 0],  [2, 0]] 
  }, {
    color:  "#66FF00",
    blocks: [[-1, -1], [0, -1], [0, 0],  [1, 0]]
  }, {
    color:  "#FF6600",
    blocks: [[-1, 0],  [0, 0],  [0, -1], [-1, -1]]
  }, {
    color:  "#CC0000",
    blocks: [[0, 0],   [1, 0],  [0, -1], [1, -1]]
  }
]

const getNewPiece = ()=> ({
  x: Math.floor(WIDTH/2),
  y: 1,
  ...PIECES[Math.floor(Math.random()*PIECES.length)]
})

let state = {
  grid: Array(WIDTH).fill([]).map(()=> Array(HEIGHT).fill(0)),
  currentPiece: getNewPiece()
}

const render = ()=> {
  ReactDOM.render(
    <Tetris state={state}/>,
    document.getElementById("root")
  )
}
render()

if (module.hot) {
  module.hot.accept(render)
}
