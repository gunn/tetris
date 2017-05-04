import React from 'react';

const BLOCK_SIZE  = 35
const BORDER_SIZE = 2

class Piece extends React.Component {
  render() {
    const { color, blocks, x, y } = this.props

    return (
      <div>
        {
          blocks.map(([bx, by], i)=> {
            const style = {
              backgroundColor: color,
              top:  BORDER_SIZE+ (y+by)*BLOCK_SIZE,
              left: BORDER_SIZE+ (x+bx)*BLOCK_SIZE
            }
            return <div className="block" key={i} style={style}/>
          })
        }
      </div>
    )
  }
}


class Tetris extends React.Component {
  render() {
    const { grid, currentPiece } = this.props.state
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
            .board {
              width:  ${(WIDTH  * BLOCK_SIZE)+BORDER_SIZE}px;
              height: ${(HEIGHT * BLOCK_SIZE)+BORDER_SIZE}px;
              border: ${BORDER_SIZE}px solid #888;
            }

            .block {
              position: absolute;
              width:  ${BLOCK_SIZE-BORDER_SIZE}px;
              height: ${BLOCK_SIZE-BORDER_SIZE}px;
              border: ${BORDER_SIZE}px solid #333;
              z-index: 20;
            }

            .block.empty {
              border: ${BORDER_SIZE}px solid #EEE;
              z-index: 10;
            }
          `}
        </style>

        {
          grid.map((column, i)=> {
            return column.map((blockColor, j)=> {
              // if (blockColor) {
                const style = {
                  backgroundColor: blockColor ? blockColor : "initial",
                  top:  BORDER_SIZE+ j*BLOCK_SIZE,
                  left: BORDER_SIZE+ i*BLOCK_SIZE
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
}

export default Tetris
