import json, random
random.seed(2026)

def mot(n, alphabet):
    return "".join(random.choice(alphabet) for _ in range(n))


def fmt(s, requetes):
    lignes = [s, str(len(requetes))] + [f"{l} {r}" for l, r in requetes]
    return "\n".join(lignes) + "\n"


def requetes_aleatoires(n, q):
    res = []
    for _ in range(q):
        l = random.randint(1, n)
        r = random.randint(l, n)
        res.append((l, r))
    return res


def blocs_periodiques(n, unites, defauts):
    # Concaténation de morceaux u^k, avec quelques lettres modifiées
    s = []
    while len(s) < n:
        u = random.choice(unites)
        s.extend(u * random.randint(5, 400))
    s = s[:n]
    for _ in range(defauts):
        s[random.randrange(n)] = "z"
    return "".join(s)


def requetes_alignees(s, q, unites_long):
    # Requêtes dont la longueur est un multiple d'une longueur d'unité : souvent une vraie puissance
    n = len(s)
    res = []
    for _ in range(q):
        u = random.choice(unites_long)
        k = random.randint(1, max(1, min(n // u, 3000)))
        lg = u * k
        l = random.randint(1, n - lg + 1)
        res.append((l, l + lg - 1))
    return res


tests = [
    fmt("abaabaabaab", [(1, 9), (1, 11), (2, 7), (5, 6), (3, 4)]),
    fmt("aaaaaa", [(1, 6), (2, 5), (3, 3)]),
]
# Petits cas
tests.append(fmt("z", [(1, 1)]))
tests.append(fmt("abab", [(1, 4), (1, 3), (2, 3), (4, 4), (1, 2)]))
s = mot(40, "ab")
tests.append(fmt(s, requetes_aleatoires(40, 60)))
s = blocs_periodiques(3000, ["ab", "aab", "abcabd", "a"], 5)
tests.append(fmt(s, requetes_alignees(s, 400, [1, 2, 3, 6, 12]) + requetes_aleatoires(3000, 100)))

# Anti-hachage « modulo 2^64 » : sur les blocs alignés du mot de Thue-Morse, la moitié gauche
# et la moitié droite ont le même hachage par débordement, quelle que soit la base.
t = "a"
for _ in range(14):
    t = t + t.translate(str.maketrans("ab", "ba"))
req = []
for k in range(1, 15):
    lg = 1 << k
    for _ in range(6):
        x = random.randrange(0, len(t) // lg) * lg
        req.append((x + 1, x + lg))
req += requetes_aleatoires(len(t), 300)
tests.append(fmt(t, req))

def que_des_a(n, q, longueurs):
    # Que des a, sauf quelques lettres b vers la fin. Les requêtes finissent sur un b et ont
    # une longueur très divisible : aucune période, mais chaque comparaison lettre à lettre
    # va presque jusqu'au bout.
    s = ["a"] * n
    defauts = sorted(random.sample(range(n - 1000, n), 20))
    for x in defauts:
        s[x] = "b"
    req = []
    for _ in range(q * 7 // 8):
        lg = random.choice(longueurs)
        x = random.choice(defauts)
        req.append((x + 2 - lg, x + 1))
    for _ in range(q - len(req)):
        lg = random.choice(longueurs)
        l = random.randint(1, n - 1000 - lg)
        req.append((l, l + lg - 1))
    random.shuffle(req)
    return fmt("".join(s), req)


# Grands tests contre les solutions qui essaient chaque diviseur ou recalculent une fonction préfixe
tests.append(que_des_a(100000, 6000, [83160, 98280, 55440, 50400, 45360, 65520, 75600, 30240, 27720]))
tests.append(que_des_a(60000, 8000, [55440, 50400, 45360, 40320, 30240, 27720, 25200, 20160]))

# Un motif répété avec quelques défauts, requêtes alignées ou non.
u = mot(12, "abc")
n = 12000
s = list(u * (n // 12))
for _ in range(3):
    s[random.randrange(n // 2, n)] = "z"
s = "".join(s)
req = requetes_alignees(s, 1200, [12, 24, 60, 120, 720, 5040]) + requetes_aleatoires(n, 300)
random.shuffle(req)
tests.append(fmt(s, req))
print(json.dumps(tests))
