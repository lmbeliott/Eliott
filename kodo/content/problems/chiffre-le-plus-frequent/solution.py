n = int(input())
if n == 0:
    print(0, 1)                  # 0 s'écrit avec un seul chiffre 0
else:
    meilleur = 0
    meilleur_compte = 0
    for c in range(10):          # un passage pour chaque chiffre c
        m = n                    # copie : la boucle interne la détruit
        compte = 0
        while m > 0:
            if m % 10 == c:
                compte = compte + 1
            m = m // 10
        if compte > meilleur_compte:
            meilleur = c
            meilleur_compte = compte
    print(meilleur, meilleur_compte)
