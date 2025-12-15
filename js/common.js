// Constants
const STATE_MENU = 0,
      STATE_TEAM_EDITOR = 1,
      STATE_TEAM_EDITOR_INFO = 2,
      STATE_BATTLE = 3,
      STATE_BATTLE_MENU = 4,
      STATE_TEAM_VIEW = 5,
      STATE_UPGRADE = 6,
      STATE_SETTINGS = 7,
      STATE_SANDBOX = 8,
      STATE_ACHIEVEMENT = 9,
      STATE_TRAITS = 10,
      BACKGROUND_MATRIX = 0,
      BACKGROUND_ALIVE = 1,
      ACTION_WALK = 0,
      ACTION_ATTACK = 1,
      UPGRADE_DAMAGE = 2,
      UPGRADE_HEALTH = 5,
      UPGRADE_AMMO = 1,
      ATTACK_MELEE = 0,
      ATTACK_AUTO = 1,
      ATTACK_SEMI_AUTO = 2,
      ATTACK_SHOTGUN = 3,
      ATTACK_KAMIKAZE = 4,
      ATTACK_LASER = 5,
      ATTACK_EXPLOSIONS = 6,
      ATTACK_GUIDED = 7,
      WEAPON_NAME = [
        'melee',
        'auto',
        'semi-auto',
        'shotgun',
        'suicide',
        'laser',
        'explosions',
        'guided',
      ],
      GHOST_LENGTH = 5,
      LASER_DURATION = 3.0
      STYLE_NORMAL = 0,
      STYLE_BOLD = 1,
      STYLE_ITALIC = 2,
      STYLE_UPPERCASE = 3,
      STYLE_NAME = [
        'normal',
        'bold',
        'italic',
        'uppercase',
      ],
      ENEMY_TEAM = 'ENEMY',
      PLAYER_TEAM = 'PLAYER',
      SHADOW_GAP = 4,
      STROKE_WEIGHT = 4,
      GAME_TITLE = 'Letter Wars',
      //BRAILLE = ['⠁', '⠂', '⠃', '⠄', '⠅', '⠆', '⠇', '⠈', '⠉', '⠊', '⠋', '⠌', '⠍', '⠎', '⠏', '⠐', '⠑', '⠒', '⠓', '⠔', '⠕', '⠖', '⠗', '⠘', '⠙', '⠚', '⠛', '⠜', '⠝', '⠞', '⠟', '⠠', '⠡', '⠢', '⠣', '⠤', '⠥', '⠦', '⠧', '⠨', '⠩', '⠪', '⠫', '⠬', '⠭', '⠮', '⠯', '⠰', '⠱', '⠲', '⠳', '⠴', '⠵', '⠶', '⠷', '⠸', '⠹', '⠺', '⠻', '⠼', '⠽', '⠾', '⠿', '⡀', '⡁', '⡂', '⡃', '⡄', '⡅', '⡆', '⡇', '⡈', '⡉', '⡊', '⡋', '⡌', '⡍', '⡎', '⡏', '⡐', '⡑', '⡒', '⡓', '⡔', '⡕', '⡖', '⡗', '⡘', '⡙', '⡚', '⡛', '⡜', '⡝', '⡞', '⡟', '⡠', '⡡', '⡢', '⡣', '⡤', '⡥', '⡦', '⡧', '⡨', '⡩', '⡪', '⡫', '⡬', '⡭', '⡮', '⡯', '⡰', '⡱', '⡲', '⡳', '⡴', '⡵', '⡶', '⡷', '⡸', '⡹', '⡺', '⡻', '⡼', '⡽', '⡾', '⡿', '⢀', '⢁', '⢂', '⢃', '⢄', '⢅', '⢆', '⢇', '⢈', '⢉', '⢊', '⢋', '⢌', '⢍', '⢎', '⢏', '⢐', '⢑', '⢒', '⢓', '⢔', '⢕', '⢖', '⢗', '⢘', '⢙', '⢚', '⢛', '⢜', '⢝', '⢞', '⢟', '⢠', '⢡', '⢢', '⢣', '⢤', '⢥', '⢦', '⢧', '⢨', '⢩', '⢪', '⢫', '⢬', '⢭', '⢮', '⢯', '⢰', '⢱', '⢲', '⢳', '⢴', '⢵', '⢶', '⢷', '⢸', '⢹', '⢺', '⢻', '⢼', '⢽', '⢾', '⢿', '⣀', '⣁', '⣂', '⣃', '⣄', '⣅', '⣆', '⣇', '⣈', '⣉', '⣊', '⣋', '⣌', '⣍', '⣎', '⣏', '⣐', '⣑', '⣒', '⣓', '⣔', '⣕', '⣖', '⣗', '⣘', '⣙', '⣚', '⣛', '⣜', '⣝', '⣞', '⣟', '⣠', '⣡', '⣢', '⣣', '⣤', '⣥', '⣦', '⣧', '⣨', '⣩', '⣪', '⣫', '⣬', '⣭', '⣮', '⣯', '⣰', '⣱', '⣲', '⣳', '⣴', '⣵', '⣶', '⣷', '⣸', '⣹', '⣺', '⣻', '⣼', '⣽', '⣾', '⣿'],
      NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      VOWELS = ['a', 'e', 'i', 'o', 'u'],
      CONSONANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'],
      SPECIALS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '{', '}', '\\', '|', ';', ':', '\'', '"', ',', '.', '<', '>', '/', '?', '`', '~'];

