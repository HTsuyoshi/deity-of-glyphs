class Achievement extends Screen {
  constructor() {
    super();
    this.background = random([BACKGROUND_MATRIX, BACKGROUND_ALIVE]);
    this.btn_offset = isMobile() ? 1.3 : 1.6 ;
    this.images = {
      '-1': { src: 'achievements/locked.png', img: null },
      '0': { src: 'achievements/beat_the_game_vowel.png', img: null },
      '1': { src: 'achievements/beat_the_game_consonant.png', img: null },
      '2': { src: 'achievements/beat_the_game_number.png', img: null },
      '3': { src: 'achievements/beat_the_game_special.png', img: null },
      '4': { src: 'achievements/beat_the_game_1.png', img: null },
      '5': { src: 'achievements/beat_the_game_2.png', img: null },
      '6': { src: 'achievements/beat_the_game_3.png', img: null },
      '7': { src: 'achievements/beat_the_game_4.png', img: null },
    };
    this.achievements = [
      ['0', '1', '2', '3'],
      ['4', '5', '6', '7'],
      ['0', '0', '0', '0'],
      ['0', '0', '0', '0'],
      ['0', '0', '0', '0'],
    ];
    this.achievement_name = '';
    this.achievement_description = '';
  }

  setup_ui() {
    this.return = new TextButton(
      '<',
      createVector(0, 0),
      createVector(SQUARE_BUTTON, SQUARE_BUTTON),
      true
    )

    this.buttons = [];

    const achievement_size = SQUARE_BUTTON;
    for (let i=0; i<this.achievements.length; i++) {
      const pos_y = - (achievement_size * this.btn_offset * 2) + (achievement_size * this.btn_offset * i);
      for (let j=0; j<this.achievements[i].length; j++) {
        const pos_x = - (this.achievements[i].length * .5 * achievement_size * this.btn_offset) + (achievement_size * .8) + (achievement_size * this.btn_offset * j);
        const img = ACHIEVEMENTS_UNLOCKED[i][j] ?
                      this.images[this.achievements[i][j]].img :
                      this.images['-1'].img;
        const button = new ImageButton(
          img,
          createVector(pos_x, pos_y),
          createVector(achievement_size, achievement_size),
          ACHIEVEMENTS_STATUS[i][j]
        );
        this.buttons.push(button);
      }
    }

    this.buttons.push(this.return);
    this.resize();
  }

  // p5js
  draw() {
    super.draw();
    push();
    textSize(CHARACTER_SIZE * 1.5)
    text('Achievements', 0, WINDOW_TOP + (height / 6));
    pop();
    if (this.achievement_name === null ||
      this.achievement_description === null) return;
    push();
    textSize(CHARACTER_SIZE * 1.2);
    text(this.achievement_name, 0, WINDOW_BOTTOM - (height / 6));
    textSize(CHARACTER_SIZE * 0.8);
    text(this.achievement_description, 0, WINDOW_BOTTOM - (height / 10));
    pop();
  }

  mouseClicked() {
    if (this.return.hover()) return STATE_MENU;
    let index = 0;
    for (let i=0; i<this.achievements.length; i++) {
      for (let j=0; j<this.achievements[i].length; j++) {
        if (ACHIEVEMENTS_UNLOCKED[i][j] &&
          this.buttons[index].hover()) {
          this.buttons[index].active = !this.buttons[index].active;
          ACHIEVEMENTS_STATUS[i][j] = this.buttons[index].active;
          return;
        }
        index++;
      }
    }
  }

  mouseMoved() {
    super.mouseMoved();
    let index = 0;
    for (let i=0; i<this.achievements.length; i++) {
      for (let j=0; j<this.achievements[i].length; j++) {
        if (this.buttons[index].hover()) {
          this.achievement_name = this.get_achievement_name(i, j);

          if (ACHIEVEMENTS_UNLOCKED[i][j]) {
            this.achievement_description = this.get_achievement_description(i, j);
            return;
          } else {
            this.achievement_description = this.get_locked_achievement_description(i, j);
            return;
          }
        }

        index++;
        }
    }
  }

  touchStarted() {
    super.touchStarted();
    this.mouseMoved();
  }

  touchMoved() {
    super.touchMoved();
    this.mouseMoved();
  }

  touchEnded() {
    super.touchEnded();
    this.mouseMoved();
  }

  resize() {
    let index = 0;
    const achievement_size = SQUARE_BUTTON;
    for (let i=0; i<this.achievements.length; i++) {
      const pos_y = - (achievement_size * this.btn_offset * 2) + (achievement_size * this.btn_offset * i);
      for (let j=0; j<this.achievements[i].length; j++) {
        const pos_x = - (this.achievements[i].length * .5 * achievement_size * this.btn_offset) + (achievement_size * .8) + (achievement_size * this.btn_offset * j);
        this.buttons[index].resize(pos_x, pos_y);
        index++;
      }
    }
    this.return.resize(
      WINDOW_LEFT + (SQUARE_BUTTON * .5) + 20,
      WINDOW_TOP + (SQUARE_BUTTON * .5) + 20,
    );
  }

  // Draw
  draw_background() {}

  // Game Logic
  get_locked_achievement_description(i, j) {
    const map = [
      ['Beat the game using\nvowels only',
        'Beat the game using\nconsonants only',
        'Beat the game using\nnumbers only',
        'Beat the game using\nspecial only'],
      ['Beat the game',
        'Beat the game 2x',
        'Beat the game 3x',
        'Beat the game 4x'],
      ['Beat the game with\nthe team as "angel"',
        'Beat the game with\nthe team as ""',
        'Beat the game with\nthe team as ""',
        'Beat the game with\nthe team as ""'],
      ['', '' ,'' ,''],
      ['', '' ,'' ,''],
    ];
    return map[i][j];
  }

  get_achievement_description(i, j) {
    const map = [
      ['Unlock consonants\n(Attack +)',
        'Unlock numbers\n(Attack +, Health +)',
        'Unlock special\n(Ammo +)',
        ''],
      ['Team size +',
        'Team size +',
        'Team size +',
        'Team size +'],
      ['Unlock weapon ""',
        'Unlock weapon "laser"',
        'Unlock weapon "explosions"',
        'Unlock weapon ""'],
      ['', '' ,'' ,''],
      ['', '' ,'' ,''],
    ];
    return map[i][j];
  }

  get_achievement_name(i, j) {
    const map = [
      ['Vowels', 'Consonants', 'Numbers', 'Specials'],
      ['Win', 'Win (2x)', 'Win (3x)', 'Win (4x)'],
      ['Angel', 'PI', 'a', 'a'],
      ['a', 'a' ,'a' ,'a'],
      ['a', 'a' ,'a' ,'a'],
    ];
    return map[i][j];
  }

  verify_achievements() {
    const popup = [],
      traits = Object.keys(count_traits(team));

    if (traits.length === 1) {
      switch(traits[0]) {
        case 'vowel':
          if (ACHIEVEMENTS_UNLOCKED[0][0]) break;
          popup.push(new Popup('Vowels', this.images['0'].img));
          ACHIEVEMENTS_UNLOCKED[0][0] = true;
          ACHIEVEMENTS_STATUS[0][0] = true;
          break;
        case 'consonant':
          if (ACHIEVEMENTS_UNLOCKED[0][1]) break;
          popup.push(new Popup('Consonants', this.images['1'].img));
          ACHIEVEMENTS_UNLOCKED[0][1] = true;
          ACHIEVEMENTS_STATUS[0][1] = true;
          break;
        case 'number':
          if (ACHIEVEMENTS_UNLOCKED[0][2]) break;
          popup.push(new Popup('Numbers', this.images['2'].img));
          ACHIEVEMENTS_UNLOCKED[0][2] = true;
          ACHIEVEMENTS_STATUS[0][2] = true;
          break;
        case 'special':
          if (ACHIEVEMENTS_UNLOCKED[0][3]) break;
          popup.push(new Popup('Specials', this.images['3'].img));
          ACHIEVEMENTS_UNLOCKED[0][3] = true;
          ACHIEVEMENTS_STATUS[0][3] = true;
          break;
      }
    }
  
    for (let i=0; i<ACHIEVEMENTS_UNLOCKED[1].length; i++) {
      if (!ACHIEVEMENTS_UNLOCKED[1][i]) {
        let achievement_title = 'Beat the game';
        if (i !== 0) achievement_title = `Beat the game x${i + 1}`;
        popup.push(new Popup(achievement_title, this.images[str(4 + i)].img));
        ACHIEVEMENTS_UNLOCKED[1][i] = true;
        ACHIEVEMENTS_STATUS[1][i] = true;
        break;
      }
    }
  
    const word = team
      .map(c => c.char)
      .join('');
    if (!ACHIEVEMENTS_UNLOCKED[2][0] &&
      word === 'angel') {
      ACHIEVEMENTS_UNLOCKED[2][0] = true;
      ACHIEVEMENTS_STATUS[2][0] = true;
      popup.push(new Popup('angel', this.images['0'].img));
    } else if (!ACHIEVEMENTS_UNLOCKED[2][1] &&
      word === '') {
      ACHIEVEMENTS_UNLOCKED[2][1] = true;
      ACHIEVEMENTS_STATUS[2][1] = true;
      popup.push(new Popup('', this.images['0'].img));
    } else if (!ACHIEVEMENTS_UNLOCKED[2][2] &&
      word === '') {
      ACHIEVEMENTS_UNLOCKED[2][2] = true;
      ACHIEVEMENTS_STATUS[2][2] = true;
      popup.push(new Popup('', this.images['0'].img));
    } else if (!ACHIEVEMENTS_UNLOCKED[2][3] &&
      word === '') {
      ACHIEVEMENTS_UNLOCKED[2][3] = true;
      ACHIEVEMENTS_STATUS[2][3] = true;
      popup.push(new Popup('', this.images['0'].img));
    }
    return popup;
  }

  new_achievement() {
    const unique_char = {};
    for (const v of team) {
      if (unique_char[v.char] == undefined) {
        unique_char[v.char] = 1;
        continue;
      }
      unique_char[v.char] += 1;
    }
  }
}