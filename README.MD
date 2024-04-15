# Flask Boggle

This is a Flask-based web application for the classic game Boggle.  The goal of the game is to get the highest point total. To gain points, players create words from a random assortment of letters in a 5x5 grid. We will be providing the functionality to generate the grid.

Words can be created from adjacent letters – that is, letters which are horizontal or vertical neighbors of each other as well as diagonals. The letters must connect to each other in the proper sequence to spell the word correctly. This means that the next letter in the word can be above, below, left, or right of the previous letter in the word (excluding any letters previously used to construct the word). We will also be providing functionality to determine if a word can be constructed from a boggle board.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them.

Python Flask

### Installing

A step by step series of examples that tell you how to get a development environment running.

git clone https://github.com/yourusername/flask-boggle.git cd flask-boggle pip install -r requirements.txt flask run

## Running the tests

A main focus of this exercise is on testing Flask. Make sure you write tests for all views you add to app.py.

## Deployment of Development Server

Open your terminal, navigate to the directory containing your `app.py` file, and run the `export FLASK_APP=app.py` command.  After running this command, you can start your Flask application by running `flask run` in your terminal.  Remember to run `export FLASK_APP=app.py` every time you open a new terminal session, or add it to your shell's startup file (like `.bashrc` or `.bash_profile`) to set it automatically.

## Built With

