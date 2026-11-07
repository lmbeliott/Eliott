s = input()
total = 0
courant = 0                  # valeur du nombre en cours de lecture
for c in s:
    if "0" <= c <= "9":
        courant = 10 * courant + (ord(c) - ord("0"))
    else:
        total = total + courant  # le nombre en cours est terminé
        courant = 0
total = total + courant      # le dernier nombre, si le mot finit par un chiffre
print(total)
