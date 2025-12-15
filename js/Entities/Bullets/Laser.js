class Laser extends SolidBullet {
  constructor(team, damage, pos, target, ammo) {
    super();
    this.attributes = {
      team: team,
      damage: damage,
      pos: pos
    };
    
    this.current_duration = 0;
    this.duration = 3;
    this.laser_width = 0;
    this.laser_width_1 = 0;
    this.laser_width_2 = 0;
    this.base_width = 10 + (ammo * (CHARACTER_SIZE * 0.1));
    this.already_hit = [];

    this.target = extend_target(this.attributes.pos, target.attributes.pos, width + height);
    this.laser_pos = extend_target(this.attributes.pos, this.target, 20 + this.base_width);
  }

  // p5js
  draw() { this.draw_bullet(); }

  update() {
    this.current_duration += deltaTime / 1000;
    let ease_duration = null;
    if (this.current_duration < 0.5) {
      ease_duration = easeInQuad((.5 - this.current_duration) * 2);
      this.laser_width = ease_duration * 2;
      this.laser_width_1 = this.laser_width + (random(.2,.3) * this.base_width);
      this.laser_width_2 = this.laser_width_1 + (random(.2,.3) * this.base_width);
      return;
    } else if (this.current_duration < 1.0) {
      ease_duration = easeInQuad(((this.current_duration - .5) * 2));
      this.laser_width = ease_duration * this.base_width;
      this.laser_width_1 = this.laser_width + (random(.2,.5) * this.base_width);
      this.laser_width_2 = this.laser_width_1 + (random(.2,.5) * this.base_width);
      return;
    } else if (this.current_duration < (LASER_DURATION - .5)) {
      this.laser_width = this.base_width * (LASER_DURATION - .5);
      this.laser_width += random(.2,.5) * this.base_width;
      this.laser_width_1 = this.laser_width + (random(.2,.5) * this.base_width);
      this.laser_width_2 = this.laser_width_1 + (random(.2,.5) * this.base_width);
    } else {
      ease_duration = easeInExpo((this.duration - this.current_duration) * 2);
      let mul = ease_duration * this.base_width * 2.5;
      this.laser_width = mul;

      ease_duration = easeInQuad((LASER_DURATION - this.current_duration) * 2);
      mul = ease_duration * this.base_width * 2.5;
      this.laser_width_1 = mul + (ease_duration * this.base_width * random(.2, .5));
      this.laser_width_2 = this.laser_width_1 + (ease_duration * this.base_width * random(.2, .5));
    }

    for (const v of entities) {
      if (v.attributes.team == this.attributes.team) continue;
      if (!this.overlap(v.attributes.pos)) continue;
      if (this.already_hit.includes(v)) continue;

      this.already_hit.push(v);
      v.damage(this.attributes.damage);
    }

    if (this.current_duration >= this.duration) this.death();
  }

  // Draw
  draw_bullet() {
    push();
    strokeCap(ROUND);
    this.draw_laser(BULLET_COLOR, this.laser_width_2);
    this.draw_laser(BULLET_COMPLEMENTARY_COLOR, this.laser_width_1);
    this.draw_laser(SECOND_COLOR, this.laser_width);
    pop();
  }

  draw_laser(laser_color, laser_width) {
    stroke(laser_color);
    strokeWeight(laser_width);
    line(this.laser_pos.x, this.laser_pos.y, this.target.x, this.target.y);
  }

  // Game logic
  overlap(target) {
    const s0 = this.laser_pos,
      s1 = this.target,
      laser_dir = p5.Vector.sub(s1, s0),
      bs0 = p5.Vector.sub(s0, target);
    // Verify if the target is before the laser
    if (p5.Vector.dot(laser_dir, bs0) > 0) return false;
    // Verify if the target is hit by the laser
    return point_line_dist(target, s0, s1) < this.laser_width;
  }

  death_animation() {}
}
 