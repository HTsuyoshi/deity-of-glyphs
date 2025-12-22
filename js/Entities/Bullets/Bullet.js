class Bullet extends SolidBullet {
  constructor(team, damage, vel, pos, target) {
    super();
    this.attributes = {
      team: team,
      damage: damage,
      vel: vel,
      pos: pos
    };
    //this.target = target;
    this.target = target.attributes.pos.copy();
    this.life = 1.0;
    game.sounds['bullet'].play();
  }

  // p5js
  draw() { this.draw_bullet(); }

  update() {
    //if (!this.target.alive()) this.death();
    if (!this.arena_limit()) this.death();
    for (const v of entities) {
      if (v.attributes.team == this.attributes.team) continue;
      if (!this.overlap(v)) continue;

      v.damage(this.attributes.damage);
      this.death();
      return;
    }

    this.walk();

    if (this.life > 0) {
      this.life-= deltaTime / 1000;
    } else {
      this.death();
    }

    if (this.life > 0.7) {
      this.attributes.vel.add(p5.Vector.normalize(
        p5.Vector.sub(
          this.target,
          this.attributes.pos
        )
      ).mult(2));
    }
  }

  // Draw
  draw_bullet() {
    push();
    translate(this.attributes.pos.x, this.attributes.pos.y);
    rotate(this.attributes.vel.heading());
    textSize(CHARACTER_SIZE);
    text('-', 0, 0);
    pop();
  }

  death_animation() {
    for (let i=0; i<random(2, 4); i++) {
      const particle = new BulletParticle(
        this.attributes.pos.copy(),
        this.attributes.vel.copy()
          .normalize()
          .rotate(random(-QUARTER_PI, QUARTER_PI))
          .mult(random(1, 5))
      );
      particles.push(particle);
    }
  }

  // Game logic
  arena_limit() {
    if ((this.attributes.pos.x > WINDOW_RIGHT) ||
      (this.attributes.pos.x < WINDOW_LEFT) ||
      (this.attributes.pos.y > WINDOW_BOTTOM) ||
      (this.attributes.pos.y < WINDOW_TOP))
      return false;
    return true;
  }
}