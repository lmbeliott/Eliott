#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int l, n, k;
    cin >> l >> n >> k;
    // étape 1 : tableau des différences, puis nombre de lampadaires par position
    vector<int> d(l + 2, 0);
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        d[a]++;
        d[b + 1]--;
    }
    vector<bool> sombre(l + 1, false);
    int c = 0;
    for (int p = 1; p <= l; p++) {
        c += d[p];
        sombre[p] = (c == 0);
    }
    // étape 2 : plus longue fenêtre avec au plus k positions sombres
    int g = 1, sombres = 0, meilleure = 0, debut = 1;
    for (int fin = 1; fin <= l; fin++) {
        if (sombre[fin]) {
            sombres++;
        }
        while (sombres > k) {
            if (sombre[g]) {
                sombres--;
            }
            g++;
        }
        if (fin - g + 1 > meilleure) {   // strictement plus longue : la plus à gauche
            meilleure = fin - g + 1;
            debut = g;
        }
    }
    cout << meilleure << " " << debut << "\n";
    return 0;
}
