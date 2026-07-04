class Battle extends Screen {
  constructor() {
    super();

    this.reset();

    this.current_animation = {
      player: 0.0,
      enemy: 0.0,
    };
    this.animation = {
      player: 1.0,
      enemy: 1.0,
    };

    this.freeze_frame = false;

    this.selected_char = null;

    this.infinite_run = true;

    this.crosshair_imgs = [];

    this.layer = null;
    this.layer_img = null;
    this.wave = 0;
  }

  setup() {
    super.setup();
    bullets = [];
    particles = [];
    for (const i in ACHIEVEMENTS_UNLOCKED) {
      for (const j in ACHIEVEMENTS_UNLOCKED[i]) { 
        if (!ACHIEVEMENTS_UNLOCKED[i][j])
          this.infinite_run = false;
        if (!this.infinite_run) break;
      }
      if (!this.infinite_run) break;
    }
    this.setup_entities();
  }

  setup_ui() {
    this.pause_btn = new TextButton(
      '⏸',
      { x: 0, y: 0 },
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
      true
    );
    this.view_team_btn = new TextButton(
      '⚔',
      { x: 0, y: 0 },
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
      true
    );

    this.buttons = [];
    this.buttons.push(this.pause_btn);
    this.buttons.push(this.view_team_btn);

    this.layer = createFramebuffer();
    this.layer.begin();
    background(MAIN_COLOR);
    this.layer.end();
    this.layer_img = this.layer.get();

    const crosshair_size = CHARACTER_SIZE * 2.5;
    const COLORS_RANDOM = [
      color(100, 255, 100),
      color(100, 255, 255),
      color(255, 100, 100),
      color(255, 255, 100),
      color(100, 100, 255),
      color(255, 100, 255),
      color(255, 255, 255),
    ];
    for (let i=0; i<COLORS_RANDOM.length; i++) {
      this.crosshair_imgs.push(createGraphics(windowWidth * 2, windowHeight * 2));
      this.crosshair_imgs[i].strokeJoin(MITER);
      this.crosshair_imgs[i].stroke(COLORS_RANDOM[i]);
      this.crosshair_imgs[i].noFill();

      // Cross 2
      this.crosshair_imgs[i].strokeWeight(4);
      // Top
      this.crosshair_imgs[i].line(
        (this.crosshair_imgs[i].width * .5) - (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) - (crosshair_size * .5),
        (this.crosshair_imgs[i].width * .5) - (crosshair_size * .25),
        (this.crosshair_imgs[i].height * .5) - (crosshair_size * .5)
      );
      this.crosshair_imgs[i].line(
        (this.crosshair_imgs[i].width * .5) + (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) - (crosshair_size * .5),
        (this.crosshair_imgs[i].width * .5) + (crosshair_size * .25),
        (this.crosshair_imgs[i].height * .5) - (crosshair_size * .5)
      );

      // Bottom
      this.crosshair_imgs[i].line(
        (this.crosshair_imgs[i].width * .5) - (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) + (crosshair_size * .5),
        (this.crosshair_imgs[i].width * .5) - (crosshair_size * .25),
        (this.crosshair_imgs[i].height * .5) + (crosshair_size * .5)
      );
      this.crosshair_imgs[i].line(
        (this.crosshair_imgs[i].width * .5) + (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) + (crosshair_size * .5),
        (this.crosshair_imgs[i].width * .5) + (crosshair_size * .25),
        (this.crosshair_imgs[i].height * .5) + (crosshair_size * .5)
      );

      // Left
      this.crosshair_imgs[i].line(
        (this.crosshair_imgs[i].width * .5) - (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) - (crosshair_size * .25),
        (this.crosshair_imgs[i].width * .5) - (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) - (crosshair_size * .5)
      );
      this.crosshair_imgs[i].line(
        (this.crosshair_imgs[i].width * .5) - (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) + (crosshair_size * .25),
        (this.crosshair_imgs[i].width * .5) - (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) + (crosshair_size * .5)
      );

      // Right
      this.crosshair_imgs[i].line(
        (this.crosshair_imgs[i].width * .5) + (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) - (crosshair_size * .25),
        (this.crosshair_imgs[i].width * .5) + (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) - (crosshair_size * .5)
      );
      this.crosshair_imgs[i].line(
        (this.crosshair_imgs[i].width * .5) + (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) + (crosshair_size * .25),
        (this.crosshair_imgs[i].width * .5) + (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) + (crosshair_size * .5)
      );

      // Cross 1
      this.crosshair_imgs[i].strokeWeight(1);
      this.crosshair_imgs[i].line(0, this.crosshair_imgs[i].height * .5, (this.crosshair_imgs[i].width * .5) - (crosshair_size * .5), this.crosshair_imgs[i].height * .5);
      this.crosshair_imgs[i].line((this.crosshair_imgs[i].width * .5) + (crosshair_size * .5), this.crosshair_imgs[i].height * .5, this.crosshair_imgs[i].width, this.crosshair_imgs[i].height * .5);
      this.crosshair_imgs[i].line(this.crosshair_imgs[i].width * .5, 0, this.crosshair_imgs[i].width * .5, (this.crosshair_imgs[i].height * .5) - (crosshair_size * .5));
      this.crosshair_imgs[i].line(this.crosshair_imgs[i].width * .5, this.crosshair_imgs[i].height, this.crosshair_imgs[i].width * .5, (this.crosshair_imgs[i].height * .5) + (crosshair_size * .5));
      this.crosshair_imgs[i].square(
        (this.crosshair_imgs[i].width * .5) - (crosshair_size * .5),
        (this.crosshair_imgs[i].height * .5) - (crosshair_size * .5),
        crosshair_size);
      this.crosshair_imgs[i].strokeWeight(2);
      this.crosshair_imgs[i].square(
        (this.crosshair_imgs[i].width * .5) - (crosshair_size * .5 * 1.2),
        (this.crosshair_imgs[i].height * .5) - (crosshair_size * .5 * 1.2),
        crosshair_size * 1.2);
    }

    this.resize();
  }

  setup_entities() {
    entities = [];
    team_battlefield = [];
    this.setup_enemies();

    const local_team = [];
    for (const c of team)
      local_team.push(new Char(PLAYER_TEAM, c.char));

    const local_enemy_team = enemy_team.slice();
    local_team.forEach((v) => v.reset_upgrades());
    local_enemy_team.forEach((v) => v.reset_upgrades());
    this.apply_buffs(local_team);
    this.apply_buffs(local_enemy_team);
    this.apply_upgrades(local_team, upgrades);
    local_team.forEach((v) => v.setup());
    local_enemy_team.forEach((v) => v.setup());
    local_team.forEach((v) => v.restore());
    local_enemy_team.forEach((v) => v.restore());

    this.setup_pos(local_team);
    this.setup_pos(local_enemy_team);
    team_battlefield = local_team;
  }

  setup_enemies() {
    enemy_team = [];

    let enemy_alphabet = [...VOWELS],
      enemy_qty = TEAM_SIZE - 2 + this.wave;

    if (ACHIEVEMENTS_UNLOCKED[1][0] &&
      ACHIEVEMENTS_STATUS[1][0]) {
      enemy_alphabet = enemy_alphabet.concat(CONSONANTS);
    }
    if (ACHIEVEMENTS_UNLOCKED[1][1] &&
      ACHIEVEMENTS_STATUS[1][1]) {
      enemy_alphabet = enemy_alphabet.concat(NUMBERS);
    }
    if (ACHIEVEMENTS_UNLOCKED[1][2] &&
      ACHIEVEMENTS_STATUS[1][2]) {
      enemy_alphabet = enemy_alphabet.concat(SPECIALS);
    }

    const word = get_team_word();

    if (word === 'sniper') enemy_qty--;

    for (const c of enemy_alphabet.sort(() => 0.5 - Math.random()).slice(0, enemy_qty))
      enemy_team.push(new Char(ENEMY_TEAM, c));

    if (!ACHIEVEMENTS_UNLOCKED[1][3] &&
      this.wave === WAVE_QUANTITY - 1) {
      const traits = Object.keys(count_traits(team));
      if (traits.length === 1 &&
        traits[0] === 'special') {
        enemy_team = [];
        enemy_team.push(new Char(ENEMY_TEAM, random(SPECIALS)));
        enemy_team.push(new Char(ENEMY_TEAM, random(SPECIALS)));
        enemy_team.push(new Char(ENEMY_TEAM, random(SPECIALS)));
        enemy_team[0].attributes.weapon = ATTACK_LASER;
        enemy_team[0].attributes.max_health = 50;
        enemy_team[1].attributes.weapon = ATTACK_ANGEL;
        enemy_team[1].attributes.ammo = 10;
        enemy_team[1].attributes.max_health = 50;
        enemy_team[2].attributes.weapon = ATTACK_LASER;
        enemy_team[2].attributes.max_health = 50;
      }
    }

    if (this.wave > (WAVE_QUANTITY - 1)) {
      for (const v of enemy_team) {
        let enemy_weapon = [
          ATTACK_AUTO,
          ATTACK_SEMI_AUTO,
          ATTACK_SHOTGUN,
          ATTACK_KAMIKAZE,
          ATTACK_LASER,
          ATTACK_EXPLOSIONS,
          ATTACK_SNIPER,
          ATTACK_ANGEL
        ];
        v.attributes.weapon = random(enemy_weapon);
        v.attributes.ammo = 10;
      }
    }


    if (word === 'italic') {
      for (const e of enemy_team)
        e.attributes.style = STYLE_ITALIC;
    } else if (word === 'bold') {
      for (const e of enemy_team)
        e.attributes.style = STYLE_BOLD;
    } else if (word === 'upper') {
      for (const e of enemy_team)
        e.attributes.style = STYLE_UPPERCASE;
    } else if (word === 'under') {
      for (const e of enemy_team)
        e.attributes.style = STYLE_UNDERLINE;
    }

    if (word === 'sniper') {
      for (const e of enemy_team)
        e.attributes.weapon = ATTACK_SNIPER;
    } else if (word === 'banzai') {
      for (const e of enemy_team)
        e.attributes.weapon = ATTACK_KAMIKAZE;
    } else if (word === 'bomb') {
      for (const e of enemy_team)
        e.attributes.weapon = ATTACK_EXPLOSIONS;
    } else if (word === 'laser') {
      for (const e of enemy_team)
        e.attributes.weapon = ATTACK_LASER;
    }
  }

  setup_pos(local_team) {
    const order = {
      vowel: CHARACTER_SIZE * 0,
      consonant: CHARACTER_SIZE * 2,
      number: CHARACTER_SIZE * 4,
      special: CHARACTER_SIZE * 6,
    };

    const player_team = local_team[0].attributes.team === PLAYER_TEAM,
      off_x = width / (local_team.length + 1);

    local_team.forEach((char, i) => {
      const trait = char.attributes.trait;

      char.attributes.pos = createVector(
        WINDOW_LEFT + ((i + 1) * off_x),
        ((height * .25) + order[trait]) * (player_team ? 1 : -1)
      );

      entities.push(local_team[i]);
    });
  }

  apply_buffs(local_team) {
    const traits = count_traits(local_team);

    for (const k in traits) {
      const buff = get_buff(k);
      for (const b in buff) {
        for (const v of local_team) {
          if (v.attributes.trait != k) continue;
          v.attributes.upgrades[b] += buff[b] * min(traits[k], TRAIT_LIMIT);
        }
      }
    }
  }

  apply_upgrades(local_team, local_upgrades) {
    for (const u of local_upgrades) {
      if ('style' in u) {
        local_team.forEach((v) => {
          if (v.attributes.trait != u.trait) return;
          v.attributes.style = u.style;
        });
        continue;
      }
      if ('weapon' in u) {
        local_team.forEach((v) => {
          if (v.attributes.trait != u.trait) return;
          v.attributes.weapon = u.weapon;
        });
        continue;
      }
      for (const b in u.buffs) {
        local_team.forEach((v) => {
          if (v.attributes.trait != u.trait) return;
          v.attributes.upgrades[b] += (u.buffs[b] * u.multiplier);
        });
      }
    }
  }

  // p5js
  mouseClicked() {
    if (this.finish) {
      if (this.winner === ENEMY_TEAM) {
        return STATE_TEAM_EDITOR;
      }

      if (this.winner === PLAYER_TEAM) {
        if ((this.wave === WAVE_QUANTITY) &&
          !this.infinite_run) {
          return STATE_ACHIEVEMENT;
        }
        this.start = false;
        return STATE_UPGRADE;
      }
      return;
    }

    if (!this.start) {
      this.start = true;
      this.pause = false;
      return;
    }

    if (this.pause) {
      if (this.selected_char !== null) {
        this.selected_char.attributes.pos.x = MOUSE_X;
        this.selected_char.attributes.pos.y = MOUSE_Y;
        entities.push(this.selected_char);
        this.pause = false;
        this.selected_char.hover_animation = false;
        this.selected_char = null;
        return;
      }
    }

    if (!this.pause) {
      const hover_chars = team_battlefield.filter(v => v.hover());
      if (hover_chars.length > 0) {
        this.selected_char = hover_chars[0];
        this.freeze_frame = true;
        const i = entities.indexOf(this.selected_char);
        entities.splice(i, 1);
        return;
      }

      if (this.pause_btn.hover()) {
        this.freeze_frame = true;
        return STATE_BATTLE_MENU;
      }
      if (this.view_team_btn.hover()) {
        this.freeze_frame = true;
        return STATE_TEAM_VIEW;
      }
    }
  }

  touchStarted() {
    super.touchStarted();
    if (this.pause) {
      if (this.selected_char !== null) {
        this.selected_char.attributes.pos.x = MOUSE_X;
        this.selected_char.attributes.pos.y = MOUSE_Y;
        entities.push(this.selected_char);
        this.pause = false;
        this.selected_char.hover_animation = false;
        this.selected_char = null;
        return;
      }
    } else {
      const hover_chars = team_battlefield.filter(v => v.hover());
      if (hover_chars.length > 0) {
        this.selected_char = hover_chars[0];
        this.freeze_frame = true;
        const i = entities.indexOf(this.selected_char);
        entities.splice(i, 1);
        return;
      }
    }
  }

  touchMoved() {
    super.touchMoved();
    this.mouseMoved();
  }

  mouseMoved() {
    super.mouseMoved();
    if (!this.pause) {
      if (this.selected_char !== null) {
        this.selected_char.hover_animation = false;
        this.selected_char = null;
      }
      const hover_chars = team_battlefield.filter(v => v.hover());
      if (hover_chars.length > 0) {
        this.selected_char = hover_chars[0];
        this.selected_char.hover_animation = true;
      }
    } else {
      if (this.selected_char !== null) {
        this.selected_char.attributes.pos.x = MOUSE_X;
        this.selected_char.attributes.pos.y = MOUSE_Y;
      }
    }
  }

  draw() {
    if (this.pause) {
      image(this.layer_img, -this.layer_img.width * .5, -this.layer_img.height * .5);
      if (this.selected_char !== null) {
        this.selected_char.draw();
      }
    } else {
      this.draw_battlefield();
    }
    if (this.selected_char !== null) {
      this.crosshair_imgs = shuffle(this.crosshair_imgs);
      const img = this.crosshair_imgs[0];
      image(
        img,
        this.selected_char.attributes.pos.x - (img.width * .5),
        this.selected_char.attributes.pos.y - (img.height * .5));
    }
    super.update();
    if (this.finish) {
      this.selected_char = null;
      this.draw_finish();
      return;
    }
    if (!this.start) {
      this.draw_wave();
      return;
    }
    if (this.pause) return;
    this.finished();
  }

  update() {
    if (this.freeze_frame) {
      this.freeze();
      this.freeze_frame = false;
    }
    if (this.pause) return;
    for (const v of entities) v.update();
    for (const v of bullets) v.update();
    for (const v of particles) v.update();
    if (particles .length > 100) particles.splice(0, particles.length - 100);
  }
  
  resize () { 
    this.view_team_btn.resize(
      WINDOW_LEFT + 25 + 20,
      WINDOW_TOP + 25 + 20
    );
    this.pause_btn.resize(
      WINDOW_LEFT + 50 + 25 + (20 * 2),
      WINDOW_TOP + 25 + 20
    );
  }

  // Draw
  freeze() {
    this.pause = true;
    this.layer.begin();
    background(MAIN_COLOR);
    this.draw_battlefield();
    filter(BLUR, 2);
    this.layer.end();
    this.layer_img = this.layer.get();
  }

  draw_wave() {
    let t = `Wave ${this.wave + 1}`;
    const traits = Object.keys(count_traits(team));
    if (traits.length === 1 &&
      traits[0] === 'special' &&
      !ACHIEVEMENTS_UNLOCKED[1][3]) {
      if (this.wave === 0) t = 'You are not alone';
      if (this.wave === 1) t = 'You have been called';
      if (this.wave === 2) t = 'The lord has heard\nyour cry';
      if (this.wave === 3) t = 'You have found favor\nwith God';
      if (this.wave === 4) t = 'Be not afraid';
    }
    text(t, 0, 0);
  }
  draw_finish() { text(this.winner, 0, 0); }

  draw_battlefield() {
    for (const v of bullets) v.draw();
    super.draw();
    for (const v of entities) v.draw();
    for (const v of particles) {
      v.draw();
      if (v.finished()) {
        const i = particles.indexOf(v);
        if (i > -1) particles.splice(i, 1);
      }
    }
  }

  // Game logic
  finished() {
    let winner = null;
    if (entities.length === 0) winner = ENEMY_TEAM;
    for (const v of entities) {
      if (winner === null) {
        winner = v.attributes.team;
        continue;
      }
      if(v.attributes.team != winner) return;
    }

    this.wave++;
    this.start = false;
    this.finish = true;
    this.winner = winner;
    team.forEach((v) => v.restore());
    this.freeze_frame = true;
  }

  reset() {
    this.pause = true;
    this.start = false;
    this.finish = false;
    this.winner = null;
  }
}