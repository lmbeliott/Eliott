import json, random
random.seed(2026)

L = 10**18
fib = [1, 2]
while fib[-1] + fib[-2] <= L:
    fib.append(fib[-1] + fib[-2])

def test(ns):
    return f"{len(ns)}\n" + "".join(f"{n}\n" for n in ns)

tests = [test([10, 1, 4, 12, 100, 1000])]
tests.append(test(list(range(1, 101))))
tests.append(test([L, L - 1, fib[-1], fib[-1] - 1, fib[-1] + 1, fib[-2] + fib[-4] + fib[-6]]))
# nombres qui demandent beaucoup de termes : F_m - 1 = F_{m-1} + F_{m-3} + ...
tests.append(test([f - 1 for f in fib[2:]] + [f + 1 for f in fib[2:]]))
tests.append(test([random.randint(1, L) for _ in range(1000)]))
tests.append(test([random.randint(1, 10**6) for _ in range(1000)]))
tests.append(test([sum(random.sample(fib, 30)) % L + 1 for _ in range(1000)]))
print(json.dumps(tests))
