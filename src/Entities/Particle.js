class Particle {
  constructor(pos, vel) {
    this.pos = pos;
    this.vel = vel;
    this.alpha = 255;
    this.size = 1;
  }

  update() {
    this.vel.mult(0.95);
    this.pos.add(this.vel);
  }

  draw() { this.draw_particle(); }

  finished() {
    return (this.alpha <= 0 || this.size <= 0);
  }
}

class BulletParticle extends Particle {
  update() {
    super.update();
    this.alpha -= 5;
  }

  draw_particle() {
    push();
    noStroke();
    fill(255, this.alpha);
    rect(this.pos.x, this.pos.y, CHARACTER_SIZE/8, CHARACTER_SIZE/8);
    pop();
  }
}

class TrailParticle extends Particle {
  setup() {
    this.size = 10;
    this.color = color(255);
  }

  update() {
    super.update();
    this.alpha -= 5;
    this.size -= 0.2;
  }

  draw_particle() {
    push();
    noStroke();
    this.color.setAlpha(this.alpha);
    fill(this.color);
    circle(
      this.pos.x,
      this.pos.y,
      this.size
    );
    pop();
  }
}

class ConfettiParticle extends TrailParticle {
  setup() {
    this.size = CHARACTER_SIZE * .5;
    this.color = random([
      color(255, 100, 100),
      color(100, 255, 100),
      color(100, 100, 255),
      color(255, 255, 100),
      color(255, 100, 255),
      color(100, 255, 255),
    ]);
  }
}

class DeathParticle extends Particle {
  constructor(pos, vel) {
    super(pos, vel);
    this.acc = createVector(0, 1);
    this.floor = pos.y + random(20, 50);
    this.animation = 0.2;
    this.turn = false;
  }

  update() {
    this.vel.y *= 0.9;
    this.vel.add(this.acc);
    if (this.pos.y >= this.floor) {
      this.vel.y = -this.vel.y;
    }
    this.pos.add(this.vel);
    this.alpha -= 5;
    this.animation -= (deltaTime / 1000);
  }

  draw_particle() {
    push();
    noStroke();
    if (this.animation < 0) {
      this.animation = 0.2;
      this.turn = !this.turn;
    }
    fill(255, this.alpha);
    if (this.turn) {
      rect(
        this.pos.x - 0,
        this.pos.y - CHARACTER_SIZE/8,
        CHARACTER_SIZE/8 * 1,
        CHARACTER_SIZE/8 * 2
      );
    } else {
      rect(
        this.pos.x - CHARACTER_SIZE/8,
        this.pos.y - 0,
        CHARACTER_SIZE/8 * 2,
        CHARACTER_SIZE/8 * 1
      );
    }
    pop();
  }
}