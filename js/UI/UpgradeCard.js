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
    pop();
  }

  // Draw
  draw_front() {
    image(
      this.img,
      - this.img.width * .5,
      - (this.img.height * .5) - CHARACTER_SIZE * .5,
      this.img.width,
      this.img.height
    );
    fill(SECOND_COLOR);
    textSize(CHARACTER_SIZE);
    text(this.name, 0, (this.img.height * .5));
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
      t2 = `${this.upgrade.trait}`;
    fill(SECOND_COLOR)
    text(t1, -(textWidth(t2) * .5), 20);
    fill(TEAM_COLOR)
    text(t2, textWidth(t1) * .5, 20);
    t1 = 'with ';
    t2 = `${WEAPON_NAME[this.upgrade.weapon]}`;
    fill(SECOND_COLOR)
    text(t1, -textWidth(t2) * .5, (CHARACTER_SIZE * .7) + 20);
    fill(UPGRADE_COLOR)
    text(t2, textWidth(t1) * .5, (CHARACTER_SIZE * .7) + 20);
  }

  draw_style_description() {
    let t1 = 'Transform ',
      t2 = `${this.upgrade.trait}`;
    fill(SECOND_COLOR)
    text(t1, -(textWidth(t2) * .5), 20);
    fill(TEAM_COLOR)
    text(t2, textWidth(t1) * .5, 20);
    t1 = 'into ';
    t2 = `${STYLE_NAME[this.upgrade.style]}`;
    fill(SECOND_COLOR)
    text(t1, -textWidth(t2) * .5, (CHARACTER_SIZE * .7) + 20);
    fill(UPGRADE_COLOR)
    text(t2, textWidth(t1) * .5, (CHARACTER_SIZE * .7) + 20);
  }

  draw_buff_description() {
    let off_y = 0;
    for (const k in this.upgrade.buffs) {
      let t1 = `${k}: `,
        t2 = `${this.upgrade.buffs[k]}`;
      fill(SECOND_COLOR);
      text(t1, -(textWidth(t2) * .5), 20 + (CHARACTER_SIZE * off_y * .6));
      fill(UPGRADE_COLOR);
      text(t2, (textWidth(t1) * .5), 20 + (CHARACTER_SIZE * off_y * .6) );
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
    if (this.current_animation < this.animation) { 
      this.current_animation += delta;
      this.pos = p5.Vector.lerp(this.start_pos, this.final_pos, easeOutElastic(this.current_animation/this.animation));
    }
  }

  get_image(images) {
    if ('buffs' in this.upgrade) {
      if ('ammo' in this.upgrade.buffs) return images['ammo_up'].img;
      if ('damage' in this.upgrade.buffs) return images['damage_up'].img;
      if ('health' in this.upgrade.buffs) return images['health_up'].img;
    }
    if ('weapon' in this.upgrade) {
      switch (this.upgrade.weapon) {
        case ATTACK_SHOTGUN:
          return images['shot'].img;;
        case ATTACK_SEMI_AUTO:
          return images['semi'].img;;
        case ATTACK_AUTO:
          return images['auto'].img;;
        case ATTACK_EXPLOSIONS:
          return images['explosion'].img;;
        case ATTACK_GUIDED:
          return images['guided'].img;;
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

  resize() {}
}