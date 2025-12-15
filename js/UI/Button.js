class GeneralButton extends Prop {
  constructor(pos, size, active) {
    super();
    this.pos = pos;
    this.size = size;
    this.active = active;
    //TODO: Buttons changing colr only in settings
    this.gap_max = SHADOW_GAP;
    this.gap = 0;
    this.on_top = false;

    this.layer = createFramebuffer();
    this.layer.resize(
      ceil(this.size.x + ((STROKE_WEIGHT + SHADOW_GAP) * 2)),
      ceil(this.size.y + ((STROKE_WEIGHT + SHADOW_GAP) * 2))
    );
    this.layer_img = null;
  }

  // p5js
  draw() {
    if (this.gap === SHADOW_GAP) {
      image(
        this.layer_img,
        this.pos.x - (this.layer_img.width * .5),
        this.pos.y - (this.layer_img.height * .5),
      );
    } else {
      this.draw_button();
    }
  }

  resize(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  update() {
    if (this.on_top) {
      if (this.gap > 0) this.gap -= 1;
    } else {
      if (this.active && (this.gap < this.gap_max)) this.gap += 1;
    }

    if (this.layer_img === null &&
      this.gap === SHADOW_GAP) this.freeze();
      //else if (!this.active && this.gap === 0) this.freeze();
  }

  freeze() { 
    this.layer.begin();
    clear();
    const old_x = this.pos.x,
      old_y = this.pos.y;
    this.pos.x = 0;
    this.pos.y = 0;
    this.draw_button();
    this.pos.x = old_x;
    this.pos.y = old_y;
    this.layer.end();
    this.layer_img = this.layer.get();
  }

  mouseMoved () { this.update_button(); }
  touchStarted() { this.update_button(); }
  touchMoved() { this.update_button(); }
  touchEnded() { this.update_button(); }

  update_button() {
    if (this.active) {
      if (this.hover()) this.on_top = true;
      if (!this.hover()) this.on_top = false;
    }
  }

  // Draw
  draw_button() {
    push();
    noFill();
    if (this.gap > 0) {
      translate(0, 0, -5);
      stroke(MAIN_COLOR_SHADOW);
      rect(
        this.pos.x - (this.size.x / 2) + this.gap,
        this.pos.y - (this.size.y / 2) + this.gap,
        this.size.x,
        this.size.y
      );
      translate(0, 0, 5);
    }
    if (this.active) {
      stroke(SECOND_COLOR);
      rect(
        this.pos.x - (this.size.x / 2) - this.gap,
        this.pos.y - (this.size.y / 2) - this.gap,
        this.size.x,
        this.size.y
      );
    } else if (this.gap === 0) {
      stroke(MAIN_COLOR_SHADOW);
      rect(
        this.pos.x - (this.size.x / 2),
        this.pos.y - (this.size.y / 2),
        this.size.x,
        this.size.y
      );
    }
    pop();
  }

  draw_content() {}
}

class TextButton extends GeneralButton {
  constructor(text, pos, size, active = true) {
    super(pos, size, active);
    this.text = text;
  }

  draw_button() {
    push();
    noStroke();
    fill(MAIN_COLOR);
    translate(0, 0, -5);
    rect(
      this.pos.x - (this.size.x / 2) - this.gap,
      this.pos.y - (this.size.y / 2) - this.gap,
      this.size.x,
      this.size.y
    );
    pop();
    this.draw_content();
    super.draw_button();
  }

  draw_content() {
    textAlign(CENTER);
    if (this.active) {
      text(
        this.text,
        this.pos.x - this.gap,
        this.pos.y - this.gap - (CHARACTER_SIZE * .1)
      );
      return;
    }
    push();
    stroke(MAIN_COLOR);
    fill(MAIN_COLOR_SHADOW);
    text(
      this.text,
      this.pos.x,
      this.pos.y - (CHARACTER_SIZE * .1)
    );
    pop();
  }
}

class ImageButton extends GeneralButton {
  constructor(image, pos, size, active = true) {
    super(pos, size, active);
    this.image = image;
    this.image_x = this.size.x - STROKE_WEIGHT;
    this.image_y = this.size.y - STROKE_WEIGHT;
  }

  draw_button() {
    push();
    noStroke();
    fill(MAIN_COLOR);
    translate(0, 0, -5);
    rect(
      this.pos.x - (this.size.x / 2) - this.gap,
      this.pos.y - (this.size.y / 2) - this.gap,
      this.size.x,
      this.size.y
    );
    pop();
    super.draw_button();
    this.draw_content();
  }

  draw_content() {
    // TODO: Fix images in achievements screen buttons
    if (this.active) {
      image(
        this.image,
        this.pos.x - (this.size.x * .5) - this.gap,
        this.pos.y - (this.size.y * .5) - this.gap,
        this.size.x,
        this.size.y
      );
      return;
    }
    push();
    tint(255,127);
    image(
      this.image,
      this.pos.x - (this.size.x * .5),
      this.pos.y - (this.size.y * .5),
      this.size.x,
      this.size.y
    );
    pop();
  }
}