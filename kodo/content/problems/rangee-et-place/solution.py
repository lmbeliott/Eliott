m, k = map(int, input().split())

# On compte à partir de 0 : la K-ième personne porte le numéro k - 1.
numero = k - 1

# Quotient et reste donnent la rangée et la place (comptées à partir de 0),
# puis on ajoute 1 pour revenir à une numérotation qui commence à 1.
rangee = numero // m + 1
place = numero % m + 1
print(rangee, place)
