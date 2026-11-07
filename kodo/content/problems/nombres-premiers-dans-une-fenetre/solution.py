from math import isqrt

def main():
    l, r = map(int, input().split())

    # 1) crible d'Ératosthène simple jusqu'à racine de R
    racine = isqrt(r)
    est_premier = bytearray([1]) * (racine + 1)
    est_premier[0] = 0
    if racine >= 1:
        est_premier[1] = 0
    for p in range(2, isqrt(racine) + 1):
        if est_premier[p]:
            est_premier[p * p::p] = bytes(len(range(p * p, racine + 1, p)))

    # 2) crible de la fenêtre : fenetre[i] dit si L + i est premier
    taille = r - l + 1
    fenetre = bytearray([1]) * taille
    for p in range(2, racine + 1):
        if est_premier[p]:
            # premier multiple de p dans la fenêtre, sans rayer p lui-même
            debut = max(p * p, (l + p - 1) // p * p)
            if debut <= r:
                fenetre[debut - l::p] = bytes(len(range(debut - l, taille, p)))
    if l == 1:
        fenetre[0] = 0                     # 1 n'est pas premier

    # 3) compter les premiers et le plus grand écart entre deux premiers consécutifs
    nombre = 0
    plus_grand_ecart = 0
    precedent = -1
    for i in range(taille):
        if fenetre[i]:
            nombre += 1
            if precedent >= 0 and i - precedent > plus_grand_ecart:
                plus_grand_ecart = i - precedent
            precedent = i
    print(nombre, plus_grand_ecart)

main()
