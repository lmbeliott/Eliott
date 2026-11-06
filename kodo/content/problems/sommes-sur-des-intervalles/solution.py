import sys

def main():
    donnees = sys.stdin.read().split()
    n, q = int(donnees[0]), int(donnees[1])
    chiffres = donnees[2]

    # cumul[i] = somme des i premières valeurs
    cumul = [0] * (n + 1)
    for i in range(n):
        cumul[i + 1] = cumul[i] + int(chiffres[i])

    reponses = []
    pos = 3
    for _ in range(q):
        a, b = int(donnees[pos]), int(donnees[pos + 1])
        pos += 2
        # jours A à B = (B premiers jours) - (A - 1 premiers jours)
        reponses.append(cumul[b] - cumul[a - 1])
    print("\n".join(map(str, reponses)))

main()
