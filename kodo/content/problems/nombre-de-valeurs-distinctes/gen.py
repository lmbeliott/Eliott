import json, random
random.seed(2026)

def test(valeurs):
    return f"{len(valeurs)}\n{' '.join(map(str, valeurs))}\n"

tests = [test([4, 7, 4, 1, 7, 4]), test([-3, 3, 0, -3])]
tests.append(test([5]))                                  # une seule valeur
tests.append(test([2] * 10))                             # toutes égales
tests.append(test(list(range(1, 11))))                   # toutes distinctes
tests.append(test([10**9, -10**9, 10**9, 0, -10**9]))    # valeurs extrêmes
for n, m in [(100, 20), (1000, 1000000), (5000, 50)]:
    tests.append(test([random.randint(-m, m) for _ in range(n)]))
# grands tests : une recherche dans une liste serait trop lente
valeurs = list(range(-25000, 25000))
random.shuffle(valeurs)
tests.append(test(valeurs))                                          # 50 000 valeurs toutes distinctes
tests.append(test([random.randint(0, 999) for _ in range(8000)]))    # beaucoup de doublons
print(json.dumps(tests))
