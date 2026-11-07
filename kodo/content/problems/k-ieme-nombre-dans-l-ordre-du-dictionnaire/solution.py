def compter(p, n):
    # nombre d'entiers de 1 à n dont l'écriture commence par celle de p
    total = 0
    debut = p
    fin = p
    while debut <= n:
        total = total + min(n, fin) - debut + 1
        debut = debut * 10
        fin = fin * 10 + 9
    return total

q = int(input())
for _ in range(q):
    n, k = map(int, input().split())
    p = 1
    k = k - 1                  # le nombre 1 est le premier de la liste
    while k > 0:
        taille = compter(p, n)
        if taille <= k:
            k = k - taille     # on saute tout le bloc de p
            p = p + 1
        else:
            k = k - 1          # on descend vers 10p, qui suit p
            p = p * 10
    print(p)
