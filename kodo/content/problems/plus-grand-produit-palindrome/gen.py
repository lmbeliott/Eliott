import json, random
random.seed(2026)

tests = ["10 99\n", "1 9\n", "10 10\n"]
tests += ["1 1\n", "9700 10000\n", "9999 9999\n", "100 400\n", "11 11\n", "1000 1300\n",
          "4000 4300\n", "8000 8300\n", "12 13\n",
          "281 581\n", "9326 9346\n", "1034 1054\n"]
for _ in range(3):
    a = random.randint(1, 9700)
    tests.append(f"{a} {a + 300}\n")
print(json.dumps(tests))
