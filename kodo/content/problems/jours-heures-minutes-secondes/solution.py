s = int(input())
# On retire d'abord les jours, puis les heures, puis les minutes.
jours = s // 86400
reste = s % 86400
heures = reste // 3600
reste = reste % 3600
minutes = reste // 60
secondes = reste % 60
print(jours, heures, minutes, secondes)
