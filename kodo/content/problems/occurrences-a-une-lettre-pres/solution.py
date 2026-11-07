import sys


def fonction_z(s):
    # z[i] = longueur du plus long préfixe commun à s et à s[i..]
    n = len(s)
    z = [0] * n
    z[0] = n
    g = d = 0  # [g, d[ : la boîte Z qui va le plus loin à droite
    for i in range(1, n):
        k = 0
        if i < d:
            k = min(d - i, z[i - g])
        while i + k < n and s[k] == s[i + k]:
            k += 1
        z[i] = k
        if i + k > d:
            g, d = i, i + k
    return z


def main():
    p, t = sys.stdin.read().split()
    m, n = len(p), len(t)

    # debut[i] : nombre de lettres de P retrouvées en lisant T à partir de i
    z = fonction_z(p + "#" + t)
    debut = z[m + 1:]
    # fin[j] : nombre de lettres de P retrouvées en lisant T vers la gauche à partir de j
    z = fonction_z(p[::-1] + "#" + t[::-1])
    fin = z[m + 1:][::-1]

    positions = []
    for i in range(n - m + 1):
        # Au plus une différence : le début et la fin retrouvés couvrent au moins m - 1 lettres.
        if debut[i] + fin[i + m - 1] >= m - 1:
            positions.append(i + 1)
    print(len(positions))
    print(" ".join(map(str, positions)))


main()
