import sys
import heapq

def main():
    donnees = sys.stdin.buffer.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    tas = [int(x) for x in donnees[2:2 + n]]

    # chaque fusion de K tas en enlève K - 1 : on ajoute des tas vides
    # pour que toutes les fusions puissent prendre exactement K tas
    while (len(tas) - 1) % (k - 1) != 0:
        tas.append(0)

    heapq.heapify(tas)
    cout_total = 0
    while len(tas) > 1:
        nouveau = 0
        for _ in range(k):
            nouveau += heapq.heappop(tas)    # les K plus petits tas
        cout_total += nouveau
        heapq.heappush(tas, nouveau)
    print(cout_total)

main()
