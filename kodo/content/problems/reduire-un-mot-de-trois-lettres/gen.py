import json, random
random.seed(2026)

def test(mots):
    return f"{len(mots)}\n" + "".join(m + "\n" for m in mots)

def alea(n, alpha="abc"):
    return "".join(random.choice(alpha) for _ in range(n))

tests = [test(["abc", "aabb", "cab", "bbbb"]), test(["ab", "c", "abab", "aabc"])]
tests.append(test(["a", "b", "c", "aa", "ccc"]))
tests.append(test(["ab", "ba", "ac", "bc", "aab", "abb"]))
tests.append(test([alea(random.randint(1, 8)) for _ in range(200)]))
tests.append(test([alea(random.randint(1, 30), random.choice(["ab", "abc", "bc", "c"])) for _ in range(300)]))
# grands tests : explorer les suites d'opérations est hors de portée
tests.append(test([alea(100000)]))
tests.append(test(["a" * 99999 + "b"]))
tests.append(test([alea(15) for _ in range(5000)]))
tests.append(test(["c" * 20000 + "ab" * 5000]))
print(json.dumps(tests))
