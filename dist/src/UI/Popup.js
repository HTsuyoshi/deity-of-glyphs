class Popup extends Prop {
  constructor(text, img) {
    super();
    this.gap = 10;
    this.initial_pos;
    this.final_pos;
    this.resize();
    this.pos = this.initial_pos.copy();

    this.size = createVector(BUTTON_WIDTH, BUTTON_HEIGHT);
    this.text = text;
    this.icon = img;

    this.animation = {
      intro: 1.0,
      delay: 1.0,
      outro: 1.0,
    };
    this.current_animation = {
      intro: 0,
      delay: 0,
      outro: 0,
    }
    this.layer = createFramebuffer();
    this.layer.resize(
      (this.size.x + STROKE_WEIGHT),
      (this.size.y + STROKE_WEIGHT)
    );
    this.layer_img = null;
  }

  // p5js
  draw() {
    let x = - (this.layer_img.width * .5) + ((this.pos.x > 0) ? .5 : -.5) * (width - this.layer_img.width);
    let y = - (this.layer_img.height * .5) + ((this.pos.y > 0) ? .5 : -.5) * (height - this.layer_img.height) ;
    image(
      this.layer_img,
      this.pos.x - (this.layer_img.width * .5),
      this.pos.y - (this.layer_img.height * .5),
    );
  }

  resize() {
    this.initial_pos = createVector(
      WINDOW_RIGHT - (BUTTON_WIDTH * .5) - this.gap,
      WINDOW_TOP - (BUTTON_HEIGHT * .5) - this.gap,
    );
    this.final_pos = createVector(
      WINDOW_RIGHT - (BUTTON_WIDTH * .5) - this.gap,
      WINDOW_TOP + (BUTTON_HEIGHT * .5) + this.gap,
    );
  }

  update() {
    if (this.layer_img === null) this.freeze();
    if (this.current_animation.intro < this.animation.intro) {
      this.current_animation.intro += deltaTime / 1000;
      this.pos = p5.Vector.lerp(this.initial_pos, this.final_pos, easeOutElastic(this.current_animation.intro));
    } else if (this.current_animation.delay < this.animation.delay) {
      this.current_animation.delay += deltaTime / 1000;
      this.pos = this.final_pos;
    } else if (this.current_animation.outro < this.animation.outro) {
      this.current_animation.outro += deltaTime / 1000;
      this.pos = p5.Vector.lerp(this.final_pos, this.initial_pos, easeOutElastic(this.current_animation.outro));
    }
  }

  freeze() {
    this.layer.begin();
    clear();
    const old_x = this.pos.x,
      old_y = this.pos.y;
    this.pos.x = 0;
    this.pos.y = 0;
    this.draw_popup();
    this.pos.x = old_x;
    this.pos.y = old_y;
    this.layer.end();
    this.layer_img = this.layer.get();
  }

  // Draw
  draw_popup() {
    push();
    fill(MAIN_COLOR_SHADOW);
    rect(
      this.pos.x - (this.size.x * .5),
      this.pos.y - (this.size.y * .5),
      this.size.x,
      this.size.y
    );
    const icon_size = BUTTON_HEIGHT - 20;
    noStroke();
    fill(MAIN_COLOR);
    rect(
      this.pos.x + this.gap - (this.size.x * .5),
      this.pos.y - (icon_size * .5),
      icon_size,
      icon_size
    );
    image(
      this.icon,
      this.pos.x + this.gap - (this.size.x * .5),
      this.pos.y - (icon_size * .5),
      icon_size,
      icon_size
    );

    fill(SECOND_COLOR);
    textAlign(LEFT);
    textSize(CHARACTER_SIZE * .8);
    textWrap(WORD);
    text(
      this.text,
      this.pos.x - (this.size.x * .5) + (icon_size) + (this.gap * 2),
      this.pos.y - 5,
      this.size.x - (icon_size) - (this.gap * 2)
    );
    pop();
  }

  // Game Logic
  finished() {
    if (this.current_animation.outro >= this.animation.outro) return true;
    return false;
  }
}