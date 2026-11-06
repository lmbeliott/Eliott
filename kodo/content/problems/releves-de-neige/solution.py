import sys

def main():
    donnees = sys.stdin.read().split()
    n, q = int(donnees[0]), int(donnees[1])
    releves = donnees[2]

    # cumul[i] = neige tombée pendant les i premières nuits
    cumul = [0] * (n + 1)
    for i in range(n):
        cumul[i + 1] = cumul[i] + int(releves[i])

    reponses = []
    pos = 3
    for _ in range(q):
        a, b = int(donnees[pos]), int(donnees[pos + 1])
        pos += 2
        # nuits A à B = (B premières nuits) - (A - 1 premières nuits)
        reponses.append(cumul[b] - cumul[a - 1])
    print("\n".join(map(str, reponses)))

main()
