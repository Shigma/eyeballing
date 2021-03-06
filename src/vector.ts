type PointLike1 = Point | [Line, Line]
type LineLike1 = Line | [Point, Point]
type PointLike2 = Point | [LineLike1, LineLike1]
type LineLike2 = Line | [PointLike1, PointLike1]
export type PointLike = Point | [LineLike2, LineLike2]
export type LineLike = Line | [PointLike2, PointLike2]

export interface Point {
  x: number
  y: number
}

export interface Line {
  x: number
  y: number
  k: number
  b: number
}

export const origin: Point = { x: 0, y: 0 }

export function squareDist(p1: Point, p2: Point = origin): number {
  return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2
}

export function distance(p1: Point, p2: Point = origin): number {
  return Math.sqrt(squareDist(p1, p2))
}

export function angle(p0: Point, p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p0.y, p2.x - p0.x) - Math.atan2(p1.y - p0.y, p1.x - p0.x)
}

export function acuteAngle(p0: Point, p1: Point, p2: Point): number {
  const alpha = angle(p0, p1, p2)
  return alpha <= - Math.PI / 2
    ? Math.abs(alpha + Math.PI)
    : alpha >= Math.PI / 2
    ? Math.abs(Math.PI - alpha)
    : Math.abs(alpha)
}

export function dot(p1: Point, p2: Point): number {
  return p1.x * p2.x + p1.y * p2.y
}

export function cross(p1: Point, p2: Point): number {
  return p1.x * p2.y - p1.y * p2.x
}

export function crossSum(p1: Point, p2: Point, p3: Point): number {
  return cross(p1, p2) + cross(p2, p3) + cross(p3, p1)
}

export function area(p1: Point, p2: Point, p3: Point): number {
  return cross(minus(p3, p1), minus(p2, p1)) / 2
}

export function normalize(p: Point, length = 1): Point {
  return times(p, length / distance(p))
}

export function plus(p1: Point, p2: Point): Point {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  }
}

export function minus(p1: Point, p2: Point): Point {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  }
}

export function times(p: Point, r: number): Point {
  return {
    x: p.x * r,
    y: p.y * r,
  }
}

export function divide(p: Point, r: number): Point {
  return {
    x: p.x / r,
    y: p.y / r,
  }
}

export function linearSum(...pp: [Point, number?][]): Point {
  return pp.reduce((prev, curr) => {
    const prop = curr[1] || 1
    return plus(prev, {
      x: prop * curr[0].x,
      y: prop * curr[0].y,
    })
  }, origin)
}

export function center(...pp: Point[]): Point {
  const { length } = pp
  const p0 = pp.shift()
  const sum = pp.reduce(plus, p0)
  return {
    x: sum.x / length,
    y: sum.y / length,
  }
}

export function division(p1: Point, p2: Point, port1 = 1, port2 = 1): Point {
  const sum = port1 + port2
  return {
    x: (p1.x * port1 + p2.x * port2) / sum,
    y: (p1.y * port1 + p2.y * port2) / sum,
  }
}

export function polar(rho: number, theta: number, p = origin): Point {
  return {
    x: p.x + rho * Math.cos(theta),
    y: p.y + rho * Math.sin(theta),
  }
}

export function rotate(o: Point, p: Point, theta: number): Point {
  const d = minus(p, o), c = Math.cos(theta), s = Math.sin(theta)
  return {
    x: o.x + d.x * c - d.y * s,
    y: o.y + d.y * c + d.x * s,
  }
}

export function connect(p1: PointLike, p2: PointLike): Line {
  if (p1 instanceof Array) p1 = intersect(...p1)
  if (p2 instanceof Array) p2 = intersect(...p2)
  if (!p1 || !p2) return null
  const k = (p2.y - p1.y) / (p2.x - p1.x)
  return { ...p1, k, b: p1.y - k * p1.x }
}

export function intersect(l1: LineLike, l2: LineLike): Point {
  if (l1 instanceof Array) l1 = connect(...l1)
  if (l2 instanceof Array) l2 = connect(...l2)
  if (!l1 || !l2) return null
  const diff = l2.k - l1.k
  return {
    x: (l1.b - l2.b) / diff,
    y: (l2.k * l1.b - l1.k * l2.b) / diff,
  }
}

export class Bezier {
  p1: Point
  p2: Point
  p3: Point
  p4: Point

  constructor(p1: Point, p2: Point, p3: Point, p4: Point) {
    this.p1 = p1
    this.p2 = p2
    this.p3 = p3
    this.p4 = p4
  }

  _sum(r1: number, r2: number, r3: number, r4: number): Point {
    return linearSum([this.p1, r1], [this.p2, r2], [this.p3, r3], [this.p4, r4])
  }

  r(t: number): Point {
    return this._sum((1 - t) ** 3, 3 * t * (1 - t) ** 2, 3 * t ** 2 * (1 - t), t ** 3)
  }

  r1(t: number): Point {
    return this._sum(0 - (1 - t) ** 2, (1 - 3 * t) * (1 - t), t * (2 - 3 * t), t ** 2)
  }

  r2(t: number): Point {
    return this._sum(1 - t, 3 * t - 2, 1 - 3 * t, t)
  }
}
