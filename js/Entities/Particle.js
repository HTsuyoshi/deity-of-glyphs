class Particle {
  constructor(pos, vel) {
    this.pos = pos;
    this.vel = vel;
    this.acc = createVector(0, 1);
    this.floor = pos.y + random(20, 50);
    this.alpha = 255;
    this.animation = 0.2;
    this.turn = false;
    this.size = 1;
  }

  update() {
    this.vel.mult(0.95);
    this.pos.add(this.vel);
    this.alpha -= 5;
  }

  draw() { this.draw_particle(); }

  finished() {
    return (this.alpha <= 0 || this.size <= 0);
  }
}

class BulletParticle extends Particle {
  draw_particle() {
    push();
    noStroke();
    fill(255, this.alpha);
    rect(this.pos.x, this.pos.y, CHARACTER_SIZE/8, CHARACTER_SIZE/8);
    pop();
  }
}

class DeathParticle extends Particle {
  update() {
    this.vel.y *= 0.9;
    this.vel.add(this.acc);
    if (this.pos.y >= this.floor) {
      this.vel.y = -this.vel.y;
    }
    this.pos.add(this.vel);
    this.alpha -= 5;
    this.animation -= (deltaTime / 1000/1000);
  }

  draw_particle() {
    push();
    noStroke();
    // TODO: Refactor this code
    if (this.animation < 0) {
      this.animation = 0.2;
      this.turn = !this.turn;
    }
    fill(255, this.alpha);
    rect(
      this.pos.x - (this.turn ? 0 : CHARACTER_SIZE/8),
      this.pos.y - (this.turn ? CHARACTER_SIZE/8 : 0),
      CHARACTER_SIZE/8 * (this.turn ? 1 : 2),
      CHARACTER_SIZE/8 * (this.turn ? 2 : 1));
    pop();
  }
}

class TrailParticle extends Particle {
  setup() {
    this.size = 10;
  }

  update() {
    this.vel.mult(0.95);
    this.pos.add(this.vel);
    this.alpha -= 5;
    this.size -= 0.2;
  }

  draw_particle() {
    push();
    noStroke();
    fill(255, this.alpha);
    circle(
      this.pos.x,
      this.pos.y,
      this.size);
    pop();
  }

  finished() {
    return (this.alpha <= 0 || this.size <= 0);
  }
}

class StarParticle extends Particle {
  constructor(pos, vel) {
    super();
    this.img = game.images['star_2'];
  }

  setup() {
    this.size = 20;
    this.rot = random_sign() * random(PI, PI * 2);
  }

  update() {
    this.vel.mult(0.95);
    this.pos.add(this.vel);
    this.alpha -= 5;
    this.size -= 0.2;
  }

  draw_particle() {
    push();
    tint(255, this.alpha);
    translate(
      this.pos.x,
      this.pos.y
      //this.pos.x - 50 - (this.size * .5),
      //this.pos.y - 50 - (this.size * .5)
    );
    rotate(this.rot);
    imageMode(CENTER);
    image(this.img, 0, 0, 20 + this.size, 20 + this.size);
    pop();
    this.size *= .9;
    this.rot *= .9;
  }
}