import json, random
random.seed(2026)

def test(k, valeurs):
    return f"{len(valeurs)} {k}\n{' '.join(map(str, valeurs))}\n"

tests = [test(10, [3, 7, 5, 5, 2, 7, 8]), test(0, [-4, 4, 0, 0, 4, 1])]
tests.append(test(2, [1]))                        # une seule valeur : aucune paire
tests.append(test(6, [3, 3, 3, 3, 3]))            # 5 × 4 / 2 = 10 paires
tests.append(test(100, [1, 2, 3, 4]))             # aucune paire
tests.append(test(2 * 10**9, [10**9, 10**9, -10**9, 10**9]))
for n, m in [(50, 10), (1000, 100), (5000, 10**9)]:
    k = random.randint(-m, m)
    tests.append(test(k, [random.randint(-m, m) for _ in range(n)]))
# grands tests : une double boucle sur les paires serait trop lente
tests.append(test(1000, [random.randint(0, 1000) for _ in range(30000)]))
tests.append(test(7, [7 - x if random.random() < 0.5 else x for x in random.sample(range(-20000, 20000), 25000)]))
tests.append(test(0, [0] * 20000))                # 20000 × 19999 / 2 paires
print(json.dumps(tests))
