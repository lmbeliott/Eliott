n = int(input())
piles = list(map(int, input().split()))

# À la fin, chaque pile contient la moyenne.
total = 0
for x in piles:
    total = total + x
moyenne = total // n

# Pour chaque frontière entre la pile i et la pile i + 1 : les i + 1 premières
# piles contiennent « deja » pièces et doivent finir avec (i + 1) * moyenne.
# La différence doit traverser la frontière, une pièce par déplacement.
deplacements = 0
deja = 0
for i in range(n - 1):
    deja = deja + piles[i]
    ecart = deja - (i + 1) * moyenne
    if ecart < 0:
        ecart = -ecart
    deplacements = deplacements + ecart

print(deplacements)
