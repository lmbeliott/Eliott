import json, random
random.seed(2026)


def test(k, a):
    return f"{len(a)} {k}\n" + "".join(" ".join(map(str, r)) + "\n" for r in a)


def aleatoire(n, p):
    return [[1 if random.random() < p else 0 for _ in range(n)] for _ in range(n)]


tests = [test(2, [[0, 1, 1], [0, 0, 1], [1, 0, 0]]), test(3, [[1, 1], [1, 0]])]
tests.append(test(1, [[1]]))
tests.append(test(15, [[1]]))
tests.append(test(5, [[0]]))
tests.append(test(1, aleatoire(4, 0.5)))
tests.append(test(15, [[1] * 10 for _ in range(10)]))
tests.append(test(15, [[0] * 10 for _ in range(10)]))
# Un cycle 1 -> 2 -> ... -> 7 -> 1.
tests.append(test(10, [[1 if j == (i + 1) % 7 else 0 for j in range(7)] for i in range(7)]))
tests.append(test(15, [[1 if i != j else 0 for j in range(10)] for i in range(10)]))
tests.append(test(12, aleatoire(10, 0.5)))
tests.append(test(15, aleatoire(10, 0.8)))
tests.append(test(7, aleatoire(6, 0.3)))
print(json.dumps(tests))
