import json, random
random.seed(2026)


def arbre(n, forme, largeur=10 ** 9):
    # Renvoie (pere, numero) : le sommet créé en k-ième position a pour parent le sommet créé
    # en position pere[k] < k ; numero[k] est son numéro après mélange (la racine reste 1).
    pere = [-1]
    for k in range(1, n):
        if forme == 'chemin':
            pere.append(k - 1)
        elif forme == 'etoile':
            pere.append(0)
        elif forme == 'deux-bras':
            pere.append(0 if k <= 2 else k - 2)
        else:
            pere.append(random.randint(max(0, k - largeur), k - 1))
    numero = [1] + random.sample(range(2, n + 1), n - 1)
    return pere, numero


def distance(pere, x, y):
    # Distance entre les sommets créés en positions x et y (lent, mais suffisant pour générer).
    prof = {}
    a, d = x, 0
    while a != -1:
        prof[a] = d
        a, d = pere[a], d + 1
    b, d = y, 0
    while b not in prof:
        b, d = pere[b], d + 1
    return prof[b] + d


def fmt(pere, numero, questions):
    n = len(pere)
    parent = [0] * (n + 1)
    for k in range(1, n):
        parent[numero[k]] = numero[pere[k]]
    return (f"{n} {len(questions)}\n" + " ".join(map(str, parent[2:])) + "\n"
            + "".join(f"{numero[x]} {numero[y]} {k}\n" for x, y, k in questions))


def questions(pere, q, choix):
    # choix() renvoie deux positions de création ; K est en général sur le chemin,
    # parfois juste après sa fin ou bien au-delà (réponse -1).
    res = []
    for _ in range(q):
        x, y = choix()
        d = distance(pere, x, y)
        r = random.random()
        if r < 0.05:
            k = d + 1
        elif r < 0.1:
            k = random.randint(d + 1, len(pere))
        elif r < 0.2:
            k = random.choice([0, d])
        else:
            k = random.randint(0, d)
        res.append((x, y, k))
    return res


def au_hasard(n):
    return lambda: (random.randrange(n), random.randrange(n))


def profonds(n):
    # Deux sommets parmi le dernier quart créé : dans un arbre profond, le chemin est long.
    return lambda: (random.randint(n - n // 4, n - 1), random.randint(n - n // 4, n - 1))


tests = [
    fmt([-1, 0, 0, 1, 1, 2, 4, 4], list(range(1, 9)),
        [(3, 5, 0), (3, 5, 1), (3, 5, 2), (3, 5, 3), (6, 7, 2), (5, 5, 0), (7, 2, 5), (0, 7, 3)]),
    fmt([-1, 0, 1, 0, 3], [1, 3, 2, 4, 5], [(4, 2, 2), (4, 2, 4), (2, 4, 1), (1, 0, 2)]),
]
tests.append(fmt([-1], [1], [(0, 0, 0), (0, 0, 1)]))
tests.append(fmt([-1, 0], [1, 2], [(0, 1, 0), (0, 1, 1), (1, 0, 1), (1, 0, 2), (1, 1, 0)]))
pere, numero = arbre(20, 'chemin')
tests.append(fmt(pere, numero, questions(pere, 30, au_hasard(20))))
pere, numero = arbre(30, 'aleatoire', 3)
tests.append(fmt(pere, numero, questions(pere, 40, au_hasard(30))))
pere, numero = arbre(1000, 'aleatoire')
tests.append(fmt(pere, numero, questions(pere, 800, au_hasard(1000))))
pere, numero = arbre(2000, 'etoile')
tests.append(fmt(pere, numero, questions(pere, 300, au_hasard(2000))))
# Grands cas : deux longs bras partant de la racine, et un long chemin.
pere, numero = arbre(12000, 'deux-bras')   # les positions impaires forment un bras, les paires l'autre
tests.append(fmt(pere, numero, questions(pere, 6000, lambda: (random.randrange(9001, 12000, 2), random.randrange(9000, 12000, 2)))))
pere, numero = arbre(12000, 'chemin')
tests.append(fmt(pere, numero, questions(pere, 6000, lambda: (random.randint(0, 1500), random.randint(10500, 11999)))))
pere, numero = arbre(3000, 'aleatoire', 3)
tests.append(fmt(pere, numero, questions(pere, 1000, profonds(3000))))
print(json.dumps(tests))
