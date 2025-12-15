class Carrousel extends Prop {
  // TODO: Intro animation
  constructor(pos, set, size) {
    super();
    this.pos = pos;
    this.set = set;
    this.size = size;

    this.index = 0;
    this.hover = 0;
    this.config = {
      quantity: 4,
      info: false,
      effects: false,
    }
    if (this.set.length > 0)
      if (this.set[0] instanceof Char)
        this.config.info = true

    if (isMobile())
      this.last_touch_x = 0;
  }

  draw() {
    if (this.config.info) this.draw_info();
    if (this.config.effects) this.draw_effects();

    for (let i = floor(this.index) - this.config.quantity;
      i < this.index + this.config.quantity + 1;
      i++) {
      if (i < 0 || i >= this.set.length) continue;
      this.draw_char(this.index - i, i);
    }
  }

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

  draw_effects() {
    for (let i = floor(this.index) - this.config.quantity;
      i < this.index + this.config.quantity + 1; i++) {
      if (i < 0 || i >= this.set.length) continue;
      const offset = this.index - i;
      push();
      textSize(this.size / (1 + abs(offset)));
      fill(color(255, 100, 100, 150 - abs(offset * 255 / 4)));
      text(
        (this.set[i] instanceof Char) ?
          this.set[i].char : this.set[i],
        this.pos.x - (offset * 150) + 10,
        this.pos.y - 10
      );
      fill(color(150, 100, 255, 150 - abs(offset * 255 / 4)));
      text(
        (this.set[i] instanceof Char) ?
          this.set[i].char : this.set[i],
        this.pos.x - (offset * 150) - 10,
        this.pos.y + 10
      );
      pop();
    }
  }

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

  update() {
    if (!isMobile()) {
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
      if (MOUSE_X > (WINDOW_RIGHT - (width * .2)) &&
        MOUSE_Y < (this.pos.y + this.size * ( 72 / 96 ) * .5) &&
        MOUSE_Y > (this.pos.y - this.size * ( 72 / 96 ) * .5) &&
        this.index < (this.set.length - 1)) {
        this.hover += deltaTime / 1000;
        this.index += .05 + (this.hover * .3);
        return;
      }

      if (MOUSE_X < (WINDOW_LEFT + (width * .2)) &&
        MOUSE_Y < (this.pos.y + this.size * ( 72 / 96 ) * .5) &&
        MOUSE_Y > (this.pos.y - this.size * ( 72 / 96 ) * .5) &&
        this.index > 0) {
        this.hover += deltaTime / 1000;
        this.index -= .05 + (this.hover * .3);
        return;
      }
    }

    this.hover = 0;
    const mod = this.index % 1;
    if (mod > 0.5) this.index += (mod * .03);
    else this.index -= (mod * .03);
  }

  touchStart() { this.last_touch_x = MOUSE_X; }

  touchMoved() {
    if (this.last_touch_x === null) {
      this.last_touch_x = MOUSE_X;
      return;
    }
    if (MOUSE_Y > (this.pos.y + this.size * ( 72 / 96 ) * .5) ||
      MOUSE_Y < (this.pos.y - this.size * ( 72 / 96 ) * .5))
      return;

    this.index += (this.last_touch_x - MOUSE_X) / 100;
    if (this.index > (this.set.length - 1)) this.index = this.set.length - 1.001; // Dont remove this .001 its purpose is to show the last index
    if (this.index < 0) this.index = 0;
    this.last_touch_x = MOUSE_X;
  }

  touchEnded() { this.last_touch_x = null; }

  resize(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  current_char() {
    return this.set[round(this.index)];
  }
}
