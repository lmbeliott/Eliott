import sys

PLAFOND = 10**18 + 1    # les longueurs plus grandes sont remplacées par ce plafond

def main():
    donnees = sys.stdin.read().split()
    e, q = int(donnees[0]), int(donnees[1])
    regle = {'a': donnees[2], 'b': donnees[3]}
    questions = [int(x) for x in donnees[4:4 + q]]

    # longueur[t][c] et nb_b[t][c] : longueur et nombre de b du mot obtenu
    # en partant de la seule lettre c et en faisant t étapes
    longueur = [{'a': 1, 'b': 1}]
    nb_b = [{'a': 0, 'b': 1}]
    for t in range(1, e + 1):
        lg = {}
        nb = {}
        for c in 'ab':
            lg[c] = min(PLAFOND, sum(longueur[t - 1][d] for d in regle[c]))
            nb[c] = min(PLAFOND, sum(nb_b[t - 1][d] for d in regle[c]))
        longueur.append(lg)
        nb_b.append(nb)

    def compter(t, c, k):
        # nombre de b parmi les k premières lettres du mot obtenu depuis c en t étapes
        if k == 0:
            return 0
        if t == 0:
            return 1 if c == 'b' else 0
        total = 0
        for d in regle[c]:
            if k >= longueur[t - 1][d]:
                # le morceau issu de d est entièrement dans les k premières lettres
                total += nb_b[t - 1][d]
                k -= longueur[t - 1][d]
            else:
                # le préfixe s'arrête au milieu de ce morceau : on descend dedans
                return total + compter(t - 1, d, k)
        return total

    print("\n".join(str(compter(e, 'a', k)) for k in questions))

main()
