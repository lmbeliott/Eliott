import sys

donnees = sys.stdin.read().split()
n = int(donnees[0])
m = int(donnees[1])

d = [0] * (n + 2)          # tableau des différences
for k in range(m):
    l = int(donnees[2 + 2 * k])
    r = int(donnees[3 + 2 * k])
    d[l] = d[l] + 1
    d[r + 1] = d[r + 1] - 1

maximum = 0
nb_max = 0
sans = 0
c = 0                      # nombre de couches de la planche i
for i in range(1, n + 1):
    c = c + d[i]
    if c > maximum:
        maximum = c
        nb_max = 1
    elif c == maximum:
        nb_max = nb_max + 1
    if c == 0:
        sans = sans + 1
print(maximum, nb_max, sans)
