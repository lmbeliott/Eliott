import json, random
random.seed(2026)

def suite(n, x, b, c, k):
    a = [x] * n
    for i in range(1, n):
        a[i] = (a[i - 1] * b + c) % k
    return a

def test(n, x, b, c, k, ms):
    return f"{n} {len(ms)}\n{x} {b} {c} {k}\n{' '.join(map(str, ms))}\n"

def autour(n, x, b, c, k):
    # seuils proches de la moyenne : réponses ni nulles ni égales à n
    a = suite(n, x, b, c, k)
    moy = sum(a) // n
    return test(n, x, b, c, k, [moy, moy + max(1, k // 200), moy + max(2, k // 30)])

N = 100000
tests = [test(7, 9, 7, 7, 30, [16, 20, 28]), test(3, 5, 1, 0, 10, [5, 6])]
tests.append(test(1, 0, 0, 0, 1, [0, 1]))
tests.append(test(10, 999999, 1, 0, 10**6, [999999, 0, 10**6]))
tests.append(test(50, 3, 5, 7, 21, [0, 8, 15]))
tests.append(test(N, 12345, 1, 0, 10**6, [12345, 12346, 0]))      # suite constante
tests.append(autour(N, 4321, 1103, 12345, 10**6))
tests.append(autour(N, 7, 31, 11, 1000))                           # suite périodique
tests.append(autour(N, 5, 1, 3, 997))                              # dents de scie
tests.append(autour(N, 999999, 1, 999999, 10**6))                  # décroissante
tests.append(test(N, 0, 1, 1, 10**6, [N // 2, N // 2 + 1, N]))     # croissante : 0, 1, 2...
tests.append(autour(N, 1, 21, 7, 1024))
for _ in range(3):
    k = random.choice([100, 10**4, 10**6])
    tests.append(autour(N, random.randint(0, k - 1), random.randint(0, k - 1), random.randint(0, k - 1), k))
print(json.dumps(tests))
