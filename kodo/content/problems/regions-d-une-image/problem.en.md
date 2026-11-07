---
title: Regions of an image
---

## Statement
An image with `R` rows and `C` columns is made of pixels; each pixel has a colour, written as a lowercase letter. Two pixels are **neighbours** if they share a side (up, down, left or right). A **region** is a maximal set of pixels of the same colour in which one can go from any pixel to any other by moving from neighbour to neighbour, without leaving the colour.

Count the regions of the image and give the number of pixels of the largest one.

## Input
- The first line contains two integers `R` and `C`.
- Each of the next `R` lines contains `C` lowercase letters: the image, row by row.

## Output
Two integers on one line: the number of regions, then the number of pixels of the largest region.

## Constraints
- 1 ≤ R, C ≤ 300

## Hints
1. The image is a graph: the vertices are the pixels, and two neighbouring pixels of the same colour are joined by an edge. The regions are its connected components.
2. No need to build the graph: the neighbours of a pixel `(r, c)` are computed on the fly, checking that they are inside the image and of the same colour.
3. A region can contain 90,000 pixels, shaped like a snake: a recursive fill exceeds the allowed depth. Use a queue or a stack.

## Solution
Scan the pixels row by row. Each pixel not yet visited opens a new region: a breadth-first search from that pixel visits every pixel of the same colour reachable from neighbour to neighbour, and counts how many it visits. This is the connected components search of the lesson, in an **implicit** graph whose neighbours are computed instead of stored.

Each pixel enters the queue once and examines its 4 neighbours: O(R × C).

**Pitfall.** A recursive fill ("paint this pixel then call yourself on its 4 neighbours") is correct, but its depth can reach the number of pixels of the region: `RecursionError` in Python, stack overflow in C++ on a spiral region.
