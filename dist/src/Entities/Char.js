class Char extends Entity {
  constructor(team, char) {
    super();
    this.attributes.team = team;
    this.attributes.trait = get_trait(char);
    this.char = char;
  }

  setup() {
    for (const k in this.attributes.upgrades)
      this.attributes.upgrades[k] = 0;
    if (this.attributes.team === PLAYER_TEAM) {
      this.attributes.style = STYLE_ITALIC;
      //this.attributes.max_health = 99999;
      this.attributes.ammo = 10;
      //this.attributes.weapon = ATTACK_LASER;
      //this.attributes.weapon = ATTACK_EXPLOSIONS;
    }

    if (this.attributes.team === ENEMY_TEAM) {
      //this.attributes.ammo = 20;
      //this.attributes.max_health = 99999;
      //this.attributes.weapon = ATTACK_LASER;
    }
  }

  update_action() {
    // Attack
    if (this.attributes.action.name === ACTION_ATTACK) {
      if (this.attributes.weapon === ATTACK_KAMIKAZE) {
        this.attack();
        return;
      }

      if (this.animation.fire_delay != -1 &&
        this.current_animation.fire_delay >= this.animation.fire_delay &&
        this.attributes.current_ammo > 0) {
        this.current_animation.fire_delay = 0;
        this.attack();
      }
    }

    // Walk
    if (this.attributes.action.name === ACTION_WALK) {
      if (this.current_animation.ghost_animation >
        this.animation.ghost_animation) {
        this.ghost.push(this.attributes.pos.copy());
        if (this.ghost.length > GHOST_LENGTH)
          this.ghost.splice(0, 1);
      }
    }

    // Update action bar
    this.attributes.action.bar -= deltaTime / 1000;
    if (this.attributes.action.bar > 0 ) return;
    this.attributes.action.name = this.next_action();
    this.attributes.action.bar = this.attributes.action.cooldown;
    this.current_animation.fire_delay = 0;
    this.attributes.current_ammo = this.all_ammo;

    // Use action bar
    switch(this.attributes.action.name) {
      case ACTION_WALK:
        let min_vel = 3,
          max_vel = 5;

        if (this.attributes.style === STYLE_ITALIC) {
          min_vel = 20;
          max_vel = 20;
        }
        this.attributes.vel = createVector(
          random(min_vel, max_vel) * random_sign(),
          random(min_vel, max_vel) * random_sign()
        );
        break;
      case ACTION_ATTACK:
        this.attack();
        break;
    }
  }

  death_animation() {
    for (let i=0; i<random(6, 12); i++) {
      const particle = new DeathParticle(
        this.attributes.pos
          .copy()
          .add(
            createVector(
              random(-CHARACTER_SIZE/4, CHARACTER_SIZE/4),
              random(-CHARACTER_SIZE/2, CHARACTER_SIZE/2)
            )
          ),
        p5.Vector.normalize(
          createVector(
            random(10, 20) * (random_bool() ? -1 : 1),
            random(-CHARACTER_SIZE, -CHARACTER_SIZE*1.3)
          )
        )
      );
      particles.push(particle);
    }
  }

  attack() {
    const target = this.next_target();
    if (target === null) return;

    const recoil = createVector(0, 0);
    switch(this.attributes.weapon) {
      case ATTACK_KAMIKAZE:
        this.attack_kamikaze(target);
        return;
      case ATTACK_SHOTGUN:
        while (this.attributes.current_ammo > 0) {
          recoil.add(this.shoot(target));
          this.attributes.current_ammo--;
        }
        break;
      case ATTACK_AUTO:
        recoil.add(this.shoot(target)).mult(0.1);
        this.attributes.current_ammo--;
        break;
      case ATTACK_LASER:
        recoil.add(this.shoot(target)).mult(0.5);
        this.attributes.current_ammo = 0;
        this.attributes.action.bar = LASER_DURATION + 1.0;
        break;
      case ATTACK_EXPLOSIONS:
        recoil.add(this.shoot(target)).mult(0);
        this.attributes.current_ammo--;
        break;
      default:
        recoil.add(this.shoot(target)).mult(0.3);
        this.attributes.current_ammo--;
        break;
    }

    this.attributes.vel = recoil.mult(-1);
  }

  attack_kamikaze(target) {
    const acc = target.attributes.pos
      .copy()
      .sub(this.attributes.pos)
      .normalize()
      .mult(
        (1 + this.current_animation.fire_delay) ** 3
      );
    if (this.current_animation.fire_delay < this.animation.fire_delay) this.attributes.vel.sub(acc);
    else this.attributes.vel.add(acc);

    if (this.current_animation.particle_animation > this.animation.particle_animation) {
      for (let i=0; i<round(random(1, 3)); i++) {
        const particle = new TrailParticle(
        //const particle = new StarParticle(
          this.attributes.pos.copy(),
          this.attributes.vel.copy()
            .normalize()
            .rotate(random(-QUARTER_PI, QUARTER_PI))
            .mult(random(-5, -1))
        );
        particle.setup();
        particles.push(particle);
      }
      this.current_animation.particle_animation = 0
    }

    if (!this.overlap(target)) return;
    this.current_animation.fire_delay = 0;
    target.damage(this.all_max_health);
    this.damage(this.all_max_health);
  }
}

class ViewChar extends Char {
  draw() { this.draw_char(); }
  draw_char() {
    push();
    textAlign(LEFT);
    textSize(CHARACTER_SIZE * 2);
    text(
      this.char,
      this.attributes.pos.x,
      this.attributes.pos.y,
    );
    pop();
  }
  
  next_action() { return ACTION_WALK; }
}
