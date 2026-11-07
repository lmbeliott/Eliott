import json, random
random.seed(2026)

N_MAX = 12000
A_MAX = 10**6


def fmt(d, a, w):
    return f"{len(a)} {d}\n" + " ".join(map(str, a)) + "\n" + " ".join(map(str, w)) + "\n"


def poids(n, wmax):
    return [random.randint(1, wmax) for _ in range(n)]


def montee_bruitee(n, bruit):
    # Une tendance croissante avec du bruit : beaucoup de bonnes sous-suites, qui sautent plus ou moins loin
    return [min(A_MAX, max(0, i * (A_MAX // n) + random.randint(-bruit, bruit))) for i in range(n)]


tests = [
    fmt(2, [3, 1, 4, 1, 5, 9, 2, 6], [2, 5, 3, 1, 4, 1, 2, 7]),
    fmt(3, [5, 5, 2, 7, 7, 8], [4, 6, 1, 3, 9, 2]),
]
# Cas limites : un seul élément, D = 1, valeurs toutes égales, suite décroissante, D = N
tests.append(fmt(1, [42], [17]))
tests.append(fmt(1, [1, 2, 3, 1, 2, 3, 4, 0], [5, 5, 5, 1, 1, 1, 1, 9]))
tests.append(fmt(4, [7] * 6, [3, 8, 2, 8, 1, 5]))
tests.append(fmt(5, [9, 8, 7, 6, 5, 4], [1, 6, 2, 5, 3, 4]))
tests.append(fmt(10, [0, 1000000, 1, 999999, 2, 999998, 3, 999997, 4, 999996], [1, 9, 1, 9, 1, 9, 1, 9, 1, 9]))
# La plus longue sous-suite n'est pas la plus lourde, et le saut le plus lourd est trop long
tests.append(fmt(2, [1, 2, 3, 4, 100, 50, 60, 5], [1, 1, 1, 1, 50, 1, 1, 1]))
# Petits et moyens cas aléatoires
tests.append(fmt(3, [random.randint(0, 20) for _ in range(40)], poids(40, 10)))
tests.append(fmt(25, [random.randint(0, 500) for _ in range(500)], poids(500, 1000)))
# Grands cas : avec D proche de N, tester toutes les positions de la fenêtre coûte N × D / 2 ≈ 7 × 10⁷.
tests.append(fmt(N_MAX, [random.randint(0, A_MAX) for _ in range(N_MAX)], poids(N_MAX, 1000)))
tests.append(fmt(9000, montee_bruitee(N_MAX, 400000), poids(N_MAX, 1000)))
tests.append(fmt(40, montee_bruitee(8000, 3000), poids(8000, 1000)))
print(json.dumps(tests))
