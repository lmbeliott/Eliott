import sys
import heapq

def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    taches = []
    for i in range(n):
        limite = int(donnees[1 + 2 * i])
        gain = int(donnees[2 + 2 * i])
        taches.append((limite, gain))
    taches.sort()                    # par date limite croissante

    gardees = []                     # tas des gains des tâches gardées (le plus petit en haut)
    for limite, gain in taches:
        heapq.heappush(gardees, gain)
        if len(gardees) > limite:
            # trop de tâches pour tenir avant cette date : on abandonne la moins rentable
            heapq.heappop(gardees)
    print(sum(gardees))

main()
