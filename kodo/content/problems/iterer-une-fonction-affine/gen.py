import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(" ".join(map(str, q)) + "\n" for q in qs)

def alea(mmax, kmax):
    m = random.randint(2, mmax)
    return (m, random.randrange(m), random.randrange(m), random.randrange(m), random.randint(0, kmax))

tests = [test([(10, 3, 1, 2, 3), (10, 3, 1, 2, 0)]), test([(7, 1, 1, 0, 100), (1000, 2, 0, 1, 10)])]
tests.append(test([(2, 1, 1, 0, 10**18), (2, 0, 0, 1, 1)]))
tests.append(test([(10**9, 10**9 - 1, 10**9 - 1, 10**9 - 1, 10**18)]))
tests.append(test([(10**9, 1, 1, 0, 10**18), (10**9, 0, 5, 3, 10**18)]))
tests.append(test([(97, 0, 0, 5, 1), (97, 1, 0, 5, 10**18), (13, 5, 0, 1, 12)]))
tests.append(test([alea(50, 30) for _ in range(100)]))
tests.append(test([alea(10**9, 10**4) for _ in range(100)]))
# grands tests : appliquer f K fois serait bien trop long
tests.append(test([alea(10**9, 10**18) for _ in range(1000)]))
tests.append(test([(10**9 - random.randint(0, 100), random.randrange(10**8, 10**9 - 100), random.randrange(10**9 - 100), random.randrange(10**9 - 100), 10**18 - random.randint(0, 10**6)) for _ in range(1000)]))
print(json.dumps(tests))
