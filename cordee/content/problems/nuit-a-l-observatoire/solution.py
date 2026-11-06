h, m, d = map(int, input().split())

# On compte tout en minutes depuis minuit.
debut = h * 60 + m
fin = debut + d

# On revient aux heures et aux minutes ; l'horloge repart de 0 après 23 h.
heures = (fin // 60) % 24
minutes = fin % 60
print(heures, minutes)
