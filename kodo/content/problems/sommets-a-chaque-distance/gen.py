import json, random
random.seed(2026)

def test(n, aretes):
    lignes = [f"{n} {len(aretes)}"] + [f"{a} {b}" for a, b in aretes]
    return "\n".join(lignes) + "\n"

def aleatoire(n, m):
    return [(random.randint(1, n), random.randint(1, n)) for _ in range(m)]

def melange(n, aretes):
    # renumérote les sommets 2..n au hasard (le sommet 1 reste le départ)
    p = list(range(2, n + 1))
    random.shuffle(p)
    nom = [0, 1] + p
    aretes = [(nom[a], nom[b]) for a, b in aretes]
    random.shuffle(aretes)
    return aretes

tests = []
tests.append(test(7, [(1, 2), (1, 3), (2, 4), (3, 4), (4, 5), (6, 7)]))
tests.append(test(5, [(2, 1), (3, 3), (2, 3), (3, 2)]))
tests.append(test(1, []))
tests.append(test(1, [(1, 1), (1, 1)]))
tests.append(test(4, []))
tests.append(test(6, [(2, 3), (3, 4), (4, 5), (5, 6)]))
# chemin de 10 000 sommets : distance maximale 9 999
tests.append(test(10000, melange(10000, [(i, i + 1) for i in range(1, 10000)])))
# étoile
tests.append(test(3000, [(1, i) for i in range(2, 3001)]))
# grille 100 x 100 aplatie
g = []
for r in range(100):
    for c in range(100):
        v = r * 100 + c + 1
        if c < 99: g.append((v, v + 1))
        if r < 99 and len(g) < 10000: g.append((v, v + 100))
tests.append(test(10000, melange(10000, g[:10000])))
for n, m in [(30, 25), (200, 220), (3000, 2500), (2000, 3000)]:
    tests.append(test(n, aleatoire(n, m)))
# arbre aléatoire profond
n = 9000
tests.append(test(n, melange(n, [(i, random.randint(max(1, i - 3), i - 1)) for i in range(2, n + 1)])))
print(json.dumps(tests))
