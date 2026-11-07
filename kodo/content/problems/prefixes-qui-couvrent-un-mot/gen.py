import json, random
random.seed(2026)


def mot(n, alphabet):
    return "".join(random.choice(alphabet) for _ in range(n))


def superpositions(w, longueur):
    # Colle des copies de w, en les faisant chevaucher quand c'est possible
    s = w
    while len(s) < longueur:
        recouvrements = [o for o in range(1, len(w)) if s.endswith(w[:o])]
        o = random.choice(recouvrements + [0, 0])
        s += w[o:]
    return s


def avec_defauts(s, k, alphabet):
    s = list(s)
    for _ in range(k):
        s[random.randrange(len(s))] = random.choice(alphabet)
    return "".join(s)


tests = [
    "abaababaaba\n",
    "aabaabaa\n",
]
# Cas limites : une lettre, deux lettres différentes, une seule lettre répétée
tests.append("z\n")
tests.append("ab\n")
tests.append("aaaaaaa\n")
tests.append("abcabcabc\n")
# Petits cas : superpositions d'un mot court, avec ou sans défauts
tests.append(superpositions("aba", 40) + "\n")
tests.append(avec_defauts(superpositions("abaab", 60), 1, "ab") + "\n")
tests.append(mot(50, "ab") + "\n")
tests.append(superpositions("abacaba", 3000) + "\n")

# Grands cas : beaucoup de bords, donc beaucoup de longueurs à tester.
# Vérifier chaque longueur en parcourant ses occurrences coûte O(N) par longueur.
tests.append("a" * 100000 + "\n")
tests.append(("abaab" * 14000) + "\n")
# Beaucoup de bords (a, aa, aaa…) mais aucun ne couvre le b du milieu
tests.append("a" * 40000 + "b" + "a" * 40000 + "\n")
fib = ["b", "a"]
while len(fib[-1]) < 70000:
    fib.append(fib[-1] + fib[-2])
tests.append(fib[-1] + "\n")
tests.append(superpositions("aabaabaaab", 20000) + "\n")
print(json.dumps(tests))
