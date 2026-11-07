def meilleur(m):
    # plus petit mot qu'on peut obtenir à partir de m
    if len(m) == 1:
        return m
    k = len(m) // 2
    g = meilleur(m[:k])
    d = meilleur(m[k:])
    return min(g + d, d + g)

print(meilleur(input().strip()))
