n = int(input())
t = list(map(int, input().split()))
resultat = []                  # nouveau tableau : t n'est pas modifié
for i in range(n):
    s = t[i]
    if i > 0:
        s = s + t[i - 1]       # voisin de gauche
    if i < n - 1:
        s = s + t[i + 1]       # voisin de droite
    resultat.append(s)
print(*resultat)
