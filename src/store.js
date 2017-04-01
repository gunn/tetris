import { createStore, combineReducers } from 'redux'

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

const initialState = {
  grid: Array(WIDTH).fill([]).map(()=> Array(HEIGHT).fill(0)),
  currentPiece: getNewPiece()
}

const grid = (state=initialState.grid, action)=> {
  return state
}

const currentPiece = (state=initialState.currentPiece, action)=> {
  switch (action.type) {
  case 'Space':
    return {
      ...state,
      y: state.y + 5
    }
  case 'ArrowDown':
    return {
      ...state,
      y: state.y + 1
    }
  case 'ArrowLeft':
    return {
      ...state,
      x: state.x - 1
    }
  case 'ArrowRight':
    return {
      ...state,
      x: state.x + 1
    }
  case 'Drop':
    return {
      ...state,
      y: state.y + 1
    }
  default:
    return state
  }
}


let store = createStore(combineReducers({grid, currentPiece}))




export default store
