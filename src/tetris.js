import Inferno from 'inferno'

const BLOCK_SIZE  = 32
const BORDER_SIZE = 2
const MARGINS     = [10, 10, 10, 10]

const Piece = ({ color, blocks, x, y })=>
  <div>
    {
      blocks.map(([bx, by], i)=> {
        const style = {
          backgroundColor: color,
          top:  (y+by)*BLOCK_SIZE,
          left: (x+bx)*BLOCK_SIZE
        }
        return <div className="block" key={i} style={style}/>
      })
    }
  </div>


const Tetris = ({ grid, currentPiece, score })=> {
  const WIDTH  = grid.length
  const HEIGHT = grid[0].length

  return (
    <div className="board">
      <style>
        {`
          html, body, * {
            padding: 0;
            margin:  0;
            // box-sizing: border-box;
          }
          html, body {
            height: 100%;
            background-color: #ffd5d5;
            background-image: linear-gradient(#ffd5d5, #b3aeff);
          }

          #root>div {
            text-align: center;
          }

          .board {
            position: relative;
            margin: ${MARGINS.map(m=> m+"px").join(" ")};
            width:  ${(WIDTH  * BLOCK_SIZE)+BORDER_SIZE}px;
            height: ${(HEIGHT * BLOCK_SIZE)+BORDER_SIZE}px;
            border: ${BORDER_SIZE}px solid rgba(0, 0, 0, 0.3);
            display: inline-block;
            background-color: rgba(34, 34, 34, 0.7);
          }

          .info {
            position: absolute;
            display: inline-block;
            padding: 10px;
          }

          .block {
            position: absolute;
            width:  ${BLOCK_SIZE-BORDER_SIZE}px;
            height: ${BLOCK_SIZE-BORDER_SIZE}px;
            border: ${BORDER_SIZE}px solid #333;
            z-index: 20;
          }

          .block.empty {
            border: ${BORDER_SIZE}px solid rgba(0, 0, 0, 0.06);
            z-index: 10;
          }
        `}
      </style>

      {
        grid.map((column, i)=> {
          return column.map((blockColor, j)=> {
            // if (blockColor) {
              const style = {
                backgroundColor: blockColor ? blockColor : null,
                top:   j*BLOCK_SIZE,
                left:  i*BLOCK_SIZE
              }

              return <div key={i+"-"+j}
                          className={"block" + (!blockColor ? " empty" : "")}
                          style={style} />
            // }
          })
        })
      }

      <Piece {...currentPiece}/>
    </div>
  );
}

const zerosForScore = (score)=> {
  const SCORE_LENGTH = 9
  const zerosLength  = SCORE_LENGTH - (score && score.toString().length)

  return new Array(zerosLength+1).join("0")
}


const App = ({grid, currentPiece, nextPiece, score, speed})=>
  <div>
    <Tetris {...{grid, currentPiece, score}} />

    <div className="info">
      <h1 style={{fontFamily: "monospace", color: "#333"}}>
        <span style={{color: "rgba(0, 0, 0, 0.15)"}}>
          {zerosForScore(score)}
        </span>

        {score && score || ""}
      </h1>

      <div style={{position: "relative", margin: "0px 25px"}}>
        <Piece {...nextPiece} x={0} y={0}/>
      </div>
    </div>
  </div>


export default App
