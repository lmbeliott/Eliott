mot = input().strip()
n = len(mot)

# solde = (voyelles - consonnes) parmi les premières lettres déjà lues.
# Le morceau entre deux moments où le solde est le même est équilibré.
# Le solde est entre -n et n : on le décale de n pour s'en servir comme indice.
premier = [-1] * (2 * n + 1)   # premier moment où l'on a vu chaque solde
compte = [0] * (2 * n + 1)     # nombre de fois où l'on a vu chaque solde

solde = 0
premier[n] = 0
compte[n] = 1
plus_long = 0
total = 0
for i in range(n):
    if mot[i] in "aeiouy":
        solde = solde + 1
    else:
        solde = solde - 1
    k = solde + n
    if premier[k] == -1:
        premier[k] = i + 1
    else:
        plus_long = max(plus_long, i + 1 - premier[k])
    # Chaque moment passé avec le même solde donne un morceau équilibré qui finit ici.
    total = total + compte[k]
    compte[k] = compte[k] + 1

print(plus_long)
print(total)
