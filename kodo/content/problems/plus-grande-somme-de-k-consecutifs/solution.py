n, k = map(int, input().split())
t = list(map(int, input().split()))
somme = 0
for i in range(k):                # somme du premier groupe
    somme = somme + t[i]
meilleure = somme
debut = 0                         # indice où commence le meilleur groupe
for i in range(n - k):
    somme = somme - t[i] + t[i + k]   # t[i] sort, t[i + k] entre
    if somme > meilleure:
        meilleure = somme
        debut = i + 1
print(meilleure, debut + 1)       # position = indice + 1