// Controlled by game
let entities = [],
  bullets = [],
  particles = [],
  team = [],
  enemy_team = [],
  upgrades = [];

// Settings
let IMAGES = {},
  CURRENT_COLORS = 0,
  WAVE_QUANTITY = 5,
  AVAILABLE_CHARACTERS,
  TEAM_SIZE,
  ENEMY_TEAM_SIZE,
  AVAILABLE_UPGRADES,
  ACHIEVEMENTS_STATUS = [
    [true, true, true, true],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ],
  ACHIEVEMENTS_UNLOCKED = [
    [true, true, true, true],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ];
setup_values();

// Setup
function setup_values() {
  AVAILABLE_CHARACTERS = [...VOWELS];
  TEAM_SIZE = 3;
  ENEMY_TEAM_SIZE = 3;
  AVAILABLE_UPGRADES = [
    //{ buffs: { ammo: UPGRADE_AMMO } },
    //{ buffs: { damage: UPGRADE_DAMAGE } },
    //{ buffs: { max_health: UPGRADE_HEALTH } },
    //{ buffs: { damage: UPGRADE_DAMAGE * .5,
    //  max_health: UPGRADE_HEALTH * .5 } },
    { weapon: ATTACK_SEMI_AUTO },
    { style: STYLE_BOLD },
    { style: STYLE_ITALIC },
    { style: STYLE_UPPERCASE },
  ];
}

// Getters
function get_trait(char) {
  if (VOWELS.includes(char)) return 'vowel';
  if (CONSONANTS.includes(char)) return 'consonant';
  if (NUMBERS.includes(char)) return 'number';
  return 'special';
}

function get_buff(trait) {
  const buffs = {
    vowel: { max_health: UPGRADE_HEALTH },
    consonant: { max_health: UPGRADE_HEALTH * .5,
      damage: UPGRADE_DAMAGE * .5 },
    number: { damage: UPGRADE_DAMAGE, },
    special:  { ammo: UPGRADE_AMMO, }
  };
  return buffs[trait];
}

// Auxiliar functions
function count_traits(team) {
  const traits = {};
  for (const v of team) {
    if (traits[v.attributes.trait] == undefined) {
      traits[v.attributes.trait] = 1;
      continue;
    }
    traits[v.attributes.trait] += 1;
  }
  return traits;
}

function setup_achievements() {
  setup_values();
  for (let i=0; i<ACHIEVEMENTS_UNLOCKED.length; i++) {
    for (let j=0; j<ACHIEVEMENTS_UNLOCKED[i].length; j++) {
      if (ACHIEVEMENTS_STATUS[i][j]) {
        change_achievement(i, j, ACHIEVEMENTS_STATUS[i][j]);
      }
    }
  }
  if (team.length > TEAM_SIZE) {
    while (team.length > TEAM_SIZE) {
      team.splice(0, 1);
    }
  } else {
    while (team.length < TEAM_SIZE) {
      team.push(new Char(PLAYER_TEAM, random(VOWELS)));
    }
  }
}

