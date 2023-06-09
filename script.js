const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gravity = 0.3

const keys={
    a: {
        pressed:false,
    },
    d: {
        pressed:false,
      },
    ArrowLeft: {   
        pressed:false,
    },
    ArrowRight: {   
        pressed:false,
    },
}

let lastKey;

class Sprite {
  constructor({ 
    position, 
    imageSrc, 
    scale = 3, 
    framesMax = 1, 
    offset = {x:0,y:0},
  
  }) {
    this.offset = offset
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax
    this.framesElapsed = 0;
    this.framesHold = 10;
  }

  draw() {
    const scaleX = canvas.width / this.image.width;
    const scaleY = canvas.height / this.image.height;
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
    
  }
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/bg.gif",
  width: canvas.width,
  height: canvas.height,
});

class Fighter extends Sprite {
  constructor({
    hitBox = { offset: {}, width: undefined, height: undefined },
    position,
    velocity,
    color,
    offset = { x: 0, y: 0 },
    imageSrc,
    scale = 1,
    framesMax = 1,
    sprites,  
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
    this.dead = false
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.hitBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.hitBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: hitBox.offset,
      width: hitBox.width,
      height: hitBox.height,
    };

    this.sprites = sprites;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    console.log(this.sprites);
  }

  update() {
    this.draw();
    if (!this.dead) {
      this.animateFrames();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.hitBox.position.x = this.position.x - this.hitBox.offset.x;
      this.hitBox.position.y = this.position.y - this.hitBox.offset.y;
      if (this.position.y + this.height + this.velocity.y >= canvas.height - 370) {
        this.velocity.y = 0;
      } else {
        this.velocity.y += gravity;
      }
    } else {
      this.switchSprite("death");
    }
  }
  

takeHit() {
  this.health -= 20;
  if (this.health <= 0) {
    this.switchSprite("death");
  } else this.switchSprite("takeHit");
}

attack() {
  this.switchSprite("attack1");
  this.isAttacking = true;
  setTimeout(() => {
    this.isAttacking = false;
  }, 100);
}

  switchSprite(sprite) {

    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
          this.dead = true; 
          return;
        }
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

      if (
        this.image === this.sprites.takeHit.image &&
        this.framesCurrent < this.sprites.takeHit.framesMax - 1
      )
        return;  

    if (this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
      ) return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      
      case "attack1":
          if (this.image !== this.sprites.attack1.image) {
            this.image = this.sprites.attack1.image;
            this.framesMax = this.sprites.attack1.framesMax;
            this.framesCurrent = 0;
          }
          break;
     
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "death":
          if (this.image !== this.sprites.death.image) {
            this.image = this.sprites.death.image;
            this.framesMax = this.sprites.death.framesMax;
            this.framesCurrent = 0;
          }
          break;    
            
        default:
        break;
      }
  }
}

const player = new Fighter({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "green",
  imageSrc: "./images/Samurai/Idle.png",
  framesMax: 10,
  scale: 4,
  offset: {
    x: 0,
    y: 0,
  },
  sprites: {
    idle: {
      imageSrc: "./images/Samurai/Idle.png",
      framesMax: 6,
    },
    run: {
      imageSrc: "./images/Samurai/Run.png",
      framesMax: 8,
      
    },
    jump: {
      imageSrc: "./images/Samurai/Jump.png",
      framesMax: 9,
    },
    attack1: {
      imageSrc: "./images/Samurai/Attack_1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./images/Samurai/Hurt.png",
      framesMax: 3,
    },
    death: {
      imageSrc:"./images/Samurai/Dead.png",
      framesMax: 6,
    },
  },

  hitBox: {
    offset: {
      x: 110,
      y: -10,
    },
    width: 300,
    height: 300,
  },
});


const enemy = new Fighter({
  position: {
    x: 1300,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x:0,
    y:0,
  },
  color: "red",
  imageSrc: "./images/Samurai_Commander/Idle.png",
  framesMax: 5,
  scale: 4,
  
  sprites: {
    idle: {
      imageSrc: "./images/Samurai_Commander/Idle.png",
      framesMax: 5,
    },
    run: {
      imageSrc: "./images/Samurai_Commander/Run.png",
      framesMax: 8,
      
    },
    jump: {
      imageSrc: "./images/Samurai_Commander/Jump.png",
      framesMax: 9,
    },
    attack1: {
      imageSrc: "./images/Samurai_Commander/Attack_1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./images/Samurai_Commander/Hurt.png",
      framesMax: 2,
    },
    death: {
      imageSrc:"./images/Samurai_Commander/Dead.png",
      framesMax: 6,
    },
  },
  hitBox: {
    offset: {
      x: 20,
      y: -140,
    },
    width: 200,
    height: 300,
  },
});
// idle 이미지 반전
enemy.sprites.idle.image.onload = function() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = enemy.sprites.idle.image.width;
  canvas.height = enemy.sprites.idle.image.height;
  
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(enemy.sprites.idle.image, 0, 0);
  
  enemy.sprites.idle.image = new Image();
  enemy.sprites.idle.image.src = canvas.toDataURL();
};

// run 이미지 반전
enemy.sprites.run.image.onload = function() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = enemy.sprites.run.image.width;
  canvas.height = enemy.sprites.run.image.height;
  
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(enemy.sprites.run.image, 0, 0);
  
  enemy.sprites.run.image = new Image();
  enemy.sprites.run.image.src = canvas.toDataURL();
};

