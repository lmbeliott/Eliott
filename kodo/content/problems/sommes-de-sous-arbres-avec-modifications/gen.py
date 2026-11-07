import json, random
random.seed(2026)


def arbre(n, forme):
    # pere[k] < k est la position de création du parent ; numero[k] le numéro après mélange.
    pere = [-1]
    for k in range(1, n):
        if forme == 'chemin':
            pere.append(k - 1)
        elif forme == 'etoile':
            pere.append(0)
        elif forme == 'profond':
            pere.append(random.randint(max(0, k - 3), k - 1))
        else:
            pere.append(random.randint(0, k - 1))
    numero = [1] + random.sample(range(2, n + 1), n - 1)
    return pere, numero


def fmt(pere, numero, valeurs, ops):
    n = len(pere)
    parent = [0] * (n + 1)
    for k in range(1, n):
        parent[numero[k]] = numero[pere[k]]
    return (f"{n} {len(ops)}\n" + " ".join(map(str, valeurs)) + "\n"
            + " ".join(map(str, parent[2:])) + "\n"
            + "".join(" ".join(map(str, op)) + "\n" for op in ops))


def operations(pere, numero, q, part_modif, cible=None):
    # cible(n) renvoie une position de création ; par défaut, au hasard.
    n = len(pere)
    choix = cible or (lambda: random.randrange(n))
    ops = []
    for _ in range(q):
        if random.random() < part_modif:
            ops.append((1, numero[choix()], random.randint(0, 1000)))
        else:
            ops.append((2, numero[choix()]))
    return ops


def cas(n, q, forme, part_modif, cible=None):
    pere, numero = arbre(n, forme)
    valeurs = [random.randint(0, 1000) for _ in range(n)]
    return fmt(pere, numero, valeurs, operations(pere, numero, q, part_modif, cible))


tests = [
    "6 6\n3 1 4 1 5 9\n1 1 2 2 3\n2 1\n2 2\n1 4 10\n2 2\n2 6\n2 3\n",
    "4 5\n5 0 2 7\n3 1 1\n2 3\n1 3 1\n2 3\n1 2 4\n2 1\n",
]
tests.append("1 3\n8\n\n2 1\n1 1 0\n2 1\n")
tests.append(cas(5, 8, 'chemin', 0.4))
tests.append(cas(7, 10, 'etoile', 0.4))
tests.append(cas(30, 40, 'aleatoire', 0.5))
tests.append(cas(500, 600, 'profond', 0.5))
tests.append(cas(3000, 2000, 'aleatoire', 0.5))
# Grands cas sur des arbres très profonds. Le premier pose surtout des questions près de la
# racine (parcourir le sous-arbre est trop lent) ; le second fait surtout des modifications
# loin de la racine (remonter tous les ancêtres est trop lent).
tests.append(cas(8000, 8000, 'profond', 0.2, cible=lambda: random.randrange(400)))
tests.append(cas(8000, 8000, 'chemin', 0.8, cible=lambda: random.randrange(6000, 8000)))
tests.append(cas(2000, 3000, 'etoile', 0.5))
print(json.dumps(tests))
