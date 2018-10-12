import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: '圆心',
  caption: '标出给定圆的圆心。',
  dataset: [{
    o: { x: 130, y: 220 },
    r: 70,
  }],
  base({ o, r }) {
    this.circle(o, r)
  },
  draw(data, mouse) {
    this.point(mouse)
  },
  test({ o }, mouse) {
    this.point(o)
    return Vector.distance(o, mouse)
  },
} as Eyeballing