import json, random
random.seed(2026)

N_MAX = 200000


def explicite(parents):
    return f"{len(parents)} 0\n" + " ".join(map(str, parents)) + "\n"


def genere(n, graine, s, k):
    return f"{n} {graine}\n{s} {k}\n"


def aleatoire(n, portee):
    return [random.randint(max(0, i - portee), i - 1) for i in range(1, n + 1)]


tests = [
    explicite([0, 1, 1, 0, 4]),
    genere(9, 7, 2, 2),
]
# Cas limites : une seule arête, un chemin, une étoile perdante, une étoile gagnante
tests.append(explicite([0]))
tests.append(explicite([0, 1, 2, 3, 4, 5]))
tests.append(explicite([0, 0, 0, 0]))
tests.append(explicite([0, 0, 0, 0, 0]))
tests.append(explicite([0, 1, 1, 1, 1, 1, 1]))


def coups_gagnants(parents):
    # même calcul que la solution, pour choisir des petits cas intéressants
    n = len(parents)
    p = [0] + parents
    g = [0] * (n + 1)
    for v in range(n, 0, -1):
        g[p[v]] ^= g[v] + 1
    besoin = [-1] * (n + 1)
    besoin[0] = 0
    total = 0
    for v in range(1, n + 1):
        b = besoin[p[v]]
        if b < 0:
            continue
        total += (g[p[v]] ^ (g[v] + 1)) == b
        z = b ^ g[p[v]] ^ (g[v] + 1)
        if z > 0:
            besoin[v] = z - 1
    return total


def interessant(n, portee, mini):
    while True:
        parents = aleatoire(n, portee)
        if coups_gagnants(parents) >= mini:
            return explicite(parents)


tests.append(interessant(12, 3, 2))
tests.append(interessant(60, 60, 4))
tests.append(interessant(2000, 5, 6))
# Deux balais : un long manche, puis beaucoup de brins au bout
balai1 = [i - 1 for i in range(1, 7001)] + [7000] * 3000
balai2 = [0] + [10000 + i for i in range(1, 7000)] + [17000] * 3001
tests.append(explicite(balai1 + balai2))
# Grands tests produits par le générateur : de très profond (un chemin) à très large
tests.append(genere(N_MAX, 99, 1, 1))          # un seul chemin
tests.append(genere(N_MAX, 5, 2, 2))           # deux longues branches entremêlées
tests.append(genere(N_MAX, 4, 3, 2))
tests.append(genere(N_MAX, 5, 10, 3))
tests.append(genere(N_MAX, 5, 100, 5))
tests.append(genere(N_MAX, 17, 1000, 50))
tests.append(genere(N_MAX, 5, 1, 1000))
tests.append(genere(N_MAX, 2, 7, 100000))      # position perdante : aucun coup gagnant
tests.append(genere(N_MAX, 13, 7, 100000))
print(json.dumps(tests))
