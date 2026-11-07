import json, random
random.seed(2026)

def test(g):
    return f"{len(g)} {len(g[0])}\n" + "".join(" ".join(map(str, l)) + "\n" for l in g)

def alea(r, c, lo=-99, hi=99):
    return [[random.randint(lo, hi) for _ in range(c)] for _ in range(r)]

tests = [test([[1, -2, 3], [-4, 5, 6], [7, -8, -9]]), test([[-3, -1], [-2, -5]])]
tests.append(test([[42]]))
tests.append(test([[-7]]))
tests.append(test([[1, 2, 3, 4]]))
tests.append(test([[5], [-10], [6], [-1], [4]]))
tests.append(test([[0] * 5 for _ in range(4)]))
tests.append(test(alea(6, 8, -5, 5)))
tests.append(test(alea(20, 50)))
tests.append(test(alea(12, 2000, -99, 98)))
# grands tests : essayer tous les rectangles serait bien trop lent
tests.append(test(alea(12, 2000)))
tests.append(test(alea(12, 2000, -99, 0)))
g = alea(12, 2000, -99, 10)
for i in range(2, 10):
    for j in range(600, 1400):
        g[i][j] = random.randint(0, 99) if (i + j) % 7 else -99
tests.append(test(g))
print(json.dumps(tests))
