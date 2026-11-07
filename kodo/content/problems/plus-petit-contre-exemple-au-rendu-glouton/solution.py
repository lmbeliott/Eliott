k = int(input())
pieces = list(map(int, input().split()))

if k <= 2:
    print(0)
else:
    limite = pieces[-2] + pieces[-1]    # les montants à examiner sont < limite
    glouton = [0] * limite
    opt = [0] * limite
    j = 0                               # indice de la plus grande pièce <= s
    reponse = 0
    for s in range(1, limite):
        while j + 1 < k and pieces[j + 1] <= s:
            j += 1
        glouton[s] = 1 + glouton[s - pieces[j]]
        meilleur = s
        for c in pieces:
            if c > s:
                break
            meilleur = min(meilleur, opt[s - c])
        opt[s] = 1 + meilleur
        if glouton[s] > opt[s]:
            reponse = s
            break
    print(reponse)
