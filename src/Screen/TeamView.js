class TeamView extends Screen {
  constructor() {
    super();
    this.current_char = null;
  }

  setup_ui() {
    // Current team carrousel
    this.team_carrousel = new ViewCarrousel(
      createVector(0, 0),
      team_battlefield,
      CHARACTER_SIZE * 10
    );
    this.current_char = this.team_carrousel.current_char();

    this.carrousel_height = height * .25;
    this.resume_btn = new TextButton(
      '▶',
      { x: 0, y: 0 },
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
      true
    );

    this.buttons = [];
    this.buttons.push(this.resume_btn);
    this.resize();

    this.layer = createFramebuffer();
    //this.layer.resize(
    //  ceil(this.size.x + ((STROKE_WEIGHT + SHADOW_GAP) * 2)),
    //  ceil(this.size.y + ((STROKE_WEIGHT + SHADOW_GAP) * 2))
    //);
    this.layer_img = null;
  }

  // p5js
  draw() {
    super.draw();
    this.team_carrousel.draw();
    if (this.layer_img === null) this.freeze();
    image(
      this.layer_img,
      - (this.layer_img.width * .5),
      - (this.layer_img.height * .5),
    );
  }

  update() {
    super.update();
    this.team_carrousel.update();
  }

  mouseClicked() { if (this.resume_btn.hover()) return STATE_BATTLE; }

  mouseMoved() {
    super.mouseMoved();
    this.team_carrousel.mouseMoved();
    if (this.current_char !== this.team_carrousel.current_char()) {
      this.current_char = this.team_carrousel.current_char();
      this.freeze();
    }
  }

  touchStarted() {
    super.touchStarted();
    this.team_carrousel.touchStarted();
  }
  touchMoved() {
    super.touchMoved();
    this.team_carrousel.touchMoved();
    if (this.current_char !== this.team_carrousel.current_char()) {
      this.current_char = this.team_carrousel.current_char();
      this.freeze();
    }
  }

  touchEnded() { 
    this.team_carrousel.touchEnded();
    return super.touchEnded();
  }

  resize() { 
    this.team_carrousel.resize(0, -height * .125);
    this.resume_btn.resize(WINDOW_LEFT + (SQUARE_BUTTON * .5) + 20, WINDOW_TOP + 25 + 20);
  }

  // Draw
  draw_char_info() {
    const char = this.team_carrousel.current_char(),
      gap = MOBILE ? CHARACTER_SIZE : CHARACTER_SIZE * .5,
      off_x = - textWidth('Max Health: 10 + 10 2') * .5,
      off_y = WINDOW_BOTTOM - (240 + CHARACTER_SIZE + (gap * 2));
    push();
    fill(MAIN_COLOR);
    rect(
      off_x - gap,
      off_y - (CHARACTER_SIZE * .5) - gap,
      abs(off_x - gap) * 2,
      240 + CHARACTER_SIZE + (gap * 2)
    );
    pop();
    this.draw_attributes(
      'Weapon',
      WEAPON_NAME[char.attributes.weapon],
      null,
      { x: off_x, y: off_y },
    );
    this.draw_attributes(
      'Damage',
      char.attributes.damage,
      char.attributes.upgrades.damage,
      { x: off_x, y: off_y + 40 },
      (char.attributes.style === STYLE_BOLD) ? STYLE_BOLD : STYLE_NORMAL
    );
    this.draw_attributes(
      'Ammo',
      char.attributes.ammo,
      char.attributes.upgrades.ammo,
      { x: off_x, y: off_y + 80 },
    );
    this.draw_attributes(
      'Health',
      char.attributes.current_health,
      null,
      { x: off_x, y: off_y + 120 },
    );
    this.draw_attributes(
      'Max Health',
      char.attributes.max_health,
      char.attributes.upgrades.max_health,
      { x: off_x, y: off_y + 160 },
      (char.attributes.style === STYLE_UPPERCASE) ? STYLE_UPPERCASE : STYLE_NORMAL
    );
    this.draw_attributes(
      'Trait',
      char.attributes.trait,
      null,
      { x: off_x, y: off_y + 200 },
    );
    this.draw_attributes(
      'Style',
      STYLE_NAME[char.attributes.style],
      null,
      { x: off_x, y: off_y + 240 },
    );
  }

  draw_attributes(name, value, upgrade, pos, multiplier = STYLE_NORMAL) {
    //TODO: '+' is not showing propely

    let t = `${name}: ${value}`;
    push();
    textAlign(LEFT);
    text(t, pos.x, pos.y);
    if (upgrade === null) {
      pop();
      return;
    }

    fill(UPGRADE_COLOR);
    text(` + ${upgrade}`,pos.x + textWidth(t), pos.y);
    if (multiplier === STYLE_NORMAL) {
      pop();
      return;
    }

    t += ` + ${upgrade}`;
    translate(
      pos.x + textWidth(t),
      pos.y - (CHARACTER_SIZE * 1.5));
    rotate(QUARTER_PI);
    fill(MAIN_COLOR_SHADOW);
    if (multiplier === STYLE_BOLD) {
      text('1.5x', SHADOW_GAP, SHADOW_GAP);
      fill(SECOND_COLOR);
      text('1.5x', 0, 0);
    } else if (multiplier === STYLE_UPPERCASE) {
      text('2.0x', SHADOW_GAP, SHADOW_GAP);
      fill(SECOND_COLOR);
      text('2.0x', 0, 0);
    }
    pop();
  }

  //Game Logic
  freeze() { 
    this.layer.begin();
    clear();
    this.draw_char_info();
    this.layer.end();
    this.layer_img = this.layer.get();
  }
}

class TeamViewEditor extends TeamView {
  setup_ui() {
    this.return_btn = new TextButton(
      '<',
      { x: 0, y: 0 },
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
    );
    super.setup_ui();

    this.buttons = [];
    this.buttons.push(this.return_btn);
    this.resize();

    this.layer = createFramebuffer();
    //this.layer.resize(
    //  ceil(this.size.x + ((STROKE_WEIGHT + SHADOW_GAP) * 2)),
    //  ceil(this.size.y + ((STROKE_WEIGHT + SHADOW_GAP) * 2))
    //);
    this.layer_img = null;
  }

  // p5js
  mouseClicked() { if (this.return_btn.hover()) return STATE_TEAM_EDITOR; }

  resize () { 
    this.team_carrousel.resize(0, -height * .125);
    this.return_btn.resize(WINDOW_LEFT + (SQUARE_BUTTON * .5) + 20, WINDOW_TOP + 25 + 20);
  }
}