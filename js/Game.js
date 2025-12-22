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

    this.background_color = 1.0;

    this.popup = [];
    //this.screen.push(new MockBattle());

    setup_achievements();

    this.sounds = {};
    this.images = {};
  }

  load(audio_folder, image_folder, font_folder) {
    this.font = loadFont(`${font_folder}/ark-pixel-10px-monospaced-latin.ttf`);

    this.screen[STATE_MENU].load(image_folder);
    this.screen[STATE_TEAM_EDITOR].load(image_folder);
    this.screen[STATE_TEAM_EDITOR_INFO].load(image_folder);
    this.screen[STATE_BATTLE].load(image_folder);
    this.screen[STATE_BATTLE_MENU].load(image_folder);
    this.screen[STATE_TEAM_VIEW].load(image_folder);
    this.screen[STATE_UPGRADE].load(image_folder);
    this.screen[STATE_SETTINGS].load(image_folder);
    this.screen[STATE_SANDBOX].load(image_folder);
    this.screen[STATE_ACHIEVEMENT].load(image_folder,
      [
        this.screen[STATE_UPGRADE].images['italic'].img,
        this.screen[STATE_UPGRADE].images['bold'].img,
        this.screen[STATE_UPGRADE].images['uppercase'].img,
        this.screen[STATE_UPGRADE].images['underline'].img,
        this.screen[STATE_UPGRADE].images['sniper'].img,
        this.screen[STATE_UPGRADE].images['sniper'].img,
        //this.screen[STATE_UPGRADE].images['kamikaze'].img,
        this.screen[STATE_UPGRADE].images['explosion'].img,
        this.screen[STATE_UPGRADE].images['laser'].img,
      ]
    );
    this.screen[STATE_TRAITS].load(audio_folder, image_folder);

    const images_load = {
      star: 'particles/star.png',
    };
    for (const k in images_load)
      this.images[k] = loadImage(`${image_folder}/${images_load[k]}`);

    const sounds_load = {
      explosion: 'explosion.wav',
      laser: 'laser.wav',
      bullet: 'bullet.wav',
      dash: 'dash.wav',
      death: 'death.wav',
      hit: 'hit.wav',
      upgrade: 'upgrade.wav',
    };
    for (const k in sounds_load) {
      this.sounds[k] = loadSound(`${audio_folder}/${sounds_load[k]}`);
      this.sounds[k].playMode('sustain');
    }
  }

  setup() {
    // UI Settings
    textAlign(CENTER, CENTER);
    textFont(this.font);
    textSize(this.font_size);
    textWrap(WORD);

    strokeWeight(STROKE_WEIGHT);
    strokeJoin(MITER);
    stroke(SECOND_COLOR);
    fill(SECOND_COLOR);

    this.screen[this.state].setup();

    // Restore save
    //if(localStorage.getItem('save')) {
    //  this.restore_save();
    //}

    // Setup Achievements
    this.restore_save();
    this.set_volumes();
    setup_achievements();
  }

  set_volumes() {
    for (const k in this.sounds) 
      this.sounds[k].setVolume(VOLUME);
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
    this.screen[this.state].resize();
    //for (const v of Object.values(this.screen)) v.resize();
    if (this.popup.length > 0)
      this.popup[0].resize();
  }

  mouseMoved() { this.screen[this.state].mouseMoved(); }
  mouseClicked() {
    userStartAudio();
    let next_state = this.screen[this.state].mouseClicked();
    this.save();
    if (next_state === undefined) return;
    this.next_state(next_state);
  }

  touchStarted() { this.screen[this.state].touchStarted(); }
  touchMoved() { this.screen[this.state].touchMoved(); }
  touchEnded() {
    userStartAudio();
    const next_state = this.screen[this.state].touchEnded();
    this.save();
    if (next_state === undefined) return;
    this.next_state(next_state);
  }

  // Game Logic
  save() {
    const save = JSON.stringify(
      {
        'current_colors': CURRENT_COLORS,
        'achievements_status': ACHIEVEMENTS_STATUS,
        'achievements_unlocked': ACHIEVEMENTS_UNLOCKED,
        'volume': VOLUME,
        'team': get_team_word(),
      }
    );
    localStorage.setItem('save', save);
  }

  has_save() { return localStorage.getItem('save') !== null; }

  restore_save() {
    if (!this.has_save()) return;
    const save = JSON.parse(localStorage.getItem('save'));
    CURRENT_COLORS = save.current_colors;
    setup_colors(false);
    ACHIEVEMENTS_STATUS = save.achievements_status;
    ACHIEVEMENTS_UNLOCKED = save.achievements_unlocked;
    VOLUME = save.volume;
    team = [];
    for (let i=0; i<save.team.length; i++) {
      team[i] = new Char(PLAYER_TEAM, save.team[i]);
    }
  }

  next_state(next_state) {
    if (this.state === STATE_BATTLE_MENU ||
      this.state === STATE_TEAM_VIEW) {
      if (next_state === STATE_BATTLE) {
        this.screen[STATE_BATTLE].pause = false;
        this.state = next_state;
        return;
      }
    }

    switch(this.state) {
     case STATE_ACHIEVEMENT:
       setup_achievements();
       break;
     case STATE_BATTLE:
       if (this.screen[STATE_BATTLE].winner === PLAYER_TEAM &&
         this.screen[STATE_BATTLE].wave === WAVE_QUANTITY) {
         this.popup = this.screen[STATE_ACHIEVEMENT].verify_achievements();
         this.screen[STATE_BATTLE] = new Battle();
         upgrades = [];
       }

       if (this.screen[STATE_BATTLE].winner === ENEMY_TEAM) {
         this.screen[STATE_BATTLE] = new Battle();
         upgrades = [];
       }
       break;
    }

    if (next_state === STATE_BATTLE) {
       this.screen[next_state].reset();
    } else if (next_state === STATE_TEAM_EDITOR_INFO) {
      this.screen[STATE_BATTLE].setup();
    }

    this.screen[next_state].setup();
    this.state = next_state;
  }
}