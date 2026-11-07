import json, random
random.seed(3305)

def test(k, a):
    return f"{len(a)} {k}\n{' '.join(map(str, a))}\n"

tests = [test(2, [1, 2, 1, 3, 3, 4, 3, 5]), test(1, [4, 4, 7, 7, 7, 4])]
tests.append(test(1, [9]))
tests.append(test(3, [1, 2, 3]))                            # toute la suite
tests.append(test(1, [1, 2, 3, 4, 5]))                      # chaque case seule : la première
tests.append(test(2, [5, 6, 5, 6, 7, 8, 7, 8]))             # deux portions de longueur 4
tests.append(test(3, [random.randint(1, 6) for _ in range(40)]))
tests.append(test(10, [random.randint(1, 30) for _ in range(2000)]))
# grands tests : partir de chaque début serait trop lent
a = [random.randint(1, 2) for _ in range(30000)]
for i in (7000, 16000, 24000):
    a[i] = 3
tests.append(test(2, a))                                    # longues portions de 1 et de 2
tests.append(test(30, [random.randint(1, 30) for _ in range(15000)] + [random.randint(1, 1000) for _ in range(15000)]))
tests.append(test(500, [random.randint(1, 1000) for _ in range(30000)]))
print(json.dumps(tests))
