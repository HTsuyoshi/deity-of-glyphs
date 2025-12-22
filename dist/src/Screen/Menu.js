class Menu extends Screen {
  constructor() {
    super();
    this.images = {
      achievement: { src: 'icons/achievements.png', img: null },
      social: { src: 'icons/social.png', img: null }
    };
    this.off_y;
    this.delay = 0.1;
    this.current_delay = 0;
  }

  setup() {
    this.background = random([BACKGROUND_MATRIX, BACKGROUND_ALIVE]);
    this.off_y = height / 6;
    super.setup();
    switch (this.background) {
      case BACKGROUND_MATRIX:
        this.matrix = [];

        let alphabet = [...AVAILABLE_CHARACTERS];
        const qty = isMobile() ? 10 : 20;
        if (alphabet.length > qty) {
          shuffle(alphabet, true);
          alphabet = alphabet.slice(0, qty);
        }

        for (const c of alphabet)
          this.matrix.push({
            char: c,
            alpha: 255,
            delay: random(0, 4),
            pos: createVector(random(WINDOW_LEFT, WINDOW_RIGHT), WINDOW_TOP - CHARACTER_SIZE),
            vel: createVector(0, 0),
            rot: 0,
            rot_vel: random(-QUARTER_PI/4, QUARTER_PI/4),
          });
        break;

      case BACKGROUND_ALIVE:
        this.title = [];
        const char_list = GAME_TITLE.split('');
        for (let i=0; i<char_list.length; i++) {
          const temp = new ViewChar(-1, char_list[i]);
          temp.setup();
          temp.attributes.pos =
            createVector(
              - (GAME_TITLE.length * CHARACTER_SIZE * .5)
              + (i * CHARACTER_SIZE),
              WINDOW_TOP + this.off_y * 1
            );
          this.title.push(temp);
        }
        break;
    }
  }

  setup_ui() {
    this.achievement = new ImageButton(
      this.images['achievement'].img,
      { x: 0, y: 0 },
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
      true
    );
    this.social = new ImageButton(
      this.images['social'].img,
      { x: 0, y: 0 },
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
      true
    );

    this.new_game = new TextButton(
      'Start',
      { x: 0, y: 0},
      { x: BUTTON_WIDTH, y: BUTTON_HEIGHT },
    );
    this.sandbox = new TextButton(
      'Sandbox',
      { x: 0, y: 0},
      { x: BUTTON_WIDTH, y: BUTTON_HEIGHT },
    );
    this.settings = new TextButton(
      'Settings',
      { x: 0, y: 0},
      { x: BUTTON_WIDTH, y: BUTTON_HEIGHT },
    );

    this.buttons = [];
    this.buttons.push(this.new_game);
    this.buttons.push(this.sandbox);
    this.buttons.push(this.settings);
    this.buttons.push(this.achievement);
    this.buttons.push(this.social);
    this.resize();
  }

  // p5js
  update() {
    super.update();
    switch (this.background) {
      case BACKGROUND_MATRIX:
        this.update_matrix();
        break;
      case BACKGROUND_ALIVE:
        for (const v of this.title) v.update();
        break;
    }

  }

  mouseClicked() {
    if (this.new_game.hover()) return STATE_TEAM_EDITOR;
    if (this.achievement.hover()) return STATE_ACHIEVEMENT;
    if (this.sandbox.hover()) return STATE_SANDBOX;
    if (this.settings.hover()) return STATE_SETTINGS;
  }

  resize() { 
    this.achievement.resize(
      WINDOW_LEFT + (SQUARE_BUTTON * .5) + 20, WINDOW_BOTTOM - 25 - 20,
    );
    this.social.resize(
      WINDOW_RIGHT - (SQUARE_BUTTON * .5) - 20, WINDOW_BOTTOM - 25 - 20,
    );
    this.new_game.resize(
      0, WINDOW_TOP + (this.off_y * 2.5),
    );
    this.sandbox.resize(
      0, WINDOW_TOP + (this.off_y * 3.5),
    );
    this.settings.resize(
      0, WINDOW_TOP + (this.off_y * 4.5),
    );
  }

  // Draw
  draw_background() {
    switch (this.background) {
      case BACKGROUND_MATRIX:
        this.draw_title();
        this.draw_matrix();
        break;
      case BACKGROUND_ALIVE:
        for (const v of this.title) v.draw();
        break;
    }
    this.current_delay += deltaTime / 1000;
    if (this.current_delay > this.delay) {
      this.current_delay = 0;

      if (mouseIsPressed) this.interact();
    }
  }

  draw_title() {
    push();
    textSize(CHARACTER_SIZE * 2);
    text(GAME_TITLE, 0, WINDOW_TOP + this.off_y * 1);
    pop();
  }

  draw_matrix() {
    push();
    for (const c of this.matrix) {
      SECOND_COLOR.setAlpha(c.alpha);
      push();
      translate(c.pos.x, c.pos.y);
      rotate(c.rot);
      text(c.char, 0, 0);
      pop();
    }
    SECOND_COLOR.setAlpha(255);
    pop();
  }

  // Update
  update_matrix() {
    for (const c of this.matrix) {
      if (c.delay > 0) {
        c.delay -= deltaTime / 1000;
        continue;
      }

      c.pos.add(c.vel.copy().mult(deltaTime / 10));
      c.vel.y += 0.1;
      c.rot += c.rot_vel;
      c.alpha = 255 * (((height * .5) - c.pos.y) / height);

      if (c.pos.x < WINDOW_LEFT || c.pos.x > WINDOW_RIGHT)
        c.vel.x = -c.vel.x;

      if (c.pos.y > WINDOW_BOTTOM) {
        c.pos.x = random(WINDOW_LEFT, WINDOW_RIGHT);
        c.pos.y = WINDOW_TOP - CHARACTER_SIZE;
        c.vel.x = 0;
        c.vel.y = 0;
        c.rot = 0;
        c.alpha = 255;
      }

    }
  }

  interact() {
    const mouse = createVector(MOUSE_X, MOUSE_Y),
          is_matrix = this.background === BACKGROUND_MATRIX;

    let array = (is_matrix) ? this.matrix : this.title;

    for (const v of array) {
      const pos = (is_matrix) ? v.pos : v.attributes.pos;
      //if (mouse.dist(pos) > 100) continue;
      if (distSquared(mouse.x, mouse.y, pos.x, pos.y)> 10000) continue;
      if (is_matrix)
        v.vel
          .add(
            mouse.copy().sub(pos)
              .normalize()
              .mult(-5)
          );
      else
        v.attributes.vel.add(
          mouse.copy().sub(pos)
            .normalize()
            .mult(-10)
        );
    }
  }
}