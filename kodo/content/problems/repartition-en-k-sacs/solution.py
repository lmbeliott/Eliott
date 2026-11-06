import sys

def main():
    donnees = sys.stdin.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    # les objets les plus lourds d'abord : les mauvaises branches échouent plus vite
    objets = sorted(map(int, donnees[2:2 + n]), reverse=True)
    total = sum(objets)
    # aucune répartition ne peut faire mieux que cette borne
    borne = max(objets[0], (total + k - 1) // k)
    charges = [0] * k
    meilleur = total + 1    # pire que tout : la première répartition trouvée l'améliorera

    def placer(i):
        nonlocal meilleur
        if i == n:
            # grâce à l'élagage, toutes les charges sont < meilleur
            meilleur = max(charges)
            return
        # on essaie d'abord le sac le moins chargé
        ordre = sorted(range(k), key=lambda j: charges[j])
        precedente = -1
        for j in ordre:
            c = charges[j]
            if c + objets[i] >= meilleur:
                break       # ce sac et les suivants, plus chargés, ne feront pas mieux
            if c == precedente:
                continue    # même charge qu'un sac déjà essayé : même résultat
            precedente = c
            charges[j] += objets[i]
            placer(i + 1)
            charges[j] -= objets[i]
            if meilleur == borne:
                return      # impossible de faire mieux : on arrête tout

    placer(0)
    print(meilleur)

main()
