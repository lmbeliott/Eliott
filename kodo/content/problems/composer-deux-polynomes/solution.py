def somme(a, b):
    # Nouvelle liste : a + b, coefficient par coefficient.
    n = max(len(a), len(b))
    r = [0] * n
    for k in range(len(a)):
        r[k] = r[k] + a[k]
    for k in range(len(b)):
        r[k] = r[k] + b[k]
    return r


def produit(a, b):
    # a[i] * b[j] contribue au terme de degré i + j.
    r = [0] * (len(a) + len(b) - 1)
    for i in range(len(a)):
        for j in range(len(b)):
            r[i + j] = r[i + j] + a[i] * b[j]
    return r


def composer(p, q):
    # Horner : P(y) = p0 + y (p1 + y (p2 + ... + y pn)).
    n = len(p) - 1
    r = [p[n]]
    for i in range(n - 1, -1, -1):
        r = somme(produit(r, q), [p[i]])
    return r


def lire_polynome():
    nombres = list(map(int, input().split()))
    # Le premier nombre est le degré ; les suivants sont les coefficients.
    coefs = []
    for k in range(1, len(nombres)):
        coefs.append(nombres[k])
    return coefs


p = lire_polynome()
q = lire_polynome()
print(" ".join(map(str, composer(p, q))))
