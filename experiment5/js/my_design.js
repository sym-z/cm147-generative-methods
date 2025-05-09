/* exported getInspirations, initDesign, renderDesign, mutateDesign */

function getInspirations() {
  return [
    {
      name: "Rorschach Test 1",
      assetUrl:
        "https://cdn.glitch.global/dd997432-0cd7-4510-8c0d-aa46dc9f70a3/1.png?v=1746406086292",
      sizeMod: TEST1_SIZE_MOD,
      emptyOval: TEST1_EMPTY_CHANCE,
      whiteOvalMod: TEST1_WHITE_MOD,
      blackOvalMod: TEST1_BLACK_MOD,
    },
    {
      name: "Rorschach Test 2",
      assetUrl:
        "https://cdn.glitch.global/dd997432-0cd7-4510-8c0d-aa46dc9f70a3/2-crop.png?v=1746406742049",
      sizeMod: TEST2_SIZE_MOD,
      emptyOval: TEST2_EMPTY_CHANCE,
      whiteOvalMod: TEST2_WHITE_MOD,
      blackOvalMod: TEST2_BLACK_MOD,
    },
    {
      name: "Rorschach Test 3",
      assetUrl:
        "https://cdn.glitch.global/dd997432-0cd7-4510-8c0d-aa46dc9f70a3/3.png?v=1746406091086",
      sizeMod: TEST3_SIZE_MOD,
      emptyOval: TEST3_EMPTY_CHANCE,
      whiteOvalMod: TEST3_WHITE_MOD,
      blackOvalMod: TEST3_BLACK_MOD,
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

  for (let i = 0; i < NUM_OVALS; i++) {
    design.fg.push({
      x: random(width / 2),
      y: random(height),
      w: random(width / OVAL_SIZE_MOD),
      h: random(height / OVAL_SIZE_MOD),
      fill: 0,
      angle: 0,
    });
  }

  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);

  for (let oval of design.fg) {
    random() > inspiration.emptyOval ? (oval.fill = 0) : (oval.fill = 255);
    fill(oval.fill);
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
    if (oval.fill == 255) {
      oval.w = mut(
        oval.w,
        0,
        (width * inspiration.whiteOvalMod) / OVAL_SIZE_MOD,
        rate
      );
      oval.h = mut(
        oval.h,
        0,
        (height * inspiration.whiteOvalMod) / OVAL_SIZE_MOD,
        rate
      );
    } else {
      oval.w = mut(oval.w, 0, width * inspiration.blackOvalMod / OVAL_SIZE_MOD, rate);
      oval.h = mut(oval.h, 0, height * inspiration.blackOvalMod / OVAL_SIZE_MOD, rate);
    }

    oval.angle = mut(oval.angle, 0, 360, rate);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
