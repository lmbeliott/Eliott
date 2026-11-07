def produit(n):
    # produit des chiffres de n
    if n < 10:
        return n
    return (n % 10) * produit(n // 10)

def persistance(n):
    if n < 10:
        return 0
    return 1 + persistance(produit(n))

q = int(input())
for _ in range(q):
    print(persistance(int(input())))
