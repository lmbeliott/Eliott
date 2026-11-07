import json, random
random.seed(2026)

N_MAX = 100000


def fibonacci(n):
    # Mot de Fibonacci : a, ab, aba, abaab, ... (très riche en répétitions)
    u, v = "a", "ab"
    while len(v) < n:
        u, v = v, v + u
    return v[:n]


def periodique(motif, n, defauts):
    s = list((motif * (n // len(motif) + 1))[:n])
    for _ in range(defauts):
        i = random.randrange(n // 2, n)
        s[i] = random.choice("xyz")
    return "".join(s)


def bloc_repete(n, taille_bloc, mutations):
    # Un bloc aléatoire répété, puis quelques lettres modifiées au hasard
    bloc = "".join(random.choice("ab") for _ in range(taille_bloc))
    s = list((bloc * (n // taille_bloc + 1))[:n])
    for _ in range(mutations):
        s[random.randrange(n)] = random.choice("abc")
    return "".join(s)


tests = ["abababa\n", "aaaa\n"]
# Cas limites : une seule lettre, aucune répétition, égalités
tests.append("z\n")
tests.append("abcdef\n")
tests.append("abaabab\n")
tests.append("aabaabaaabaab\n")
tests.append(bloc_repete(40, 3, 2) + "\n")
tests.append(bloc_repete(2000, 7, 15) + "\n")
# Grands tests : tout identique, périodique avec quelques défauts, mot de Fibonacci
tests.append("a" * N_MAX + "\n")
tests.append(periodique("ab", N_MAX, 3) + "\n")
tests.append(fibonacci(N_MAX - 7) + "\n")
tests.append(bloc_repete(60000, 11, 40) + "\n")
print(json.dumps(tests))