// jump 이미지 반전
enemy.sprites.jump.image.onload = function() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = enemy.sprites.jump.image.width;
  canvas.height = enemy.sprites.jump.image.height;
  
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(enemy.sprites.jump.image, 0, 0);
  
  enemy.sprites.jump.image = new Image();
  enemy.sprites.jump.image.src = canvas.toDataURL();
};

// attack1 이미지 반전
enemy.sprites.attack1.image.onload = function() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = enemy.sprites.attack1.image.width;
  canvas.height = enemy.sprites.attack1.image.height;
  
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(enemy.sprites.attack1.image, 0, 0);
  
  enemy.sprites.attack1.image = new Image();
  enemy.sprites.attack1.image.src = canvas.toDataURL();
};
//hurt 이미지 반전
enemy.sprites.takeHit.image.onload = function() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = enemy.sprites.takeHit.image.width;
  canvas.height = enemy.sprites.takeHit.image.height;
  
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(enemy.sprites.takeHit.image, 0, 0);
  
  enemy.sprites.takeHit.image = new Image();
  enemy.sprites.takeHit.image.src = canvas.toDataURL();
};

function rectangularCollision({ rectangle1, rectangle2}) {
  return (
    rectangle1.hitBox.position.x + rectangle1.hitBox.width >= rectangle2.position.x &&
    rectangle1.hitBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.hitBox.position.y + rectangle1.hitBox.height >= rectangle2.position.y &&
    rectangle1.hitBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function animate() {
  
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  player.update();
  enemy.update();

//아군 좌/우 이동 구현
  player.velocity.x = 0;
  if (keys.a.pressed && lastKey === "a") {
    player.velocity.x = -4;//왼쪽으로 이동
    player.switchSprite("run")
  } else if (keys.d.pressed && lastKey === "d") {
    player.velocity.x = 4;//오른쪽으로 이동
    player.switchSprite("run")
  } else {
    player.switchSprite("idle");
    }
  if (player.velocity.y < 0) {
    player.image = player.sprites.jump.image;
    player.framesMax = player.sprites.jump.framesMax;
  }

//적군 좌/우 이동 구현
  enemy.velocity.x= 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -4; // 왼쪽으로 이동
    enemy.switchSprite("run")
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 4; // 오른쪽으로 이동
    enemy.switchSprite("run")
  } else {
    enemy.switchSprite("idle");
    }
    if (enemy.velocity.y < 0) {
      enemy.image = enemy.sprites.jump.image;
      enemy.framesMax = enemy.sprites.jump.framesMax;
    }    

    //체력바 

      if(enemy.health <=0 || player.health <=0){
        determineWinner({player,enemy,timerId})
      }

      //적군 피격판정시 체력 감소
      if (
        rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking //&& player.framesCurrent === 1
        ) {
          enemy.takeHit()
            
          player.isAttacking = false; 
          document.querySelector("#enemyHealth").style.width = enemy.health + "%";
          console.log("player attack");
        }
      //아군 피격판정시 체력 감소
      if (
        rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking //&& enemy.framesCurrent === 1
        ) {
        
        player.takeHit();

        enemy.isAttacking = false;
        document.querySelector("#playerHealth").style.width = player.health+"%";
        console.log("enemy attack");
      }     
}


animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {  
  switch (event.key) {
    case "d":
        keys.d.pressed = true;
        lastKey = "d";
        break;
    case "a":
        keys.a.pressed = true;
        lastKey = "a";
        break;
    case "w":
        player.velocity.y= -7;
        break;
    case "h":
          player.attack()
          break;
      }
    }        
    //적 움직임
    if (!enemy.dead) {
    switch (event.key) {    
    case"ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight"
        break;
    case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
    case "ArrowUp" :
        enemy.velocity.y = -7 ;
        break;
    case "ArrowDown" :
        enemy.attack();
        break 
  }
    }
      console.log(event.key);
  
  });

  window.addEventListener("keyup", (event) => {
    switch (event.key) {
    case "d":
        keys.d.pressed = false;
        break;
    case "a":
        keys.a.pressed = false;
        break;
    case "w":
        player.velocity.y= -0;
        break;
    }


    //적 움직임
    switch(event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = false;
        break;
      case "ArrowLeft" :
        keys.ArrowLeft.pressed = false;
        break;
      case "ArrowUp" :
        enemy.velocity.y = -0;
        break;

    }
    console.log(event.key);
})


  //타이머
  let timer = 60;
  let timerId;
  
  function decreaseTimer() {
    if (timer > 0) {
      timerId = setTimeout(decreaseTimer, 1000);
      timer--;
      document.querySelector('#timer').innerHTML = timer;
    }
    if (timer === 0) {
      determineWinner({ player, enemy, timerId });
    }
  }
  
  function determineWinner({ player, enemy, timerId }) {
    document.querySelector("#displayText").style.display = "flex";
    if (player.health === enemy.health) {
      document.querySelector("#displayText").innerHTML = "引き分け!";
    } else if (player.health > enemy.health) {
      document.querySelector("#displayText").innerHTML = "1P 勝利!";
    } else if (player.health < enemy.health) {
      document.querySelector("#displayText").innerHTML = "2P 勝利!";
    }
    clearTimeout(timerId);
  }
  
  decreaseTimer();


  



