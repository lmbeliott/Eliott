import json, random
random.seed(2026)

RMAX = 10**6

def test(taches):
    return f"{len(taches)}\n" + "".join(f"{r} {g}\n" for r, g in taches) + ""

def aleatoire(n, rmax=RMAX, part_gains=0.5):
    taches = []
    for _ in range(n):
        r = random.randint(0, rmax)
        if random.random() < part_gains:
            g = random.randint(0, rmax)
        else:
            g = -random.randint(0, r)
        taches.append((r, g))
    return taches

def pieges_pertes(n):
    # des pertes où l'ordre « plus exigeante d'abord » ou « plus petite perte d'abord »
    # se trompe : seule l'énergie restante r + g compte
    taches = []
    for _ in range(n):
        reste = random.randint(0, RMAX // 2)
        perte = random.randint(1, RMAX // 2)
        taches.append((reste + perte, -perte))
    return taches

def pieges_gains(n):
    # des gains très exigeants qui rapportent beaucoup, et des gains faciles qui
    # rapportent peu : prendre le plus gros gain d'abord coûte cher
    taches = []
    for _ in range(n):
        if random.random() < 0.3:
            taches.append((random.randint(RMAX // 2, RMAX), random.randint(RMAX // 2, RMAX)))
        else:
            taches.append((random.randint(0, RMAX // 20), random.randint(0, RMAX // 100)))
    return taches

def melange(n):
    t = pieges_pertes(n // 2) + pieges_gains(n - n // 2)
    random.shuffle(t)
    return t

tests = [
    test([(6, -4), (3, 5), (9, -1), (4, -2)]),
    test([(7, -5), (6, -2), (3, 4)]),
    test([(0, 0)]),                                   # rien à prévoir
    test([(5, -5)]),                                  # une seule tâche
    test([(0, 3), (2, 1), (4, 0), (9, 2)]),           # que des gains
    test([(3, -3), (3, -3), (3, -3)]),                # que des pertes, toutes égales
    test([(10, -1), (10, -9), (2, -2), (6, 0)]),
    test([(1, 1), (2, 1), (3, 1), (4, 1), (100, -50), (60, -60)]),
    test(aleatoire(8, 20)),
    test(pieges_pertes(10)),
    test(pieges_gains(10)),
    test(melange(200)),
    test(aleatoire(1000, 1000)),
    test(melange(2000)),
]
# tailles maximales
tests.append(test(melange(10000)))
tests.append(test([(RMAX - random.randint(0, 10), -(RMAX - random.randint(10, 20))) for _ in range(6000)]))  # réponse > 2³¹
print(json.dumps(tests))
