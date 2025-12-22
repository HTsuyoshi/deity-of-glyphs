class Traits extends Screen {
  constructor() {
    super();

    //this.layer = createFramebuffer();
    //this.layer_img = null;
    // TOOD: Finish framebuffer
  }

  setup_ui() {
    this.return = new TextButton(
      '<',
      { x: 0, y: 0 },
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
      true
    );

    this.buttons = [];
    this.buttons.push(this.return);
    this.resize();
  }

  // p5js
  draw() {
    super.draw();
    this.draw_traits_info();
  }

  mouseClicked() {
    if (this.return.hover()) return STATE_MENU;
  }

  resize () { 
    this.return.resize(WINDOW_LEFT + 25 + 20, WINDOW_TOP + 25 + 20);
  }

  // Draw
  draw_traits_info() {
    push();
    noFill();

    translate(0, 0, -5);
    stroke(MAIN_COLOR_SHADOW);
    translate(-(width * .75 * .5), -(height * .75 * .5));
    rect(
      SHADOW_GAP,
      SHADOW_GAP,
      width * .75,
      height * .75
    );
    translate(0, 0, 5);
    stroke(SECOND_COLOR);
    rect(
      - SHADOW_GAP,
      - SHADOW_GAP,
      width * .75,
      height * .75
    );
    
    const traits = [
        'vowel',
        'consonant',
        'number',
        'special',
      ];

    noStroke();
    fill(SECOND_COLOR);
    textAlign(LEFT);
    translate(
      0,
      (height * .75 * .5) - (traits.length * 4 * CHARACTER_SIZE * .5)
    );
    for (let i=0; i<traits.length; i++) {
      translate(0, CHARACTER_SIZE);
      text(traits[i], width * .1, 0);
      for (let j=0; j<3; j++) {
        translate(0, CHARACTER_SIZE);
        text(JSON.stringify(get_buff(traits[i], j)), width * .2, 0); }
        // TODO: Fix this text
      }
    pop();
  }
}