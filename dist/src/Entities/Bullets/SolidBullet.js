class SolidBullet extends Solid {
  constructor() {
    super();
    this.attributes = {
      team: '',
      damage: 0,
      vel: createVector(0, 0),
      pos: createVector(0, 0)
    };
  }

  death() {
    if (bullets.length === 0) return;
    let i = bullets.indexOf(this);
    if (i > -1) bullets.splice(i, 1);
    this.death_animation();
  }

  arena_limit() {
    if ((this.attributes.pos.x > WINDOW_RIGHT) &&
      (this.attributes.vel.x > 0))
      this.attributes.vel.x = -this.attributes.vel.x

    if ((this.attributes.pos.x < WINDOW_LEFT) &&
      (this.attributes.vel.x < 0))
      this.attributes.vel.x = -this.attributes.vel.x

    if ((this.attributes.pos.y > WINDOW_BOTTOM) &&
      (this.attributes.vel.y > 0))
      this.attributes.vel.y = -this.attributes.vel.y

    if ((this.attributes.pos.y < WINDOW_TOP) &&
      (this.attributes.vel.y < 0))
      this.attributes.vel.y = -this.attributes.vel.y
  }
}