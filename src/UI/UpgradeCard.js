class UpgradeCard extends Prop {
  constructor(pos, size, delay, upgrade, images) {
    super();
    this.delay = delay;

    this.size = size;
    this.pos = createVector(0, WINDOW_TOP - size.y/2);
    this.start_pos = createVector(0, WINDOW_TOP - size.y/2);
    this.final_pos = pos;
    this.animation = 2;
    this.current_animation = 0;
    this.rot = 0;
    this.final_rot = PI;

    this.upgrade = upgrade;
    this.name = upgrade.trait;
    this.img = this.get_image(images);

    this.multiplier = 1;
    this.play_audio = true;
    this.particles = [];

    if ('buffs' in this.upgrade) {
      const mult = Math.random();
      if (ACHIEVEMENTS_STATUS[4][3] && mult < .0625) {
        this.multiplier = 16;
      } else if (ACHIEVEMENTS_STATUS[4][2] && mult < .125) {
        this.multiplier = 8;
      } else if (ACHIEVEMENTS_STATUS[4][1] && mult < .25) {
        this.multiplier = 4;
      } else if (ACHIEVEMENTS_STATUS[4][0] && mult < .5) {
        this.multiplier = 2;
      }

      if (this.multiplier > 1) this.create_confetti();
    }
    this.upgrade.multiplier = this.multiplier;
  }

  // p5js
  draw() {
    push();

    noFill();

    push();
    translate(this.pos.x, this.pos.y - (this.size.y * .5), 145);
    rotateY(this.rot);

    stroke(MAIN_COLOR_SHADOW);
    if (this.rot < HALF_PI) {
      rect(
        SHADOW_GAP - (this.size.x * .5),
        SHADOW_GAP,
        this.size.x,
        this.size.y
      );
    } else {
      rect(
        - (SHADOW_GAP * 3) - (this.size.x * .5),
        SHADOW_GAP,
        this.size.x,
        this.size.y
      );
    }
    pop();

    push();
    translate(this.pos.x, this.pos.y - (this.size.y * .5), 150);
    rotateY(this.rot);

    fill(MAIN_COLOR);
    stroke(SECOND_COLOR);
    rect(
      - SHADOW_GAP - (this.size.x * .5),
      - SHADOW_GAP,
      this.size.x,
      this.size.y
    );

    noStroke();
    if (this.rot < HALF_PI) {
      translate(0, (this.size.y * .5), 1);
      this.draw_front();
    } else {
      rotateY(PI);
      translate(0, (this.size.y * .5), 1);
      this.draw_back();
    }
    pop();

    for (const v of this.particles) {
      v.draw();
      if (v.finished()) {
        const i = this.particles.indexOf(v);
        if (i > -1) this.particles.splice(i, 1);
      }
    }
    pop();
  }

  // Draw
  draw_front() {
    const ratio = (MOBILE) ? .75 : 1;
    image(
      this.img,
      - this.img.width * .5 * ratio,
      - (this.img.height * .5 * ratio) - CHARACTER_SIZE * .5,
      this.img.width * ratio,
      this.img.height * ratio
    );
    fill(SECOND_COLOR);
    if (this.multiplier > 1) {
      textSize(CHARACTER_SIZE * 2);
      fill(MAIN_COLOR_SHADOW)
      text(
        `x${this.multiplier}`,
        this.size.x * .5 + SHADOW_GAP - (CHARACTER_SIZE * 1.5),
        - (this.size.y * .5) + SHADOW_GAP + (CHARACTER_SIZE),
      );
      fill(SECOND_COLOR)
      text(
        `x${this.multiplier}`,
        this.size.x * .5 - SHADOW_GAP - (CHARACTER_SIZE * 1.5),
        - (this.size.y * .5) - SHADOW_GAP + (CHARACTER_SIZE),
      );
    }
    textSize(CHARACTER_SIZE);
    text(this.name, 0, (this.img.height * .5 * ratio));
  }

  draw_back() {
    textSize(CHARACTER_SIZE * .6);
    if ('weapon' in this.upgrade) {
      this.draw_weapon_description();
      return;
    }
    if ('style' in this.upgrade) {
      this.draw_style_description();
      return;
    }
    this.draw_buff_description();
  }

  draw_weapon_description() {
    let t1 = 'Equip ',
      t2 = `${this.upgrade.trait}`,
      h = - CHARACTER_SIZE * .35;
    fill(SECOND_COLOR)
    text(t1, -(textWidth(t2) * .5), + h);
    fill(TEAM_COLOR)
    text(t2, textWidth(t1) * .5, + h);
    t1 = 'with ';
    t2 = `${WEAPON_NAME[this.upgrade.weapon]}`;
    fill(SECOND_COLOR)
    text(t1, -textWidth(t2) * .5, (CHARACTER_SIZE * .7) + h);
    fill(UPGRADE_COLOR)
    text(t2, textWidth(t1) * .5, (CHARACTER_SIZE * .7) + h);
  }

  draw_style_description() {
    let t1 = 'Transform ',
      t2 = `${this.upgrade.trait}`;
    const h = - (CHARACTER_SIZE * .7);

    fill(SECOND_COLOR)
    text(t1, -(textWidth(t2) * .5), h);
    fill(TEAM_COLOR)
    text(t2, textWidth(t1) * .5, h);
    t1 = 'into ';
    t2 = `${STYLE_NAME[this.upgrade.style]}`;
    fill(SECOND_COLOR)
    text(t1, -textWidth(t2) * .5, (CHARACTER_SIZE * .7) + h);
    fill(UPGRADE_COLOR)
    text(t2, textWidth(t1) * .5, (CHARACTER_SIZE * .7) + h);
    switch(this.upgrade.style) {
      case STYLE_ITALIC:
        t1 = '(Walk longer)';
        break;
      case STYLE_BOLD:
        t1 = '(1.5x Damage)';
        break;
      case STYLE_UPPERCASE:
        t1 = '(2.0x Health)';
        break;
      case STYLE_UNDERLINE:
        t1 = '(Block first attack)';
        break;
    }
    fill(DEAD_COLOR)
    text(t1, 0, (CHARACTER_SIZE * 1.4) + h);
  }

  draw_buff_description() {
    let off_y = 0,
      h = - (CHARACTER_SIZE * .7) * (Object.keys(this.upgrade.buffs).length - 1);
    
    for (const k in this.upgrade.buffs) {
      let t1 = `${k}: `,
        t2 = `${this.upgrade.buffs[k]}`;
      fill(SECOND_COLOR);
      text(t1, -(textWidth(t2) * .5), h + (CHARACTER_SIZE * off_y * .6));
      fill(UPGRADE_COLOR);
      text(t2, (textWidth(t1) * .5), h + (CHARACTER_SIZE * off_y * .6) );
      off_y++;
    }
  }

  update() {
    if (this.hover() && this.rot < this.final_rot) this.rot += PI * .05;
    if (!this.hover() && this.rot > 0) this.rot -= PI * .05;
    const delta = deltaTime / 1000;
    if (this.delay > 0) {
      this.delay -= delta;
      return;
    }

    if (this.play_audio) {
      if (this.multiplier > 1) game.play_sound(`upgrade_${this.multiplier}`);
      else game.play_sound('upgrade');
      this.play_audio = false;
    }

    if (this.current_animation < this.animation) { 
      this.current_animation += delta;
      this.pos = p5.Vector.lerp(this.start_pos, this.final_pos, easeOutElastic(this.current_animation/this.animation));
    }
    for (const v of this.particles) v.update();
  }

  get_image(images) {
    if ('buffs' in this.upgrade) {
      if ('ammo' in this.upgrade.buffs) return images['ammo_up'].img;
      if (('damage' in this.upgrade.buffs) && ('max_health' in this.upgrade.buffs)) return images['damage_health_up'].img;
      if ('damage' in this.upgrade.buffs) return images['damage_up'].img;
      if ('max_health' in this.upgrade.buffs) return images['health_up'].img;
    }
    if ('weapon' in this.upgrade) {
      switch (this.upgrade.weapon) {
        case ATTACK_SHOTGUN:
          return images['shot'].img;;
        case ATTACK_SEMI_AUTO:
          return images['semi'].img;;
        case ATTACK_AUTO:
          return images['auto'].img;;
        case ATTACK_LASER:
          return images['laser'].img;;
        case ATTACK_EXPLOSIONS:
          return images['explosion'].img;;
        case ATTACK_SNIPER:
          return images['sniper'].img;;
        case ATTACK_KAMIKAZE:
          return images['kamikaze'].img;;
        case ATTACK_ANGEL:
          return images['angel'].img;;
      }
    }
    if ('style' in this.upgrade) {
      switch (this.upgrade.style) {
        case STYLE_ITALIC:
          return images['italic'].img;;
        case STYLE_BOLD:
          return images['bold'].img;;
        case STYLE_UPPERCASE:
          return images['uppercase'].img;;
        case STYLE_UNDERLINE:
          return images['underline'].img;;
      }
    }
    return images['ammo_up'].img;
  }

  hover() {
    // TODO: Understand how z axis movement work and do the correct calculations
    if (MOUSE_X > (this.pos.x  - (this.size.x * .6)) &&
      MOUSE_X < (this.pos.x + (this.size.x * .6)) &&
      MOUSE_Y > ((this.pos.y * 1.2) - (this.size.y * .6)) &&
      MOUSE_Y < ((this.pos.y * 1.2) + (this.size.y * .6)))
      return true;
    return false;
  }

  mouseClicked() {}

  resize(x, y) {
    this.final_pos.x = x;
    this.final_pos.y = y;
  }

  create_confetti() {
    for (let i=0; i<round(random(10, 20)); i++) {
      const particle = new ConfettiParticle(
        createVector(
          this.pos.x + (this.size.x * .5 * (Math.random() < .5 ? -1 : 1)),
          WINDOW_TOP + random(-10, -100),
        ),
        createVector(
          0,
          random(10, 50),
        ).rotate(random(-EIGHTH_PI, EIGHTH_PI)),
      );
      particle.setup();
      this.particles.push(particle);
    }
  }
}