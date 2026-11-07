import json, random
random.seed(2026)

def test(budget, prix):
    return f"{len(prix)} {budget}\n" + "".join(map(str, prix)) + "\n"

def prix_aleatoires(n, lo=1, hi=9):
    return [random.randint(lo, hi) for _ in range(n)]

tests = [
    test(20, [3, 2, 4, 1, 2, 3, 1, 5]),
    test(5, [7, 9, 6]),
    test(5, [5]),                      # un seul jour, juste le bon prix
    test(4, [5]),                      # un seul jour, trop cher
    test(20, [4] * 6),                 # tout identique, budget exact pour 5 jours
    test(10**9, [1, 9, 1, 9]),         # budget énorme : toute la période
    test(6, [9, 9, 3, 3, 9, 9]),
    test(15, [9, 1, 1, 1, 1, 1, 9, 5, 5, 5]),
]
p = prix_aleatoires(50)
tests.append(test(30, p))
p = prix_aleatoires(5000)
tests.append(test(sum(p) // 3, p))
p = prix_aleatoires(10000, 2, 9)
tests.append(test(sum(p) - 1, p))      # il faut enlever un seul jour
# deux tests de taille maximale, avec de longues fenêtres :
# la solution naïve y fait des milliards de pas
p = prix_aleatoires(150000)
tests.append(test(sum(p) * 3 // 5, p))
p = prix_aleatoires(150000, 3, 9)
tests.append(test(sum(p) * 2 // 3, p))
print(json.dumps(tests))
