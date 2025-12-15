class Game {
  constructor() {
    // Game UI Settings
    this.font_size = 32;

    // Constants
    this.save_name = 'save';

    // Variables
    this.state = STATE_MENU;
    this.screen = [];
    this.screen.push(new Menu());
    this.screen.push(new TeamEditor());
    this.screen.push(new TeamViewEditor());
    this.screen.push(new Battle());
    this.screen.push(new BattleMenu());
    this.screen.push(new TeamView());
    this.screen.push(new Upgrade());
    this.screen.push(new Settings());
    this.screen.push(new SandBox());
    this.screen.push(new Achievement());
    this.screen.push(new Traits());

    this.popup = [];
    //this.screen.push(new MockBattle());

    for (let i=0; i<TEAM_SIZE; i++) {
      team.push(new Char(PLAYER_TEAM, random(VOWELS)));
    }

    enemy_team.push(new Char(ENEMY_TEAM, random(VOWELS)));
    enemy_team.push(new Char(ENEMY_TEAM, random(CONSONANTS)));
    enemy_team.push(new Char(ENEMY_TEAM, random(NUMBERS)));
    enemy_team.push(new Char(ENEMY_TEAM, random(SPECIALS)));
    setup_achievements();

    this.sounds = {};
    this.images = {};
  }

  async setup(audio_folder, image_folder, font_folder) {
    // UI Settings
    this.font = await loadFont(`${font_folder}/ark-pixel-10px-monospaced-latin.ttf`);
    textAlign(CENTER, CENTER);
    textFont(this.font);
    textSize(this.font_size);
    textWrap(WORD);

    strokeWeight(STROKE_WEIGHT);
    strokeJoin(MITER);
    stroke(SECOND_COLOR);
    fill(SECOND_COLOR);

    // Old load
    for (const v of Object.values(this.screen))
      v.load(audio_folder, image_folder);
    const images_load = {
      star_1: 'particles/star_1.png',
      star_2: 'particles/star_2.png',
    };
    for (const k in images_load)
      this.images[k] = await loadImage(`${image_folder}/${images_load[k]}`);

    for (const v of Object.values(this.screen))
      v.setup();
    // Restore save
    //if(localStorage.getItem('save')) {
    //  this.restore_save();
    //}

    // Setup Achievements
    setup_achievements();
  }

  draw() {
    background(MAIN_COLOR)
    //if (this.screen[STATE_BATTLE].pause) background(lerpColor(MAIN_COLOR, MAIN_COLOR_SHADOW, 0.5));

    switch(this.state) {
      case STATE_MENU:
        this.screen[STATE_MENU].update();
        this.screen[STATE_MENU].draw();
        break;

      case STATE_BATTLE:
        if (!this.screen[STATE_BATTLE].pause);
          this.screen[STATE_BATTLE].update();
        this.screen[STATE_BATTLE].draw();
        break;

      case STATE_BATTLE_MENU:
        if (!this.screen[STATE_BATTLE].pause)
          this.screen[STATE_BATTLE].update();
        this.screen[STATE_BATTLE].draw();
        this.screen[STATE_BATTLE_MENU].update();
        this.screen[STATE_BATTLE_MENU].draw();
        break;

      case STATE_TEAM_VIEW:
        if (!this.screen[STATE_BATTLE].pause)
          this.screen[STATE_BATTLE].update();
        this.screen[STATE_BATTLE].draw();
        this.screen[STATE_TEAM_VIEW].update();
        this.screen[STATE_TEAM_VIEW].draw();
        break;

      case STATE_UPGRADE:
        if (!this.screen[STATE_BATTLE].pause);
          this.screen[STATE_BATTLE].update();
        this.screen[STATE_BATTLE].draw();
        this.screen[STATE_UPGRADE].update();
        this.screen[STATE_UPGRADE].draw();
        break;

      default:
        this.screen[this.state].update();
        this.screen[this.state].draw();
        break;
    }

    if (this.popup.length > 0) {
      this.popup[0].update();
      this.popup[0].draw();
      if (this.popup[0].finished()) this.popup.splice(0, 1);
    }
  }

  // p5js
  resize() {
    for (const v of Object.values(this.screen)) v.resize();
    if (this.popup.length > 0)
      this.popup[0].resize();
  }

  mouseMoved() { this.screen[this.state].mouseMoved(); }
  mouseClicked() {
      this.popup = this.screen[STATE_ACHIEVEMENT].verify_achievements();
    let next_state = this.screen[this.state].mouseClicked();
    this.save();
    if (next_state === undefined) return;
    if (this.state === STATE_ACHIEVEMENT)
        setup_achievements();
    if (this.state === STATE_BATTLE &&
      this.screen[STATE_BATTLE].winner === PLAYER_TEAM &&
      this.screen[STATE_BATTLE].wave === WAVE_QUANTITY) {
      this.popup = this.screen[STATE_ACHIEVEMENT].verify_achievements();
      next_state = STATE_MENU;
      this.screen[STATE_BATTLE] = new Battle();
    }
    if (this.state === STATE_UPGRADE) {
      this.screen[STATE_BATTLE].setup_entities();
    }
    switch(next_state) {
      case STATE_MENU:
        this.screen[next_state].setup();
        break;
      case STATE_BATTLE:
        if (this.state === STATE_BATTLE_MENU ||
          this.state === STATE_TEAM_VIEW) {
          this.screen[next_state].pause = false;
          break;
        }
        bullets = [];
        particles = [];
        this.screen[next_state].setup();
        this.screen[next_state].reset();
        break;
      case STATE_UPGRADE:
        this.screen[next_state].reset_upgrades();
        break;
    }
    this.screen[next_state].setup_ui();
    this.state = next_state;
  }

  touchStart() { this.screen[this.state].touchStart(); }
  touchMoved() { this.screen[this.state].touchMoved(); }
  touchEnded() { this.screen[this.state].touchEnded(); }

  // Game Logic
  save() {
    const save = JSON.stringify(
      {
        'current_colors': CURRENT_COLORS,
        'achievements_status': ACHIEVEMENTS_STATUS,
        'achievements_unlocked': ACHIEVEMENTS_UNLOCKED
      }
    );
    localStorage.setItem('save', save);
  }

  has_save() { return localStorage.getItem('save') !== null; }

  restore_save() {
    if (!this.has_save()) return;
    const save = JSON.parse(localStorage.getItem('save'));
    CURRENT_COLORS = save.current_colors;
    ACHIEVEMENTS_STATUS = save.achievements_status;
    ACHIEVEMENTS_UNLOCKED = save.achievements_unlocked;
  }
}