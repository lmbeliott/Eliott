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
        elif forme == 'deux-bras':
            pere.append(0 if k <= 2 else k - 2)
        elif forme == 'profond':
            pere.append(random.randint(max(0, k - 3), k - 1))
        else:
            pere.append(random.randint(0, k - 1))
    numero = [1] + random.sample(range(2, n + 1), n - 1)
    return pere, numero


def fmt(pere, numero, ops):
    n = len(pere)
    parent = [0] * (n + 1)
    for k in range(1, n):
        parent[numero[k]] = numero[pere[k]]
    return (f"{n} {len(ops)}\n" + " ".join(map(str, parent[2:])) + "\n"
            + "".join(" ".join(map(str, op)) + "\n" for op in ops))


def cas(n, q, forme, part_ajout, bout=None, question=None):
    # bout() et question() renvoient des positions de création : extrémités des chemins,
    # sommets des questions. Par défaut, au hasard.
    pere, numero = arbre(n, forme)
    bout = bout or (lambda: random.randrange(n))
    question = question or (lambda: random.randrange(n))
    ops = []
    for i in range(q):
        if i < q // 5 or random.random() < part_ajout:  # d'abord quelques ajouts
            ops.append((1, numero[bout()], numero[bout()], random.randint(1, 1000)))
        else:
            ops.append((2, numero[question()]))
    return fmt(pere, numero, ops)


tests = [
    "6 8\n1 1 2 2 3\n1 4 6 2\n2 1\n2 2\n1 5 2 3\n2 2\n2 3\n1 1 1 7\n2 1\n",
    "4 4\n3 1 1\n1 2 4 5\n2 3\n1 3 3 1\n2 1\n",
]
tests.append("1 3\n\n2 1\n1 1 1 1000\n2 1\n")
tests.append(cas(6, 10, 'chemin', 0.5))
tests.append(cas(8, 12, 'etoile', 0.5))
tests.append(cas(9, 12, 'deux-bras', 0.5))
tests.append(cas(40, 60, 'aleatoire', 0.5))
tests.append(cas(800, 1000, 'profond', 0.5))
tests.append(cas(3000, 2000, 'aleatoire', 0.5))
# Grands cas sur des arbres profonds : de longs chemins et des questions près de la racine.
n = 10000
tests.append(cas(n, 8000, 'profond', 0.5, bout=lambda: random.randrange(n // 2, n), question=lambda: random.randrange(300)))
tests.append(cas(n, 8000, 'deux-bras', 0.6, bout=lambda: random.randrange(n - 1500, n)))
tests.append(cas(2500, 1500, 'aleatoire', 0.5))
print(json.dumps(tests))
