class Screen {
  constructor() {
    //this.background;
    //this.background_front;

    this.images = {};
    this.buttons = [];
  }

  load(image_folder) {
    for (const k in this.images)
      if ('src' in this.images[k])
        this.images[k].img = loadImage(`${image_folder}/${this.images[k].src}`);
  }

  setup() { this.setup_ui(); }

  setup_ui() {}

  // p5js
  draw() {
    for (const v of Object.values(this.buttons)) v.draw();
    this.draw_background();
  }

  update() {
    for (const b of this.buttons) b.update();
  }

  resize() {}

  mouseClicked () {}
  mouseMoved () {
    for (const v of Object.values(this.buttons)) v.mouseMoved()
  }
  
  touchStarted() { for (const v of Object.values(this.buttons)) v.touchStarted() }
  touchMoved() { for (const v of Object.values(this.buttons)) v.touchMoved() }
  touchEnded() { 
    for (const v of Object.values(this.buttons)) v.touchEnded()
    return this.mouseClicked();
  }

  // Draw
  draw_background() {
    //image(this.background,
    //  -this.background.width * 0.5,
    //  -this.background.height * 0.5,
    //  this.background.width,
    //  this.background.height
    //);
    //image(this.background_front,
    //  (MOUSE_X*0.01) -this.background.width * 0.5,
    //  (MOUSE_Y*0.01) -this.background.height * 0.5,
    //  this.background.width,
    //  this.background.height
    //);
  }
}