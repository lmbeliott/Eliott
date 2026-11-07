import json, random
random.seed(2054)

def test(p):
    return f"{len(p)}\n{' '.join(map(str, p))}\n"

def equilibre(a, b, res):
    if a > b:
        return
    m = (a + b) // 2
    res.append(m)
    equilibre(a, m - 1, res)
    equilibre(m + 1, b, res)

tests = []
tests.append(test([2, 1, 3]))
tests.append(test([3, 4, 5, 1, 2]))
tests.append(test([1]))
tests.append(test([1, 2, 3, 4, 5, 6]))
tests.append(test(list(range(1, 1001))))
tests.append(test(list(range(1000, 0, -1))))
res = []
equilibre(1, 1023, res)
tests.append(test(res))
res = []
equilibre(1, 1000, res)
tests.append(test(res))
for n in [7, 50, 1000, 1000]:
    p = list(range(1, n + 1))
    random.shuffle(p)
    tests.append(test(p))
# zigzag : 1, 1000, 2, 999, ...
z = []
a, b = 1, 1000
while a <= b:
    z.append(a)
    if a != b:
        z.append(b)
    a += 1
    b -= 1
tests.append(test(z))
print(json.dumps(tests))
