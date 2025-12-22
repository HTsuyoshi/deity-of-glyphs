class Boss extends Char {
  constructor(team, char) {
    super(team, char);
  }

  setup() {
    this.animation.spin_animation = 0;
    this.spin_animation_vel = 1;

    this.dolls_per_circle = 10;
    this.circles = 4;
    this.dolls = [];
    for (let i=0; i<this.circles; i++) {
      const dolls_list = [];
      for (let j=0; j<this.dolls_per_circle; j++) {
        const doll = new Doll(this.attributes.team, random(AVAILABLE_CHARACTERS));
        doll.attributes.pos = createVector(
          // TODO: Create in a spiral
          random(width * .75, width) * random_sign(),
          random(height * .75, height) * random_sign()
        );
        doll.attributes.weapon = ATTACK_KAMIKAZE;
        //doll.attributes.current_health = 99999; // REMOVE
        //doll.attributes.max_health = 99999; // REMOVE
        dolls_list.push(doll);
        entities.push(doll);
      }
      this.dolls.push(dolls_list);
    }
    if (this.attributes.team === ENEMY_TEAM) {
      // REMOVE
      //this.attributes.max_health = 99999;
    }
  }

  // p5js
  update() {
    super.update();
    this.animation.spin_animation += this.spin_animation_vel * deltaTime / 1000;
    if (this.animation.spin_animation >= 1) this.spin_animation_vel *= -1;
    if (this.animation.spin_animation <= -1) this.spin_animation_vel *= -1;
    this.update_dolls();
  }

  // Update
  update_dolls() {
    for (const j in this.dolls) {
      for (let i=0; i<this.dolls[j].length; i++) {
        let pos = createVector(this.attributes.pos.x, this.attributes.pos.y);
        pos.add(this.circle_function(j, i));
        //doll_list[i].attributes.pos = pos;
        this.dolls[j][i].attributes.pos.add(pos.sub(this.dolls[j][i].attributes.pos).normalize().mult(10));
      }
    }
  }

  // Game logic
  attack() {
    const target = this.next_target();
    if (target == null) return;
    
    if (this.dolls.length === 0) return;
    const dolls_list = random(this.dolls);
    const doll = random(dolls_list);
    
    let i = dolls_list.indexOf(doll);
    if (i > -1) dolls_list.splice(i, 1);
    doll.attributes.action.name = ACTION_ATTACK;
    if (dolls_list.length !== 0) return;

    i = this.dolls.indexOf(dolls_list);
    if (i > -1) this.dolls.splice(i, 1);
  }

  circle_function(j, i) {
    const functions = [
      {
        //x: 0,
        x: sin((this.attributes.action.bar * PI * 2) + (PI * 2 / this.dolls_per_circle * i)) * 20,
        y: cos(this.attributes.action.bar * PI * 2 + (PI * 2 / this.dolls_per_circle * i)) * 100
      },
      {
        x: sin((this.attributes.action.bar * PI * 2) + (PI * 2 / this.dolls_per_circle * i)) * 100,
        y: cos(this.attributes.action.bar * PI * 2 + (PI * 2 / this.dolls_per_circle * i)) * 20
        //y: 0
      },
      {
        x: sin((this.attributes.action.bar * PI * 2) + (PI * 2 / this.dolls_per_circle * i)) * 75,
        y: sin(this.attributes.action.bar * PI * 2 + (PI * 2 / this.dolls_per_circle * (i + 1))) * 75
      },
      {
        x: -sin((this.attributes.action.bar * PI * 2) + (PI * 2 / this.dolls_per_circle * (i + 1))) * 75,
        y: sin(this.attributes.action.bar * PI * 2 + (PI * 2 / this.dolls_per_circle * i)) * 75
      },
      //{
      //  x: sin((this.attributes.action.bar * PI * 2) + (PI * 2 / this.dolls_per_circle * i)) * 100,
      //  y: cos(this.attributes.action.bar * PI * 2 + (PI * 2 / this.dolls_per_circle * i)) * 100
      //},
      //{
      //  x: sin((this.attributes.action.bar * PI * 2) + (PI * 2 / 10 * i)) * 100 * sin(this.attributes.action.bar * PI * 2),
      //  y: cos(this.attributes.action.bar * PI * 2 + (PI * 2 / 10 * i)) * 100
      //},
    ];

    return createVector(
      functions[j].x,
      functions[j].y
    );
  }
}