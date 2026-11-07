n = int(input())
communes = set(input())             # les lettres du premier mot
for i in range(n - 1):
    communes = communes & set(input())   # on garde celles présentes dans ce mot aussi

reponse = ""
for code in range(ord("a"), ord("z") + 1):  # ordre alphabétique
    if chr(code) in communes:
        reponse = reponse + chr(code)
if reponse == "":
    reponse = "AUCUNE"
print(reponse)
