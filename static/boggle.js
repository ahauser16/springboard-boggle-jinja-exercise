// all of this is from the solution codebase so you need to reverse engineer it and understand it.

class BoggleGame {
  /* make a new game at this DOM id */

  constructor(boardId, secs = 60) {
    this.secs = secs; // game length

    //commented out so that the timer doesn't start automatically
    // this.showTimer();

    this.score = 0;
    this.words = new Set();
    this.board = $("#" + boardId);

    //commented out so that the timer doesn't start automatically
    // every 1000 msec, "tick"
    // this.timer = setInterval(this.tick.bind(this), 1000);

    //  The form element in your index.html file is associated with the handleSubmit function in your boggle.js file through the use of jQuery's on method in the constructor of the BoggleGame class.  

    //  The logic behind this line of code below is saying the following: "When the form with the class "add-word" inside "this.board" is submitted, execute the "handleSubmit" method of this BoggleGame instance."

    // Furthermore, the "handleSubmit" method is bound to the BoggleGame instance to ensure that the "this" keyword within the "handleSubmit" method refers to the "BoggleGame" instance, not the form element that triggered the event.

    $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));

    // Add event listener to "START GAME" button
    $("#start-btn").on("click", this.startGame.bind(this));
  }

  /* Start the game */

  startGame() {
    this.showTimer();
    this.timer = setInterval(this.tick.bind(this), 1000);
    // Show the board
    $(".board td").show();
    // Initialize any other game state here
  }


  /* show word in list of words */

  showWord(word) {
    $("#sidebar .words").append($("<li>", { text: word }));
  }

  /* show score in html */

  showScore() {
    $("#sidebar .score").text(this.score);
  }

  /* show a status message */

  showMessage(msg, cls) {
    $("#sidebar .msg")
      .text(msg)
      .removeClass()
      .addClass(`msg ${cls}`);
  }

  /* handle submission of word: if unique and valid, score & show */

  async handleSubmit(evt) {
    evt.preventDefault();
    const $word = $("#sidebar .word");

    let word = $word.val();
    if (!word) return;

    if (this.words.has(word)) {
      this.showMessage(`Already found ${word}`, "err");
      return;
    }

    // check server for validity
    const resp = await axios.get("/check-word", { params: { word: word }});
    if (resp.data.result === "not-word") {
      this.showMessage(`${word} is not a valid English word`, "err");
    } else if (resp.data.result === "not-on-board") {
      this.showMessage(`${word} is not a valid word on this board`, "err");
    } else {
      this.showWord(word);
      this.score += word.length;
      this.showScore();
      this.words.add(word);
      this.showMessage(`Added: ${word}`, "ok");
    }

    $word.val("").focus();
  }

  /* Update timer in DOM */

  showTimer() {
    $("#sidebar .timer").text(this.secs);
  }

  /* Tick: handle a second passing in game */

  async tick() {
    this.secs -= 1;
    this.showTimer();

    if (this.secs === 0) {
      clearInterval(this.timer);
      await this.scoreGame();
    }
  }

  /* end of game: score and update message. */

  async scoreGame() {
    $(".add-word", this.board).hide();
    const resp = await axios.post("/post-score", { score: this.score });
    if (resp.data.brokeRecord) {
      this.showMessage(`New record: ${this.score}`, "ok");g
    } else {
      this.showMessage(`Final score: ${this.score}`, "ok");
    }
  }
}