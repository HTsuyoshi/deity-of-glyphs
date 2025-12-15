class Prop {
  constructor() {
    this.pos = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.size = { x: 0, y: 0 }
  }

  hover() {
    if (MOUSE_X > (this.pos.x  - (this.size.x * .5)) &&
      MOUSE_X < (this.pos.x + (this.size.x * .5)) &&
      MOUSE_Y > (this.pos.y - (this.size.y * .5)) &&
      MOUSE_Y < (this.pos.y + (this.size.y * .5)))
      return true;
    return false;
  }

  mouseClicked () {}
  mouseMoved () {}

  touchStarted() {}
  touchMoved() {}
  touchEnded() {}

  resize() {}
}