function change_achievement(i, j, activate) {
  if (i === 0) {
    let characters = [];
    if (j === 0) characters = CONSONANTS;
    if (j === 1) characters = NUMBERS;
    if (j === 2) characters = SPECIALS;

    if (activate) {
      AVAILABLE_CHARACTERS = AVAILABLE_CHARACTERS.concat(characters);
    } else {
      AVAILABLE_CHARACTERS = AVAILABLE_CHARACTERS.filter(
        char => characters.includes(char)
      );

    }
    return;
  }
  if (i === 1) {
    if (activate) TEAM_SIZE++;
    else TEAM_SIZE--;
  }
  if (i === 2) {
    const new_weapon = [ATTACK_GUIDED, ATTACK_KAMIKAZE, ATTACK_LASER, ATTACK_EXPLOSIONS];
    if (activate) AVAILABLE_UPGRADES.push({ weapon: new_weapon[j] });
    else AVAILABLE_UPGRADES = AVAILABLE_UPGRADES
      .filter(upgrade => JSON.stringify(upgrade) !== JSON.stringify({ weapon: new_weapon }));
    return;
  }
}

function setup_colors(change) {
  if (change)
    CURRENT_COLORS = (CURRENT_COLORS + 1) % COLORS.length;
  const c = COLORS[CURRENT_COLORS];
  MAIN_COLOR = c.main;
  MAIN_COLOR_SHADOW = c.shadow;
  DEAD_COLOR = c.dead;
  UPGRADE_COLOR = c.upgrade;
  SECOND_COLOR = c.second;
  TEAM_COLOR = c.team;
  BULLET_COLOR = c.bullet;
  BULLET_COMPLEMENTARY_COLOR = c.bullet_complementary;
}

// UI
function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipod|android|windows phone/.test(userAgent);
}

function small_screen() {
  if (width < 280 || height < 600) return true;
  return false;
}

// Variables
let BUTTON_WIDTH = 250,
    BUTTON_HEIGHT = 100,
    SQUARE_BUTTON = 50,
    CHARACTER_SIZE = 32,
    SMALL_SCREEN = false;

if (isMobile()) {
  BUTTON_WIDTH = 200;
  BUTTON_HEIGHT = 100;
  SQUARE_BUTTON = 50;
  CHARACTER_SIZE *= .7;
  // TODO: Make everthing that has hit box scale with CHARACTER_SIZE
}

// Optimization

// Constants
let MIN_VEL = 1;

// General functions
function add(a, b, fix) {
  return parseFloat((parseFloat(a) + parseFloat(b)).toFixed(fix));
}

function sub(a, b, fix) {
  return parseFloat((parseFloat(a) - parseFloat(b)).toFixed(fix));
}

function mul(a, b, fix) {
  return parseFloat((parseFloat(a) * parseFloat(b)).toFixed(fix));
}

// Random
function random_signed() {
  return (Math.random() - 0.5);
}

function random_bool() {
  return (0 >= (Math.random() - 0.5));
}

function random_sign() {
  if (random_bool()) return -1;
  return 1;
}

// Easing functions
function easeInQuad(x) {
  return x * x;
}

function easeInExpo(x) {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

function easeOutElastic(x ) {
  const c4 = (2 * Math.PI) / 3;
  
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

// Math functions
function distSquared(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return dx * dx + dy * dy;
}

function extend_target(s0, s1, range) {
  const angle = atan2(s1.y - s0.y, s1.x - s0.x);
  return createVector(s0.x + (cos(angle) * range), s0.y + (sin(angle) * range));
}

function point_line_dist(p, s0, s1) {
  let num = abs((s1.y - s0.y) * p.x - (s1.x - s0.x) * p.y + s1.x * s0.y - s1.y * s0.x);
  let denom = p5.Vector.dist(s0, s1);
  return num / denom;
}