* [Flask](http://flask.pocoo.org/) - The web framework used
* [Python](https://www.python.org/) - Programming Language

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Springboard Bootcamp Project** - *December 2023* - [ahauser16](https://github.com/ahauser16)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

## Notes 

### associated with starter codebase

```
def find_from(self, board, word, y, x, seen):
        """Can we find a word on board, starting at x, y?"""

        if x > 4 or y > 4:
            return

        # This is called recursively to find smaller and smaller words
        # until all tries are exhausted or until success.

        # Base case: this isn't the letter we're looking for.

        if board[y][x] != word[0]:
            return False

        # Base case: we've used this letter before in this current path

        if (y, x) in seen:
            return False

        # Base case: we are down to the last letter --- so we win!

        if len(word) == 1:
            return True

        # Otherwise, this letter is good, so note that we've seen it,
        # and try of all of its neighbors for the first letter of the
        # rest of the word
        # This next line is a bit tricky: we want to note that we've seen the
        # letter at this location. However, we only want the child calls of this
        # to get that, and if we used `seen.add(...)` to add it to our set,
        # *all* calls would get that, since the set is passed around. That would
        # mean that once we try a letter in one call, it could never be tried again,
        # even in a totally different path. Therefore, we want to create a *new*
        # seen set that is equal to this set plus the new letter. Being a new
        # object, rather than a mutated shared object, calls that don't descend
        # from us won't have this `y,x` point in their seen.
        #
        # To do this, we use the | (set-union) operator, read this line as
        # "rebind seen to the union of the current seen and the set of point(y,x))."
        #
        # (this could be written with an augmented operator as "seen |= {(y, x)}",
        # in the same way "x = x + 2" can be written as "x += 2", but that would seem
        # harder to understand).

        seen = seen | {(y, x)}

        # adding diagonals

        if y > 0:
            if self.find_from(board, word[1:], y - 1, x, seen):
                return True

        if y < 4:
            if self.find_from(board, word[1:], y + 1, x, seen):
                return True

        if x > 0:
            if self.find_from(board, word[1:], y, x - 1, seen):
                return True

        if x < 4:
            if self.find_from(board, word[1:], y, x + 1, seen):
                return True

        # diagonals
        if y > 0 and x > 0:
            if self.find_from(board, word[1:], y - 1, x - 1, seen):
                return True

        if y < 4 and x < 4:
            if self.find_from(board, word[1:], y + 1, x + 1, seen):
                return True

        if x > 0 and y < 4:
            if self.find_from(board, word[1:], y + 1, x - 1, seen):
                return True

        if x < 4 and y > 0:
            if self.find_from(board, word[1:], y - 1, x + 1, seen):
                return True
        # Couldn't find the next letter, so this path is dead

        return False

    def find(self, board, word):
        """Can word be found in board?"""

        # Find starting letter --- try every spot on board and,
        # win fast, should we find the word at that place.

        for y in range(0, 5):
            for x in range(0, 5):
                if self.find_from(board, word, y, x, seen=set()):
                    return True

        # We've tried every path from every starting square w/o luck.
        # Sad panda.

        return False
```

### my notes:

The provided Python code defines a class `Boggle` that simulates the game of Boggle, a word game that involves a grid of letters and players attempt to find words in sequences of adjacent letters.

The `Boggle` class has several methods:

- `__init__(self)`: This is the constructor method that gets called when an object of the class is instantiated. It initializes the `words` attribute by calling the `read_dict` method with a file name "words.txt".
  
```
def __init__(self):
    self.words = self.read_dict("words.txt")
```
---

- `read_dict(self, dict_path)`: This method opens a file at the given `dict_path`, reads all the words in the file, strips any leading or trailing whitespace from each word, and returns a list of these words.

```
def read_dict(self, dict_path):
        """Read and return all words in dictionary."""

        dict_file = open(dict_path)
        words = [w.strip() for w in dict_file]
        dict_file.close()
        return words
```
---
- `make_board(self)`: This method creates a 5x5 Boggle board. Each cell of the board is filled with a random uppercase letter.

```
def make_board(self):
        """Make and return a random boggle board."""

        board = []

        for y in range(5):
            row = [choice(string.ascii_uppercase) for i in range(5)]
            board.append(row)

        return board
```
---
- `check_valid_word(self, board, word)`: This method checks if a given `word` is valid. A word is valid if it exists in the dictionary (i.e., the `words` attribute) and can be found on the Boggle `board`. The method returns "ok" if the word is valid, "not-on-board" if the word is in the dictionary but not on the board, and "not-word" if the word is not in the dictionary.

```
def check_valid_word(self, board, word):
        """Check if a word is a valid word in the dictionary and/or the boggle board"""

        word_exists = word in self.words
        valid_word = self.find(board, word.upper())

        if word_exists and valid_word:
            result = "ok"
        elif word_exists and not valid_word:
            result = "not-on-board"
        else:
            result = "not-word"

        return result
```
---

- `find_from(self, board, word, y, x, seen)`: This is a helper method used to find a `word` on the `board` starting from the cell at coordinates `(y, x)`. It uses depth-first search to explore all possible paths from the starting cell. The `seen` set keeps track of the cells that have already been visited.

```
def find_from(self, board, word, y, x, seen):
        """Can we find a word on board, starting at x, y?"""

        if x > 4 or y > 4:
            return

        if board[y][x] != word[0]:
            return False

        if (y, x) in seen:
            return False

        if len(word) == 1:
            return True

        seen = seen | {(y, x)}

        if y > 0:
            if self.find_from(board, word[1:], y - 1, x, seen):
                return True

        if y < 4:
            if self.find_from(board, word[1:], y + 1, x, seen):
                return True

        if x > 0:
            if self.find_from(board, word[1:], y, x - 1, seen):
                return True

        if x < 4:
            if self.find_from(board, word[1:], y, x + 1, seen):
                return True

        if y > 0 and x > 0:
            if self.find_from(board, word[1:], y - 1, x - 1, seen):
                return True

        if y < 4 and x < 4:
            if self.find_from(board, word[1:], y + 1, x + 1, seen):
                return True

        if x > 0 and y < 4:
            if self.find_from(board, word[1:], y + 1, x - 1, seen):
                return True

        if x < 4 and y > 0:
            if self.find_from(board, word[1:], y - 1, x + 1, seen):
                return True

        return False
```

- **LINE BY LINE ANALYSIS**: 
1.  `def find_from(self, board, word, y, x, seen):` defines the method find_from. It takes five parameters: self (which is a reference to the instance of the class Boggle), board (the Boggle board), word (the word to find), y and x (the coordinates of the starting cell), and seen (a set of cells that have already been visited).   
    
2. `if x > 4 or y > 4:
    return` checks if the coordinates (y, x) are outside the bounds of the board. If they are, it returns immediately, ending the current call to ``find_from``.

3. `if board[y][x] != word[0]:
    return False` checks if the letter at the cell ``(y, x)`` on the board is not the first letter of the word. If it's not, it returns ``False``, indicating that the word cannot be found starting from this cell.

4.  `if (y, x) in seen:
    return False` checks if the cell ``(y, x)`` has already been visited. If it has, it returns ``False``, preventing the search from revisiting the same cell.

5. `if len(word) == 1:
    return True` checks if the word has only one letter left. If it does, it returns ``True``, indicating that the word has been found.

6. `seen = seen | {(y, x)}`  adds the cell `(y, x)` to the `seen` set. The `|` operator is used for set union in Python, which combines the elements of two sets.

The following lines of code try to find the rest of the word starting from each of the neighboring cells of `(y, x)`. If the word can be found starting from any of these cells, it returns `True`.

7. `if y > 0:
    if self.find_from(board, word[1:], y - 1, x, seen):
        return True` tries to find the word starting from the cell above ``(y, x)``.

8. `if y < 4:
    if self.find_from(board, word[1:], y + 1, x, seen):
        return True` tries to find the word starting from the cell below ``(y, x)``.

9. `if x > 0:
    if self.find_from(board, word[1:], y, x - 1, seen):
        return True` tries to find the word starting from the cell to the left of ``(y, x)``.

10. `if x < 4:
    if self.find_from(board, word[1:], y, x + 1, seen):
        return True` tries to find the word starting from the cell to the right of ``(y, x)``.

11. `if y > 0 and x > 0:
            if self.find_from(board, word[1:], y - 1, x - 1, seen):
                return True` this checks the cell diagonally above and to the left of the current cell ``(y, x)``. If the ``y`` and ``x`` coordinates are both greater than 0 (meaning the current cell is not on the top row or the leftmost column), it calls the ``find_from`` method recursively with the coordinates of the cell above and to the left ``(y - 1, x - 1)``. If ``find_from`` returns ``True``, it means the word can be found starting from that cell, so it returns ``True``.

12. `if y < 4 and x < 4:
    if self.find_from(board, word[1:], y + 1, x + 1, seen):
        return True` this checks the cell diagonally below and to the right of the current cell ``(y, x)``. If the ``y`` and ``x`` coordinates are both less than 4 (meaning the current cell is not on the bottom row or the rightmost column), it calls the ``find_from`` method recursively with the coordinates of the cell below and to the right ``(y + 1, x + 1)``. If ``find_from`` returns ``True``, it means the word can be found starting from that cell, so it returns ``True``.

13. `if x > 0 and y < 4:
    if self.find_from(board, word[1:], y + 1, x - 1, seen):
        return True` this checks the cell diagonally below and to the left of the current cell ``(y, x)``. If ``x`` is greater than 0 and ``y`` is less than 4 (meaning the current cell is not on the top row or the leftmost column), it calls the ``find_from`` method recursively with the coordinates of the cell below and to the left ``(y + 1, x - 1)``. If ``find_from`` returns ``True``, it means the word can be found starting from that cell, so it returns ``True``.

14. `if x < 4 and y > 0:
    if self.find_from(board, word[1:], y - 1, x + 1, seen):
        return True` this checks the cell diagonally above and to the right of the current cell ``(y, x)``. If ``x`` is less than 4 and ``y`` is greater than 0 (meaning the current cell is not on the bottom row or the rightmost column), it calls the ``find_from`` method recursively with the coordinates of the cell above and to the right ``(y - 1, x + 1)``. If ``find_from`` returns ``True``, it means the word can be found starting from that cell, so it returns ``True``.

---

- `find(self, board, word)`: This method checks if a `word` can be found on the `board`. It iterates over each cell of the board and calls the `find_from` method to try to find the word starting from that cell.

```
def find(self, board, word):
        """Can word be found in board?"""

        for y in range(0, 5):
            for x in range(0, 5):
                if self.find_from(board, word, y, x, seen=set()):
                    return True

        return False
```

---

Summary: The code uses the `choice` function from the `random` module to select random letters when creating the Boggle board, and the `string.ascii_uppercase` constant to get all uppercase letters.
---
