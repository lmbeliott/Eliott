import json, random
random.seed(2026)

G = 10**9
tests = ["1 3 2 5\n", "2 4 3 6\n"]
tests += ["0 1 0 7\n", "-1 2 1 2\n", "-3 4 -2 3\n",
          f"{G - 1} {G} {G - 2} {G - 1}\n", f"{G - 2} {G - 1} {G - 1} {G}\n",
          f"{G} 1 {G} 1\n", f"{-G} 1 {G} 1\n", f"1 {G} 1 {G - 1}\n", f"{-G} {G} -1 1\n",
          f"{G} {G - 1} {G - 1} {G - 2}\n"]
for _ in range(2):
    a, c = random.randint(-G, G), random.randint(-G, G)
    b, d = random.randint(1, G), random.randint(1, G)
    tests.append(f"{a} {b} {c} {d}\n")
# deux fractions égales écrites différemment
k1, k2 = 37, 41
tests.append(f"{-12345 * k1} {6789 * k1} {-12345 * k2} {6789 * k2}\n")
print(json.dumps(tests))
