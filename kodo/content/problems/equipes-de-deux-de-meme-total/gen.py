import json, random
random.seed(3304)

def test(v):
    return f"{len(v)}\n{' '.join(map(str, v))}\n"

def possible(n, t):
    v = []
    for _ in range(n // 2):
        x = random.randint(max(1, t - 100000), min(100000, t - 1))
        v += [x, t - x]
    random.shuffle(v)
    return v

tests = [test([3, 8, 5, 6, 4, 7]), test([1, 2, 3, 5]), test([10, 10, 4, 16])]
tests.append(test([7, 100000]))                             # deux joueurs : toujours possible
tests.append(test([5, 5, 5, 5, 5, 5]))
tests.append(test([1, 1, 2, 2, 3, 3]))                      # possible : 1+3, 1+3, 2+2
tests.append(test([1, 2, 2, 3, 3, 4]))                      # somme totale compatible mais impossible
tests.append(test(possible(40, 50)))
v = possible(1000, 120000); v[random.randrange(1000)] += 1
tests.append(test(v))                                        # un niveau modifié : impossible
# grands tests
tests.append(test(possible(20000, 100001)))
v = possible(20000, 60000)
i, j = random.sample(range(20000), 2)
while v[i] - 1 < 1 or v[j] + 1 > 100000:
    i, j = random.sample(range(20000), 2)
v[i] -= 1; v[j] += 1                                          # même somme totale, mais impossible
tests.append(test(v))
tests.append(test(possible(20000, 2)))
print(json.dumps(tests))
