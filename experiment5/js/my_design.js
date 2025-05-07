/* exported getInspirations, initDesign, renderDesign, mutateDesign */

function getInspirations() {
  return [
    {
      name: "Rorschach Test 1",
      assetUrl:
        "./1.png",
      sizeMod: 1.5,
      emptyOval: 0.25,
    },
    {
      name: "Rorschach Test 2",
      assetUrl:
        "./2-crop.png",
      sizeMod: 3,
      emptyOval: 0.2,
    },
    {
      name: "Rorschach Test 3",
      assetUrl:
        "./3.png",
      sizeMod: 8,
      emptyOval: 0.5,
    },
  ];
}

function initDesign(inspiration) {
  resizeCanvas(
    inspiration.image.width / inspiration.sizeMod,
    inspiration.image.height / inspiration.sizeMod
  );

  let design = {
    bg: 255,
    fg: [],
  };

  for (let i = 0; i < 250; i++) {
    design.fg.push({
      x: random(width / 2),
      y: random(height),
      w: random(width / 4),
      h: random(height / 4),
      angle: 0,
    });
  }

  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);

  for (let oval of design.fg) {
    random() > inspiration.emptyOval ? fill(0) : fill(255);
    // Left side oval
    push();
    translate(oval.x, oval.y);
    rotate(oval.angle);
    ellipse(0, 0, oval.w, oval.h);
    pop();
    // Right side oval
    push();
    translate(width - oval.x, oval.y);
    rotate(-oval.angle);
    ellipse(0, 0, oval.w, oval.h);
    pop();
  }
}

function mutateDesign(design, inspiration, rate) {
  for (let oval of design.fg) {
    oval.x = mut(oval.x, 0, width / 2, rate);
    oval.y = mut(oval.y, 0, height, rate);
    oval.w = mut(oval.w, 0, width / 4, rate);
    oval.h = mut(oval.h, 0, height / 4, rate);
    oval.angle = mut(oval.angle, 0, 360, rate);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
