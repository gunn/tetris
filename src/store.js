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
  tetris: {
    grid: Array(WIDTH).fill([]).map(()=> Array(HEIGHT).fill(0)),
    currentPiece: getNewPiece()
  }
}

const movementDeltaForAction = (action)=> {
  switch (action.type) {
    case 'ArrowUp'   : return {r:  1}
    case 'ArrowLeft' : return {x: -1}
    case 'ArrowRight': return {x:  1}
    case 'ArrowDown' : 
    case 'Drop'      : return {y:  1}
    case 'Space'     : return {y: HEIGHT}
  }
}

const pieceCanFit = (grid, piece)=> {
  const {x:px, y:py} = piece
  return piece.blocks.every(([bx, by])=> {
    const [x, y] = [px+bx, py+by]


    if (y> 20) debugger
    return !(grid[x] && grid[x][y]) &&
           x >= 0 &&
           x < WIDTH &&
           y < HEIGHT
  })
}

const attemptMove = (grid, piece, delta)=> {
  const deltas = Object.assign({x: 0, y: 0, r: 0}, delta)

  const newPiece = {
    ...piece,
    x: piece.x + deltas.x,
    y: piece.y + deltas.y,
  }

  if (pieceCanFit(grid, newPiece)) {
    return [false, newPiece]
  } else {
    return [true, piece]
  }
}

const addPieceToGrid = (grid, piece)=> {
  const {x:px, y:py, color} = piece
  piece.blocks.forEach(([bx, by])=> {
    const [x, y] = [px+bx, py+by]

    grid[x][y] = color
  })

  // FIXME: grid has been mutated:
  return grid.map(row=> row.map(cell=> cell))
}

const tetris = (state=initialState.tetris, action)=> {
  let {grid, currentPiece} = state

  const delta = movementDeltaForAction(action)
  if (!delta) return state

  const [moveObstructed, movedPiece] = attemptMove(grid, currentPiece, delta)
  currentPiece = movedPiece

  if (action.type=="Drop" && moveObstructed) {
    grid         = addPieceToGrid(grid, currentPiece)
    currentPiece = getNewPiece()

    if (!pieceCanFit(grid, currentPiece)) {
      // Game Over
      grid = grid.map(row=> row.map(cell=> 0))
    }
  }


  return {
    grid,
    currentPiece
  }
}


let store = createStore(combineReducers({tetris}))




export default store
