import sys

def main():
    donnees = sys.stdin.buffer.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    a = [int(x) for x in donnees[2:2 + n]]

    def nombre_au_plus(s):
        # nombre de portions de somme <= s, avec deux pointeurs
        total = 0
        debut = 0
        somme = 0
        for fin in range(n):
            somme += a[fin]
            while somme > s:
                somme -= a[debut]
                debut += 1
            total += fin - debut + 1    # portions qui finissent en fin
        return total

    trop_petit = 0          # aucune portion n'a une somme <= 0
    suffisant = sum(a)      # toutes les portions ont une somme <= sum(a)
    while suffisant - trop_petit > 1:
        milieu = (trop_petit + suffisant) // 2
        if nombre_au_plus(milieu) >= k:
            suffisant = milieu
        else:
            trop_petit = milieu
    print(suffisant)

main()
