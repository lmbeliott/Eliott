import json, random
random.seed(2026)


def mot(l, lettres="abcdefghijklmnopqrstuvwxyz"):
    return "".join(random.choice(lettres) for _ in range(l))


def test(a, b):
    assert len(a) == len(b)
    return f"{a}\n{b}\n"


tests = [test("bonjour", "jourbon"), test("abab", "baba")]
tests.append(test("a", "a"))
tests.append(test("ab", "ab"))
tests.append(test("abc", "acb"))                      # pas une rotation
tests.append(test("abcabcabc", "cabcabcab"))           # mot périodique : le plus petit K
tests.append(test("a" * 2000, "a" * 2000))
a = "a" * 1999 + "b"
tests.append(test(a, a[1998:] + a[:1998]))              # K = 1998
tests.append(test(a, "a" * 1998 + "ba"))               # K = 1
tests.append(test("a" * 1999 + "b", "a" * 1998 + "bb"))  # même lettres ? non : -1
x = mot(2000, "ab")
tests.append(test(x, x[1234:] + x[:1234]))
y = mot(2000)
tests.append(test(y, y[777:] + y[:777]))
z = mot(1500, "ab")
tests.append(test(z, z[::-1]))
print(json.dumps(tests))
