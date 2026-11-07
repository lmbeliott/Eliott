import json, random
random.seed(2026)

def test(listes):
    s = f"{len(listes)}\n"
    for a in listes:
        s += f"{len(a)}\n{' '.join(map(str, a))}\n"
    return s

def perm(n):
    a = list(range(1, n + 1))
    random.shuffle(a)
    return a

tests = [test([[5, 1, 4, 2, 3], [2, 1, 3], [3, 1, 2]]), test([[7], [2, 1], [1, 2], [4, 4, 1, 9]])]
tests.append(test([[3, 2, 1], [1, 3, 2], [2, 3, 1], [1, 2, 3], [5, 5], [9, 8, 9]]))
tests.append(test([perm(random.randint(1, 8)) for _ in range(1000)]))
tests.append(test([[random.randint(1, 4) for _ in range(random.randint(1, 6))] for _ in range(1000)]))
tests.append(test([perm(10000)]))
tests.append(test([perm(5000), perm(5000)]))
big = perm(9999)
big.append(15)
tests.append(test([big]))
tests.append(test([[random.randint(1, 10**9) for _ in range(30)] for _ in range(200)]))
tests.append(test([list(range(10000, 0, -1))]))
tests.append(test([list(range(9999, 0, -1))]))
tests.append(test([list(range(1, 9998)), [10**9, 1]]))
print(json.dumps(tests))
