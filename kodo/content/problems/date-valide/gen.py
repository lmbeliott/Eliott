import json, random
random.seed(2026)

tests = ["14 7 2021\n", "31 4 2023\n", "29 2 2024\n", "29 2 1900\n"]
tests += ["29 2 2000\n", "28 2 2023\n", "29 2 2023\n", "0 5 2020\n", "10 0 2020\n", "1 13 2020\n",
          "31 12 9999\n", "1 1 1\n", "32 1 2020\n", "30 6 1500\n", "31 8 1600\n", "40 15 4\n"]
for _ in range(4):
    tests.append(f"{random.randint(0, 40)} {random.randint(0, 15)} {random.randint(1, 9999)}\n")
print(json.dumps(tests))
