import sys

def main():
    donnees = sys.stdin.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    s = donnees[2]

    # ecart[c] = (nombre de lettres c) - (nombre de lettres a) dans le préfixe en cours.
    # Deux préfixes de même écart délimitent une sous-chaîne équilibrée.
    ecart = [0] * k
    vus = {tuple(ecart): 1}      # le préfixe vide
    total = 0
    for lettre in s:
        c = ord(lettre) - ord('a')
        if c == 0:
            # un a de plus : tous les écarts diminuent de 1
            for i in range(1, k):
                ecart[i] -= 1
        else:
            ecart[c] += 1
        cle = tuple(ecart)
        deja = vus.get(cle, 0)
        total += deja            # chaque préfixe précédent de même écart donne une sous-chaîne
        vus[cle] = deja + 1
    print(total)

main()
