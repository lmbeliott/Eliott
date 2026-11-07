N = int(input())
nombre = 0
plus_grand = 0
for n in range(2, N + 1):
    premier = True             # remis à vrai pour chaque candidat
    d = 2
    while d * d <= n and premier:
        if n % d == 0:
            premier = False    # un diviseur trouvé : n n'est pas premier
        d = d + 1
    if premier:
        nombre = nombre + 1
        plus_grand = n
print(nombre, plus_grand)
