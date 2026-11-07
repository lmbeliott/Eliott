n = int(input())

# La première mesure forme à elle seule une montée de longueur 1.
precedente = int(input())
en_cours = 1
meilleure = 1

for i in range(n - 1):
    mesure = int(input())
    if mesure > precedente:
        en_cours = en_cours + 1   # la montée continue
    else:
        en_cours = 1              # une nouvelle montée commence
    if en_cours > meilleure:
        meilleure = en_cours
    precedente = mesure

print(meilleure)
