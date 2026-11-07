import json, random
random.seed(2026)

def test(a, ms):
    return f"{len(a)} {len(ms)}\n{' '.join(map(str, a))}\n{' '.join(map(str, ms))}\n"

def marche(n, base, amp):
    # températures qui varient doucement
    a = []
    x = base
    for _ in range(n):
        x = min(1000, max(0, x + random.randint(-amp, amp)))
        a.append(x)
    return a

tests = [test([12, 18, 9, 15, 20, 7], [15, 10, 30]), test([5, 5, 5], [5, 6])]
tests.append(test([0], [0, 1]))
tests.append(test([1000] * 10, [1000, 0, 999]))
tests.append(test([random.randint(0, 20) for _ in range(50)], [0, 5, 10, 15, 21]))
tests.append(test([random.randint(0, 1000) for _ in range(30000)], [500, 499, 501, 0, 1000]))
tests.append(test(marche(30000, 500, 10), [490, 500, 510, 520, 530]))
m8 = marche(5000, 200, 3)
tests.append(test(m8, [min(m8) + 1, sum(m8) // 5000, sum(m8) // 5000 + 1, max(m8) - 1, max(m8)]))
tests.append(test([1000 - i // 30 for i in range(30000)], [990, 500, 1, 999, 1000]))
tests.append(test([i // 5 for i in range(5000)], [990, 500, 1, 999, 1000]))
print(json.dumps(tests))
