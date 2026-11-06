import sys

def main():
    donnees = sys.stdin.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    chiffres = donnees[2]

    garde = []          # les chiffres gardés jusqu'ici (une pile)
    a_effacer = k
    for c in chiffres:
        # un chiffre plus grand juste avant c : l'effacer rend le nombre plus petit
        while a_effacer > 0 and garde and garde[-1] > c:
            garde.pop()
            a_effacer -= 1
        garde.append(c)
    # s'il reste des chiffres à effacer, on enlève les derniers (les plus grands)
    garde = garde[:n - k]
    print("".join(garde))

main()
