class Achievement extends Screen {
  constructor() {
    super();
    this.background = random([BACKGROUND_MATRIX, BACKGROUND_ALIVE]);
    this.btn_offset = MOBILE ? 1.3 : 1.6 ;
    this.images = {
      '-1': { src: 'achievements/locked.png', img: null },
      '0':  { src: 'achievements/beat_the_game_1.png', img: null },
      '1':  { src: 'achievements/beat_the_game_2.png', img: null },
      '2':  { src: 'achievements/beat_the_game_3.png', img: null },
      '3':  { src: 'achievements/beat_the_game_4.png', img: null },
      '4':  { src: 'achievements/beat_the_game_consonant.png', img: null },
      '5':  { src: 'achievements/beat_the_game_number.png', img: null },
      '6':  { src: 'achievements/beat_the_game_special.png', img: null },
      '7':  { img: null },
      '8':  { img: null },
      '9':  { img: null },
      '10': { img: null },
      '11': { img: null },
      '12': { img: null },
      '13': { img: null },
      '14': { img: null },
      '15': { img: null },
      '16': { src: 'achievements/multiplier_2x.png', img: null },
      '17': { src: 'achievements/multiplier_4x.png', img: null },
      '18': { src: 'achievements/multiplier_8x.png', img: null },
      '19': { src: 'achievements/multiplier_16x.png', img: null },
    };
    this.achievements = [
      ['0',  '1',  '2',  '3'],
      ['4',  '5',  '6',  '7'],
      ['8',  '9',  '10', '11'],
      ['12', '13', '14', '15'],
      ['16', '17', '18', '19'],
    ];
    this.achievement_name = '';
    this.achievement_description = '';
  }

  load(image_folder, images) {
    super.load(image_folder);
    for (let i=0; i<images.length; i++)
      this.images[str(i + 7)].img = images[i];

  }

  setup_ui() {
    this.return = new TextButton(
      '<',
      { x: 0, y: 0 },
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
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
    
    const i = ceil((MOUSE_Y + (SQUARE_BUTTON * this.btn_offset * 1.5)) / (SQUARE_BUTTON * this.btn_offset));
    const j = ceil((MOUSE_X + (SQUARE_BUTTON * this.btn_offset)) / (SQUARE_BUTTON * this.btn_offset));
    if (j < 0 || i < 0 || i >= this.achievements.length || j >= this.achievements[0].length) return;
    let index = (i * this.achievements[0].length) + j;
    if (this.buttons[index].hover()) {
      if (ACHIEVEMENTS_UNLOCKED[i][j] &&
        this.buttons[index].hover()) {
        this.buttons[index].active = !this.buttons[index].active;
        ACHIEVEMENTS_STATUS[i][j] = this.buttons[index].active;
        return;
      }
    }
  }

  mouseMoved() {
    super.mouseMoved();
    const i = ceil((MOUSE_Y + (SQUARE_BUTTON * this.btn_offset * 1.5)) / (SQUARE_BUTTON * this.btn_offset));
    const j = ceil((MOUSE_X + (SQUARE_BUTTON * this.btn_offset)) / (SQUARE_BUTTON * this.btn_offset));
    if (j < 0 || i < 0 || i >= this.achievements.length || j >= this.achievements[0].length) return;
    
    let index = (i * this.achievements[0].length) + j;
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
  }

  touchStarted() {
    super.touchStarted();
    this.mouseMoved();
  }

  touchMoved() {
    this.mouseMoved();
    super.touchMoved();
  }

  touchEnded() {
    this.mouseMoved();
    return super.touchEnded();
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
      ['Beat the game',
        'Beat the game 2x',
        'Beat the game 3x',
        'Beat the game 4x'],
      ['Beat the game using\nvowels only',
        'Beat the game using\nconsonants only',
        'Beat the game using\nnumbers only',
        'Beat the game using\nspecial only'],
      ['Beat the game with\nthe team as "italic"',
        'Beat the game with\nthe team as "bold"',
        'Beat the game with\nthe team as "upper"',
        'Beat the game with\nthe team as "under"'],
      ['Beat the game with\nthe team as "sniper"',
        'Beat the game with\nthe team as "banzai"',
        'Beat the game with\nthe team as "bomb"',
        'Beat the game with\nthe team as "laser"'],
      [ 'Unlock all achievements\nin first row',
        'Unlock all achievements\nin second row',
        'Unlock all achievements\nin third row',
        'Unlock all achievements\nin fourth row'],
    ];
    return map[i][j];
  }

