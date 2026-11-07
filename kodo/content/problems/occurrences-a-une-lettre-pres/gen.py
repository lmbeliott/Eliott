import json, random
random.seed(2026)


def fmt(p, t):
    return f"{p}\n{t}\n"


def mot(n, alphabet):
    return "".join(random.choice(alphabet) for _ in range(n))


def modifie(s, k, alphabet):
    # Change k lettres de s, à des positions au hasard
    s = list(s)
    for x in random.sample(range(len(s)), k):
        s[x] = random.choice([c for c in alphabet if c != s[x]])
    return "".join(s)


def texte_avec_copies(n, p, alphabet, nb):
    # Un texte aléatoire où l'on recopie P avec 0, 1 ou 2 erreurs à plusieurs endroits
    t = list(mot(n, alphabet))
    m = len(p)
    for _ in range(nb):
        x = random.randint(0, n - m)
        t[x:x + m] = modifie(p, random.randint(0, min(2, m)), alphabet)
    return "".join(t)


tests = [
    fmt("abca", "abcabbaabcca"),
    fmt("xyz", "aaxyzx"),
]
# Cas limites : une seule lettre (toute fenêtre convient), motif aussi long que le texte, aucune occurrence
tests.append(fmt("q", "abc"))
tests.append(fmt("abcd", "abzd"))
tests.append(fmt("abcd", "zbcz"))
tests.append(fmt("ab", "cdcdcd"))
tests.append(fmt("aa", "aaaaba"))
# Petits cas aléatoires
p = mot(5, "ab")
tests.append(fmt(p, texte_avec_copies(300, p, "ab", 40)))
p = mot(30, "abc")
tests.append(fmt(p, texte_avec_copies(3000, p, "abc", 80)))
# Motif périodique dans un texte périodique avec des défauts
u = mot(7, "ab")
p = modifie(u * 300, 1, "ab")
t = list(u * 2000)
for _ in range(60):
    t[random.randrange(len(t))] = random.choice("ab")
tests.append(fmt(p, "".join(t)))


def presque_que_des_a(n, m, ecart, erreur_p):
    # Que des a, avec des b espacés d'environ « ecart » : une fenêtre contient zéro, un ou deux b,
    # et une comparaison lettre à lettre va presque toujours jusqu'au bout.
    t = ["a"] * n
    x = random.randint(0, ecart)
    while x < n:
        t[x] = "b"
        x += random.randint(ecart * 3 // 4, ecart * 5 // 4)
    p = ["a"] * m
    if erreur_p:
        p[random.randrange(m)] = "b"
    return fmt("".join(p), "".join(t))


# Grands cas contre la comparaison lettre à lettre de chaque fenêtre
tests.append(presque_que_des_a(100000, 50000, 40000, False))
tests.append(presque_que_des_a(80000, 30000, 20000, True))
# Grand cas aléatoire sur deux lettres, avec de nombreuses copies du motif
p = mot(2000, "ab")
tests.append(fmt(p, texte_avec_copies(60000, p, "ab", 150)))
print(json.dumps(tests))
