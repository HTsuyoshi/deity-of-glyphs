class Screen {
  constructor() {
    //this.background;
    //this.background_front;

    this.images = {};
    this.buttons = [];
  }

  async load(audio_folder, image_folder) {
    for (const k in this.images)
      this.images[k].img = await loadImage(`${image_folder}/${this.images[k].src}`);
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
    //if(Object.keys(this.animations).length > 0) this.update_animation(this.animations);
    //if(this.combos.length > 0) this.update_animation(this.combos);
  }

  resize() {}

  mouseClicked () {}
  mouseMoved () { for (const v of Object.values(this.buttons)) v.mouseMoved() }
  
  touchStart() { for (const v of Object.values(this.buttons)) v.touchStart()}
  touchMoved() { for (const v of Object.values(this.buttons)) v.touchMoved()}
  touchEnded() { for (const v of Object.values(this.buttons)) v.touchEnded()}

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

  // Update
  update_animation(list, duration = 1) {
    //for (const k of Object.keys(list)) {
    //  if (list[k].animation < duration) {
    //    list[k].animation += deltaTime / 1000 * .001;
    //    if (list[k].animation > duration)
    //      list[k].animation = duration;
    //  }
    //};
  }
}