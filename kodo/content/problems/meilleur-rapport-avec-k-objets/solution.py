import sys

def main():
    donnees = sys.stdin.buffer.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    valeurs = [int(x) for x in donnees[2:2 + 2 * n:2]]
    poids = [int(x) for x in donnees[3:3 + 2 * n:2]]

    def possible(q):
        # existe-t-il K objets avec 1000 * (somme des valeurs) >= q * (somme des poids) ?
        # on garde les K objets qui ont le plus grand 1000 * V - q * P
        gains = sorted((1000 * v - q * p for v, p in zip(valeurs, poids)), reverse=True)
        return sum(gains[:k]) >= 0

    possible_ok = 0                      # q = 0 marche toujours
    impossible = 1000 * max(valeurs) + 1 # le rapport ne dépasse jamais max(V) / 1
    while impossible - possible_ok > 1:
        milieu = (possible_ok + impossible) // 2
        if possible(milieu):
            possible_ok = milieu
        else:
            impossible = milieu
    print(possible_ok)

main()
