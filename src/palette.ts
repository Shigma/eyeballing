import { Point, Bezier } from './vector'

function lineStrokeStyle(agent: string): string {
  switch(agent) {
    case 'user': return 'blue'
    case 'test': return 'green'
    case 'base': return 'black'
  }
}

function pointStrokeStyle(agent: string): string {
  switch(agent) {
    case 'user': return 'darkblue'
    case 'test': return 'darkgreen'
    case 'base': return 'darkred'
  }
}

export function bezier(c: Bezier): void {
  this.strokeStyle = lineStrokeStyle(this.$agent)
  this.beginPath()
  this.moveTo(c.p1.x, c.p1.y)
  this.bezierCurveTo(c.p2.x, c.p2.y, c.p3.x, c.p3.y, c.p4.x, c.p4.y)
  this.stroke()
}

export function circle(p: Point, r: number): void {
  this.strokeStyle = lineStrokeStyle(this.$agent)
  this.beginPath()
  this.arc(p.x, p.y, r, 0, 2 * Math.PI)
  this.stroke()
}

export function segment(p1: Point, p2: Point, width = 2): void {
  const lineWidth = this.lineWidth
  this.lineWidth = width || lineWidth
  this.strokeStyle = lineStrokeStyle(this.$agent)
  this.beginPath()
  this.moveTo(p1.x, p1.y)
  this.lineTo(p2.x, p2.y)
  this.stroke()
  this.lineWidth = lineWidth
}

export function segmentAmong(pp: Point[], width = 2): void {
  let p1: Point, p2: Point
  pp = pp.filter(p => p)
  const p0 = pp.shift()
  if (p0.x - pp[0].x) {
    p1 = pp.reduce((prev, curr) => prev.x < curr.x ? prev : curr, p0)
    p2 = pp.reduce((prev, curr) => prev.x > curr.x ? prev : curr, p0)
  } else {
    p1 = pp.reduce((prev, curr) => prev.y < curr.y ? prev : curr, p0)
    p2 = pp.reduce((prev, curr) => prev.y > curr.y ? prev : curr, p0)
  }
  segment.call(this, p1, p2, width)
}

export function segmentBesides(pp: Point[], p: Point, width = 2): void {
  let p1: Point, p2: Point
  pp = pp.filter(p => p)
  const p0 = pp.shift()
  if (p0.x - pp[0].x) {
    p1 = pp.reduce((prev, curr) => prev.x < curr.x ? prev : curr, p0)
    p2 = pp.reduce((prev, curr) => prev.x > curr.x ? prev : curr, p0)
    if (p1.x > p.x) segment.call(this, p1, p, width)
    if (p2.x < p.x) segment.call(this, p2, p, width)
  } else {
    p1 = pp.reduce((prev, curr) => prev.y < curr.y ? prev : curr, p0)
    p2 = pp.reduce((prev, curr) => prev.y > curr.y ? prev : curr, p0)
    if (p1.y > p.y) segment.call(this, p1, p, width)
    if (p2.y < p.y) segment.call(this, p2, p, width)
  }
}

export function halfline(p1: Point, p2: Point, width = 2): void {
  const lineWidth = this.lineWidth
  this.lineWidth = width || lineWidth
  this.strokeStyle = lineStrokeStyle(this.$agent)
  this.beginPath()
  this.moveTo(p1.x, p1.y)
  let x3: number, y3: number
  if (p1.x === p2.x) {
    x3 = p1.x
    y3 = p1.y > p2.y ? 0 : 400
  } else {
    x3 = p1.x > p2.x ? 0 : 300
    y3 = (p2.x * p1.y + x3 * p2.y - p1.x * p2.y - x3 * p1.y) / (p2.x - p1.x)
  }
  this.lineTo(x3, y3)
  this.stroke()
  this.lineWidth = lineWidth
}

export function line(p1: Point, p2: Point, width = 2): void {
  const lineWidth = this.lineWidth
  this.lineWidth = width || lineWidth
  this.strokeStyle = lineStrokeStyle(this.$agent)
  this.beginPath()
  if (p1.x === p2.x) {
    this.moveTo(p1.x, 0)
    this.lineTo(p2.x, 400)
  } else {
    this.moveTo(0, (p2.x * p1.y - p1.x * p2.y) / (p2.x - p1.x))
    this.lineTo(300, (p2.x * p1.y + 300 * p2.y - p1.x * p2.y - 300 * p1.y) / (p2.x - p1.x))
  }
  this.stroke()
  this.lineWidth = lineWidth
}

export function point(p: Point, radius = 3): void {
  const bdColor = pointStrokeStyle(this.$agent)
  this.$points.push(() => {
    this.strokeStyle = bdColor
    this.beginPath()
    this.arc(p.x, p.y, radius, 0, 2 * Math.PI)
    this.fill()
    this.stroke()
  })
}
