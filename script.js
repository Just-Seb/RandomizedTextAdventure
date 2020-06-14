var items = {
  dagger: [1, 2],
  axe: [0, 4],
  sword: [0, 6],
  mace: [0, 8],
  claymore: [0, 10],
  health_pot_sm: [1],
  health_pot_md: [0],
  health_pot_lg: [0],
  bomb: [0, 25],
  stun_grenade: [0, 1],
};

var stats = {
  gold: 4,
  xp: 1,
  level: 1,
  maxHealth: 100,
  currHealth: 100,
  currWeaponAttack: 2,
  attack: 1,
  currWeapon: 'dagger',
};

var storeItems = {
  dagger: [1, 1],
  axe: [2, 2],
  sword: [3, 3],
  mace: [4, 4],
  claymore: [5, 5],
  health_pot_sm: [2, 1],
  health_pot_md: [4, 2],
  health_pot_lg: [6, 3],
  bomb: [6, 2],
  stun_grenade: [6, 2],
};

var roomSize = ["small", "narrow", "large", "long", "tall"];
var walls = ["vines", "roots", "blood", "ancient text", "spiders", "slime"];
var smell = ["ale", "fish", "goblin", "rot"];
var feel = ["cold", "hot", "damp"];

class player {
  constructor(inventory, stats) {
    this.stats = stats;
    this.inventory = inventory;
  }
  updateWeapon(weapon, damage) {
    if (this.inventory[weapon][0] <= 1) {
     this.stats.currWeaponAttack = this.inventory[weapon][1]; 
    }
  }
  updateAttackHealth() {
    this.stats.attack = this.stats.currWeaponAttack * this.stats.xp;
  }
  updateStats() {
    var stats =
      "Gold: " +
      this.stats.gold +
      "<br>" +
      "Level: " +
      this.stats.level +
      "<br>" +
      "Xp: " +
      this.stats.xp +
      "<br>" +
      "Max Health: " +
      this.stats.maxHealth +
      "<br>" +
      "Current Health: " +
      this.stats.currHealth +
      "<br>" +
      "Attack: " +
      this.stats.attack +
      "<br>" +
      "Current Weapon: " +
      this.stats.currWeapon +
      "<br>" +
      "<br>" +
      "Inventory: ";

    var inven = "";
    for (var key in this.inventory) {
      if (this.inventory[key][0] == 0) {
        continue;
      }
      inven =
        inven +
        "<button onclick='user." +
        key +
        "()'>" +
        key +
        " (" +
        this.inventory[key][0] +
        ")" +
        "</button>" +
        ", ";
    }
    
    var storeSell = "Sell: ";
    for (var key in currRoom.storeItems) {
      if ((key == this.stats.currWeapon && this.inventory[key][0] > 1) || (key != this.stats.currWeapon && this.inventory[key][0] > 0)) {
        storeSell +=
          "<button onclick='user.sellItem(\"" +
          key +
          "\")'>" +
          key +
          " cost(" +
          currRoom.storeItems[key][0] +
          ")" +
          "</button>" +
          ", ";
      }
    }
    
    var storeBuy = "Buy: ";
    for (var key in currRoom.storeItems) {
      if ((this.stats.gold >= currRoom.storeItems[key][0]) && (this.stats.level >= currRoom.storeItems[key][1])) {
        storeBuy +=
          "<button onclick='user.buyItem(\"" +
          key +
          "\")'>" +
          key +
          " cost(" +
          currRoom.storeItems[key][0] +
          ")" +
          "</button>" +
          ", ";
      }
    }
    
    writeStats("stats", stats);
    writeStats("inventory", inven);
    writeStats("storeSell", storeSell);
    writeStats("storeBuy", storeBuy);
    var stats = "";
    if (currEnemy) {
      stats =
          "Health: " +
          currEnemy.health +
          "<br>" +
          "Attack: " +
          currEnemy.attack +
          "<br>" +          
          "Stunned for: " +
          currEnemy.stunnedFor +
          "<br>";
    }
    writeStats("enemyStats", stats);
  }
  
  sellItem(item) {
    user.inventory[item][0] --;
    user.stats.gold += currRoom.storeItems[item][0];
    writeText("text", "You sold: " + item + ".");
  }
  
  buyItem(item) {
    user.inventory[item][0] ++;
    user.stats.gold -= currRoom.storeItems[item][0];
    writeText("text", "You bought: " + item + ".");
  }
  