  get_achievement_description(i, j) {
    const map = [
      ['Team size +',
        'Team size +',
        'Team size +',
        'Team size +'],
      ['Unlock consonants\n(Attack +)',
        'Unlock numbers\n(Attack +, Health +)',
        'Unlock special\n(Ammo +)',
        'Unlock weapon angel'],
      ['Unlock style italic',
        'Unlock style bold',
        'Unlock style uppercase',
        'Unlock style underline'],
      ['Unlock weapon sniper',
        'Unlock weapon kamikaze',
        'Unlock weapon explosions',
        'Unlock weapon laser'],
      [ '50% chance to multiply\nbuff by 2x',
        '25% chance to multiply\nbuff by 4x',
        '12.5% chance to multiply\nbuffs by 8x',
        '6.25% chance to multiply\nbuffs by 16x'],
    ];
    return map[i][j];
  }

  get_achievement_name(i, j) {
    const map = [
      ['Win', 'Win (2x)', 'Win (3x)', 'Win (4x)'],
      ['Vowels', 'Consonants', 'Numbers', 'Specials'],
      ['Italic', 'Bold' ,'Uppercase' ,'Underline'],
      ['Sniper', 'Banzai', 'Explosions', 'Laser'],
      ['2x', '4x', '8x', '16x'],
    ];
    return map[i][j];
  }

