class Doll extends Char {
  constructor(team, char) { super(team, char); };
  next_action() { return ACTION_WALK; }
}
