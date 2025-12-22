//TODO: Fix when current selected alphabet isnt unlocked in the achievements

class TeamEditor extends Screen {
  constructor() {
    super();
    this.index_carrousel = 0;
    this.images = {
      traits: { src: 'icons/traits.png', img: null },
    };
  }

  setup_ui() {
    // Current team carrousel
    this.team_carrousel = new ViewCarrousel(
      createVector(0, 0),
      team,
      CHARACTER_SIZE * 10
    );

    // Select new character carrousel
    this.carrousel_height = height * .25;

    this.vowel_carrousel = new EditorCarrousel(
      createVector(0, 0),
      VOWELS,
      CHARACTER_SIZE * 3
    );
    this.consonant_carrousel = new EditorCarrousel(
      createVector(0, 0),
      CONSONANTS,
      CHARACTER_SIZE * 3
    );
    this.special_carrousel = new EditorCarrousel(
      createVector(0, 0),
      SPECIALS,
      CHARACTER_SIZE * 3
    );
    this.number_carrousel = new EditorCarrousel(
      createVector(0, 0),
      NUMBERS,
      CHARACTER_SIZE * 3
    );

    this.available_carrousel = {
      vowel: this.vowel_carrousel,
    };

    if (ACHIEVEMENTS_STATUS[1][0]) this.available_carrousel['consonant'] = this.consonant_carrousel;
    if (ACHIEVEMENTS_STATUS[1][1]) this.available_carrousel['number'] = this.number_carrousel;
    if (ACHIEVEMENTS_STATUS[1][2]) this.available_carrousel['special'] = this.special_carrousel;

    this.current_carrousel = this.vowel_carrousel;

    // Buttons top
    this.return = new TextButton(
      '<',
      { x: 0, y: 0 },
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
      true
    )
    this.traits = new ImageButton(
      this.images['traits'].img,
      { x: 0, y: 0 },
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
      true
    )
    this.info = new TextButton(
      '?',
      { x: 0, y: 0 },
      { x: SQUARE_BUTTON, y: SQUARE_BUTTON },
      true
    )

    // Buttons Mid
    this.mid_height = this.carrousel_height * .6;
    this.next_carrousel = new TextButton(
      '>',
      createVector(0, 0),
      createVector(textWidth('>') + 20, SQUARE_BUTTON),
      (Object.keys(this.available_carrousel).length !== 1)
    )
    this.previous_carrousel = new TextButton(
      '<',
      createVector(0, 0),
      createVector(textWidth('<') + 20, SQUARE_BUTTON),
      (Object.keys(this.available_carrousel).length !== 1)
    )

    // Buttons Bottom
    this.bottom_height = this.carrousel_height * 1.6;
    if (MOBILE) {
      this.ready = new TextButton(
        'Ready',
        { x: 0, y: 0 },
        { x: 300, y: 75 },
      )
    } else {
      this.choose = new TextButton(
        'Choose',
        { x: 0, y: 0 },
        { x: 150, y: 75 },
      )
      this.ready = new TextButton(
        'Ready',
        { x: 0, y: 0 },
        { x: 150, y: 75 },
      )
    }


    this.buttons = [];
    this.buttons.push(this.return);
    this.buttons.push(this.traits);
    this.buttons.push(this.info);
    if (!MOBILE) this.buttons.push(this.choose);
    this.buttons.push(this.ready);
    this.buttons.push(this.next_carrousel);
    this.buttons.push(this.previous_carrousel);
    this.resize();
  }

  // p5js
  draw() {
    super.draw();
    this.draw_carrousel();
  }

  update() {
    super.update();
    this.team_carrousel.update();
    this.current_carrousel.update();
  }

