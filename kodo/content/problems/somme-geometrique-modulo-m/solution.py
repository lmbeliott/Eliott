import sys

def puissance_et_somme(a, n, m):
    # renvoie (a^n mod m, (1 + a + ... + a^(n-1)) mod m), soit la somme des n premiers termes
    if n == 0:
        return 1 % m, 0
    if n % 2 == 0:
        # les n termes = les n/2 premiers, puis les mêmes multipliés par a^(n/2)
        p, s = puissance_et_somme(a, n // 2, m)
        return p * p % m, s * (1 + p) % m
    # n impair : les n - 1 premiers termes, plus le terme a^(n-1)
    p, s = puissance_et_somme(a, n - 1, m)
    return p * a % m, (s + p) % m

def main():
    donnees = sys.stdin.read().split()
    t = int(donnees[0])
    reponses = []
    for i in range(t):
        a = int(donnees[1 + 3 * i])
        n = int(donnees[2 + 3 * i])
        m = int(donnees[3 + 3 * i])
        # 1 + A + ... + A^N contient N + 1 termes
        reponses.append(puissance_et_somme(a % m, n + 1, m)[1])
    print("\n".join(map(str, reponses)))

main()
