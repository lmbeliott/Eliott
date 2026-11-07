#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> valeurs(n);
    int M = 0;
    for (int i = 0; i < n; i++) {
        cin >> valeurs[i];
        M = max(M, valeurs[i]);
    }

    vector<long long> f(M + 1, 0);     // f[v] = nombre de positions de valeur v
    for (int v : valeurs) f[v]++;

    // exact[d] = nombre de paires dont le PGCD vaut exactement d
    vector<long long> exact(M + 1, 0);
    long long total = 0;
    for (int d = M; d >= 1; d--) {
        long long cnt = 0;              // nombre de valeurs multiples de d
        for (int m = d; m <= M; m += d) cnt += f[m];
        long long paires = cnt * (cnt - 1) / 2;    // paires dont le PGCD est un multiple de d
        for (int m = 2 * d; m <= M; m += d) {
            paires -= exact[m];                    // on retire celles de PGCD 2d, 3d, ...
        }
        exact[d] = paires;
        total += d * paires;
    }
    cout << total << "\n";
    return 0;
}
