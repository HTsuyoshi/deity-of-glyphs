
//p5.disableFriendlyErrors = true;

// Variables
let game,
  WINDOW_TOP,
  WINDOW_BOTTOM,
  WINDOW_LEFT,
  WINDOW_RIGHT,
  MOUSE_X,
  MOUSE_Y,
  MAIN_COLOR,
  MAIN_COLOR_SHADOW,
  MAIN_COLOR_DARKER,
  SECOND_COLOR,
  TEAM_COLOR,
  BULLET_COLOR,
  BULLET_COMPLEMENTARY_COLOR,
  COLORS,
  MOBILE;

let framerateP; //REMOVE

// p5.js functions
async function setup() {
  noLoop();
  COLORS = [
    { // Yellow
      main: color(255, 204, 0),
      shadow: color(240, 152, 22),
      second: color(255),
      bullet: color(255,100,100),
      bullet_complementary: color(255,100,255),
      dead: color(255, 94, 56),
      upgrade: color(184, 255, 159),
      team: color(123, 176, 247),
      inverted: false,
    },
    { // Dark
      main: color(30, 30, 30),
      shadow: color(0, 0, 0),
      second: color(255),
      bullet: color(255,100,100),
      bullet_complementary: color(255,100,255),
      dead: color(255, 94, 56),
      upgrade: color(255, 204, 0),
      team: color(100, 100, 255),
      inverted: false,
    },
    { // Purple
      main: color(200, 100, 255),
      shadow: color(140, 70, 200),
      second: color(255),
      bullet: color(80,228,155),
      bullet_complementary: color(14, 105, 27),//255, 172, 0),
      dead: color(255, 70, 50),
      upgrade: color(160, 255, 120),
      team: color(130, 180, 255),
      inverted: false,
    },
    { // Purple inverted
      main: color(55, 155, 0),
      shadow: color(115, 185, 55),
      second: color(255),
      bullet: color(255,100,100),
      bullet_complementary: color(255,100,255),
      dead: color(0, 185, 205),
      upgrade: color(95, 0, 135),
      team: color(125, 75, 0),
      inverted: true,
    },
    { // Pink Pastel
      main: color(245,202,195),
      shadow: color(192, 130, 156),
      second: color(255),
      bullet: color(242,130,130),
      bullet_complementary: color(132,160,160),
      dead: color(255, 94, 56),
      upgrade: color(255, 246, 179),
      team: color(123, 176, 247),
      inverted: false,
    },
    { // Lime
      main: color(137, 216, 55),
      shadow: color(75, 150, 0),
      second: color(255),
      bullet: color(255, 130, 90),
      bullet_complementary: color(255, 130, 255),
      dead: color(255, 90, 60),
      upgrade: color(255, 246, 179),
      team: color(150, 150, 255),
      inverted: false,
    },
  ];
  setup_colors(false);

  // Old Preload
  const audio_folder = '/audio',
        image_folder = '/images',
        font_folder = '/font';

  // Setup
  createCanvas(windowWidth, windowHeight, WEBGL); 
  pixelDensity(1);
  setAttributes({
    antialias: false,
    depth: false,
    premultipliedAlpha: false
  });
  noSmooth();
  curveDetail(3);
  describe('A game about characters fighting each other.');

  frameRateP = createP();// REMOVE

  // Game Logic
  update_constants();
  update_mouse();
  SMALL_SCREEN = small_screen();
  MOBILE = isMobile();

  game = new Game();
  await game.setup(audio_folder, image_folder, font_folder);
  // REMOVE
  //game.restore_save();
  loop();
}

function draw() {
  if (SMALL_SCREEN) {
    push();
    background(MAIN_COLOR);
    text('Screen too small', 0, 0);
    pop();
    return;
  }

  frameRateP.html(round(frameRate()));// REMOVE

  if (!MOBILE) update_mouse();
  game.draw();
  if (COLORS[CURRENT_COLORS].inverted)
    filter(INVERT);
}

function mouseClicked() {
  if (SMALL_SCREEN) return;
  if (MOBILE) return;
  game.mouseClicked();
}

function mouseMoved() {
  if (SMALL_SCREEN) return;
  if (MOBILE) return;
  game.mouseMoved();
}

function mousePressed() {
  if (SMALL_SCREEN) return;
  if (!MOBILE) return;
  update_mouse();
}

function mouseDragged() {
  if (SMALL_SCREEN) return;
  if (!MOBILE) return;
  update_mouse();
  game.touchMoved();
}

function mouseReleased(){
  if (SMALL_SCREEN) return;
  if (!MOBILE) return;
  update_mouse();
  game.mouseClicked();
  game.touchEnded();
  MOUSE_X = WINDOW_LEFT - 1000;
  MOUSE_Y = WINDOW_TOP - 1000;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  update_constants();
  game.resize();
  if (small_screen()) SMALL_SCREEN = true;
  else SMALL_SCREEN = false;
}

// Game Logic
function update_constants() {
  WINDOW_TOP = -height/2;
  WINDOW_BOTTOM = height/2;
  WINDOW_LEFT = -width/2;
  WINDOW_RIGHT = width/2;
}

function update_mouse() {
  MOUSE_X = mouseX + WINDOW_LEFT;
  MOUSE_Y = mouseY + WINDOW_TOP;
}