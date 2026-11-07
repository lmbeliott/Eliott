n, m = map(int, input().split())
somme = 0                     # concerne toute la table
for i in range(1, n + 1):
    for j in range(1, m + 1):
        print(i * j, end=" ")
        somme = somme + i * j
    print()                   # fin de la ligne i
print(somme)
