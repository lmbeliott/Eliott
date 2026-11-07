import json, random
random.seed(2026)

N_MAX = 100000


def mot(n, alphabet):
    return "".join(random.choice(alphabet) for _ in range(n))


def zimin(n):
    # a, aba, abacaba, abacabadabacaba... : des palindromes emboîtés partout
    z = "a"
    lettre = "b"
    while len(z) < n:
        z = z + lettre + z
        lettre = chr(ord(lettre) + 1)
    return z[:n]


def avec_palindromes(n, longueurs):
    # Texte aléatoire dans lequel on recopie quelques grands palindromes
    s = list(mot(n, "abcd"))
    for lg in longueurs:
        moitie = mot(lg // 2, "abcd")
        pal = moitie + mot(lg % 2, "abcd") + moitie[::-1]
        x = random.randrange(0, n - lg)
        s[x:x + lg] = pal
    return "".join(s)


tests = ["abacabaxyzzy\n", "aaaa\n"]
# Cas limites
tests.append("ab\n")
tests.append("abcdef\n")
tests.append("racecar\n")
tests.append("abbaabba\n")
tests.append(mot(30, "ab") + "\n")
tests.append(avec_palindromes(3000, [400, 251, 97]) + "\n")
# Grands tests : tout identique, périodiques, mot de Zimin, palindromes cachés
tests.append("a" * N_MAX + "\n")
tests.append(("ab" * N_MAX)[:N_MAX - 10001] + "\n")
tests.append(zimin(N_MAX) + "\n")
tests.append(avec_palindromes(N_MAX, [30001, 29999, 5000]) + "\n")
print(json.dumps(tests))
