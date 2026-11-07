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
tests.append(explicite([0, 1, 1, 1, 1, 1, 1]))
tests.append(explicite(aleatoire(12, 3)))
tests.append(explicite(aleatoire(60, 60)))
# Deux balais : un long manche, puis beaucoup de brins au bout
manche = [i - 1 for i in range(1, 15001)]
tests.append(explicite(manche + [15000] * 5001))
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
