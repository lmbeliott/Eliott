import sys

def main():
    donnees = sys.stdin.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    # les sacs les plus lourds d'abord : les mauvaises branches échouent plus vite
    sacs = sorted(map(int, donnees[2:2 + n]), reverse=True)
    total = sum(sacs)
    # aucune répartition ne peut faire mieux que cette borne
    borne = max(sacs[0], (total + k - 1) // k)
    charges = [0] * k
    meilleur = total + 1    # pire que tout : la première répartition trouvée l'améliorera

    def placer(i):
        nonlocal meilleur
        if i == n:
            # grâce à l'élagage, toutes les charges sont < meilleur
            meilleur = max(charges)
            return
        # on essaie d'abord la mule la moins chargée
        ordre = sorted(range(k), key=lambda j: charges[j])
        precedente = -1
        for j in ordre:
            c = charges[j]
            if c + sacs[i] >= meilleur:
                break       # cette mule et les suivantes, plus chargées, ne feront pas mieux
            if c == precedente:
                continue    # même charge qu'une mule déjà essayée : même résultat
            precedente = c
            charges[j] += sacs[i]
            placer(i + 1)
            charges[j] -= sacs[i]
            if meilleur == borne:
                return      # impossible de faire mieux : on arrête tout

    placer(0)
    print(meilleur)

main()
