import json, random
random.seed(2026)

N_MAX = 400


def fmt(lettres, valeurs):
    return f"{len(lettres)}\n{lettres}\n" + " ".join(map(str, valeurs)) + "\n"


def aleatoire(n, alphabet, vmin, vmax):
    return fmt("".join(random.choice(alphabet) for _ in range(n)), [random.randint(vmin, vmax) for _ in range(n)])


tests = [
    fmt("abab", [3, 1, 2, 5]),
    fmt("aabbaa", [2, 4, 1, 6, 3, -2]),
]
# Cas limites : un seul point, aucune paire possible, que des valeurs négatives
tests.append(fmt("a", [7]))
tests.append(fmt("abcd", [5, 5, 5, 5]))
tests.append(fmt("aaaa", [-3, -2, 4, -5]))
tests.append(fmt("abba", [10, 1, 1, 10]))


def optimum(lettres, v):
    n = len(lettres)
    f = [[0] * (n + 1) for _ in range(n + 2)]
    for l in range(n - 1, -1, -1):
        for r in range(l, n):
            res = f[l + 1][r]
            for k in range(l + 1, r + 1):
                if lettres[k] == lettres[l]:
                    res = max(res, v[l] * v[k] + (f[l + 1][k - 1] if k > l + 1 else 0) + (f[k + 1][r] if k < r else 0))
            f[l][r] = res
    return f[0][n - 1]


def glouton(lettres, v):
    # Relie toujours la paire compatible de plus grand produit
    n = len(lettres)
    arcs = []
    paires = sorted(((v[i] * v[j], i, j) for i in range(n) for j in range(i + 1, n) if lettres[i] == lettres[j]), reverse=True)
    pris = set()
    total = 0
    for p, i, j in paires:
        if p <= 0 or i in pris or j in pris:
            continue
        if any(a < i < b < j or i < a < j < b for a, b in arcs):
            continue
        arcs.append((i, j))
        pris |= {i, j}
        total += p
    return total


def piege(n, alphabet):
    # Un cas où le glouton se trompe
    while True:
        lettres = "".join(random.choice(alphabet) for _ in range(n))
        v = [random.randint(1, 9) for _ in range(n)]
        if glouton(lettres, v) < optimum(lettres, v):
            return fmt(lettres, v)


# Pièges pour le glouton « la paire de plus grand produit d'abord »
tests.append(fmt("abab", [8, 9, 8, 9]))
tests.append(piege(6, "ab"))
tests.append(piege(10, "abc"))
tests.append(aleatoire(12, "ab", -5, 9))
tests.append(aleatoire(60, "abc", -50, 100))
# Grands cas : une seule lettre (pire cas pour le temps), peu de lettres, valeurs de signes variés
tests.append(aleatoire(N_MAX, "a", 1, 1000))
tests.append(aleatoire(N_MAX, "a", -1000, 1000))
tests.append(aleatoire(N_MAX, "ab", -1000, 1000))
tests.append(aleatoire(N_MAX, "abcde", 1, 1000))
tests.append(fmt("ab" * (N_MAX // 2), [1000 - i for i in range(N_MAX)]))
print(json.dumps(tests))
