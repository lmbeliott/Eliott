n, k = map(int, input().split())
present = [True] * n          # present[i] : la personne i + 1 est encore dans le cercle
pos = 0                       # indice de la personne comptée « 1 »
restants = n
ordre = []
for sortie in range(n):
    s = (k - 1) % restants    # les tours complets ne changent rien
    while s > 0:              # avancer de s personnes présentes
        pos = (pos + 1) % n
        if present[pos]:
            s = s - 1
    present[pos] = False
    ordre.append(pos + 1)
    restants = restants - 1
    if restants > 0:          # la prochaine personne présente sera comptée « 1 »
        while not present[pos]:
            pos = (pos + 1) % n
print(*ordre)
