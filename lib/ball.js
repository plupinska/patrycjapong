class Ball {
  constructor(width, height, game) {
    this.pos = [270,270];
    this.xvel = 3;
    this.yvel = 2;
    this.radius = 10;
    this.color = "#5A879A";
    this.cwidth = width;
    this.cheight = height;
    this.drawCicle = this.drawCircle.bind(this);
    this.game = game.game;
    this.getCollisionPoints = this.getCollisionPoints.bind(this);
    this.angleToRadian = this.angleToRadian.bind(this);
    this.calcPointFromCenter = this.calcPointFromCenter.bind(this);
  }

  drawCircle(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 360, false);
    ctx.fill();
  }

  getCollisionPoints(ball) {
    let angles = [60, 150, 240, 330, 0, 90, 180, 270];
    let collisionCoordinates = [];

    angles.forEach((angle) => {
      let rad = this.angleToRadian(angle);
      collisionCoordinates.push(this.calcPointFromCenter(this.pos, rad));
    });

    return collisionCoordinates;
  }

  calcPointFromCenter(point, radian) {
    let x = point[0] + (this.radius * Math.cos(radian));
    let y = point[1] + (this.radius * Math.sin(radian));

    return [x,y];
  }

  angleToRadian(angle) {
    return Math.floor((angle* (Math.PI / 180)));
  }


  bounce(paddle1, paddle2) {
    const ballCollisionPts = this.getCollisionPoints(this);
    if (this.hitTop()) {
      this.pos[1] = this.radius;
      this.yvel = -1 * this.yvel;
      let snd = new Audio("audio/bouncelost.wav");
      snd.play();
    } else if (this.hitBottom()) {
      this.pos[1] = this.pos[1] - this.radius * 2;
      this.yvel = -1 * this.yvel;
      let snd = new Audio("audio/bouncelost.wav");
      snd.play();
    } else if (this.haveCollided(paddle1, ballCollisionPts)){

     let snd = new Audio("audio/bouncelost.wav");
     snd.play();
     let relativeIntersectY = (paddle1.pos[1]+ (paddle1.height/2)) - this.pos[1];
     let normalizedRelativeIntersectionY = (relativeIntersectY/(paddle1.height/2));
     let bounceAngle = normalizedRelativeIntersectionY * 3*Math.PI/10;
     this.pos[0] = (this.pos[0] + (paddle1.pos[0]+ paddle1.width - this.pos[0] + this.radius));
     this.yvel = -5*Math.sin(bounceAngle);
     this.xvel = 5*Math.cos(bounceAngle);

  } else if (this.haveCollided(paddle2, ballCollisionPts)){

    let snd = new Audio("audio/bouncelost.wav");
    snd.play();
    let relativeIntersectY = (paddle2.pos[1] + (paddle2.height/2)) - this.pos[1];
    let normalizedRelativeIntersectionY = (relativeIntersectY/(paddle2.height/2));
    let bounceAngle = normalizedRelativeIntersectionY * 3*Math.PI/10;
    this.pos[0] -= 5;
    this.yvel = -5*Math.sin(bounceAngle);
    this.xvel = -5*Math.cos(bounceAngle);

  } else if (this.hitLeftOrRight()) {
    let snd = new Audio("audio/bounce.wav");
    snd.play();
    this.yvel = this.yvel;
    this.xvel = -1 * this.xvel;
    if (this.pos[0] < 0) {
      this.game.humanPlayer.score += 1;
      this.game.aiPlayer.lives -=1;
      this.pos[0] = 5;
    }
     else {
      this.pos[0] = 500;
      this.game.humanPlayer.lives -=1;
      this.game.aiPlayer.score +=1;
    }
  }

    this.move();
  }

  haveCollided(paddle, ballCollisionPts) {
    let collision = false;

    for (let i = 0; i < ballCollisionPts.length; i++) {
      let ballPt = ballCollisionPts[i];
      if ((ballPt[1] > paddle.pos[1]) && (ballPt[1] < paddle.pos[1] + paddle.height)) {
          if ((ballPt[0] > paddle.pos[0]) && (ballPt[0] < paddle.pos[0] + paddle.width)) {
            collision = true;
          }
        }
    }
    return collision;
  }

  verticalCollision(paddle, collisionPts) {

    let collision = false;
    for( let i = 0; i < collisionPts.length; i++) {
      let point = collisionPts[i];
      if ((paddle[0] <= point[0] <= paddle[0] + paddle.width) && (paddle[1] <= point[1] <= paddle[1] + paddle.height)) {
        collision = true;
      }
    }

    return collision;
  }

  hitLeftOrRight() {
    return this.pos[0] < 0 || this.pos[0] > 500;
  }

  hitBottom() {
  return this.pos[1] + this.radius > 500;
  }

  hitTop() {
    return this.pos[1] - this.radius < 0;
  }

  move() {
    this.pos[0] += this.xvel;
    this.pos[1] += this.yvel;
  }

}

module.exports = Ball;
