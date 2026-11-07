import json, random
random.seed(2026)

LIM = 10**9

def hasard(nb_termes, max_facteurs, grand):
    # On fabrique les termes un par un, en gardant produits et sommes partielles
    # entre -10^9 et 10^9.
    s, total = "", 0
    for t in range(nb_termes):
        facteurs = [random.randint(0, grand)]
        for _ in range(random.randint(0, max_facteurs - 1)):
            x = random.randint(1, random.choice([9, grand]))
            prod = 1
            for f in facteurs:
                prod *= f
            if prod * x <= LIM:
                facteurs.append(x)
        terme = 1
        for f in facteurs:
            terme *= f
        texte = "*".join(map(str, facteurs))
        if t == 0:
            s, total = texte, terme
        elif total + terme <= LIM and (total - terme < -LIM or random.random() < 0.5):
            s, total = s + "+" + texte, total + terme
        else:
            s, total = s + "-" + texte, total - terme
    assert len(s) <= 1000
    return s + "\n"

tests = ["2+3*4\n", "10-2*3-4\n", "7*0+100*2*3-50\n"]
tests += [
    "0\n",
    "1000\n",
    "5-10\n",                     # résultat négatif
    "1000*1000*1000\n",           # le plus grand produit
    "0*999+3\n",
    "8-2-3\n",                    # les soustractions de gauche à droite
    "2*3*4-5*6+7\n",
    "1000*1000*1000-1000*1000*1000+1\n",
    "1-" * 333 + "1\n",
    "1*" * 499 + "7\n",
]
tests.append(hasard(6, 3, 20))
tests.append(hasard(30, 3, 100))
tests.append(hasard(80, 2, 1000))
tests.append(hasard(60, 6, 9))
tests.append(hasard(190, 1, 1000))
tests.append(hasard(40, 4, 1000))
print(json.dumps(tests))
