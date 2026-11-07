s = int(input())
q = s // 9             # nombre de chiffres 9
r = s % 9              # le premier chiffre (absent s'il vaut 0)
resultat = r
for i in range(q):
    resultat = resultat * 10 + 9   # on ajoute un 9 à droite
print(resultat)
