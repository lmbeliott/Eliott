import json, random
random.seed(2026)

G = 10**9

def test(l1, c1, l2, c2, l3, c3):
    return f"{l1} {c1}\n{l2} {c2}\n{l3} {c3}\n"

tests = [
    test(4, 4, 4, 9, 2, 6),
    test(4, 4, 8, 8, 6, 6),
    test(2, 3, 5, 4, 1, 1),
    test(5, 5, 3, 7, 1, 9),
]
tests += [
    test(4, 4, 8, 8, 5, 7),            # obstacle dans le rectangle, hors de la diagonale
    test(5, 5, 9, 9, 7, 3),            # obstacle sur l'autre diagonale
    test(3, 1, 3, 9, 4, 5),            # ligne : obstacle sur la ligne d'à côté
    test(3, 9, 3, 1, 3, 4),            # ligne, vers la gauche : bloqué
    test(9, 2, 1, 2, 5, 2),            # colonne, vers le haut : bloqué
    test(1, 2, 9, 2, 10, 2),           # colonne : obstacle derrière la case
    test(5, 5, 6, 6, 4, 4),            # case voisine, obstacle derrière la dame
    test(7, 2, 2, 7, 4, 5),            # diagonale montante : bloqué
    test(1, 1, G, G, G // 2, G // 2),
    test(1, 1, G, G, G // 2, G // 2 + 1),
    test(1, G, G, 1, 2, G - 1),        # obstacle juste à côté de la dame
    test(G, 1, 1, G, 2, G - 1),        # obstacle juste à côté de la case
    test(1, 1, 2, 3, 3, 3),            # un saut de cavalier : impossible
    test(1, 1, G, G - 1, 2, 2),
    test(G, G, 1, G, G, 1),
]

DIRS = [(0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (1, -1), (-1, 1), (-1, -1)]

def answer(l1, c1, l2, c2, l3, c3):
    dl, dc, ol, oc = l2 - l1, c2 - c1, l3 - l1, c3 - c1
    if not (dl == 0 or dc == 0 or dl == dc or dl == -dc):
        return False
    t = max(abs(dl), abs(dc))
    sl, sc = (dl > 0) - (dl < 0), (dc > 0) - (dc < 0)
    # l'obstacle bloque s'il vaut dame + s * direction avec 0 < s < t
    s = max(abs(ol), abs(oc))
    return not (ol == s * sl and oc == s * sc and 0 < s < t)

def inside(*v):
    return all(1 <= x <= G for x in v)

def random_case(big):
    hi = G if big else 30
    while True:
        l1, c1 = random.randint(1, hi), random.randint(1, hi)
        kind = random.randint(0, 5)
        dl_, dc_ = random.choice(DIRS)
        t = random.randint(1, hi)
        l2, c2 = l1 + t * dl_, c1 + t * dc_
        if kind == 0:     # obstacle sur le chemin
            s = random.randint(1, t)
            l3, c3 = l1 + s * dl_, c1 + s * dc_
        elif kind == 1:   # obstacle sur la bonne droite, derrière la case ou la dame
            s = random.choice([random.randint(t + 1, t + hi), -random.randint(1, hi)])
            l3, c3 = l1 + s * dl_, c1 + s * dc_
        elif kind == 2:   # obstacle sur le chemin, décalé d'une case
            s = random.randint(1, t)
            l3, c3 = l1 + s * dl_ + random.randint(-1, 1), c1 + s * dc_ + random.randint(-1, 1)
        elif kind == 3:   # obstacle sur une autre droite de la dame
            e_l, e_c = random.choice(DIRS)
            s = random.randint(1, hi)
            l3, c3 = l1 + s * e_l, c1 + s * e_c
        elif kind == 4:   # case presque alignée
            l2 += random.choice([-1, 1])
            l3, c3 = random.randint(1, hi), random.randint(1, hi)
        else:             # tout au hasard
            l2, c2 = random.randint(1, hi), random.randint(1, hi)
            l3, c3 = random.randint(1, hi), random.randint(1, hi)
        cells = {(l1, c1), (l2, c2), (l3, c3)}
        if len(cells) == 3 and inside(l1, c1, l2, c2, l3, c3):
            return (l1, c1, l2, c2, l3, c3)

# Cas aléatoires, autant de OUI que de NON.
voulu = True
while len(tests) < 30:
    case = random_case(big=len(tests) >= 26)
    if answer(*case) == voulu:
        tests.append(test(*case))
        voulu = not voulu
print(json.dumps(tests))
