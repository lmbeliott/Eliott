def puissance(m, e):
    # m multiplié e fois par lui-même
    r = 1
    for _ in range(e):
        r *= m
    return r


def compter(x, autorises):
    # Nombre d'entiers n tels que 1 ≤ n ≤ x, écrits seulement avec les chiffres autorisés.
    if x == 0:
        return 0
    s = str(x)
    longueur = len(s)
    m = len(autorises)
    non_nuls = 0
    for c in autorises:
        if c != "0":
            non_nuls += 1

    total = 0
    # Les nombres qui ont moins de chiffres que x : un premier chiffre non nul,
    # puis n'importe quel chiffre autorisé à chaque autre position.
    for l in range(1, longueur):
        total += non_nuls * puissance(m, l - 1)

    # Les nombres qui ont autant de chiffres que x : ils suivent x jusqu'à une position i,
    # puis y mettent un chiffre autorisé plus petit ; ensuite, tout est permis.
    for i in range(longueur):
        plus_petits = 0
        for c in autorises:
            if c < s[i] and not (i == 0 and c == "0"):
                plus_petits += 1
        total += plus_petits * puissance(m, longueur - 1 - i)
        if s[i] not in autorises:
            return total     # x ne peut plus être suivi au-delà de cette position
    return total + 1         # x lui-même est écrit avec les chiffres autorisés


q = int(input())
for _ in range(q):
    autorises, a, b = input().split()
    print(compter(int(b), autorises) - compter(int(a) - 1, autorises))
