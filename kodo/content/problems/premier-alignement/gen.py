import json, random
random.seed(2026)

def test(h, w, k, coups):
    return f"{h} {w} {k}\n{len(coups)}\n" + " ".join(map(str, coups)) + "\n"

def partie(h, w, nb):
    # nb coups au hasard, sans jamais jouer dans une colonne pleine.
    hauteur = [0] * w
    coups = []
    for _ in range(nb):
        libres = [c for c in range(w) if hauteur[c] < h]
        c = random.choice(libres)
        hauteur[c] += 1
        coups.append(c + 1)
    return coups

tests = [
    test(6, 7, 4, [4, 4, 5, 5, 6, 6, 7]),
    test(4, 4, 3, [1, 2, 2, 3, 4, 3, 3]),
    test(2, 3, 3, [1, 2, 3, 1, 2, 3]),
]
tests += [
    test(1, 1, 1, [1]),                              # K = 1 : le premier coup suffit
    test(6, 7, 4, [1, 1, 2, 2, 4, 4, 3]),            # le jeton du milieu relie deux morceaux
    test(6, 7, 4, [1, 2, 1, 2, 1, 2, 3, 2]),         # le joueur 2 gagne à la verticale
    test(6, 7, 4, [4, 3, 3, 2, 2, 1, 2, 1, 1, 7, 1]),  # diagonale montante vers la gauche
    test(6, 7, 4, [1, 2, 2, 3, 3, 4, 3, 4, 4, 7, 4]),  # diagonale montante vers la droite
    test(3, 3, 4, [1, 2, 3, 1, 2, 3, 1, 2, 3]),      # K trop grand : jamais
    test(50, 50, 50, partie(50, 50, 2500)),
    test(50, 50, 2, partie(50, 50, 2500)),
    test(50, 50, 5, partie(50, 50, 2500)),
    test(50, 50, 7, partie(50, 50, 2500)),
    test(50, 50, 9, partie(50, 50, 2500)),
    test(50, 49, 12, partie(50, 49, 2450)),
    test(1, 50, 2, partie(1, 50, 50)),
    test(50, 1, 3, [1] * 50),                        # une seule colonne : alternance
    test(10, 10, 6, partie(10, 10, 100)),
    test(8, 9, 4, partie(8, 9, 60)),
]
print(json.dumps(tests))
