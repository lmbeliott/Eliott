import json, random
random.seed(2026)

def test(prod):
    return f"{len(prod)}\n" + " ".join(map(str, prod)) + "\n"

tests = [test([40, 55, 38, 61, 46]), test([7, 8, 8])]
tests.append(test([120]))
tests.append(test([0]))
tests.append(test([30, 30, 30, 30]))
tests.append(test([0, 0, 0, 500]))           # un seul très bon jour
tests.append(test([500, 500, 500, 0]))       # moyenne 375
tests.append(test([10, 20, 30]))             # un jour exactement égal à la moyenne
tests.append(test([1, 2]))                   # moyenne 1,5
tests.append(test([random.randint(0, 500) for _ in range(1000)]))
tests.append(test([500] * 999 + [499]))
tests.append(test([random.randint(40, 60) for _ in range(1000)]))
for _ in range(2):
    n = random.randint(5, 31)
    tests.append(test([random.randint(20, 80) for _ in range(n)]))
print(json.dumps(tests))
