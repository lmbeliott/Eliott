from math import isqrt

MOD = 1_000_000_007

def exposant_dans_factorielle(n, p):
    # exposant de p dans n! : multiples de p, plus multiples de p², plus multiples de p³...
    e = 0
    while n > 0:
        n //= p
        e += n
    return e

def main():
    n, k = map(int, input().split())
    # crible d'Ératosthène jusqu'à n
    est_premier = bytearray([1]) * (n + 1)
    for x in range(min(2, n + 1)):
        est_premier[x] = 0
    for p in range(2, isqrt(n) + 1):
        if est_premier[p]:
            est_premier[p * p::p] = bytes(len(range(p * p, n + 1, p)))
    # C(N, K) = N! / (K! × (N - K)!) : on soustrait les exposants
    reponse = 1
    for p in range(2, n + 1):
        if est_premier[p]:
            e = exposant_dans_factorielle(n, p) - exposant_dans_factorielle(k, p) - exposant_dans_factorielle(n - k, p)
            reponse = reponse * (e + 1) % MOD
    print(reponse)

main()
