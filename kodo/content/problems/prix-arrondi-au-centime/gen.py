import json, random
random.seed(2026)

tests = ["1999 20\n", "1 50\n"]
tests += ["1 0\n", "5 10\n", "1 49\n", "1050 1\n", "1000000000 100\n", "1000000000 0\n",
          "250 2\n", "999999999 99\n", "15 10\n", "3 50\n", "6 75\n", "10 25\n"]
# des demi-centimes exacts : P * (100 + T) se termine par 50
k = 0
while k < 3:
    p, t = random.randint(1, 10**9), random.randint(0, 100)
    if p * (100 + t) % 100 == 50:
        tests.append(f"{p} {t}\n")
        k += 1
for _ in range(1):
    tests.append(f"{random.randint(1, 10**9)} {random.randint(0, 100)}\n")
print(json.dumps(tests))
