const fillers = {
  preamble: ["The", "Legend of", "Adventures of", "Super"],
  starter: ["Bucket", "Frog", "Grumbo", "Cat-Man", "Block Bot", "Turtle", "Beetle"],
  middle: ["Forest", "City", "Fantasy", "Treasure", "Story"],
  connector: [":", "and the", "&"],
  descriptor: ["Curse of the", "Spirits of the", "Adventures in", "Revenge of the", "Tournament of", "Search for"],
  ending:["Souls", "Tennis", "Racing", "Party"],
  postfix:["64", "Ultra", "Reloaded", "Remix", "Deluxe", "2", "3", "World Tour"],
};

const template = `Come check out this new game! It's called $preamble $starter $middle $connector $descriptor $ending $postfix!`;


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
