import json, random
random.seed(3307)

def test(l):
    return f"{len(l)}\n{' '.join(map(str, l))}\n"

tests = [test([4, 2, 3, 7, 5]), test([1, 1, 2, 2])]
tests.append(test([5]))                                      # moins de trois bâtons
tests.append(test([3, 4, 5]))
tests.append(test([1, 2, 3]))                                # triangle aplati : 0
tests.append(test([1, 2, 4, 8, 16, 32, 64]))                 # aucun triangle
tests.append(test([7] * 10))                                 # tous équilatéraux : 120
tests.append(test([random.randint(1, 20) for _ in range(50)]))
tests.append(test([random.randint(1, 10**6) for _ in range(400)]))
# grands tests : essayer tous les triplets serait trop lent
tests.append(test([random.randint(1, 10**6) for _ in range(2000)]))
tests.append(test([random.randint(500000, 10**6) for _ in range(2000)]))
tests.append(test([random.choice([1, 2, 3, 5, 8, 13, 21, 34]) * random.randint(1, 29000) for _ in range(2000)]))
print(json.dumps(tests))
