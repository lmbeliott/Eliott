#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;
    int v = *max_element(a.begin(), a.end());
    vector<long long> combien(v + 1, 0);   // combien[x] : nombre de fois où la valeur x apparaît
    for (int x : a) combien[x]++;

    // exact[d] : nombre de paires dont le PGCD vaut exactement d.
    // Les paires dont les deux valeurs sont multiples de d ont un PGCD multiple de d :
    // on enlève celles dont le PGCD vaut 2d, 3d, ... (déjà calculées, on descend).
    vector<long long> exact(v + 1, 0);
    for (int d = v; d >= 1; d--) {
        long long m = 0;
        for (int x = d; x <= v; x += d) m += combien[x];   // valeurs multiples de d
        exact[d] = m * (m - 1) / 2;
        for (int x = 2 * d; x <= v; x += d) exact[d] -= exact[x];
    }

    // crible d'Ératosthène jusqu'à v
    vector<bool> est_premier(v + 1, true);
    for (int x = 0; x < 2 && x <= v; x++) est_premier[x] = false;
    for (long long p = 2; p * p <= v; p++) {
        if (!est_premier[p]) continue;
        for (long long q = p * p; q <= v; q += p) est_premier[q] = false;
    }

    long long total = 0;
    for (int p = 2; p <= v; p++) {
        if (est_premier[p]) total += exact[p];
    }
    cout << total << "\n";
    return 0;
}
