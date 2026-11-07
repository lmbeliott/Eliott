import json, random
random.seed(3204)

def test(q, d):
    return f"{len(d)} {q}\n{' '.join(map(str, d))}\n"

tests = [test(3, [5, 2, 7]), test(4, [4, 9, 1, 8])]
tests.append(test(1, [1]))
tests.append(test(10, [3, 3, 3]))                         # tout se termine au premier passage
tests.append(test(1, [5, 5, 5, 5]))                       # Q = 1 : les tâches alternent
tests.append(test(2, [40, 1, 40]))
tests.append(test(5, [random.randint(1, 100) for _ in range(30)]))
tests.append(test(100, [random.randint(1, 2000) for _ in range(1000)]))
# grands tests : une liste avec pop(0) serait trop lente
tests.append(test(1000, [random.randint(1, 20000) for _ in range(20000)]))
tests.append(test(1000, [random.randint(19000, 20000) for _ in range(20000)]))
tests.append(test(1, [random.randint(1, 20) for _ in range(20000)]))
print(json.dumps(tests))