  verify_achievements() {
    const popup = [],
      traits = Object.keys(count_traits(team));
  
    if (traits.length === 1) {
      switch(traits[0]) {
        case 'vowel':
          if (ACHIEVEMENTS_UNLOCKED[1][0]) break;
          popup.push(new Popup('Vowels', this.images['0'].img));
          ACHIEVEMENTS_UNLOCKED[1][0] = true;
          ACHIEVEMENTS_STATUS[1][0] = true;
          break;
        case 'consonant':
          if (ACHIEVEMENTS_UNLOCKED[1][1]) break;
          popup.push(new Popup('Consonants', this.images['1'].img));
          ACHIEVEMENTS_UNLOCKED[1][1] = true;
          ACHIEVEMENTS_STATUS[1][1] = true;
          break;
        case 'number':
          if (ACHIEVEMENTS_UNLOCKED[1][2]) break;
          popup.push(new Popup('Numbers', this.images['2'].img));
          ACHIEVEMENTS_UNLOCKED[1][2] = true;
          ACHIEVEMENTS_STATUS[1][2] = true;
          break;
        case 'special':
          if (ACHIEVEMENTS_UNLOCKED[1][3]) break;
          popup.push(new Popup('Specials', this.images['3'].img));
          ACHIEVEMENTS_UNLOCKED[1][3] = true;
          ACHIEVEMENTS_STATUS[1][3] = true;
          break;
      }
    }
  
    for (let i=0; i<ACHIEVEMENTS_UNLOCKED[0].length; i++) {
      if (!ACHIEVEMENTS_UNLOCKED[0][i]) {
        let achievement_title = 'Beat the game';
        if (i !== 0) achievement_title = `Beat the game x${i + 1}`;
        popup.push(new Popup(achievement_title, this.images[str(4 + i)].img));
        ACHIEVEMENTS_UNLOCKED[0][i] = true;
        ACHIEVEMENTS_STATUS[0][i] = true;
        break;
      }
    }

    const word = get_team_word();

    if (!ACHIEVEMENTS_UNLOCKED[2][0] &&
      word === 'italic') {
      ACHIEVEMENTS_UNLOCKED[2][0] = true;
      ACHIEVEMENTS_STATUS[2][0] = true;
      popup.push(new Popup('Italic', this.images['8'].img));
    } else if (!ACHIEVEMENTS_UNLOCKED[2][1] &&
      word === 'bold') {
      ACHIEVEMENTS_UNLOCKED[2][1] = true;
      ACHIEVEMENTS_STATUS[2][1] = true;
      popup.push(new Popup('Bold', this.images['9'].img));
    } else if (!ACHIEVEMENTS_UNLOCKED[2][2] &&
      word === 'upper') {
      ACHIEVEMENTS_UNLOCKED[2][2] = true;
      ACHIEVEMENTS_STATUS[2][2] = true;
      popup.push(new Popup('Uppercase', this.images['10'].img));
    } else if (!ACHIEVEMENTS_UNLOCKED[2][3] &&
      word === 'under') {
      ACHIEVEMENTS_UNLOCKED[2][3] = true;
      ACHIEVEMENTS_STATUS[2][3] = true;
      popup.push(new Popup('Underline', this.images['11'].img));
    }

    if (!ACHIEVEMENTS_UNLOCKED[3][0] &&
      word === 'guide') {
      ACHIEVEMENTS_UNLOCKED[3][0] = true;
      ACHIEVEMENTS_STATUS[3][0] = true;
      popup.push(new Popup('angel', this.images['12'].img));
    } else if (!ACHIEVEMENTS_UNLOCKED[2][1] &&
      word === 'banzai') {
      ACHIEVEMENTS_UNLOCKED[3][1] = true;
      ACHIEVEMENTS_STATUS[3][1] = true;
      popup.push(new Popup('', this.images['13'].img));
    } else if (!ACHIEVEMENTS_UNLOCKED[2][2] &&
      word === 'bomb') {
      ACHIEVEMENTS_UNLOCKED[3][2] = true;
      ACHIEVEMENTS_STATUS[3][2] = true;
      popup.push(new Popup('', this.images['14'].img));
    } else if (!ACHIEVEMENTS_UNLOCKED[2][3] &&
      word === 'laser') {
      ACHIEVEMENTS_UNLOCKED[3][3] = true;
      ACHIEVEMENTS_STATUS[3][3] = true;
      popup.push(new Popup('', this.images['15'].img));
    }

    if (
      ACHIEVEMENTS_UNLOCKED[0][0] &&
      ACHIEVEMENTS_UNLOCKED[0][1] &&
      ACHIEVEMENTS_UNLOCKED[0][2] &&
      ACHIEVEMENTS_UNLOCKED[0][3] &&
      !ACHIEVEMENTS_UNLOCKED[4][0]
    ) {
      ACHIEVEMENTS_UNLOCKED[4][0] = true;
      ACHIEVEMENTS_STATUS[4][0] = true;
      popup.push(new Popup('Multiplier 2x', this.images['16'].img));
    }
    if (
      ACHIEVEMENTS_UNLOCKED[1][0] &&
      ACHIEVEMENTS_UNLOCKED[1][1] &&
      ACHIEVEMENTS_UNLOCKED[1][2] &&
      ACHIEVEMENTS_UNLOCKED[1][3] &&
      !ACHIEVEMENTS_UNLOCKED[4][1]
    ) {
      ACHIEVEMENTS_UNLOCKED[4][1] = true;
      ACHIEVEMENTS_STATUS[4][1] = true;
      popup.push(new Popup('Multiplier 4x', this.images['17'].img));
    }
    if (
      ACHIEVEMENTS_UNLOCKED[2][0] &&
      ACHIEVEMENTS_UNLOCKED[2][1] &&
      ACHIEVEMENTS_UNLOCKED[2][2] &&
      ACHIEVEMENTS_UNLOCKED[2][3] &&
      !ACHIEVEMENTS_UNLOCKED[4][2]
    ) {
      ACHIEVEMENTS_UNLOCKED[4][2] = true;
      ACHIEVEMENTS_STATUS[4][2] = true;
      popup.push(new Popup('Multiplier 8x', this.images['18'].img));
    }
    if (
      ACHIEVEMENTS_UNLOCKED[3][0] &&
      ACHIEVEMENTS_UNLOCKED[3][1] &&
      ACHIEVEMENTS_UNLOCKED[3][2] &&
      ACHIEVEMENTS_UNLOCKED[3][3] &&
      !ACHIEVEMENTS_UNLOCKED[4][3]
    ) {
      ACHIEVEMENTS_UNLOCKED[4][3] = true;
      ACHIEVEMENTS_STATUS[4][3] = true;
      popup.push(new Popup('Multiplier 16x', this.images['19'].img));
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