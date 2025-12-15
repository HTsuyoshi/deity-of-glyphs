class Settings extends Screen {
  constructor() {
    super();
    this.sliders = [];
  }

  setup_ui() {
    this.volume = new Slider(
      'Volume',
      createVector(0, 0),
      BUTTON_WIDTH
    );

    this.sliders = [];
    this.sliders.push(this.volume);

    this.change_color = new TextButton(
      'Game color',
      createVector(0, 0),
      createVector(BUTTON_WIDTH, BUTTON_HEIGHT)
    )

    this.return = new TextButton(
      '<',
      createVector(0, 0),
      createVector(SQUARE_BUTTON, SQUARE_BUTTON),
      true
    )

    this.buttons = [];
    this.buttons.push(this.change_color);
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
    if (this.sliders[0].hover()) this.sliders[0].mouseClicked();
    if (this.change_color.hover()) setup_colors(true);
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