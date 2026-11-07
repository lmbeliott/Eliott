n = int(input())
articles = 0
montant = 0
for i in range(n):
    q, p = map(int, input().split())
    articles = articles + q
    montant = montant + q * p
print(articles)
print(montant)
