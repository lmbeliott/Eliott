n = int(input())
s = 0
position = 0
for morceau in input().split():
    chiffre = int(morceau)
    position = position + 1
    s = s + position * chiffre
print(s)
# Ce qu'il faut ajouter pour atteindre un multiple de 10 (0 si c'en est déjà un).
print((10 - s % 10) % 10)
