p = input()
q = int(input())

for _ in range(q):
    mot = input()
    # j = nombre de lettres du mot déjà trouvées, dans l'ordre.
    j = 0
    for c in p:
        # Dès que la lettre attendue apparaît, on la prend.
        if j < len(mot) and c == mot[j]:
            j += 1
    if j == len(mot):
        print("OUI")
    else:
        print("NON")
