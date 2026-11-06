#include <iostream>
#include <vector>
using namespace std;

const int NB_PISTES = 16;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;

    // somme[F] = nombre d'abonnés dont les préférences sont exactement F (pour l'instant).
    vector<int> somme(1 << NB_PISTES, 0);
    for (int i = 0; i < n; i++) {
        int f;
        cin >> f;
        somme[f]++;
    }

    // Somme sur les sous-ensembles, bit par bit : à la fin,
    // somme[m] = nombre d'abonnés dont les préférences sont un sous-ensemble de m.
    for (int b = 0; b < NB_PISTES; b++) {
        int bit = 1 << b;
        for (int m = 0; m < (1 << NB_PISTES); m++) {
            if (m & bit) somme[m] += somme[m ^ bit];  // m ^ bit : m privé de la piste b
        }
    }

    for (int i = 0; i < q; i++) {
        int o;
        cin >> o;
        cout << somme[o] << "\n";
    }
    return 0;
}
