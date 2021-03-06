import * as Vector from '../vector'
import { Eyeballing } from '../tests'
import Triangle from '../data/triangle'

export default {
  name: '重心',
  caption: '标出三角形的重心。\n重心是三角形<strong>三条中线的交点</strong>。',
  dataset: Triangle,
  base({ p1, p2, p3 }) {
    this.point(p1)
    this.point(p2)
    this.point(p3)
    this.segment(p1, p2)
    this.segment(p2, p3)
    this.segment(p3, p1)
  },
  draw({ p1, p2, p3 }, mouse) {
    const q1 = Vector.intersect([p2, p3], [p1, mouse])
    const q2 = Vector.intersect([p3, p1], [p2, mouse])
    const q3 = Vector.intersect([p1, p2], [p3, mouse])
    this.segmentBesides([p1, p2], q3, 1)
    this.segmentBesides([p2, p3], q1, 1)
    this.segmentBesides([p3, p1], q2, 1)
    this.segmentAmong([p1, q1, mouse], 1)
    this.segmentAmong([p2, q2, mouse], 1)
    this.segmentAmong([p3, q3, mouse], 1)
    this.point(q1, 2)
    this.point(q2, 2)
    this.point(q3, 2)
    this.point(mouse)
  },
  test({ p1, p2, p3 }, mouse) {
    const target = Vector.center(p1, p2, p3)
    const q1 = Vector.division(p2, p3)
    const q2 = Vector.division(p3, p1)
    const q3 = Vector.division(p1, p2)
    this.segment(p1, q1, 1)
    this.segment(p2, q2, 1)
    this.segment(p3, q3, 1)
    this.point(q1, 2)
    this.point(q2, 2)
    this.point(q3, 2)
    this.point(target)
    return Vector.distance(target, mouse)
  },
} as Eyeballing
