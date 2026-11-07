import json, random
random.seed(2026)

def hasard(n, lettres):
    return "".join(random.choice(lettres) for _ in range(n))

tests = ["abababa\n", "aaaaaaaaaa\n", "banane\n"]
tests += ["z\n", "ab\n", "abcdefghijklmnopqrstuvwxyz\n", "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz\n",
          "tobeornottobeortobeornot\n"]
tests.append(hasard(1000, "ab") + "\n")
tests.append(hasard(50000, "ab") + "\n")
tests.append(hasard(50000, "abcdefghijklmnopqrstuvwxyz") + "\n")
tests.append("a" * 50000 + "\n")
tests.append(("abcab" * 10000) + "\n")
tests.append(hasard(30000, "aaaaaaab") + "\n")
print(json.dumps(tests))
