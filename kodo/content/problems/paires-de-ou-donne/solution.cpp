#include <iostream>
#include <vector>
using namespace std;

const int BITS = 16;
const int TAILLE = 1 << BITS;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    // f[m] : nombre de valeurs égales à m, puis nombre de valeurs dont les bits sont inclus dans m
    vector<long long> f(TAILLE, 0);
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        f[x]++;
    }
    for (int b = 0; b < BITS; b++)
        for (int m = 0; m < TAILLE; m++)
            if ((m >> b) & 1) f[m] += f[m ^ (1 << b)];

    // g[m] : nombre de paires dont le OU est inclus dans m (les deux valeurs le sont)
    vector<long long> g(TAILLE);
    for (int m = 0; m < TAILLE; m++) g[m] = f[m] * (f[m] - 1) / 2;
    // On enlève, bit par bit, les paires dont le OU est strictement inclus : il reste le OU égal à m.
    for (int b = 0; b < BITS; b++)
        for (int m = 0; m < TAILLE; m++)
            if ((m >> b) & 1) g[m] -= g[m ^ (1 << b)];

    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int x;
        cin >> x;
        cout << g[x] << "\n";
    }
    return 0;
}
