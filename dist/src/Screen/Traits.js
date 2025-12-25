class Traits extends Screen {
  constructor() {
    super();

    this.size = {
      x: 350,
      y: 450
    };
  }

  setup() {
    this.layer = createFramebuffer();
    this.layer.resize(
      this.size.x + SHADOW_GAP + (STROKE_WEIGHT * 2),
      this.size.y + SHADOW_GAP + (STROKE_WEIGHT * 2),
    );
    this.layer_img = null;

    super.setup();
  }

  setup_ui() {
    this.pos = createVector(0, WINDOW_TOP - (this.size.y * .5));
    this.start_pos = createVector(0, WINDOW_TOP - (this.size.y * .5));
    this.final_pos = createVector(0, 0);

    this.current_animation = 0;
    this.animation = 2;

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
    push();
    noStroke();
    fill(MAIN_COLOR);
    rect(
      WINDOW_LEFT,
      WINDOW_TOP,
      SQUARE_BUTTON + 20 + (STROKE_WEIGHT * 2),
      SQUARE_BUTTON + 20 + (STROKE_WEIGHT * 2)
    );
    pop();
    super.draw();

    image(
      this.layer_img,
      this.pos.x - (this.layer_img.width * .5),
      this.pos.y - (this.layer_img.height * .5),
    );
  }

  update() {
    super.update();
    if (this.layer_img === null) this.freeze();

    if (this.current_animation < this.animation) { 
      this.current_animation += deltaTime / 1000;
      this.pos = p5.Vector.lerp(this.start_pos, this.final_pos, easeOutElastic(this.current_animation/this.animation));
    }
  }

  mouseClicked() { if (this.return.hover()) return STATE_TEAM_EDITOR; }

  resize () { this.return.resize(WINDOW_LEFT + (SQUARE_BUTTON * .5) + 20, WINDOW_TOP + (SQUARE_BUTTON * .5) + 20); }

  // Draw
  draw_traits_info() {
    push();
    noFill();

    translate(0, 0, -5);
    stroke(MAIN_COLOR_SHADOW);
    rect(
      (- this.size.x * .5) + SHADOW_GAP,
      (- this.size.y * .5) + SHADOW_GAP,
      this.size.x,
      this.size.y
    );

    translate(0, 0, 5);
    fill(MAIN_COLOR)
    stroke(SECOND_COLOR);
    rect(
      (- this.size.x * .5) - SHADOW_GAP,
      (- this.size.y * .5) - SHADOW_GAP,
      this.size.x,
      this.size.y
    );

    const gap = (MOBILE) ? CHARACTER_SIZE * 3 : CHARACTER_SIZE * 2,
      traits = [
      'vowel',
      'consonant',
      'number',
      'special',
    ];

    fill(SECOND_COLOR);
    textAlign(LEFT);
    translate(
      0,
      - (traits.length * gap * .75)
    );
      
    for (let i=0; i<traits.length; i++) {

      let qnt = count_traits(team)[traits[i]];
      if (qnt === undefined) qnt = 0;
      let t0 = '',
        t1 = '';

      t1 = `\t${capitalize(traits[i])} (Qnt: ${' '.repeat(qnt.length)} )`;
      fill(SECOND_COLOR);
      text(
        t1,
        - (this.size.x * .5),
        0
      );
      t0 += `\t${capitalize(traits[i])} (Qnt: `;

      if (qnt > TRAIT_LIMIT) fill(DEAD_COLOR);
      text(
        `${qnt}`,
        - (this.size.x * .5)
        + textWidth(t0),
        0
      );

      fill(SECOND_COLOR);
      const buff = get_buff(traits[i]);
      let off_x = textWidth('\t\t');
      for (const k in buff) {
        translate(0, gap * .5);
        let buff_name = k;
        if (buff_name === 'max_health') buff_name = 'health';

        const t = `${buff_name}: ${buff[k]} x ${min(qnt, TRAIT_LIMIT)}`;
        text(
          t,
          - (this.size.x * .5) + off_x,
          0
        );
      }
      translate(0, gap);
    }
    pop();
  }

  // Game Logic
  freeze() { 
    this.layer.begin();
    clear();
    this.draw_traits_info();
    this.layer.end();
    this.layer_img = this.layer.get();
  }
}