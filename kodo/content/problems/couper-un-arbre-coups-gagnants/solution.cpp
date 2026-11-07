#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    unsigned long long graine;
    cin >> n >> graine;
    vector<int> parent(n + 1, 0);  // parent[i] < i ; le sol est le sommet 0
    if (graine == 0) {
        for (int i = 1; i <= n; i++) cin >> parent[i];
    } else {
        // Générateur décrit dans l'énoncé
        long long s, k;
        cin >> s >> k;
        unsigned long long x = graine;
        for (int i = 1; i <= n; i++) {
            x = x * 6364136223846793005ULL + 1442695040888963407ULL;  // modulo 2^64 automatiquement
            parent[i] = (int)max(0LL, i - s * (1 + (long long)(x >> 33) % k));
        }
    }

    // 1) Nombres de Grundy, des feuilles vers le sol : g[v] = XOR sur les enfants c de (g[c] + 1)
    vector<long long> g(n + 1, 0);
    for (int v = n; v >= 1; v--) g[parent[v]] ^= g[v] + 1;

    // 2) Du sol vers les feuilles : besoin[v] = valeur que g[v] doit prendre après le coup
    //    pour que le sol vaille 0 (-1 : impossible avec un coup dans le sous-arbre de v).
    vector<long long> besoin(n + 1, -1);
    besoin[0] = 0;
    long long gagnants = 0;
    for (int v = 1; v <= n; v++) {
        int p = parent[v];
        long long b = besoin[p];
        if (b < 0) continue;
        // Couper l'arête (p, v) : g[p] devient g[p] XOR (g[v] + 1)
        if ((g[p] ^ (g[v] + 1)) == b) gagnants++;
        // Un coup plus bas dans le sous-arbre de v doit donner g'[v] + 1 = b XOR g[p] XOR (g[v] + 1)
        long long z = b ^ g[p] ^ (g[v] + 1);
        if (z > 0) besoin[v] = z - 1;
    }
    cout << gagnants << "\n";
    return 0;
}
