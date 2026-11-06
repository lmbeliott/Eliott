import sys

def nb_plus_rapides(temps, t):
    # temps est trié : renvoie le nombre de temps strictement inférieurs à t,
    # c'est-à-dire le premier indice i tel que temps[i] >= t
    gauche, droite = 0, len(temps)
    while gauche < droite:
        milieu = (gauche + droite) // 2
        if temps[milieu] < t:
            gauche = milieu + 1
        else:
            droite = milieu
    return gauche

def main():
    donnees = sys.stdin.read().split()
    n, q = int(donnees[0]), int(donnees[1])
    temps = sorted(map(int, donnees[2:2 + n]))
    reponses = []
    for t in map(int, donnees[2 + n:2 + n + q]):
        avant = nb_plus_rapides(temps, t)
        # les temps sont entiers : « <= t » revient à « < t + 1 »
        ex_aequo = nb_plus_rapides(temps, t + 1) - avant
        reponses.append(f"{avant + 1} {ex_aequo}")
    print("\n".join(reponses))

main()
