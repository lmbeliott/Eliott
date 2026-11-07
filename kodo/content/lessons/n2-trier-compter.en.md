Ranking racers, counting the votes of a contest, sorting words into families: sorting and counting are two moves you'll find everywhere. Both languages already do most of the work for you; you just need to know how to use them.

## Sorting a list

In Python, `my_list.sort()` sorts the list in place, from smallest to largest. In C++, you use `sort` on a `vector`, giving the start and the end of what to sort.

```python
times = [5412, 4987, 5120, 6003]
times.sort()
print(times)        # [4987, 5120, 5412, 6003]
times.sort(reverse=True)
print(times[0])     # 6003: the largest
```

```cpp
vector<int> times = {5412, 4987, 5120, 6003};
sort(times.begin(), times.end());              // 4987 5120 5412 6003
sort(times.begin(), times.end(), greater<int>());
cout << times[0] << "\n";                      // 6003: the largest
```

Strings are sorted in alphabetical order. So watch out for numbers read as text: `"950"` comes **after** `"1000"`, because `"9"` and `"1"` are compared first. Remember to convert with `int` before sorting.

## Sorting with several criteria

You often sort items that carry several pieces of information, like a bib number and a time. You store them in **pairs**: a tuple in Python, a `pair` in C++. Two pairs are compared by their first element first, and only if those are equal, by their second element. So you put first whatever should decide the ranking.

To sort by **decreasing** score, then by **increasing** name, here's a trick: sort the pairs `(-score, name)` in the normal increasing order. The highest score has the smallest `-score`, so it comes first.

```python
teams = [("green", 7), ("blue", 9), ("red", 7)]
ranking = []
for name, score in teams:
    ranking.append((-score, name))
ranking.sort()
for minus_score, name in ranking:
    print(name, -minus_score)    # blue 9, green 7, red 7
```

```cpp
vector<pair<string, int>> teams = {{"green", 7}, {"blue", 9}, {"red", 7}};
vector<pair<int, string>> ranking;
for (auto& t : teams) {
    ranking.push_back({-t.second, t.first});
}
sort(ranking.begin(), ranking.end());
for (auto& r : ranking) {
    cout << r.second << " " << -r.first << "\n";   // blue 9, green 7, red 7
}
```

## Counting with an array of counters

When the values to count are small integers or letters, an array is enough: cell `k` counts how many times the value `k` appears. For letters, you use 26 cells, and the letter `c` goes into cell `ord(c) - ord("a")` (in C++: `c - 'a'`).

```python
count = [0] * 26
for c in "letter":
    count[ord(c) - ord("a")] += 1
print(count[ord("t") - ord("a")])   # 2
```

```cpp
vector<int> count(26, 0);
string word = "letter";
for (char c : word) {
    count[c - 'a']++;
}
cout << count['t' - 'a'] << "\n";   // 2
```

## Counting with a dictionary

When the values are words, or numbers too big for an array, you use a **dictionary**: it associates a **value** with each **key**. In Python, you have to create the key before increasing it. In C++, a `map` automatically creates a missing key with the value `0`, and it keeps its keys sorted.

```python
votes = ["green", "blue", "green", "red", "green"]
count = {}
for v in votes:
    if v not in count:
        count[v] = 0
    count[v] += 1
for name in sorted(count):
    print(name, count[name])   # blue 1, green 3, red 1
```

```cpp
vector<string> votes = {"green", "blue", "green", "red", "green"};
map<string, int> count;
for (string v : votes) {
    count[v]++;
}
for (auto& p : count) {
    cout << p.first << " " << p.second << "\n";   // blue 1, green 3, red 1
}
```

In Python, you go through a dictionary in the order in which the keys were added: `sorted(count)` gives the keys in alphabetical order. In C++, `unordered_map` is used like `map` and is a bit faster, but its keys are not kept in any particular order.

## Grouping

A dictionary can also hold **lists**: you put together the items that share the same property, called the key. Here, we group words by their length:

```python
groups = {}
for word in ["salt", "rice", "tomato", "apple", "bread"]:
    key = len(word)
    if key not in groups:
        groups[key] = []
    groups[key].append(word)
print(groups[4])   # ['salt', 'rice']
```

```cpp
map<int, vector<string>> groups;
for (string word : {"salt", "rice", "tomato", "apple", "bread"}) {
    groups[word.size()].push_back(word);
}
cout << groups[4][0] << " " << groups[4][1] << "\n";   // salt rice
```

The whole art of grouping is choosing the right key: a value you compute for each item, which is the same for two items exactly when they belong in the same group.

The key can be any value computed from the item, including a string built from it. In Python, `sorted` applied to a string gives the **list** of its sorted letters, and `"".join(...)` glues those letters back into a string. In C++, `sort` sorts the letters of a `string` directly.

```python
letters = sorted("pomme")
print(letters)            # ['e', 'm', 'm', 'o', 'p']
print("".join(letters))   # emmop
```

```cpp
string s = "pomme";
sort(s.begin(), s.end());
cout << s << "\n";        // emmop
```

Careful: in Python, a dictionary key must be a string, a number or a tuple, never a list (otherwise: `TypeError: unhashable type: 'list'`). Finally, like pairs, two lists (or two `vector`s) are compared element by element: so a list of lists can be sorted with `sort`.

## Key takeaways

- `sort` puts a list in increasing order; strings are compared in alphabetical order.
- Pairs are sorted by their first element first: put the main criterion there, and use `-score` for a decreasing order.
- To count letters or small integers, an array of counters is enough; for words, use a dictionary.
- A dictionary of lists groups together the items that have the same key; that key can be a computed string, but not a list.
