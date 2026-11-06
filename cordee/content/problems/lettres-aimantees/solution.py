boite = input()
mot = input()

# compte[k] = nombre de fois où la k-ième lettre de l'alphabet apparaît.
dans_boite = [0] * 26
for c in boite:
    dans_boite[ord(c) - ord("a")] += 1
dans_mot = [0] * 26
for c in mot:
    dans_mot[ord(c) - ord("a")] += 1

# Chaque lettre du mot limite le nombre de panneaux possibles.
panneaux = len(boite)
for k in range(26):
    if dans_mot[k] > 0:
        panneaux = min(panneaux, dans_boite[k] // dans_mot[k])

print(panneaux)
