import sys

def assez_de_pieces(minutes, durees, m):
    # en `minutes` minutes, la machine de durée d fabrique minutes // d pièces
    total = 0
    for d in durees:
        total += minutes // d
        if total >= m:
            return True
    return False

def main():
    donnees = sys.stdin.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    durees = list(map(int, donnees[2:2 + n]))

    # en 0 minute on n'a rien ; avec min(durees) * m minutes, la machine
    # la plus rapide fabrique à elle seule les m pièces
    trop_court = 0
    suffisant = min(durees) * m
    while suffisant - trop_court > 1:
        milieu = (trop_court + suffisant) // 2
        if assez_de_pieces(milieu, durees, m):
            suffisant = milieu
        else:
            trop_court = milieu
    print(suffisant)

main()
