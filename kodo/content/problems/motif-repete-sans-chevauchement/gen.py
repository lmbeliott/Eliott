import json, random
random.seed(2026)

N_MAX = 50000


def mot(n, alphabet):
    return "".join(random.choice(alphabet) for _ in range(n))


def thue_morse(ordre):
    t = "a"
    for _ in range(ordre):
        t = t + t.translate(str.maketrans("ab", "ba"))
    return t


def fmt(k, s):
    return f"{k}\n{s}\n"


tests = [fmt(2, "abcabxabcab"), fmt(2, "aaaaa")]
# Petits cas : un seul choix, chevauchements, K grand
tests.append(fmt(1, "zyx"))
tests.append(fmt(3, "abababab"))
tests.append(fmt(3, "bananabanana"))
tests.append(fmt(4, "abcdabcabdcadbcaabcd"))
tests.append(fmt(2, mot(300, "ab")))
tests.append(fmt(5, mot(3000, "abc")))

# Anti-hachage « modulo 2^64 » : deux blocs de Thue-Morse différents ont le même hachage
# pour toute base quand on calcule avec débordement. Chaque copie du motif contient l'un des deux.
t = thue_morse(11)
t_bar = t.translate(str.maketrans("ab", "ba"))
p, q = mot(1500, "ab"), mot(1500, "ab")
morceaux = []
for j in range(6):
    morceaux.append(p + (t if j % 3 == 0 else t_bar) + q)
    morceaux.append(mot(random.randint(500, 900), "cd"))
tests.append(fmt(6, "".join(morceaux)[:N_MAX]))

# Beaucoup de fenêtres distinctes et K = 2 : un module de l'ordre de 10^9 fait des collisions.
tests.append(fmt(2, mot(N_MAX, "abcdefghijklmnopqrstuvwxyz")))

# Réponse très longue : un bloc répété avec un peu de bruit (le naïf compare des sous-chaînes énormes).
bloc = mot(12000, "abc")
s = list((bloc + mot(500, "z")) * 4)
for _ in range(6):
    s[random.randrange(len(s))] = "y"
tests.append(fmt(4, "".join(s)[:N_MAX]))
bloc = mot(24000, "ab")
s = list(bloc + mot(1000, "c") + bloc)
s[random.randrange(30000, 49000)] = "d"
tests.append(fmt(2, "".join(s)[:N_MAX]))

# Tout identique : les occurrences se chevauchent énormément.
tests.append(fmt(7, "a" * N_MAX))
# Périodique de petite période, K grand.
tests.append(fmt(1000, ("abaab" * 10000)[:N_MAX - 3] + "bbb"))
print(json.dumps(tests))
