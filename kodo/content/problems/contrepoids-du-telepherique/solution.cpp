#include <iostream>
#include <vector>
using namespace std;

const int IMPOSSIBLE = -1;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, wMax;
    cin >> n >> wMax;

    // meilleur[w] = meilleure utilité d'un chargement d'exactement w kg, ou IMPOSSIBLE.
    vector<int> meilleur(wMax + 1, IMPOSSIBLE);
    meilleur[0] = 0;  // le chargement vide
    for (int i = 0; i < n; i++) {
        int p, u;
        cin >> p >> u;
        // w décroissant : meilleur[w - p] ne contient pas encore ce colis.
        for (int w = wMax; w >= p; w--) {
            int avant = meilleur[w - p];
            if (avant != IMPOSSIBLE && avant + u > meilleur[w]) meilleur[w] = avant + u;
        }
    }

    cout << meilleur[wMax] << "\n";
    return 0;
}
