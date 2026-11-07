import json, random
random.seed(3206)

def test(h):
    assert len(set(h)) == len(h)
    return f"{len(h)}\n{' '.join(map(str, h))}\n"

def hasard(n, m=100000):
    return random.sample(range(1, m + 1), n)

tests = [test([3, 1, 4, 2, 5]), test([6, 2, 5, 1, 3, 4])]
tests.append(test([7]))                                  # personne à voir
tests.append(test([1, 2]))
tests.append(test(list(range(1, 11))))                  # croissant : seulement les voisines
tests.append(test([10, 1, 9, 2, 8, 3, 7, 4, 6, 5]))
tests.append(test(hasard(50, 100)))
tests.append(test(hasard(3000)))
# grands tests : tester les paires, même en s'arrêtant tôt, serait trop lent
tests.append(test(hasard(20000)))
h = sorted(hasard(20000), reverse=True)
for _ in range(2000):                                     # décroissant avec un peu de désordre
    i = random.randrange(19999)
    h[i], h[i + 1] = h[i + 1], h[i]
tests.append(test(h))
h = sorted(hasard(10000))
tests.append(test(h[0::2][::-1] + h[1::2]))              # une vallée : décroissant puis croissant
print(json.dumps(tests))