  generateLoot(isBoss) {
    var possibleLoot = ["health_pot_sm", "health_pot_md", "health_pot_lg", "dagger", "axe", "sword", "mace", "claymore", "bomb", "stun_grenade"];
    var level = this.stats.level;
    
    if (isBoss) {
      level ++;
    }
    
    if (level <= 1) {
      possibleLoot = ["health_pot_sm", "health_pot_md", "health_pot_lg", "dagger", "bomb", "stun_grenade"];
      return possibleLoot[Math.round(Math.random() * 5)];
    } else if (level <= 2) {
      possibleLoot = ["health_pot_sm", "health_pot_md", "health_pot_lg", "dagger", "axe", "bomb", "stun_grenade"];
      return possibleLoot[Math.round(Math.random() * 6)];
    } else if (level <= 3) {
      possibleLoot = ["health_pot_sm", "health_pot_md", "health_pot_lg", "dagger", "axe", "sword", "bomb", "stun_grenade"];
      return possibleLoot[Math.round(Math.random() * 7)];
    } else if (level <= 4) {
      possibleLoot = ["health_pot_sm", "health_pot_md", "health_pot_lg", "dagger", "axe", "sword", "mace", "bomb", "stun_grenade"];
      return possibleLoot[Math.round(Math.random() * 8)];
    } else if (level <= 5) {
      possibleLoot = ["health_pot_sm", "health_pot_md", "health_pot_lg", "dagger", "axe", "sword", "mace", "claymore", "bomb", "stun_grenade"];
      return possibleLoot[Math.round(Math.random() * 9)];
    }
  }
  
  health_pot_sm() {
    if (this.stats.currHealth < this.stats.maxHealth) {
     this.stats.currHealth += 5;
      this.inventory.health_pot_sm[0] --;
      this.checkHealth();
      this.updateStats();
      writeText("text", "you used a small health pot");
    } else {
      writeText("text", "you already have max health");
    }
  }
  health_pot_md() {
    if (this.stats.currHealth < this.stats.maxHealth) {
     this.stats.currHealth += 10;
      this.inventory.health_pot_md[0] --;
      this.checkHealth();
      this.updateStats();
      writeText("text", "you used a medium health pot");
    } else {
      writeText("text", "you already have max health");
    }
  }
  health_pot_lg() {
    if (this.stats.currHealth < this.stats.maxHealth) {
     this.stats.currHealth += 15;
      this.inventory.health_pot_lg[0] --;
      this.checkHealth();
      this.updateStats();
      writeText("text", "you used a large health pot");
    } else {
      writeText("text", "you already have max health");
    }
  }
  dagger() {
    this.stats.currWeapon = 'dagger';
    this.stats.currWeaponAttack = this.inventory.dagger[1];
  }
  axe() {
    this.stats.currWeapon = 'axe';
    this.stats.currWeaponAttack = this.inventory.axe[1];
  }
  sword() {
    this.stats.currWeapon = 'sword';
    this.stats.currWeaponAttack = this.inventory.sword[1];
  }
  mace() {
    this.stats.currWeapon = 'mace';
    this.stats.currWeaponAttack = this.inventory.mace[1];
  }
  claymore() {
    this.stats.currWeapon = 'claymore';
    this.stats.currWeaponAttack = this.inventory.claymore[1];
  }
  bomb() {
    this.dealDamage(user.inventory.bomb[1]);
    user.inventory.bomb[0] --;
  }
  stun_grenade() {
    currEnemy.stunnedFor += user.inventory.stun_grenade[1];
    user.inventory.stun_grenade[0] --;
  }
  checkHealth() {
    if (this.stats.currHealth <= 0) {
      window.location.replace(
        "https://dungeon-crawler-text.glitch.me/death.html"
      );
    }
    if (this.stats.currHealth > this.stats.maxHealth) {
      this.stats.currHealth = this.stats.maxHealth;
      writeText("text", "you are now at full health");
    }
  }
  takeDamage(damage) {
    this.stats.currHealth -= damage;
  }
  dealDamage(damage = user.stats.attack) {
    if (currEnemy == null) {
      return;
    }
    currEnemy.health -= damage;
    if (currEnemy.stunnedFor > 0) {
      currEnemy.stunnedFor --;
    } else {
      this.takeDamage(currEnemy.attack);
    }
    if (currEnemy.health <= 0) {
      if (currRoom.isEnemy) {
        writeText("text", "You killed the enemy!");
        this.stats.xp += 0.1;
      } else if(currRoom.isBoss) {
        writeText("text", "You killed the boss!!!!!");
        this.stats.xp += 0.3;
      }
      this.inventory[currRoom.loot][0] ++;
      currEnemy = null;
    }
  }
}

class enemy {
  constructor(health, attack) {
    this.health = health * user.stats.level;
    this.attack = attack * user.stats.level;
    this.stunnedFor = 0;
  }
}

class normRoom {
  constructor(isStore, isBoss, isEnemy, enemy, doors, storeItems) {
    this.isStore = isStore;
    this.isEnemy = isEnemy;
    this.isBoss = isBoss;
    this.storeItems = storeItems;
    this.enemy = enemy;
    if (isEnemy) {
      this.loot = user.generateLoot(false);
      this.north = doors[0];
      this.south = doors[1];
      this.east = doors[2];
      this.west = doors[3];
    } else if (isBoss) {
      this.loot = user.generateLoot(true);
      this.north = doors[0];
      this.south = doors[1];
      this.east = doors[2];
      this.west = doors[3];
    } else if (isStore) {
      this.north = doors[0];
      this.south = doors[1];
      this.east = doors[2];
      this.west = doors[3];
    } else {
      this.north = doors[0];
      this.south = doors[1];
      this.east = doors[2];
      this.west = doors[3];
    }
    
  }
}

