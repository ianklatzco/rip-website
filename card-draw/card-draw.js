const tournament = 'rip11';

const discordWebhookUrl = 'https://dis' + 'corda' + 'pp.com/api/webho' + 'oks/51087618717882' + '7786/zBNpG-Db' + 'lnHLqfaHt8' + 'mI1gPZfKr0wEZ5p6MIr' + 'Z1fZ' + 'RJRz8jFYv' + '1IwqNIfdH5xIY-w_Ud'; // so bots don't scrape it
const previousStateStack = [];
let cardObjects = [];
let songs = [];

$(document).ready(() => {
  const cards = $('#card-area');

  $.getJSON(`res/${tournament}/data.json`, (data) => {
    songs = data;
  });

  const statuses = ['card_regular', 'card_protected', 'card_vetoed'];

  let currentPosition = -1;

  function randomize(numRequested) {
    const randomNumberArray = [];

    // for a total of numRequested times
    for (let i = 0; i < numRequested; i += 1) {
      // generate a random number
      let x;
      do {
        x = Math.floor(Math.random() * songs.length);
        // catch duplicates
      } while (randomNumberArray.indexOf(x) >= 0);

      randomNumberArray.push(x);
    }

    // now the array contains a lot of random numbers
    return randomNumberArray;
  }

  function render(cardArray) {
    if (cardArray === null) {
      return;
    }

    // remove the old ones
    cards.empty();
    cardObjects = [];

    for (let i = 0; i < cardArray.length; i += 1) {
      const songObject = songs[cardArray[i]];
      const img = $(`
            <div class="card_regular">
                <div class="banner_image"></div>
                <div class="info_bar">
                    <div class="info_name">
                        <div class="text_title_wrapper">
                            <div class="text_title">${songObject.title}</div>
                            <div class="text_subtitle">${songObject.subtitle}</div>
                        </div>
                    </div>
                    <div class="info_difficulty">
                        <div class="text_difficulty">${songObject.difficulty}</div>
                    </div>
                </div>
            </div>
      `);
      img.children('.banner_image').css('background-image', `url("res/${tournament}/banners/${songObject.banner_filename}")`);
      if (songObject.subtitle === '') {
        img.find('.text_subtitle').remove();
      }
      img.status = 0;
      img.addClass(statuses[0]);
      img.click(() => {
        img.removeClass(statuses[img.status]);
        img.status += 1;
        img.status %= statuses.length;
        img.addClass(statuses[img.status]);
      });
      cards.append(img);
      cardObjects.push(img);
    }
  }

  function draw(number) {
    if (currentPosition < previousStateStack.length) {
      previousStateStack.length = currentPosition + 1;
    }

    const randomNumberArray = randomize(number);
    previousStateStack.push(randomNumberArray);
    currentPosition += 1;
    render(randomNumberArray);
  }

  function fuckGoBack() {
    if (currentPosition > 0) {
      currentPosition -= 1;
    }
    render(previousStateStack[currentPosition]);
  }

  function fuckGoForward() {
    if (currentPosition < previousStateStack.length - 1) {
      currentPosition += 1;
    }
    render(previousStateStack[currentPosition]);
  }

  function webhook() {
    if (currentPosition < 0) {
      alert('fuck there\'s nothing here');
    }

    const thePicks = previousStateStack[currentPosition];
    const result = [];

    for (let i = 0; i < cardObjects.length; i += 1) {
      const curr = cardObjects[i];
      const active = curr.status !== 2;
      if (active) {
        result.push(songs[thePicks[i]].title);
      }
    }

    const resultString = result.join(', ');
    const theBody = `pool picks: ${resultString}\nAnnyeong!!!! owo wwwww~~~~~`;

    $.post(discordWebhookUrl, JSON.stringify({ content: theBody }), 'json');
  }

  $('#draw5').click(() => {
    draw(5);
  });
  $('#draw7').click(() => {
    draw(7);
  });
  $('#undo').click(() => {
    fuckGoBack();
  });
  $('#redo').click(() => {
    fuckGoForward();
  });
  $('#submit').click(() => {
    webhook();
  });
});
