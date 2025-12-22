class Explosion extends SolidBullet {
  constructor(team, damage, vel, pos, ammo) {
    super();
    this.attributes = {
      team: team,
      damage: damage,
      vel: vel,
      pos: pos
    };
    this.base_size = CHARACTER_SIZE + (CHARACTER_SIZE * 0.2 * ammo);
    this.size = this.base_size;
    this.already_hit = [];

    this.img = game.images['star'];
    this.off = 0;
    this.timer = random(2, 3);
    this.explosion_duration = 1;
    this.rot_vel = random(HALF_PI, PI * 2) * random_sign();
    this.rot = 0;

    this.play_sound = true;
  }

  // p5js
  draw() { this.draw_bullet(); }

  update() {
    this.arena_limit();
    if (this.timer > 0) {
      this.timer -= deltaTime / 1000;
      this.off = random(0, 40);

      if (this.timer < 0.5) {
        this.size = (this.base_size * 2 * easeInQuad(this.timer * 2));
        this.rot += this.rot_vel;
        this.rot_vel *= 0.8;
      } else if (this.timer < 1.0) {
        this.size = this.base_size + ((this.base_size) * easeInQuad((1 - this.timer) * 2));
      }

      this.attributes.vel.mult(0.95);
      this.walk();
      return;
    }
    if (this.timer <= 0 && this.play_sound) {
      game.sounds['explosion'].play();
      this.play_sound = false;
    }

    this.explosion_duration -= deltaTime / 1000;
    this.size = easeInQuad((1.0 - this.explosion_duration) * 2) * this.base_size * 2;
    if (this.explosion_duration < 0.5) {
      this.size = easeInQuad(1) * this.base_size * 2;
      this.off = random(0, 20);
    }
    for (const v of entities) {
      if (v.attributes.team === this.attributes.team) continue;
      if (!this.overlap(v)) continue;
      if (this.already_hit.includes(v)) continue;

      this.already_hit.push(v);
      v.damage(this.attributes.damage);
    }

    for (const v of bullets) {
      if (v.attributes.team !== this.attributes.team) continue;
      if (!(v instanceof Explosion)) continue;
      if (!this.overlap(v)) continue;

      this.already_hit.push(v);
      v.attributes.vel.add(
        v.attributes.pos.copy()
          .sub(this.attributes.pos)
          .normalize()
          .mult(3)
      );
    }
    if (this.explosion_duration < 0) this.death();
  }

  // Draw
  draw_bullet() {
    push();
    translate(this.attributes.pos.x, this.attributes.pos.y);
    noFill();
    stroke(SECOND_COLOR);
    let off = 0;
    if (this.timer < 0) {
      strokeWeight(easeInQuad(this.explosion_duration) * this.base_size * .25);

      circle(0, 0, this.size + this.off);
      pop();
      return;
    }

    if (this.timer < 0.5) {
      strokeWeight(easeInQuad(this.timer * 2) * 5);
      circle(0, 0, (this.base_size * .25) + this.base_size * easeInQuad((.5 - this.timer) * 2));
    }

    rotate(this.rot);
    translate(0,0,-5);
    image(
      this.img,
      - ((this.size + this.off) * .5),
      - ((this.size + this.off) * .5),
      (this.size + this.off),
      (this.size + this.off)
    );
    pop();
    return;
  }

  death_animation() {}

  // Game logic
  overlap(target) {
    if (this.attributes.pos.dist(target.attributes.pos) < this.size) return true;
    return false;
  }
}