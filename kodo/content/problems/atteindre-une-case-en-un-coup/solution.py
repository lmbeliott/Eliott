l1, c1 = map(int, input().split())
l2, c2 = map(int, input().split())
l3, c3 = map(int, input().split())

# Le déplacement à faire, et la position de l'obstacle vue depuis la dame.
dl = l2 - l1
dc = c2 - c1
ol = l3 - l1
oc = c3 - c1

# Les lignes et les colonnes de l'obstacle sont-elles entre la dame et la case ?
ligne_entre = (l1 < l3 and l3 < l2) or (l2 < l3 and l3 < l1)
colonne_entre = (c1 < c3 and c3 < c2) or (c2 < c3 and c3 < c1)

if dl == 0:
    # Le long d'une ligne.
    bloque = ol == 0 and colonne_entre
    possible = not bloque
elif dc == 0:
    # Le long d'une colonne.
    bloque = oc == 0 and ligne_entre
    possible = not bloque
elif dl == dc:
    # Diagonale : ligne et colonne changent dans le même sens.
    bloque = ol == oc and ligne_entre
    possible = not bloque
elif dl == -dc:
    # Diagonale : ligne et colonne changent en sens contraires.
    bloque = ol == -oc and ligne_entre
    possible = not bloque
else:
    # La case n'est dans aucune direction de la dame.
    possible = False

if possible:
    print("OUI")
else:
    print("NON")
