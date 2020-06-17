// start global variables

var user = new player(items, stats);
var currRoom;
var currEnemy;

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

// end global variables


// start classes

// this is the class we use for the player in this class we have made methods which handel everything from taking damage to equiping and selling weaposn
// most of the functions which have anything to do with the player are stored here as methods on the class
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
  updateAttack() {
    this.stats.attack = this.stats.currWeaponAttack * this.stats.xp;
  }
  updateHealth() {
    this.stats.maxHealth = this.stats.maxHealth * this.stats.xp;
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
  
  // this function generates the random loot which you aquire from defeating enemies
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
  
  // these are the functions with handling equiping new weapons and using items
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
        this.updateAttack();
      } else if(currRoom.isBoss) {
        writeText("text", "You killed the boss!!!!!");
        this.stats.xp += 0.3;
        this.updateAttack();
        this.updateHealth();
      }
      this.inventory[currRoom.loot][0] ++;
      writeText("text", "You found: " + currRoom.loot);
      currEnemy = null;
    }
  }
}

// this is the class we use for the enemy, this is a very simple class to just keep track of the current health and attack of the current enemy
// whenever you leave a room we destroy the enemy and when you enter another room with and enemy then we recreate the enemy
class enemy {
  constructor(health, attack) {
    this.health = health * user.stats.level;
    this.attack = attack * user.stats.level;
    this.stunnedFor = 0;
  }
}

//this is the class we use for the room you are currently in, depending on a randomly generated number we either construct the room to be a store room,
// boss room, enemy room, or just a plain empty room
class normRoom {
  constructor(isStore, isBoss, isEnemy, enemy, doors, storeItems) {
    this.isStore = isStore;
    this.isEnemy = isEnemy;
    this.isBoss = isBoss;
    this.storeItems = storeItems;
    this.enemy = enemy;
    // this is if it's a regular enemy room
    if (isEnemy) {
      this.loot = user.generateLoot(false);
      this.north = doors[0];
      this.south = doors[1];
      this.east = doors[2];
      this.west = doors[3];
      // this is for when it's a boss room
    } else if (isBoss) {
      this.loot = user.generateLoot(true);
      this.north = doors[0];
      this.south = doors[1];
      this.east = doors[2];
      this.west = doors[3];
      // this if for when it's a store rom
    } else if (isStore) {
      this.north = doors[0];
      this.south = doors[1];
      this.east = doors[2];
      this.west = doors[3];
      // this is for when it's a plain room
    } else {
      this.north = doors[0];
      this.south = doors[1];
      this.east = doors[2];
      this.west = doors[3];
    }
    
  }
}

// end classes


// start functions

// this is the function which we made to be able to write to div boxes
function writeText(div, text) {
    var currText = document.getElementById(div).innerHTML;
    var newText = currText + "<br>" + "-------------------------------------------" + "<br>" + text;
    document.getElementById(div).innerHTML = newText;
    var curr = document.getElementById('text');
    curr.scrollTop = curr.scrollHeight;
}

// we needed to make a seperate function for printing text to the stats section of the screen since it had different formating than the main text
function writeStats(div, text) {
  document.getElementById(div).innerHTML = text;
}

// this is a function which randomly generates a room description and changes based on what type of room it is
function generateRoomDescription() {
  
  var thing = "You enter a " + ((currRoom.isBoss) ? "boss room which is " : (currRoom.isStore) ? "store room which is " : "") + roomSize[Math.round(Math.random() * 5)] + " room with " + walls[Math.round(Math.random() * 6)] + " on the walls. The room smells faintly like " + smell[Math.round(Math.random() * 4)] + " and feels " + feel[Math.round((Math.random() * 3))] + ". You notice there is " + ((currRoom.isEnemy) ? "an enemy " : "no enemy ") + " in the room. Exits can be found " + ((currRoom.north) ? "on the north, " : "") + ((currRoom.south) ? "on the south, " : "") + ((currRoom.east) ? "on the east, " : "") + "and " + ((currRoom.west) ? "on the west" : "on no other") + " walls.";
  return thing;
}

// this is the function which handles a player moving, when the player clicks a button to move in a direction it feeds into this function to make sure that
// they are able to move through that door and if they are able to then it generates to new room which the move into
function move(direction) {
  if (direction == "north" && currRoom.north) {
    generate();
    writeText("text", generateRoomDescription());
  } else if (direction == "south" && currRoom.south) {
    generate();
    writeText("text", generateRoomDescription());
  } else if (direction == "east" && currRoom.east) {
    generate();
    writeText("text", generateRoomDescription());
  } else if (direction == "west" && currRoom.west) {
    generate();
    writeText("text", generateRoomDescription());
  } else if(direction == "down") {
    // when trying to move down a level this funtion checks to see if you are on the last floor and if you are then it takes you to the winning screen
    writeText("text", "You are descending a level down........");
    if (user.stats.level >= 5) {
      window.location.replace("https://dungeon-crawler-text.glitch.me/win.html");
    }
    generate();
    increaseLevel();
    writeText("text", generateRoomDescription());
  } else {
    writeText("text", "You can not move " + direction);
    console.log("you gave an incorrect direction");
  }
}

// this function randomly generates how many and where there are doors in your current room, it also makes sure that there will always be at least one open door
// so that you aren't able to get stuck in a room
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

// this is the function which randomly generates what type of room you move into and then creates a room object based on that
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


// when you click start game this is the function which runs to start all the initial processes
function startGame() {
  currRoom = new normRoom(true, false, false, null, [true, true, true, true], storeItems);
  document.getElementById("main").style.visibility = "visible";
  document.getElementById("startButton").style.visibility = "hidden";
  
  writeText("text", generateRoomDescription());
  
  // this is a update function which runs every half a second to make sure you haven't died and to update your current stats and to hide things which shouldn't be visible
  setInterval(function update() {
    if (currRoom.isStore) {
      document.getElementById('store').style.visibility = "visible";
    } else {
      document.getElementById('store').style.visibility = "hidden";
    }
    if (currRoom.isBoss && currEnemy == null) {
      document.getElementById('downButton').style.visibility = "visible";
    } else {
      document.getElementById('downButton').style.visibility = "hidden";
    }
    user.updateStats();
    user.checkHealth();
  }, 500);
}

//when you click the start game on the main page this is the function which takes you to the game
function moveToGame() {
  window.location.replace("https://dungeon-crawler-text.glitch.me/game.html");
}

// this is a function to increase which floor you are on everytime you kill a boss a choose to move further along
function increaseLevel() {
  user.stats.level ++;
}

// end functions
