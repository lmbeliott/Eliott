n = int(input())
creneaux = []
for _ in range(n):
    d, f = map(int, input().split())
    creneaux.append((d, f))

# Trié par heure de début : un créneau ne peut prolonger que la période en cours.
creneaux.sort()

nb_periodes = 0
plus_longue = 0
debut, fin = creneaux[0]
for d, f in creneaux[1:]:
    if d <= fin:
        # Le créneau commence avant la fin de la période (ou pile à la fin) :
        # il la prolonge peut-être, mais il peut aussi être entièrement dedans.
        fin = max(fin, f)
    else:
        # Un trou : la période en cours est terminée.
        nb_periodes += 1
        plus_longue = max(plus_longue, fin - debut)
        debut, fin = d, f

# La dernière période n'est suivie d'aucun trou.
nb_periodes += 1
plus_longue = max(plus_longue, fin - debut)

print(nb_periodes, plus_longue)
