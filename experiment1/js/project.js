const fillers = {
  intro: ["Come check out this new game! It's called", "Ugh I am so tired, I was up all night playing", "I have been thinking of picking up this game once it goes on sale, it's called", "Yo they just announced they're making"],
  preamble: ["The", "Legend of", "Adventures of", "Super"],
  starter: ["Bucket", "Frog", "Grumbo", "Cat-Man", "Block Bot", "Turtle", "Beetle"],
  middle: ["Forest", "City", "Fantasy", "Treasure", "Story", "Dungeon", "Incorporated", ""],
  connector: [":", "and the", "&"],
  descriptor: ["Curse of the", "Spirits of the", "Adventures in", "Revenge of the", "Tournament of", "Search for"],
  ending:["Souls", "Tennis", "Racing", "Party"],
  postfix: ["64", "Ultra", "Reloaded", "Remix", "Deluxe", "2", "3", "World Tour", "3D", "Edition"],
  outro: ["! The final boss is crazy.", "! It is free to play with a coupon.", "! The battle pass in it kind of doesn't make sense."]
};

const template = `$intro $preamble $starter $middle $connector $descriptor $ending $postfix$outro`;
// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);
}

/* global clicker */
$("#clicker").click(generate);

generate();
