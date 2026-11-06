import json, random
random.seed(2026)

def test(budget, prix):
    return f"{len(prix)} {budget}\n" + " ".join(map(str, prix)) + "\n"

def prix_aleatoires(n, lo=20, hi=100):
    return [random.randint(lo, hi) for _ in range(n)]

tests = [
    test(100, [30, 25, 40, 10, 20, 35, 15, 50]),
    test(10, [12, 30, 11]),
    test(5, [5]),                      # un seul jour, juste le bon prix
    test(4, [5]),                      # un seul jour, trop cher
    test(200, [40] * 6),               # tout identique, budget exact pour 5 jours
    test(10**9, [1, 100, 1, 100]),     # budget énorme : toute la saison
    test(60, [100, 100, 30, 30, 100, 100]),
    test(150, [100, 1, 1, 1, 1, 1, 100, 50, 50, 50]),
]
p = prix_aleatoires(50, 1, 100)
tests.append(test(300, p))
p = prix_aleatoires(5000, 1, 100)
tests.append(test(sum(p) // 3, p))
p = prix_aleatoires(10000)
tests.append(test(sum(p) - 1, p))      # il faut enlever un seul jour
# deux tests de taille maximale, avec de longues fenêtres
p = prix_aleatoires(50000)
tests.append(test(sum(p) * 2 // 5, p))
p = prix_aleatoires(50000, 1, 100)
tests.append(test(sum(p) * 3 // 5, p))
print(json.dumps(tests))
