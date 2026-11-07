#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    long long l, r;
    cin >> l >> r;

    // 1) crible d'Ératosthène simple jusqu'à racine de R
    long long racine = 0;
    while ((racine + 1) * (racine + 1) <= r) racine++;
    vector<char> est_premier(racine + 1, 1);
    est_premier[0] = 0;
    if (racine >= 1) est_premier[1] = 0;
    for (long long p = 2; p * p <= racine; p++) {
        if (est_premier[p]) {
            for (long long m = p * p; m <= racine; m += p) est_premier[m] = 0;
        }
    }

    // 2) crible de la fenêtre : fenetre[i] dit si L + i est premier
    long long taille = r - l + 1;
    vector<char> fenetre(taille, 1);
    for (long long p = 2; p <= racine; p++) {
        if (!est_premier[p]) continue;
        // premier multiple de p dans la fenêtre, sans rayer p lui-même
        long long debut = max(p * p, (l + p - 1) / p * p);
        for (long long m = debut; m <= r; m += p) fenetre[m - l] = 0;
    }
    if (l == 1) fenetre[0] = 0;            // 1 n'est pas premier

    // 3) compter les premiers et le plus grand écart entre deux premiers consécutifs
    long long nombre = 0, plus_grand_ecart = 0, precedent = -1;
    for (long long i = 0; i < taille; i++) {
        if (fenetre[i]) {
            nombre++;
            if (precedent >= 0 && i - precedent > plus_grand_ecart) plus_grand_ecart = i - precedent;
            precedent = i;
        }
    }
    cout << nombre << " " << plus_grand_ecart << "\n";
    return 0;
}
