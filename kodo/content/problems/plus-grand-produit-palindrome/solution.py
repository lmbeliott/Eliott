a, b = map(int, input().split())
meilleur = 0        # le plus grand palindrome trouvé (0 : aucun)
nombre = 0          # nombre de couples qui le donnent
for x in range(a, b + 1):
    for y in range(x, b + 1):
        p = x * y
        if p >= meilleur:
            # p est-il un palindrome ? On construit son retourné r.
            m = p
            r = 0
            while m > 0:
                r = r * 10 + m % 10
                m = m // 10
            if r == p:
                if p > meilleur:
                    meilleur = p
                    nombre = 1      # le couple (x, y) compte déjà
                else:
                    nombre = nombre + 1
if meilleur == 0:
    print("AUCUN")
else:
    print(meilleur, nombre)
