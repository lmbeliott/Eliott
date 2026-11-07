---
title: Two-deck war
---

## Statement
Two players each have a deck of `N` cards, face down. The `2N` cards carry the numbers from `1` to `2N`, each once.

At each turn, each player turns over the top card of their deck. The one with the higher card wins the turn: they slide under their deck first **their own** card, then the opponent's. The game stops as soon as a player has no card left, or after 1,000,000 turns if this has not happened before.

Print the number of turns played, then the number of cards of the first player, then that of the second, at the end of the game.

## Input
The first line contains `N`. The second line contains the `N` cards of the first player, the third line those of the second, each from the top card to the bottom one.

## Output
Three integers on one line: the number of turns, then the numbers of cards of the two players.

## Constraints
- 1 ≤ N ≤ 10,000

## Hints
1. Each deck behaves like a queue: cards are taken at the front and added at the end.
2. With 1,000,000 turns and 20,000 cards in play, removing the front of a Python list with `pop(0)` is too slow. Use `collections.deque` (in C++, `queue` or `deque`).

## Solution
Each deck is a queue: the top card is at the front, and a card slid under the deck is added at the back. Simulate turn by turn: remove the front of each queue, compare, and the winner appends to their queue their own card then the other's. Stop when a queue is empty or when the turn counter reaches 1,000,000.

Everything is determined by the rules: the simulation is correct as soon as each deck is represented properly. At any moment, a player's queue holds their cards from top to bottom, and the total number of cards stays `2N`.

**Cost.** At most 1,000,000 turns, each in a few queue operations. With a list and `pop(0)`, each removal shifts all the remaining cards: up to 20,000 shifts per turn, that is billions of operations. The trap: forgetting the turn limit, since some games never end.
