import sys

def main():
    donnees = sys.stdin.read().split()
    n = int(donnees[0])
    creneaux = []
    for i in range(n):
        debut = int(donnees[1 + 2 * i])
        duree = int(donnees[2 + 2 * i])
        creneaux.append((debut + duree, debut))   # (fin, début)

    # on examine les créneaux par heure de fin croissante
    creneaux.sort()
    acceptes = 0
    salle_libre_a = 0     # moment où la salle se libère
    for fin, debut in creneaux:
        if debut >= salle_libre_a:
            acceptes += 1
            salle_libre_a = fin
    print(acceptes)

main()
