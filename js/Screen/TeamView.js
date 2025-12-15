class TeamView extends Screen {
  constructor() {
    super();
  }

  setup_ui() {
    // Current team carrousel
    this.team_carrousel = new Carrousel(
      createVector(0, 0),
      team,
      CHARACTER_SIZE * 10
    );

    this.carrousel_height = height / 4;
    this.resume_btn = new TextButton(
      '▶',
      createVector(0, 0),
      createVector(SQUARE_BUTTON, SQUARE_BUTTON),
      true
    );

    this.buttons = [];
    this.buttons.push(this.resume_btn);
    this.resize();
  }

  // p5js
  draw() {
    super.draw();
    this.team_carrousel.draw();
    this.draw_char_info();
  }

  update() {
    super.update();
    this.team_carrousel.update();
  }

  mouseClicked() { if (this.resume_btn.hover()) return STATE_BATTLE; }

  touchStart() { this.team_carrousel.touchStart(); }
  touchMoved() { this.team_carrousel.touchMoved(); }
  touchEnded() { this.team_carrousel.touchEnded(); }

  resize () { 
    this.team_carrousel.resize(0, -height * .125);
    this.resume_btn.resize(WINDOW_LEFT + (SQUARE_BUTTON * .5) + 20, WINDOW_TOP + 25 + 20);
  }

  draw_char_info() {
    const char = this.team_carrousel.current_char();
    this.draw_attributes(
      'damage',
      char.attributes.damage,
      char.attributes.upgrades.damage,
      createVector(0, this.carrousel_height - 160)
    );
    // TODO: Draw multiplier BOLD
    this.draw_attributes(
      'weapon',
      WEAPON_NAME[char.attributes.weapon],
      null,
      createVector(0, this.carrousel_height - 120)
    );
    this.draw_attributes(
      'Ammo',
      char.attributes.ammo,
      char.attributes.upgrades.ammo,
      createVector(0, this.carrousel_height - 80)
    );
    this.draw_attributes(
      'Health',
      char.attributes.current_health,
      null,
      createVector(0, this.carrousel_height - 40)
    );
    // TODO: Draw multiplier UPPERCASE
    this.draw_attributes(
      'Max Health',
      char.attributes.max_health,
      char.attributes.upgrades.max_health,
      createVector(0, this.carrousel_height)
    );
    this.draw_attributes(
      'Trait',
      char.attributes.trait,
      null,
      createVector(0, this.carrousel_height + 40)
    );
  }

  draw_attributes(name, value, upgrade, pos) {
    push();
    text(`${name}: ${value}`, pos.x, pos.y);
    fill(UPGRADE_COLOR);
    if (upgrade != null)
      text(
        ` + ${upgrade}`,
        pos.x +
          textWidth(`${name}: ${value}`) * .5 +
          textWidth(` + ${upgrade}`) * .5,
        pos.y);
      //TODO: '+' is not showing propely
    pop();
  }
}

class TeamViewEditor extends TeamView {
  setup_ui() {
    this.return_btn = new TextButton(
      '<',
      createVector(0, 0),
      createVector(50, 50)
    );
    super.setup_ui();

    this.buttons = [];
    this.buttons.push(this.return_btn);
    this.resize();
  }

  // p5js
  mouseClicked() { if (this.return_btn.hover()) return STATE_TEAM_EDITOR; }

  resize () { 
    super.resize();
    this.return_btn.resize(WINDOW_LEFT + (SQUARE_BUTTON * .5) + 20, WINDOW_TOP + 25 + 20);
  }
}