#include <iostream>
#include <vector>
using namespace std;

const int NB_BITS = 16;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;

    // somme[a] = nombre d'ensembles de la liste égaux à a (pour l'instant).
    vector<int> somme(1 << NB_BITS, 0);
    for (int i = 0; i < n; i++) {
        int a;
        cin >> a;
        somme[a]++;
    }

    // Somme sur les sous-ensembles, bit par bit : à la fin,
    // somme[m] = nombre d'ensembles de la liste inclus dans m.
    for (int b = 0; b < NB_BITS; b++) {
        int bit = 1 << b;
        for (int m = 0; m < (1 << NB_BITS); m++) {
            if (m & bit) somme[m] += somme[m ^ bit];  // m ^ bit : m privé de l'élément b
        }
    }

    for (int i = 0; i < q; i++) {
        int r;
        cin >> r;
        cout << somme[r] << "\n";
    }
    return 0;
}
