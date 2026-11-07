import json, random
random.seed(2026)

L = 600

def mot(n, lettres):
    return "".join(random.choice(lettres) for _ in range(n))

def par_blocs(n, lettres, longueur_max):
    # une suite de blocs de lettres identiques, de longueurs au hasard
    s = ""
    while len(s) < n:
        s += random.choice(lettres) * random.randint(1, longueur_max)
    return s[:n]

def test(u, v):
    return f"{u}\n{v}\n"

tests = [
    test("aba", "ab"),
    test("aab", "cbb"),
    test("a", "a"),
    test("a", "b"),
    test("z" * L, "z" * L),
    test("a" * L, "b" * L),
    test("ab" * (L // 2), "ba" * (L // 2)),
    test(mot(8, "ab"), mot(7, "ab")),
    test(mot(10, "abc"), mot(12, "abc")),
    test(mot(40, "abcdefghijklmnopqrstuvwxyz"), mot(35, "abcdefghijklmnopqrstuvwxyz")),
]
# tailles maximales
tests.append(test(mot(L, "ab"), mot(L, "ab")))
tests.append(test(mot(L, "abc"), mot(L - 1, "abc")))
tests.append(test(mot(L, "abcd"), mot(L, "abcd")))
tests.append(test(par_blocs(L, "abc", 4), par_blocs(L, "abc", 4)))
u = par_blocs(L, "abcde", 6)
tests.append(test(u, u))
tests.append(test(mot(L, "abcdefghijklmnopqrstuvwxyz"), mot(L, "abcdefghijklmnopqrstuvwxyz")))
tests.append(test(mot(1, "ab"), mot(L, "ab")))
print(json.dumps(tests))
