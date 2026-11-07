import json, random
random.seed(2026)

def test(paires):
    return f"{len(paires)}\n" + "".join(f"{a} {b}\n" for a, b in paires)

fib = [1, 1]
while fib[-1] < 10**18:
    fib.append(fib[-1] + fib[-2])
fib = [f for f in fib if f <= 10**18]

tests = [test([(5, 3), (4, 4), (2, 7)]), test([(12, 18), (1, 1)])]
tests.append(test([(10**18, 1), (1, 10**18)]))
tests.append(test([(10**18, 10**18), (10**18, 10**18 - 1)]))
tests.append(test([(fib[-1], fib[-2]), (fib[-2], fib[-1]), (fib[40], fib[39])]))
tests.append(test([(random.randint(1, 30), random.randint(1, 30)) for _ in range(50)]))
tests.append(test([(random.randint(1, 1000), random.randint(1, 1000)) for _ in range(200)]))
# grands tests : simuler carré par carré serait bien trop long
tests.append(test([(random.randint(1, 10**18), random.randint(1, 10**18)) for _ in range(1000)]))
tests.append(test([(random.randint(1, 10**18), random.randint(1, 10**6)) for _ in range(1000)]))
g = [random.randint(1, 10**9) for _ in range(1000)]
tests.append(test([(x * random.randint(1, 10**9), x * random.randint(1, 10**9)) for x in g]))
print(json.dumps(tests))
