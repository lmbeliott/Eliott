def suivant(n):
    s = 0
    while n > 0:
        c = n % 10
        s = s + c * c
        n = n // 10
    return s


def etapes(n):
    # Après une étape, toutes les valeurs sont < 1500.
    vu = [False] * 1500        # liste locale : recréée à chaque appel
    k = 0
    while n != 1:
        if n < 1500:
            if vu[n]:
                return -1       # valeur déjà vue : la suite tourne en rond
            vu[n] = True
        n = suivant(n)
        k = k + 1
    return k


q = int(input())
for i in range(q):
    print(etapes(int(input())))
