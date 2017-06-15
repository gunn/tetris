const WIDTH  = 11
const HEIGHT = 24

const PIECES = [
  {
    // ####
    color:  "#FF6600",
    blocks: [[-1, 0],  [0, 0],  [1, 0],  [2, 0]],
    rotate: ([x, y])=> [-y, -x]
  }, {
    // ##
    //  ##
    color:  "#66FF00",
    blocks: [[-1, -1], [0, -1], [0, 0],  [1, 0]],
    rotate: ([x, y], r)=> r%2==0 ? [y, -x] : [-y, x]
  }, {
    //  ##
    // ##
    color:  "#00FFFF",
    blocks: [[-1, 0],  [0, -1], [0, 0],  [1, -1]],
    rotate: ([x, y], r)=> r%2==0 ? [y, -x] : [-y, x]
  }, {
    // ###
    //   #
    color:  "#0066FF",
    blocks: [[-1, 0],  [0, 0],  [1, 0],  [1, 1]]
  }, {
    // ###
    // #
    color:  "#9900FF",
    blocks: [[-1, 0],  [0, 0],  [1, 0],  [-1, 1]]
  }, {
    // ###
    //  #
    color:  "#FFFF00",
    blocks: [[-1, 0],  [0, 0],  [1, 0],  [0, 1]]
  }, {
    // ##
    // ##
    color:  "#CC0000",
    blocks: [[0, 0],   [1, 0],  [0, -1], [1, -1]],
    rotate: ([x, y])=> [x, y]
  }
]

const SCORING = [5, 24, 76, 192, 584]


const getNewPiece = ()=> ({
  x: Math.floor(WIDTH/2),
  y: 1,
  r: 0,
  rotate: ([x, y])=> [-y, x],
  ...PIECES[Math.floor(Math.random()*PIECES.length)]
})

const initialState = {
  tetris: {
    grid: Array(WIDTH).fill([]).map(()=> Array(HEIGHT).fill(0)),
    currentPiece: getNewPiece(),
    score: 0,
    speed: 2.5
  },
  lastDropTime: new Date()
}

const movementDeltaForAction = (action)=> {
  switch (action.type) {
    case 'ArrowUp'   : return {r:  1}
    case 'ArrowLeft' : return {x: -1}
    case 'ArrowRight': return {x:  1}
    case 'ArrowDown' : return {y:  2}
    case 'Drop'      : return {y:  1}
    case 'Space'     : return {y: HEIGHT}
  }
}

const pieceCanFit = (grid, piece)=> {
  const {x:px, y:py} = piece
  return piece.blocks.every(([bx, by])=> {
    const [x, y] = [px+bx, py+by]


    return !(grid[x] && grid[x][y]) &&
           x >= 0 &&
           x < WIDTH &&
           y < HEIGHT
  })
}

const pieceCanMoveDown = (grid, piece)=> {
  const movedPiece = {
    ...piece,
    y: piece.y + 1
  }

  return pieceCanFit(grid, movedPiece)
}

const attemptMove = (grid, piece, delta)=> {
  const deltas = Object.assign({x: 0, y: 0, r: 0}, delta)

  const newPiece = {
    ...piece,
    r: piece.r + deltas.r,
    x: piece.x + deltas.x,
    // y: piece.y + deltas.y,
  }

  if (deltas.r) {
    newPiece.blocks = newPiece.blocks.map(b=> newPiece.rotate(b, newPiece.r))
  }

  if (deltas.y) {
    // We can do this because only type of movement is processed at once.
    // I.E. !(delta.y && delta.r)

    for (let i=1; i<=deltas.y; i++) {
      newPiece.y = piece.y + i
      if (!pieceCanFit(grid, newPiece)) {
        // Use the last good position and report the move was obstructed:
        newPiece.y -= 1
        return [true, newPiece]
      }
    }
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

  // const changedRows = piece.blocks.map(([bx, by])=> py+by)
  //                                 .filter((e, i, a)=> a.indexOf(e)==i)

  // const filledRows = changedRows.filter(y=> {
  //   return grid.every(column=> column[y])
  // })

  const filledRows = grid[0].map((_, i)=> i).filter(i=> {
    return grid.every(column=> column[i])
  })

  filledRows.forEach(y=> {
    grid.forEach(column=> {
      column.splice(y, 1)
      column.unshift(0)
    })
  })

  // FIXME: grid has been mutated:
  grid = grid.map(column=> column.map(cell=> cell))

  return {
    grid,
    eliminatedRowCount: filledRows.length
  }
}

const tetris = (state=initialState.tetris, action)=> {
  let {grid, currentPiece, score, speed} = state

  const delta = movementDeltaForAction(action)
  if (!delta) return state

  const pieceHasSettled = delta.y && !pieceCanMoveDown(grid, currentPiece)


  const [moveObstructed, movedPiece] = attemptMove(grid, currentPiece, delta)
  currentPiece = movedPiece


  if (pieceHasSettled) {
    const addResult = addPieceToGrid(grid, currentPiece)
    const eliminatedRowCount = addResult.eliminatedRowCount
    grid = addResult.grid

    currentPiece = getNewPiece()

    score += SCORING[eliminatedRowCount]
    speed += 0.02

    if (!pieceCanFit(grid, currentPiece)) {
      // Game Over
      grid  = grid.map(row=> row.map(cell=> 0))
      score = 0
      speed = 2.5
    }
  }

  return {
    grid,
    currentPiece,
    score,
    speed
  }
}

const lastDropTime = (state=new Date(), action)=> {
    switch (action.type) {
    case 'Space':
    case 'ArrowDown':
    case 'Drop':
      return new Date()
    default:
      return state
  }
}



let state = initialState

let store = {
  dispatch(action) {
    state.tetris       = tetris(state.tetris, action)
    state.lastDropTime = lastDropTime(state.lastDropTime, action)

    if (this.callback) this.callback()
  },

  getState() {
    return state
  },

  subscribe(callback) {
    this.callback = callback
    return ()=> this.callback = null
  }
}



export default store
