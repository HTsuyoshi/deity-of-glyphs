class Battle extends Screen {
  // TODO: Use Layer here
  constructor() {
    super();

    this.reset();

    this.layer = null;
    this.layer_img = null;
    this.wave = 0;
    this.finish_delay = 3;
  }

  setup() {
    super.setup();
    this.setup_entities();
  }

  setup_ui() {
    this.pause_btn = new TextButton(
      '⏸',
      createVector(0, 0),
      createVector(50, 50),
      true
    );
    this.view_team_btn = new TextButton(
      '⚔',
      createVector(0, 0),
      createVector(50, 50),
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
    this.resize();
  }

  setup_entities() {
    entities = [];

    const local_team = [...team];
    const local_enemy_team = [...enemy_team];
    local_team.forEach((v) => v.setup());
    local_enemy_team.forEach((v) => v.setup());
    this.apply_buffs(local_team);
    this.apply_buffs(local_enemy_team);
    this.apply_upgrades(local_team);
    local_team.forEach((v) => v.restore());
    local_enemy_team.forEach((v) => v.restore());

    this.setup_pos(local_team);
    this.setup_pos(local_enemy_team);
  }

  setup_pos(local_team) {
    const order = {
      vowel: CHARACTER_SIZE * 0,
      consonant: CHARACTER_SIZE * 1,
      number: CHARACTER_SIZE * 2,
      special: CHARACTER_SIZE * 3,
    };

    const player_team = local_team[0].attributes.team === PLAYER_TEAM,
          off_x = width / (local_team.length + 1);

    local_team.forEach((char, i) => {
      const trait = char.attributes.trait,
            off_y = (order[trait] * (player_team ? 1 : -1));

      char.attributes.pos = createVector(
        WINDOW_LEFT + ((i + 1) * off_x),
        (WINDOW_TOP + 150 + off_y) * (player_team ? 1 : -1)
      );

      entities.push(local_team[i]);
    });
  }

  apply_buffs(local_team) {
    const traits = count_traits(local_team);

    for (const k in traits) {
      const buff = get_buff(k) * min(traits[k], 3);
      for (const b in buff) {
        for (const v of local_team) {
          if (v.attributes.trait != k) continue;
          v.attributes.upgrades[b] += buff[b];
        }
      }
    }
  }

  apply_upgrades(local_team) {
    for (const u of upgrades) {
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
        for (const v of local_team) {
          if (v.attributes.trait != u.trait) continue;
          v.attributes.upgrades[b] += u.buffs[b];
        }
      }
    }
  }

  // p5js
  mouseClicked() {
    if (this.finish) {
      if (this.winner == ENEMY_TEAM) {
        // TODO: Statistics
        return STATE_TEAM_EDITOR;
      }

      if (this.winner == PLAYER_TEAM) {
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

    for (const v of team) 
      if (v.mouseClicked()) return;

    if (!this.pause && this.pause_btn.hover()) {
      this.freeze();
      this.pause = true;
      return STATE_BATTLE_MENU;
    }

    if (!this.pause && this.view_team_btn.hover()) {
      this.freeze();
      this.pause = true;
      return STATE_TEAM_VIEW;
    }
  }

  draw() {
    if (this.pause) {
      image(this.layer_img, -this.layer_img.width * .5, -this.layer_img.height * .5);
      //this.draw_battlefield();
      //filter(BLUR, 2);
    } else {
      this.draw_battlefield();
    }
    super.update();
    if (this.finish) {
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
    if (this.pause) return;
    for (const v of entities) v.update();
    for (const v of bullets) v.update();
    for (const v of particles) v.update();
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
    //this.layer = createFramebuffer();
    this.layer.begin();
    background(MAIN_COLOR);
    this.draw_battlefield();
    filter(BLUR, 2);
    this.layer.end();
    this.layer_img = this.layer.get();
  }

  draw_wave() { text(`Wave ${this.wave + 1}`, 0, 0); }
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
    if (entities.length == 0) return;
    let winner = null;
    for (const v of entities) {
      if (winner == null) {
        winner = v.attributes.team;
        continue;
      }
      if(v.attributes.team != winner) return;
    }

    this.wave++;
    this.pause = true;
    this.start = false;
    this.finish = true;
    this.winner = winner;
    this.freeze();
  }

  reset() {
    this.pause = true;
    this.start = false;
    this.finish = false;
    this.winner = null;
  }
}