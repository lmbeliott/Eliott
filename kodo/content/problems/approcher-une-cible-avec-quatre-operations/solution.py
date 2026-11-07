import sys

donnees = sys.stdin.read().split()
n, cible = int(donnees[0]), int(donnees[1])
nombres = [int(x) for x in donnees[2:2 + n]]

meilleur = min(abs(x - cible) for x in nombres)
deja_vus = set()                      # multiensembles déjà explorés

def explorer(liste):
    global meilleur
    cle = tuple(sorted(liste))
    if meilleur == 0 or cle in deja_vus:
        return
    deja_vus.add(cle)
    k = len(liste)
    for i in range(k):
        for j in range(i + 1, k):
            a, b = max(liste[i], liste[j]), min(liste[i], liste[j])
            reste = [liste[t] for t in range(k) if t != i and t != j]
            resultats = [a + b, a * b]
            if a > b:
                resultats.append(a - b)
            if a % b == 0:
                resultats.append(a // b)
            for v in resultats:
                meilleur = min(meilleur, abs(v - cible))
                explorer(reste + [v])

explorer(nombres)
print(meilleur)
