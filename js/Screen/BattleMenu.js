class BattleMenu extends Screen {
  constructor() {
    super();
  }

  setup_ui() {
    // Buttons
    this.resume = new TextButton(
      'Resume',
      { x: 0, y: - BUTTON_WIDTH * .25 },
      { x: BUTTON_WIDTH, y: BUTTON_HEIGHT },
    )
    this.exit = new TextButton(
      'Exit',
      { x: 0, y: - BUTTON_WIDTH * .25 },
      { x: BUTTON_WIDTH, y: BUTTON_HEIGHT },
    )

    this.buttons = [];
    this.buttons.push(this.resume);
    this.buttons.push(this.exit);
    this.resize();
  }

  resize() {
    this.resume.resize(0, - BUTTON_HEIGHT * .8);
    this.exit.resize(0, BUTTON_HEIGHT * .8);
  }

  // p5js
  draw() {
    this.draw_title();
    for (const v of Object.values(this.buttons))
      v.draw();
  }

  mouseClicked() {
    if (this.resume.hover()) return STATE_BATTLE;
    if (this.exit.hover()) return STATE_MENU;
  }

  // Draw
  draw_title() {
    //for (const v of this.title) v.draw(this.pause);
    push();
    textSize(CHARACTER_SIZE * 2);
    text('Paused', 0, -250);
    pop();
  }
}