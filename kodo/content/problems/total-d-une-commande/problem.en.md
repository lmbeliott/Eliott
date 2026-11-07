---
title: Total of an order
---

## Statement
A catalogue gives the price of each item. An order is a list of lines "item, quantity". Compute the total price of the order, and count the lines whose item is not in the catalogue (they are ignored in the total).

The catalogue may list the same item several times: the **last** price given is then the valid one.

## Input
- The first line contains the integer `N`, the number of lines of the catalogue.
- Each of the next `N` lines contains an item name and its price (an integer), separated by a space.
- The next line contains the integer `M`, the number of lines of the order.
- Each of the next `M` lines contains an item name and a quantity (an integer), separated by a space.

Names are made of lowercase letters without accents.

## Output
Two lines: the total price of the order, then the number of order lines whose item is unknown.

## Constraints
- 1 ≤ N, M ≤ 1,000
- 1 ≤ price ≤ 10,000
- 1 ≤ quantity ≤ 1,000

## Hints
1. Store the catalogue in a dictionary: the item name is the key, its price the value.
2. An assignment `price[name] = p` on a key already present replaces the old value: that is exactly the last-price rule.
3. Before reading `price[name]`, test `name in price`, otherwise Python stops with a `KeyError` error. In C++, the total can exceed 2 × 10⁹: use `long long`.

## Solution
Read the catalogue into a **dictionary** `price` that maps each name to its price. The assignment `price[name] = p` adds the key if it is new and **replaces** the value if the key already exists: after reading, each item therefore has its last price.

Then read the order line by line. If the name is a key of the dictionary (`name in price`), add `price[name] × quantity` to the total; otherwise, increase the counter of unknown items.

Two traps. In Python, reading `price[name]` for a missing name raises `KeyError`: you must test first. In C++, it is sneakier: `price[name]` on a missing name raises no error, but **creates** the key with the value 0; so test with `price.count(name)`. Finally, the total can reach 1,000 × 10,000 × 1,000 = 10¹⁰: in C++, you need a `long long`.
