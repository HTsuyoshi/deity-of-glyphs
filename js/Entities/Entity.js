class Entity extends Solid {
  constructor() {
    super();
    this.attributes = {
      team: -1,
      trait: '',
      style: 0,
      weapon: ATTACK_SEMI_AUTO,
      current_ammo: 1,
      ammo: 1,
      damage: 5,
      current_health: 10,
      max_health: 10,
      upgrades: {
        ammo: 0,
        damage: 0,
        current_health: 0,
        max_health: 0,
      },
      action: {},
      vel: createVector(0, 0),
      pos: createVector(0, 0)
    };
    this.animation = {
      show_bar: 3,
      fire_delay: -1,
      particle_animation: .05,
      ghost_animation: 0.05,
    };
    this.restore();
  }

  // p5js
  mouseClicked() {
    //if (!this.hover()) return false;
    //this.attributes.pos.x = MOUSE_X;
    //this.attributes.pos.y = MOUSE_Y;
    //return true;
  }

  update() {
    if (this.layer_img === null) this.freeze();
    this.update_animations();

    // Character is moving
    if (abs(this.attributes.vel.x) > 0 || abs(this.attributes.vel.y) > 0) {
      this.arena_limit();
      this.attributes.vel.mult(0.8);
      this.walk();
    }

    this.update_action();
  }

  draw() {
    //this.draw_char();
    image(
      this.layer_img,
      this.attributes.pos.x - (this.layer_img.width * .5),
      this.attributes.pos.y - (this.layer_img.height * .5),
    );
    if (this.current_animation.show_bar >= this.animation.show_bar) return;
    const alpha = lerp(255, 0, (this.current_animation.show_bar / this.animation.show_bar));
    this.draw_health_bar(alpha);
    this.draw_action_bar(alpha);
  }

  // Draw
  draw_char() {
    push();
    textSize(CHARACTER_SIZE);

    let char = this.char;
    switch (this.attributes.style) {
      case STYLE_BOLD:
        textSize(CHARACTER_SIZE * 1.25);
        break;
      case STYLE_ITALIC:
        textStyle(ITALIC);
        if (this.attributes.action.name !== ACTION_WALK) break;
        for (const v in this.ghost) {
          SECOND_COLOR.setAlpha((v/GHOST_LENGTH) * 255)
          text(
            this.char,
            this.ghost[v].x,
            this.ghost[v].y,
          );
        }
        break;
      case STYLE_UPPERCASE:
        char = char.toUpperCase();
        break;
    }
    SECOND_COLOR.setAlpha(255)
    text(
      char,
      this.attributes.pos.x,
      this.attributes.pos.y,
    );
    pop();
  }

  draw_health_bar(alpha) {
    push();
    noStroke();
    fill(color(255, 0, 0, alpha));
    rect(
      this.attributes.pos.x - (CHARACTER_SIZE/2),
      this.attributes.pos.y - ((CHARACTER_SIZE/2) + (CHARACTER_SIZE/5)),
      CHARACTER_SIZE * (this.attributes.current_health/(this.all_max_health)),
      CHARACTER_SIZE/10
    );

    // DEBUG: Show character health
    //textSize(CHARACTER_SIZE * .4);
    //text(
    //  `${this.attributes.current_health}`,
    //  this.attributes.pos.x - (CHARACTER_SIZE/2) - (CHARACTER_SIZE * .2),
    //  this.attributes.pos.y - ((CHARACTER_SIZE/2) + (CHARACTER_SIZE/5))
    //);
    pop();
  }

  draw_action_bar(alpha) {
    push();
    noStroke();
    fill(color(0, 255, 0, alpha));
    let bar_width = (this.attributes.action.cooldown - this.attributes.action.bar)/this.attributes.action.cooldown;
    if (bar_width < 0) bar_width = 0.1;
    rect(
      this.attributes.pos.x - (CHARACTER_SIZE/2),
      this.attributes.pos.y - (CHARACTER_SIZE/2),
      CHARACTER_SIZE *
      bar_width,
      CHARACTER_SIZE/10
    );
    pop();
  }

  // Updates
  update_animations() {
    for (const k in this.animation)
      this.current_animation[k] += deltaTime / 1000;
  }

  // Game Logic
  shoot(target) {
    let vel = p5.Vector.normalize(
        p5.Vector.sub(
          target.attributes.pos,
          this.attributes.pos
        )
      )
    // TODO: Change normalize to heading

    let bullet;
    switch (this.attributes.weapon) {
      case ATTACK_LASER:
        bullet = new Laser(
          this.attributes.team,
          this.all_damage,
          createVector(this.attributes.pos.x, this.attributes.pos.y),
          target,
          this.all_ammo
        );
        vel = vel.mult(bullet.base_width * .5);
        break;
      case ATTACK_EXPLOSIONS:
        vel = vel.mult(random(15, 20))
          .rotate(random(-QUARTER_PI, QUARTER_PI));
        bullet = new Explosion(
          this.attributes.team,
          this.all_damage,
          vel,
          createVector(this.attributes.pos.x, this.attributes.pos.y),
          this.all_ammo
        );
        break;
      case ATTACK_GUIDED:
        vel = vel
          .rotate(random(-QUARTER_PI, QUARTER_PI))
          .mult(this.all_damage);
        bullet = new GuidedBullet(
          this.attributes.team,
          this.all_damage,
          vel,
          createVector(this.attributes.pos.x, this.attributes.pos.y),
          this.all_ammo
        );
        break;
      default:
        vel = vel
          .rotate(random(-QUARTER_PI, QUARTER_PI))
          .mult(this.all_damage);
        bullet = new Bullet(
          this.attributes.team,
          this.all_damage,
          vel,
          createVector(this.attributes.pos.x, this.attributes.pos.y),
          target
        );
        break;

    }

    bullets.push(bullet);
    return vel;
  };

  alive() { return (this.attributes.current_health > 0); }

  death() {
    if (entities.length === 0) return;
    let i = entities.indexOf(this);
    if (i > -1) entities.splice(i, 1);
    this.death_animation();
  }

  damage(quantity) {
    this.current_animation.show_bar = 0;
    this.attributes.current_health = max(this.attributes.current_health - quantity, 0);
    if (this.attributes.current_health <= 0) this.death();
  }

  next_action() { return random([ACTION_WALK, ACTION_ATTACK]); }

  next_target() {
    let target = null;

    for (const e of entities) {
      if (e.attributes.team == this.attributes.team) continue;

      if (target == null ||
        this.attributes.pos.dist(e.attributes.pos) <
        this.attributes.pos.dist(target.attributes.pos)
      ) target = e;
    }

    return target;
  }

  restore() {
    this.ghost = [];

    const fire_rate = [
      -1,
      (this.attributes.action.cooldown * .5) / (this.all_ammo),
      this.attributes.action.cooldown / (this.all_ammo),
      -1,
      random(0.1, 0.3),
      -1,
      (this.attributes.action.cooldown * .5) / (this.all_ammo),
      -1
    ];
    this.animation.fire_delay = fire_rate[this.attributes.weapon];

    this.attributes.current_health = this.all_max_health;
    this.attributes.vel = createVector(0, 0);
    this.attributes.action = {
      name: ACTION_WALK,
      cooldown: 1.0,
      bar: 1.0
    };

    this.current_animation = {
      show_bar: 3,
      fire_delay: 0,
      particle_animation: 0,
      ghost_animation: 0,
    };
  }

  hover() {
    if (MOUSE_X > (this.attributes.pos.x - (40 / 2)) &&
        MOUSE_X < (this.attributes.pos.x + (40 / 2)) &&
        MOUSE_Y > (this.attributes.pos.y - (40 / 2)) &&
        MOUSE_Y < (this.attributes.pos.y + (40 / 2)))
      return true;
    return false;
  }

  freeze() {
    this.layer.begin();
    clear();
    const old_x = this.attributes.pos.x,
      old_y = this.attributes.pos.y;
    this.attributes.pos.x = 0;
    this.attributes.pos.y = 0;
    this.draw_char();
    this.attributes.pos.x = old_x;
    this.attributes.pos.y = old_y;
    this.layer.end();
    this.layer_img = this.layer.get();
  }

  // Getters and Setters
  get all_ammo() {
    return this.attributes.ammo + this.attributes.upgrades.ammo;
  }

  get all_damage() {
    if (this.attributes.style === STYLE_BOLD)
      return (this.attributes.damage + this.attributes.upgrades.damage) * 1.5;
    return this.attributes.damage + this.attributes.upgrades.damage;
  }

  get all_max_health() {
    if (this.attributes.style === STYLE_UPPERCASE)
      return (this.attributes.max_health + this.attributes.upgrades.max_health) * 1.5;
    return this.attributes.max_health + this.attributes.upgrades.max_health;
  }
}