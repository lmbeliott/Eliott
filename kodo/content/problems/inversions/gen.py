import json, random
random.seed(2026)


def fmt(perm):
    return f"{len(perm)}\n" + " ".join(map(str, perm)) + "\n"


def presque_trie(n, echanges):
    p = list(range(1, n + 1))
    for _ in range(echanges):
        i = random.randrange(n - 1)
        p[i], p[i + 1] = p[i + 1], p[i]
    return p


tests = [
    fmt([2, 5, 1, 4, 3]),
    fmt([1, 2, 3, 4]),
]
tests.append(fmt([1]))
tests.append(fmt([2, 1]))
tests.append(fmt(list(range(10, 0, -1))))
p = list(range(1, 31))
random.shuffle(p)
tests.append(fmt(p))
p = list(range(1, 1001))
random.shuffle(p)
tests.append(fmt(p))
# Grands cas.
tests.append(fmt(list(range(20000, 0, -1))))   # permutation décroissante : toutes les paires sont des inversions
p = list(range(1, 20001))
random.shuffle(p)
tests.append(fmt(p))
tests.append(fmt(presque_trie(8000, 12000)))
# Deux moitiés : les valeurs paires d'abord, puis les impaires, chacune dans le désordre.
pairs = list(range(2, 20001, 2))
impairs = list(range(1, 20001, 2))
random.shuffle(pairs)
random.shuffle(impairs)
tests.append(fmt(pairs + impairs))
print(json.dumps(tests))
