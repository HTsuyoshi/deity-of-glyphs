class Solid {
  overlap(target) {
    if (this.attributes.pos.dist(target.attributes.pos) < 20) return true;
    return false;
    // TODO: Improve overlap calculation
  }

  walk() {
    if (abs(this.attributes.vel.x) > MIN_VEL ||
      abs(this.attributes.vel.y) > MIN_VEL) {
      this.attributes.pos.add(this.attributes.vel);
    }
  }

  arena_limit() {
    if ((this.attributes.pos.x + CHARACTER_SIZE > WINDOW_RIGHT) &&
      (this.attributes.vel.x > 0))
      this.attributes.vel.x = -this.attributes.vel.x

    if ((this.attributes.pos.x - CHARACTER_SIZE < WINDOW_LEFT) &&
      (this.attributes.vel.x < 0))
      this.attributes.vel.x = -this.attributes.vel.x

    if ((this.attributes.pos.y + CHARACTER_SIZE > WINDOW_BOTTOM) &&
      (this.attributes.vel.y > 0))
      this.attributes.vel.y = -this.attributes.vel.y

    if ((this.attributes.pos.y - CHARACTER_SIZE < WINDOW_TOP) &&
      (this.attributes.vel.y < 0))
      this.attributes.vel.y = -this.attributes.vel.y
  }
}