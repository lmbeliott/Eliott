n = int(input())

# familles[signature] = liste des mots qui ont cette signature.
# La signature d'un mot, ce sont ses lettres rangées dans l'ordre alphabétique :
# deux anagrammes ont exactement la même.
familles = {}
for _ in range(n):
    mot = input()
    signature = "".join(sorted(mot))
    if signature not in familles:
        familles[signature] = []
    familles[signature].append(mot)

# Chaque famille est triée, puis on trie les familles entre elles
# (deux listes se comparent d'abord par leur premier élément).
resultat = []
for signature in familles:
    groupe = familles[signature]
    groupe.sort()
    resultat.append(groupe)
resultat.sort()

print(len(resultat))
for groupe in resultat:
    print(" ".join(groupe))
