piste = input()
q = int(input())

for _ in range(q):
    mot = input()
    # j = nombre de lettres du mot déjà trouvées, dans l'ordre.
    j = 0
    for balise in piste:
        # Dès qu'une balise porte la lettre attendue, on la prend.
        if j < len(mot) and balise == mot[j]:
            j += 1
    if j == len(mot):
        print("oui")
    else:
        print("non")
