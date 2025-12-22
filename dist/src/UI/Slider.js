class Slider extends Prop {
  constructor(text, pos, length, value) {
    super();
    this.text = text;
    this.pos = pos;
    this.size = { x: length, y: 10 };

    this.gap = SHADOW_GAP;
    this.gap_max = SHADOW_GAP;

    this.bar = length * value;
    this.hover_bar = 0;
  }

  get value() {
    return this.bar / this.size.x;
  }

  draw() {
    push();
    strokeWeight(STROKE_WEIGHT);

    noFill();
    translate(0, 0, -5);
    stroke(MAIN_COLOR_SHADOW);
    rect(
      this.pos.x - (this.size.x  * .5) + this.gap,
      this.pos.y + this.gap,
      this.size.x,
      this.size.y
    );
    noStroke();
    fill(MAIN_COLOR_SHADOW);
    rect(
      this.pos.x - (this.size.x * .5) + this.gap,
      this.pos.y + this.gap,
      this.bar,
      this.size.y
    );
    translate(0, 0, 5);


    if (this.hover()) {
      noStroke();
      fill(lerpColor(SECOND_COLOR, MAIN_COLOR, 0.5));
      rect(
        this.pos.x - (this.size.x * .5) - this.gap,
        this.pos.y - this.gap,
        this.hover_bar,
        this.size.y
      );
    }

    noStroke();
    fill(SECOND_COLOR);
    rect(
      this.pos.x - (this.size.x * .5) - this.gap,
      this.pos.y - this.gap,
      this.bar,
      this.size.y
    );
    text(
      this.text,
      this.pos.x + (textWidth(this.text) * .5) - (this.size.x  * .5) - this.gap,
      this.pos.y - this.gap - 3 - (this.size.y * 4)
    );
    noFill();
    stroke(SECOND_COLOR);
    rect(
      this.pos.x - (this.size.x  * .5) - this.gap,
      this.pos.y - this.gap,
      this.size.x,
      this.size.y
    );
    pop();
  }

  update() {
    if (this.hover()) {
      if (this.gap > 0) this.gap -= 1;
      if (MOUSE_X < 0) this.hover_bar = MOUSE_X - this.pos.x + (this.size.x * .5);
      else this.hover_bar = this.size.x + MOUSE_X - this.pos.x - (this.size.x * .5);
      return;
    }
    if (this.gap < this.gap_max) this.gap += 1;
  }

  mouseClicked(){ 
    if (this.hover()) this.bar = this.hover_bar;
  }

  resize(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }
}