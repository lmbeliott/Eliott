import json, random
random.seed(2026)

def test(g):
    return f"{len(g)} {len(g[0])}\n" + "".join(row + "\n" for row in g)

def alea(l, c, p):
    return ["".join("#" if random.random() < p else "." for _ in range(c)) for _ in range(l)]

tests = [test(["..#..", ".....", "#...#", "....."]), test(["#.#", ".#.", "#.#"])]
tests.append(test(["."]))
tests.append(test(["#"]))
tests.append(test(["." * 300] * 300))
tests.append(test(alea(300, 300, 0.02)))
tests.append(test(alea(250, 250, 0.3)))
g = alea(300, 300, 0.001)
tests.append(test(g))
tests.append(test(["".join("#" if (i + j) % 2 == 0 else "." for j in range(40)) for i in range(40)]))
tests.append(test(["".join("." if j <= i else "#" for j in range(100)) for i in range(100)]))
tests.append(test([alea(1, 300, 0.05)[0]]))
tests.append(test([random.choice(".#") for _ in range(300)]))
print(json.dumps(tests))
