class Settings extends Screen {
  constructor() {
    super();
    this.sliders = [];
  }

  setup_ui() {
    this.volume = new Slider(
      'Volume',
      { x: 0, y: 0},
      BUTTON_WIDTH,
      VOLUME
    );

    this.sliders = [];
    this.sliders.push(this.volume);

    this.change_color = new TextButton(
      'Game color',
      { x: 0, y: 0},
      { x: BUTTON_WIDTH, y: BUTTON_HEIGHT },
    )

    this.enable_shader = new TextButton(
      `Shader: ${ENABLE_SHADER ? 'on' : 'off'}`,
      { x: 0, y: 0},
      { x: BUTTON_WIDTH, y: BUTTON_HEIGHT },
    )

    this.return = new TextButton(
      '<',
      { x: 0, y: 0},
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
      true
    )

    this.buttons = [];
    this.buttons.push(this.change_color);
    this.buttons.push(this.enable_shader);
    this.buttons.push(this.return);
    this.resize();
  }

  // p5js
  draw() {
    super.draw();
    this.draw_title();
    for (const v of Object.values(this.sliders)) v.draw();
  }

  mouseClicked() {
    if (this.sliders[0].hover()) {
      this.sliders[0].mouseClicked();
      VOLUME = this.sliders[0].value;
      game.setup_volume();
      game.play_sound('dash');
    }

    if (this.change_color.hover()) {
      setup_colors(true);
      stroke(SECOND_COLOR);
      fill(SECOND_COLOR);
      this.setup();
    }

    if (this.enable_shader.hover()) {
      ENABLE_SHADER = !ENABLE_SHADER;
      this.setup_ui();
    }
    if (this.return.hover()) return STATE_MENU;
  }

  update() {
    super.update();
    for (const v of this.buttons) v.update();
    for (const v of this.sliders) v.update();
  }

  resize() {
    this.volume.resize(0, -150);
    this.change_color.resize(0, 0);
    this.enable_shader.resize(0, 150);
    this.return.resize(WINDOW_LEFT + (SQUARE_BUTTON * .5) + 20, WINDOW_TOP + (SQUARE_BUTTON * .5) + 20);
  }

  // Draw
  draw_title() {
    push();
    textSize(CHARACTER_SIZE * 1.5);
    text('Settings', 0, WINDOW_TOP + (height / 6));
    pop();
  }
}