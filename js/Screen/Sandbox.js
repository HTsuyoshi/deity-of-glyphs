class SandBox extends Battle {
  constructor() {
    super();
  }

  setup() {
    super.setup();
    this.setup_sandbox_buttons();
  }

  setup_sandbox_buttons() {
  }

  // p5js
  mouseClicked() {
    const a = new Boss(random(0, 1), 'a');
    a.setup();
    a.attributes.pos = createVector(MOUSE_X, MOUSE_Y);
    entities.push(a);

    //for (const v of entity) 
    //  if (v.mouseClicked()) return;

    if (this.pause_btn.hover()) {
      this.pause = true;
      return STATE_BATTLE_MENU;
    }

    if (this.finish && (this.winner == ENEMY_TEAM)) {
      // TODO: Statistics
      return STATE_TEAM_EDITOR;
    }

    if (this.finish && (this.winner == PLAYER_TEAM)) {
      return STATE_UPGRADE;
    }
  }

  // Game logic
  finished() {}
}