  mouseClicked() {
    if (this.return.hover()) return STATE_MENU;
    if (this.traits.hover()) return STATE_TRAITS;
    if (this.info.hover()) return STATE_TEAM_EDITOR_INFO;
    if (this.ready.hover()) return STATE_BATTLE;

    if (!MOBILE)
    if (this.choose.hover()) {
      const char = new Char(PLAYER_TEAM, this.current_carrousel.current_char());
      team[round(this.team_carrousel.index)] = char;
      return;
    }

    const available_carrousel = Object.keys(this.available_carrousel);
    if (this.next_carrousel.hover()) {
      this.index_carrousel = (this.index_carrousel + 1) % available_carrousel.length;
      this.current_carrousel = this.available_carrousel[available_carrousel[this.index_carrousel]];
      return;
    }

    if (this.previous_carrousel.hover()) {
      this.index_carrousel = (this.index_carrousel - 1) % available_carrousel.length;
      if (this.index_carrousel < 0) this.index_carrousel = available_carrousel.length - 1;
      this.current_carrousel = this.available_carrousel[available_carrousel[this.index_carrousel]];
      return;
    }
  }

  touchStarted() {
    super.touchStarted();
    this.team_carrousel.touchStarted();
    this.current_carrousel.touchStarted();
  }

  touchMoved() {
    super.touchMoved();
    this.team_carrousel.touchMoved();
    this.current_carrousel.touchMoved();
  }

  touchEnded() {
    // TODO: If you drop the character in a button, it shouldnt click the button
    this.team_carrousel.touchEnded();
    if (this.current_carrousel.touchEnded()) {
      if (this.team_carrousel.hover()) {
        const char = new Char(PLAYER_TEAM, this.current_carrousel.current_char());
        team[round(this.team_carrousel.index)] = char;
      }
      return;
    }
    return super.touchEnded();
  }
  
  resize () { 
    // Current team carrousel
    this.team_carrousel.resize(0, -height * .125);
    this.vowel_carrousel.resize(0, this.carrousel_height);
    this.consonant_carrousel.resize(0, this.carrousel_height);
    this.special_carrousel.resize(0, this.carrousel_height);
    this.number_carrousel.resize(0, this.carrousel_height);

    // Buttons top
    this.return.resize( WINDOW_LEFT + (SQUARE_BUTTON * .5) + 20, WINDOW_TOP + 25 + 20);
    this.traits.resize( WINDOW_RIGHT - (SQUARE_BUTTON * 1.5) - (20 * 2), WINDOW_TOP + 25 + 20);
    this.info.resize(WINDOW_RIGHT - (SQUARE_BUTTON * .5) - 20, WINDOW_TOP + 25 + 20);

    // Buttons Mid
    this.mid_height = this.carrousel_height * .6;
    this.next_carrousel.resize(150, this.mid_height);
    this.previous_carrousel.resize( -150, this.mid_height);

    // Buttons Bottom
    this.bottom_height = this.carrousel_height * 1.6;
    if (MOBILE) {
      this.ready.resize(0, this.bottom_height);
    } else {
      this.choose.resize( -100, this.bottom_height);
      this.ready.resize(100, this.bottom_height);
    }
  }

  // Draw
  draw_carrousel() {
    this.team_carrousel.draw();
    this.current_carrousel.draw();

    const available_carrousel = Object.keys(this.available_carrousel);
    push();
    noFill();

    translate(0, 0, -5);
    stroke(MAIN_COLOR_SHADOW);
    rect(
      - (textWidth('consonant') / 2) - 20 + SHADOW_GAP,
      this.mid_height - 25 + SHADOW_GAP,
      textWidth('consonant') + 40,
      50
    );
    translate(0, 0, 5);
    stroke(SECOND_COLOR);
    rect(
      - (textWidth('consonant') / 2) - 20 - SHADOW_GAP,
      this.mid_height - 25 - SHADOW_GAP,
      textWidth('consonant') + 40,
      50
    );

    fill(SECOND_COLOR);
    text(
      available_carrousel[this.index_carrousel],
      0 - SHADOW_GAP,
      this.mid_height - (SHADOW_GAP * 2)
    );
    pop();
  }
}