import React, { Component } from 'react'
import { both, clone, is, complement, equals, map, addIndex } from 'ramda'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import Crop, { coordinateType } from './Crop'
import styles from "./index.less"
import { message } from 'antd'


const isValidPoint = (point = {}) => {
  const strictNumber = number => both(
    is(Number),
    complement(equals(NaN)),
  )(number)
  return strictNumber(point.x) && strictNumber(point.y)
}


class MultiCrops extends Component {
  drawingIndex = -1

  pointA = {}

  id = shortid.generate()

  renderCrops = (props) => {
    const indexedMap = addIndex(map)
    return indexedMap((coor, index) =>
      (<Crop
        // improve performance when delet crop in middle array
        key={coor.id || index}
        index={index}
        coordinate={coor}
        {...props}
      />))(props.coordinates)
  }

  getCursorPosition = (e) => {
    const { left, top } = this.container.getBoundingClientRect()
    return {
      x: e.clientX - left,
      y: e.clientY - top,
    }
  }

  handleMouseDown = (e) => {
    const { coordinates, onClick, checkValue } = this.props;
    if (e.target === this.img || e.target === this.container) {
      if (coordinates.length > checkValue.length) {
        message.error("请为本热点区域勾选对应标题后，再绘画下一个热点区域")
      } else {
        const { x, y } = this.getCursorPosition(e)
        this.drawingIndex = coordinates.length
        this.pointA = { x, y }
        this.id = shortid.generate()
      }
    }
  }


  handleMouseMove = (e) => {
    const { onDraw, onChange, coordinates } = this.props
    const { pointA } = this
    if (isValidPoint(pointA)) {
      // if (coordinates.length - 1 > checkValue.length) {
      //   message.error("请为上一个热点区域勾选对应标题后，再绘画下一个热点区域")
      //   this.pointA = {}
      // } else {
      const pointB = this.getCursorPosition(e)
      // get the drawing coordinate
      const coordinate = {
        x: Math.min(pointA.x, pointB.x),
        y: Math.min(pointA.y, pointB.y),
        width: Math.abs(pointA.x - pointB.x),
        height: Math.abs(pointA.y - pointB.y),
        id: this.id,
      }
      const nextCoordinates = clone(coordinates)
      nextCoordinates[this.drawingIndex] = coordinate
      if (is(Function, onDraw)) {
        onDraw(coordinate, this.drawingIndex, nextCoordinates)
      }
      if (is(Function, onChange)) {
        onChange(coordinate, this.drawingIndex, nextCoordinates)
      }
      // }
    }
  }

  handlMouseUp = () => {
    this.pointA = {}
  }

  render() {
    const {
      src, width, height, onLoad,
    } = this.props
    // const { clicked } = this.state
    return (
      <div
        style={{
          display: 'inline-block',
          position: 'relative',
          border: "1px solid #999999",
          padding: 10,
          height: 580
        }}
        className={styles.removeSelect}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handlMouseUp}
        ref={container => this.container = container}
      >
        <img
          ref={img => this.img = img}
          src={src}
          width={width}
          height={height}
          onLoad={onLoad}
          alt=""
          draggable={false}
        />
        {this.renderCrops(this.props)}

      </div>
    )
  }
}

const {
  string, arrayOf, number, func,
} = PropTypes

MultiCrops.propTypes = {
  coordinates: arrayOf(coordinateType),
  src: string,
  width: number, // eslint-disable-line
  height: number, // eslint-disable-line
  onDraw: func, // eslint-disable-line
  onChange: func, // eslint-disable-line
  onLoad: func, // eslint-disable-line
  onClick: func, // eslint-disable-line
}

MultiCrops.defaultProps = {
  coordinates: [],
  src: '',
}

export default MultiCrops