import json, random
random.seed(4307)

PREMIERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]


def plus_petit(k, borne=10 ** 18):
    # même exploration que la solution, pour ne garder que les K dont la réponse est au plus 10¹⁸
    meilleur = [borne + 1]

    def explorer(i, reste, valeur, emax):
        if reste == 1:
            meilleur[0] = min(meilleur[0], valeur)
            return
        if i == len(PREMIERS):
            return
        for e in range(1, emax + 1):
            valeur *= PREMIERS[i]
            if valeur >= meilleur[0]:
                break
            if reste % (e + 1) == 0:
                explorer(i + 1, reste // (e + 1), valeur, e)

    explorer(0, k, 1, 64)
    return meilleur[0]


valides = [k for k in range(1, 110000) if plus_petit(k) <= 10 ** 18]


def texte(ks):
    for k in ks:
        assert k in VALIDES
    return f"{len(ks)}\n" + "".join(f"{k}\n" for k in ks)


VALIDES = set(valides)
tests = [texte([1, 6, 12]), texte([16, 7])]
tests.append(texte([2, 3, 59, 60]))
tests.append(texte([103680, 92160, 64512, 4096]))
tests.append(texte(list(range(1, 61))))
tests.append(texte(sorted(random.sample(valides, 300))))
tests.append(texte(valides))                              # tous les K possibles jusqu'à 103 680
tests.append(texte([k for k in valides if k > 10000]))
tests.append(texte([k for k in valides if all(k % p for p in range(2, int(k ** 0.5) + 1))]))  # K premiers
print(json.dumps(tests))
