import React from "react";
import ReactDOM from "react-dom";

function randomInRange(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

class ConfettiParticle {
  r = randomInRange(10, 30); // radius
  tilt = Math.floor(Math.random() * 10) - 10;
  tiltAngleIncremental = Math.random() * 0.07 + 0.05;
  tiltAngle = 0;

  constructor(color, maxW, maxH, maxParticles) {
    this.color = color;
    this.x = Math.random() * maxW;
    this.y = Math.random() * maxH - maxH;
    this.d = Math.random() * maxParticles + 10; // density
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = this.r / 2;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
    ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
    return ctx.stroke();
  }

  checkForReposition(index, W, H, angle) {
    if (this.x > W + 20 || this.x < -20 || this.y > H) {
      if (index % 5 > 0 || index % 2 == 0) {
        // 66.67% of the flakes
        this.reposition(
          Math.random() * W,
          -10,
          Math.floor(Math.random() * 10) - 20,
        );
      } else {
        if (Math.sin(angle) > 0) {
          // Enter from the left
          this.reposition(
            -20,
            Math.random() * H,
            Math.floor(Math.random() * 10) - 20,
          );
        } else {
          // Enter from the right
          this.reposition(
            W + 20,
            Math.random() * H,
            Math.floor(Math.random() * 10) - 20,
          );
        }
      }
    }
  }

  reposition(xCoordinate, yCoordinate, tilt) {
    this.x = xCoordinate;
    this.y = yCoordinate;
    this.tilt = tilt;
  }

  step(angle, index) {
    this.tiltAngle += this.tiltAngleIncremental;
    this.y += (Math.cos(angle + this.d) + 3 + this.r / 2) / 2;
    this.x += Math.sin(angle);
    this.tilt = Math.sin(this.tiltAngle - index / 3) * 15;
  }
}

export default class Confetti extends React.Component {
  ref = React.createRef();

  componentDidMount() {
    // https://jsfiddle.net/hcxabsgh/

    const maxParticles = 150;
    const particles = [];
    let angle = 0;
    let tiltAngle = 0;
    let W;
    let H;
    let animationHandler;

    const canvas = this.ref.current;
    const ctx = canvas.getContext("2d");
    handleResize();

    const particleColors = {
      colorOptions: [
        "DodgerBlue",
        "OliveDrab",
        "Gold",
        "pink",
        "SlateBlue",
        "lightblue",
        "Violet",
        "PaleGreen",
        "SteelBlue",
        "SandyBrown",
        "Chocolate",
        "Crimson",
      ],
      colorIndex: 0,
      colorIncrementer: 0,
      colorThreshold: 10,
      getColor: function() {
        if (this.colorIncrementer >= 10) {
          this.colorIncrementer = 0;
          this.colorIndex++;
          if (this.colorIndex >= this.colorOptions.length) {
            this.colorIndex = 0;
          }
        }
        this.colorIncrementer++;
        return this.colorOptions[this.colorIndex];
      },
    };

    for (var i = 0; i < maxParticles; i++) {
      particles.push(
        new ConfettiParticle(particleColors.getColor(), W, H, maxParticles),
      );
    }

    function handleResize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(particle => particle.draw(ctx));
    }

    function update() {
      angle += 0.01;
      tiltAngle += 0.1;

      particles.forEach((particle, i) => {
        particle.step(angle, i);
        particle.checkForReposition(i, W, H, angle);
      });
    }

    (function animloop() {
      animationHandler = requestAnimationFrame(animloop);
      draw();
      update();
    })();
    window.addEventListener("resize", handleResize);
    document.addEventListener("focusout", handleResize);

    this.cleanup = function cleanup() {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("focusout", handleResize);
      cancelAnimationFrame(animationHandler);
    };
  }

  componentWillUnmount() {
    this.cleanup();
  }

  render() {
    return (
      <div className="confetti-container">
        {this.props.children}
        <canvas
          style={{
            pointerEvents: "none",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          ref={this.ref}
        />
      </div>
    );
  }
}
