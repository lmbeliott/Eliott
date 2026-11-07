import json, random
random.seed(3107)

def test(t):
    return f"{len(t)}\n{' '.join(map(str, t))}\n"

tests = [test([3, 0, 6, 1, 5]), test([10, 8, 5, 4, 3, 3, 1])]
tests.append(test([0]))                                   # indice 0
tests.append(test([1000000000]))                          # un article : indice 1
tests.append(test([0, 0, 0, 0]))
tests.append(test([5, 5, 5, 5, 5]))                       # exactement 5
tests.append(test([100] * 50))                            # limité par le nombre d'articles
tests.append(test([random.randint(0, 60) for _ in range(100)]))
tests.append(test([random.randint(0, 10**9) for _ in range(2000)]))
# grands tests : recompter pour chaque h serait trop lent
tests.append(test([random.randint(0, 30000) for _ in range(25000)]))
tests.append(test([random.randint(0, 25000) if random.random() < 0.97 else random.randint(0, 10**9) for _ in range(25000)]))
print(json.dumps(tests))
