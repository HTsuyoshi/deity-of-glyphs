class Carrousel extends Prop {
  constructor(pos, set, size) {
    super();
    this.pos = pos;
    this.set = set;
    this.size = size;

    this.index = 0;
    this.scroll = 0;
    this.config = {
      quantity: 4,
      info: false,
      effects: false,
    };

    if (this.set.length > 0)
      if (this.set[0] instanceof Char)
        this.config.info = true;

    if (MOBILE) {
      this.move_char = false;
    }
  }

  // p5js
  draw() {
    if (this.config.info) this.draw_info();
  }

  update() {
    // DEBUG: Hover area
    //push();
    //fill(SECOND_COLOR);
    //rect(
    //  WINDOW_LEFT,
    //  (this.pos.y - this.size * ( 72 / 96 ) * .5),
    //  width * .2,
    //  this.size * ( 72 / 96 ),
    //);
    //pop();
    if (!MOBILE) {
      if (this.hover() &&
        MOUSE_X > (WINDOW_RIGHT - (width * .2)) &&
        this.index < (this.set.length - 1)) {
        this.scroll += deltaTime / 1000;
        this.index += .05 + (this.scroll * .3);
        return;
      }

      if (this.hover() &&
        MOUSE_X < (WINDOW_LEFT + (width * .2)) &&
        this.index > 0) {
        this.scroll += deltaTime / 1000;
        this.index -= .05 + (this.scroll * .3);
        return;
      }
    }

    this.scroll = 0;
    const mod = this.index % 1;
    if (mod > 0.5) this.index += (mod * .03);
    else this.index -= (mod * .03);
  }

  touchStarted() {
    if (this.hover())
      this.move_char = true;
  }

  touchMoved() {
    if (!this.move_char) return;
    if (!this.hover())
      return;

    this.index += ((pmouseX + WINDOW_LEFT) - MOUSE_X) / 100;
    if (this.index > (this.set.length - 1)) this.index = this.set.length - 1.001; // Dont remove this .001 its purpose is to show the last index
    if (this.index < 0) this.index = 0;
  }

  touchEnded() {
    if (this.move_char) this.move_char = false;
  }

  resize(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  // Draw
  draw_char() {}

  draw_info() {
    // Team index
    let index = ceil(this.index)
    if (index === 0) index = 1;
    if (index === this.set.length) index = this.set.length;

    push();
    textSize(CHARACTER_SIZE * 2);
    fill(MAIN_COLOR_SHADOW);
    text(
      `${index}/${this.set.length}`,
      this.pos.x + SHADOW_GAP,
      this.pos.y - (this.size * .53) + SHADOW_GAP
    )

    fill(SECOND_COLOR);
    text(
      `${index}/${this.set.length}`,
      this.pos.x - SHADOW_GAP,
      this.pos.y - (this.size * .53) - SHADOW_GAP
    )
    pop();
  }

  // Game Logic
  current_char() {
    return this.set[round(this.index)];
  }

  hover() {
    if (MOUSE_Y < (this.pos.y + this.size * ( 72 / 96 ) * .5) &&
      MOUSE_Y > (this.pos.y - this.size * ( 72 / 96 ) * .5))
      return true;
    return false;
  }
}

class EditorCarrousel extends Carrousel {
  constructor(pos, set, size) {
    super(pos, set, size);
    if (MOBILE) {
      this.select_char = false;
      this.select_char_pos = { x: 0, y: 0 };
      this.select_char_rot = 0;
    }
  }

  // p5js
  draw() {
    super.draw();

    for (let i = floor(this.index) - this.config.quantity;
      i < this.index + this.config.quantity + 1;
      i++) {
      if (i < 0 || i >= this.set.length) continue;
      if (MOBILE)
      if (this.select_char &&
        i === floor(this.index)) {
        const old_x = this.pos.x,
          old_y = this.pos.y;
        this.pos.x = MOUSE_X + this.select_char_pos.x;
        this.pos.y = MOUSE_Y + this.select_char_pos.y;
        this.draw_char(this.index - i, i, old_y);
        this.pos.x = old_x;
        this.pos.y = old_y;
        continue;
      }
      this.draw_char(this.index - i, i);
    }
  }

  touchStarted() {
    if (!this.hover())
      return;

    if (MOUSE_X < ((this.size * ( 72 / 96 ) * .5) + (CHARACTER_SIZE * .5)) &&
      MOUSE_X > ((- this.size * ( 72 / 96 ) * .5) - (CHARACTER_SIZE * .5))) {
      this.select_char = true;
      this.select_char_pos = {
        x: this.pos.x - MOUSE_X,
        y: this.pos.y - MOUSE_Y,
      }
      return;
    }
    super.touchStarted();
  }

  touchMoved() {
    if (this.select_char) {
      this.select_char_rot = (mouseX - pmouseX) / 100;
      return;
    }
    super.touchMoved();
  }

  touchEnded() {
    super.touchEnded();
    if (this.select_char) {
      this.select_char = false;
      return true;
    }
    return false;
  }

  // Draw
  draw_char(offset, i, old_y = 0) {
    // TODO: Refactor
    let c = this.set[i];
    push();
    textSize(this.size / (1 + abs(offset)));
    if (MOBILE)
    if (this.select_char && i === floor(this.index)){ 
      const div = ((old_y - (height * .5)) / (MOUSE_Y - (height * .5)))
      textSize(max(this.size / div, this.size));
    }

    MAIN_COLOR_SHADOW.setAlpha(255 - abs(offset * 255 / this.config.quantity));
    fill(MAIN_COLOR_SHADOW);
    translate(this.pos.x, this.pos.y);
    if (MOBILE)
    if (this.select_char && i === floor(this.index)){ 
      rotate(this.select_char_rot);
    }
    text(
      (c instanceof Char) ? c.char : c,
      - (offset * 150) + SHADOW_GAP + this.size * .05,
      SHADOW_GAP
    );
    MAIN_COLOR_SHADOW.setAlpha(255);

    SECOND_COLOR.setAlpha(255 - abs(offset * 255 / this.config.quantity));
    fill(SECOND_COLOR);
    text(
      (c instanceof Char) ? c.char : c,
      - (offset * 150) - SHADOW_GAP + this.size * .05,
      - SHADOW_GAP
    );
    SECOND_COLOR.setAlpha(255);
    pop();
  }
}

class ViewCarrousel extends Carrousel {
  draw() {
    super.draw();
    for (let i = floor(this.index) - this.config.quantity;
      i < this.index + this.config.quantity + 1;
      i++) {
      if (i < 0 || i >= this.set.length) continue;
      this.draw_char(this.index - i, i);
    }
  }

  // Draw
  draw_char(offset, i) {
    let c = this.set[i];
    push();
    textSize(this.size / (1 + abs(offset)));

    MAIN_COLOR_SHADOW.setAlpha(255 - abs(offset * 255 / this.config.quantity));
    fill(MAIN_COLOR_SHADOW);
    text(
      (c instanceof Char) ? c.char : c,
      this.pos.x - (offset * 150) + SHADOW_GAP + this.size * .05,
      this.pos.y + SHADOW_GAP
    );
    MAIN_COLOR_SHADOW.setAlpha(255);

    SECOND_COLOR.setAlpha(255 - abs(offset * 255 / this.config.quantity));
    fill(SECOND_COLOR);
    if (c instanceof Char) {
      if (c.attributes.current_health == 0) {
        DEAD_COLOR.setAlpha(255 - abs(offset * 255 / this.config.quantity))
        fill(DEAD_COLOR);
        DEAD_COLOR.setAlpha(255);
      }
    }
    text(
      (c instanceof Char) ? c.char : c,
      this.pos.x - (offset * 150) - SHADOW_GAP + this.size * .05,
      this.pos.y - SHADOW_GAP
    );
    SECOND_COLOR.setAlpha(255);
    pop();
  }
}
