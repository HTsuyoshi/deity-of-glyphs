class Upgrade extends Screen {
  constructor() {
    super();
    this.upgrades = [];
    this.images = {
      ammo_up: { src: 'upgrades/ammo_up.png', img: null },
      damage_health_up: { src: 'upgrades/damage_health_up.png', img: null },
      damage_up: { src: 'upgrades/damage_up.png', img: null },
      health_up: { src: 'upgrades/health_up.png', img: null },
      semi: { src: 'upgrades/semi.png', img: null },
      auto: { src: 'upgrades/auto.png', img: null },
      shot: { src: 'upgrades/shot.png', img: null },
      laser: { src: 'upgrades/laser.png', img: null },
      explosion: { src: 'upgrades/explosion.png', img: null },
      sniper: { src: 'upgrades/sniper.png', img: null },
      kamikaze: { src: 'upgrades/kamikaze.png', img: null },
      angel: { src: 'upgrades/angel.png', img: null },
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
    let size = { x: UPGRADE_CARD_WIDTH, y: UPGRADE_CARD_HEIGHT };
    for (let i=3; i>0;i--) {
      const upgrade = this.random_upgrade();
      this.upgrades.push(
        new UpgradeCard(
          createVector(0, 0),
          size,
          i * .5,
          upgrade,
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
        if (v.multiplier > 1) game.play_sound(`upgrade_${v.multiplier}`);
        else game.play_sound('upgrade');
        upgrades.push(v.upgrade);
        return STATE_BATTLE;
      }
    }
  }

  resize() {
    const len = this.upgrades.length;
    for (let i=3; i>0; i--) {
      if (MOBILE) this.upgrades[len - i].resize(0, WINDOW_TOP + (height * .1) + (i * height * .22));
      else this.upgrades[len - i].resize(0, WINDOW_TOP + (i * height * .25));
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
    let available_upgrades = AVAILABLE_UPGRADES.map(map => Object.assign({}, map));

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
    const weapons = [... new Set(team_battlefield
      .filter(char => char.attributes.trait === trait)
      .map(char => char.attributes.weapon))];

    // Remove repeated styles
    const styles = [... new Set(team_battlefield
      .filter(char => char.attributes.trait === trait)
      .map(char => char.attributes.style))];

    available_upgrades = available_upgrades.filter(upgrade => !weapons.includes(upgrade.weapon));
    available_upgrades = available_upgrades.filter(upgrade => !styles.includes(upgrade.style));

    // Remove style Upper case if trait is special or number
    if (trait === 'special' || trait === 'number')
      available_upgrades = available_upgrades.filter(upgrade => upgrade.style !== STYLE_UPPERCASE);

    if (this.upgrades.length > 0) {
      // Remove Style or Weapon if already has upgrade of one of them
      for (const u of this.upgrades) {
        if ('style' in u.upgrade)
          available_upgrades = available_upgrades.filter(upgrade => !('style' in upgrade));

        if ('weapon' in u.upgrade)
          available_upgrades = available_upgrades.filter(upgrade => !('weapon' in upgrade));
      }

      // Do not repeat upgrades
      for (const remove of this.upgrades.filter(upgrade => upgrade.upgrade.trait === trait)) {
        available_upgrades = available_upgrades
          .filter(upgrade => !this.compare_upgrades(upgrade, remove.upgrade));
      }
    }

    return random(available_upgrades);
  }

  compare_upgrades(d1, d2) {
    const keys1 = Object.keys(d1).filter(k => k !== 'multiplier'),
      keys2 = Object.keys(d2).filter(k => k !== 'multiplier');

    if (keys1.length !== keys2.length) return false;

    return keys1.every(
      key => d2.hasOwnProperty(key) && d1[key] === d2[key]
    );
  }
}