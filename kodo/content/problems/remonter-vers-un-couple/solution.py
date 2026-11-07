def coups(a, b, c, d):
    """Nombre de coups pour aller de (a, b) à (c, d), ou -1."""
    total = 0
    while True:
        if c == a and d == b:
            return total
        if c < a or d < b or c == d:
            return -1
        if c > d:
            if d == b:
                # le second nombre reste b : on passe par (a, b) seulement si c - a est un multiple de d
                if (c - a) % d == 0:
                    return total + (c - a) // d
                return -1
            q = (c - 1) // d      # reculer d'un coup tant que c > d
            total += q
            c -= q * d
        else:
            if c == a:
                if (d - b) % c == 0:
                    return total + (d - b) // c
                return -1
            q = (d - 1) // c
            total += q
            d -= q * c


t = int(input())
for _ in range(t):
    a, b, c, d = map(int, input().split())
    print(coups(a, b, c, d))
