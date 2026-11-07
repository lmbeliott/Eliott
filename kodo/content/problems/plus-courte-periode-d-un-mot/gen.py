import json, random
random.seed(2026)

def test(mots):
    assert 1 <= len(mots) <= 10 and all(1 <= len(m) <= 1000 for m in mots)
    return f"{len(mots)}\n" + "".join(m + "\n" for m in mots)

def hasard(n, alphabet):
    return "".join(random.choice(alphabet) for _ in range(n))

def periodique(p, n, alphabet):
    # Un motif de p lettres répété jusqu'à n lettres (la plus courte période peut être plus petite).
    motif = hasard(p, alphabet)
    return "".join(motif[i % p] for i in range(n))

def abime(mot):
    # On change une lettre : la période grandit en général.
    i = random.randrange(len(mot))
    autre = "b" if mot[i] == "a" else "a"
    return mot[:i] + autre + mot[i + 1:]

tests = [
    test(["abcabcab", "aaaa", "abaab", "abcd"]),
    test(["ababa", "aabaa", "z", "abcabd"]),
]
tests += [
    test(["a"]),
    test(["ab", "aa", "ba"]),
    test(["abcabcabc", "abcabcab", "abcabca", "abcabc"]),
    test(["aaaaaaaaab", "baaaaaaaaa", "aabaabaaba", "abaababaab"]),
    test(["a" * 999 + "b"] * 3 + ["b" + "a" * 999] * 3 + ["a" * 1000, "ab" * 499 + "a" + "b"]),
    test([periodique(p, 1000, "ab") for p in [1, 2, 7, 333, 500, 501, 999, 1000, 64, 3]]),
    test([abime(periodique(p, 1000, "ab")) for p in [1, 2, 7, 333, 500, 501, 999, 10, 64, 3]]),
    test([periodique(random.randint(1, 50), random.randint(1, 1000), "abc") for _ in range(10)]),
    test([periodique(random.randint(1, n), n, "ab") for n in [random.randint(1, 1000) for _ in range(10)]]),
    test([hasard(random.randint(1, 1000), "abcdefghijklmnopqrstuvwxyz") for _ in range(10)]),
    test([("a" * k + "b") * (1000 // (k + 1)) + "a" * (1000 % (k + 1)) for k in [1, 2, 3, 30, 100, 400, 498, 499, 600, 999]]),
]
print(json.dumps(tests))
