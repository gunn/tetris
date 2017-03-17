import React from 'react';

const BLOCK_SIZE = 35
const WIDTH  = 11
const HEIGHT = 22

class Piece extends React.Component {
  render() {
    const { color, blocks, x, y } = this.props

    return (
      <div>
        {
          blocks.map(([bx, by], i)=> {
            const style = {
              backgroundColor: color,
              top:  (y+by)*BLOCK_SIZE,
              left: (x+bx)*BLOCK_SIZE
            }
            return <div className="block" key={i} style={style} />
          })
        }
      </div>
    )
  }
}


class Tetris extends React.Component {
  render() {
    const { grid, currentPiece } = this.props.state

    return (
      <div className="board">
        <style>
          {`
            html, body {
              padding: 0;
              margin:  0;
            }
            .board {
              width:  ${WIDTH  * BLOCK_SIZE}px;
              height: ${HEIGHT * BLOCK_SIZE}px;
              border: 1px solid black;
            }

            .block {
              position: absolute;
              width:  ${BLOCK_SIZE}px;
              height: ${BLOCK_SIZE}px;
              box-sizing: border-box;
              border: 1px solid black;
            }  
          `}
        </style>

        <Piece {...currentPiece}/>

        {
          grid.map((column, i)=> {
            return column.map((blockColor, j)=> {
              if (blockColor) {
                const style = {
                  backgroundColor: blockColor,
                  top:  j*BLOCK_SIZE,
                  left: i*BLOCK_SIZE
                }
                return <div className="block" key={i+"-"+j} style={style} />
              }
            })
          })
        }
      </div>
    );
  }
}

export default Tetris
