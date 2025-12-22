// Font
// Palindromo
// Anagrama
// Equal words
// Accentuation

class Upgrade extends Screen {
  constructor() {
    super();
    this.upgrades = [];
    this.images = {
      ammo_up: { src: 'upgrades/ammo_up.png', img: null },
      damage_up: { src: 'upgrades/damage_up.png', img: null },
      health_up: { src: 'upgrades/health_up.png', img: null },
      semi: { src: 'upgrades/semi.png', img: null },
      auto: { src: 'upgrades/auto.png', img: null },
      shot: { src: 'upgrades/shot.png', img: null },
      laser: { src: 'upgrades/laser.png', img: null },
      explosion: { src: 'upgrades/explosion.png', img: null },
      sniper: { src: 'upgrades/sniper.png', img: null },
      //kamikaze: { src: 'upgrades/sniper.png', img: null },
      bold: { src: 'upgrades/bold.png', img: null },
      italic: { src: 'upgrades/italic.png', img: null },
      uppercase: { src: 'upgrades/uppercase.png', img: null },
      underline: { src: 'upgrades/underline.png', img: null },
    };
  }

  setup_ui() {
    this.skip = new TextButton(
      'Skip',
      { x: 0, y: 0 },
      { x: textWidth('Skip') + 20, y: SQUARE_BUTTON },
    )

    this.buttons = [];
    this.buttons.push(this.skip);
    this.reset_upgrades();

    this.resize();
  }

  reset_upgrades() {
    this.upgrades = [];
    let size = createVector(250, 200);
    for (let i=3; i>0;i--) {
      this.upgrades.push(
        new UpgradeCard(
          createVector(0, 0),
          size,
          i * .5,
          this.random_upgrade(),
          this.images
        )
      );
    }

    this.resize();
  }

  // p5js
  draw() {
    super.draw();
    for (const v of this.upgrades) v.draw();
  }

  update() {
    super.update();
    for (const v of this.upgrades) v.update();
  }

  mouseClicked() {
    if (this.skip.hover()) return STATE_BATTLE;

    for (const v of this.upgrades) {
      if (v.hover()) {
        game.sounds['upgrade'].play();
        upgrades.push(v.upgrade);
        return STATE_BATTLE;
      }
    }
  }

  resize() {
    const len = this.upgrades.length;
    for (let i=3; i>0; i--) {
      this.upgrades[len - i].resize(0, WINDOW_TOP + (i * height * .25));
    }

    this.skip.resize(
      WINDOW_LEFT + ((textWidth('Skip') + 20) * .5) + 20,
      WINDOW_TOP + (SQUARE_BUTTON * .5) + 20
    );

  }

  // Gamge Logic
  random_upgrade() {
    const traits = count_traits(team),
      trait = random(Object.keys(traits));
    let available_upgrades = [...AVAILABLE_UPGRADES];

    // Equip weapon
    const trait_upgrades = upgrades.filter(upgrade => upgrade.trait === trait);
    if (trait_upgrades.length > 0) {
      if (trait_upgrades.filter(upgrade => 'ammo' in upgrade)) {
        available_upgrades.concat(
          [{ weapon: ATTACK_SHOTGUN },
          { weapon: ATTACK_AUTO }]
        )
      }
    }

    available_upgrades.forEach((u) => u.trait = trait);

    // Remove repeated weapon
    const weapons = [... new Set(team
      .filter(char => char.attributes.trait === trait)
      .map(char => char.attributes.weapon))];

    // Remove repeated styles
    const styles = [... new Set(team
      .filter(char => char.attributes.trait === trait)
      .map(char => char.attributes.style))];

    available_upgrades = available_upgrades.filter(upgrade => !weapons.includes(upgrade.weapon));
    available_upgrades = available_upgrades.filter(upgrade => !styles.includes(upgrade.style));
    // Remove style Upper case if trait is special
    if (trait === 'special' || trait === 'number')
      available_upgrades = available_upgrades.filter(upgrade => upgrade.style !== STYLE_UPPERCASE);

    if (this.upgrades.length > 0) {
      // Do not repeat upgrades
      for (const remove of this.upgrades.filter(upgrade => upgrade.upgrade.trait === trait)) {
        available_upgrades = available_upgrades
          .filter(upgrade => JSON.stringify(upgrade) !== JSON.stringify(remove.upgrade));
      }
    }

    return random(available_upgrades);
  }
}