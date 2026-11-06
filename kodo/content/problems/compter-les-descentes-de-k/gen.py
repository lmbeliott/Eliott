import json, random
random.seed(2026)

def test(k, symboles):
    return f"{len(symboles)} {k}\n{symboles}\n"

def aleatoire(n, poids=(1, 1, 1)):
    return "".join(random.choices("+-=", weights=poids, k=n))

tests = [
    test(1, "+--=+-"),
    test(2, "+++++"),
    test(1, "-"),
    test(1, "="),
    test(3, "---"),
    test(1, "====-===="),
    test(2, "-+-+--+-+-"),
]
tests.append(test(2, aleatoire(40)))
tests.append(test(5, aleatoire(3000, (1, 2, 1))))
# tests de taille maximale
tests.append(test(1, "-" * 50000))
tests.append(test(10, "=" * 45000 + "-" * 10 + "=" * 54990))   # réponse > 2^31
tests.append(test(3, aleatoire(100000)))
tests.append(test(40, aleatoire(100000, (2, 3, 4))))
print(json.dumps(tests))
