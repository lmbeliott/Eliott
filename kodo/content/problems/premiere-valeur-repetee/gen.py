import json, random
random.seed(2026)

def test(valeurs):
    return f"{len(valeurs)}\n{' '.join(map(str, valeurs))}\n"

tests = [test([5, 3, 8, 3, 5, 8]), test([1, 2, 3, 4])]
tests.append(test([7]))                          # une seule valeur
tests.append(test([9, 9]))                       # répétition immédiate
tests.append(test([1, 2, 3, 4, 5, 6, 1]))        # répétition à la toute fin
tests.append(test([4, 1, 2, 1, 4]))              # 1 se répète avant 4
tests.append(test([0, 1000000000, 0]))
for n in [50, 500, 5000]:
    tests.append(test([random.randint(0, 3 * n) for _ in range(n)]))
# grands tests : une recherche dans une liste des valeurs vues serait trop lente
valeurs = list(range(1, 50000))
random.shuffle(valeurs)
valeurs.append(valeurs[12345])                   # une seule répétition, tout à la fin
tests.append(test(valeurs))
valeurs = random.sample(range(1000000000), 6000)  # toutes distinctes
tests.append(test(valeurs))
print(json.dumps(tests))
