valeurs = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
symboles = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]

# valeur de chaque lettre, rangée à l'indice ord(lettre) - ord("A")
valeur_lettre = [0] * 26
lettres = "IVXLCDM"
montants = [1, 5, 10, 50, 100, 500, 1000]
for i in range(7):
    valeur_lettre[ord(lettres[i]) - ord("A")] = montants[i]

q = int(input())
for k in range(q):
    s = input()
    if "0" <= s[0] <= "9":
        # chiffres -> romains : on retire les plus grandes valeurs possibles
        n = int(s)
        res = ""
        for i in range(13):
            while n >= valeurs[i]:
                res = res + symboles[i]
                n = n - valeurs[i]
        print(res)
    else:
        # romains -> chiffres : un symbole suivi d'un plus grand est soustrait
        total = 0
        for i in range(len(s)):
            v = valeur_lettre[ord(s[i]) - ord("A")]
            if i + 1 < len(s) and v < valeur_lettre[ord(s[i + 1]) - ord("A")]:
                total = total - v
            else:
                total = total + v
        print(total)
