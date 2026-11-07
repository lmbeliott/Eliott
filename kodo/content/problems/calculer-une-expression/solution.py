expr = input()

total = 0      # somme des termes déjà terminés
signe = 1      # signe du terme en cours : 1 ou -1
terme = 0      # valeur du terme en cours (un produit)
op = "+"       # l'opération placée juste avant le nombre que l'on va lire

i = 0
while i < len(expr):
    # On lit le nombre qui commence en i, chiffre par chiffre.
    nombre = 0
    while i < len(expr) and "0" <= expr[i] <= "9":
        nombre = nombre * 10 + (ord(expr[i]) - ord("0"))
        i = i + 1

    if op == "*":
        # Le produit continue : le terme en cours est multiplié.
        terme = terme * nombre
    else:
        # Un + ou un - termine le terme précédent et en commence un nouveau.
        total = total + signe * terme
        if op == "+":
            signe = 1
        else:
            signe = -1
        terme = nombre

    # On lit l'opération suivante, s'il en reste une.
    if i < len(expr):
        op = expr[i]
        i = i + 1

# Le dernier terme n'est suivi d'aucun + ou - : on l'ajoute à la fin.
total = total + signe * terme
print(total)