function showStore() {
  document.getElementById('store').style.visibility = "visible";
  
}

function writeText(div, text) {
    var currText = document.getElementById(div).innerHTML;
    var newText = currText + "<br>" + "-------------------------------------------" + "<br>" + text;
    document.getElementById(div).innerHTML = newText;
    var curr = document.getElementById('text');
    curr.scrollTop = curr.scrollHeight;
}

function writeStats(div, text) {
  document.getElementById(div).innerHTML = text;
}

function generateRoomDescription(north, south, east, west, enemy) {
  if (enemy) {
    enemy = "an enemy";
  } else {
    enemy = "no enemy";
  }
  if (north) {
    north = " on the north";
  } else {
    north = " not on the north";
  }
  if (south) {
    south = ", on the south";
  } else {
    south = ", not on the south";
  }
  if (east) {
    east = ", on the east, ";
  } else {
    east = ", not on the east, ";
  }
  if (west) {
    west = " on the west";
  } else {
    west = " not on the west";
  }
  
  var thing = "You enter a " + roomSize[Math.round(Math.random() * 5)] + " room with " + walls[Math.round(Math.random() * 6)] + " on the walls. The room smells faintly like " + smell[Math.round(Math.random() * 4)] + " and feels " + feel[Math.round((Math.random() * 3))] + ". You notice there is " + enemy + " in the room. Exits can be found " + north + south + east + "and" + west + " walls.";
  return thing;
}

function move(direction) {
  if (direction == "north" && currRoom.north) {
    generate();
    writeText("text", generateRoomDescription(currRoom.north, currRoom.south, currRoom.east, currRoom.west, currRoom.isEnemy));
  } else if (direction == "south" && currRoom.south) {
    generate();
    writeText("text", generateRoomDescription(currRoom.north, currRoom.south, currRoom.east, currRoom.west, currRoom.isEnemy));
  } else if (direction == "east" && currRoom.east) {
    generate();
    writeText("text", generateRoomDescription(currRoom.north, currRoom.south, currRoom.east, currRoom.west, currRoom.isEnemy));
  } else if (direction == "west" && currRoom.west) {
    generate();
    writeText("text", generateRoomDescription(currRoom.north, currRoom.south, currRoom.east, currRoom.west, currRoom.isEnemy));
  } else if(direction == "down") {
    writeText("text", "You are descending a level down........");
    if (user.stats.level >= 5) {
      window.location.replace("https://dungeon-crawler-text.glitch.me/win.html");
    }
    generate();
    increaseLevel();
    writeText("text", generateRoomDescription(currRoom.north, currRoom.south, currRoom.east, currRoom.west, currRoom.isEnemy));
  } else {
    console.log("you gave an incorrect direction");
  }
}

function generateDoors() {
  var doors = [false, false, false, false];
  while (!doors[0] && !doors[1] && !doors[2] && !doors[3]) {
    if (Math.random() <= 0.5) {
      doors[0] = true;
    }
    if (Math.random() <= 0.5) {
      doors[1] = true;
    }
    if (Math.random() <= 0.5) {
      doors[2] = true;
    }
    if (Math.random() <= 0.5) {
      doors[3] = true;
    }
  }
  return doors;
}

function generate() {
  var ranNum = Math.random();
  var isStore = false;
  var isBoss = false;
  var isEnemy = false;
  var e = null;
  if (ranNum <= 0.10) {
    // boss room
    isBoss = true;
    e = new enemy(30, 3);
  } else if (ranNum <= .20 && ranNum > .10) {
    // store room
    isStore = true;
  } else if (ranNum <= .75 && ranNum > .20) {
    // enemy room
    isEnemy = true;
    e = new enemy(10, 1);
  } else if (ranNum <= 1 && ranNum > .75) {
    // normal room
  } else {
    console.log("there was an error generating random number!!!!!!!!!");
  }
  currEnemy = e;
  currRoom = new normRoom(isStore, isBoss, isEnemy, e, generateDoors(), storeItems);
}

function startGame() {
  currRoom = new normRoom(true, false, false, null, [true, true, true, true], storeItems);
  document.getElementById("main").style.visibility = "visible";
  document.getElementById("startButton").style.visibility = "hidden";
  
  writeText("text", generateRoomDescription(currRoom.north, currRoom.south, currRoom.east, currRoom.west, currRoom.isEnemy));
  
  setInterval(function update() {
    if (currRoom.isStore) {
      showStore();
    } else {
      document.getElementById('store').style.visibility = "hidden";
    }
    if (currRoom.isBoss && currEnemy == null) {
      document.getElementById('downButton').style.visibility = "visible";
    } else {
      document.getElementById('downButton').style.visibility = "hidden";
    }
    user.updateAttackHealth();
    user.updateStats();
    user.checkHealth();
  }, 500);
}

function moveToGame() {
  window.location.replace("https://dungeon-crawler-text.glitch.me/game.html");
}

function increaseLevel() {
  user.stats.level ++;
}

var user = new player(items, stats);
var currRoom;
var currEnemy;
