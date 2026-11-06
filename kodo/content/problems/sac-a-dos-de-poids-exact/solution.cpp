#include <iostream>
#include <vector>
using namespace std;

const int IMPOSSIBLE = -1;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, wMax;
    cin >> n >> wMax;

    // meilleur[w] = meilleure valeur d'une sélection de poids exactement w, ou IMPOSSIBLE.
    vector<int> meilleur(wMax + 1, IMPOSSIBLE);
    meilleur[0] = 0;  // la sélection vide
    for (int i = 0; i < n; i++) {
        int p, v;
        cin >> p >> v;
        // w décroissant : meilleur[w - p] ne contient pas encore cet objet.
        for (int w = wMax; w >= p; w--) {
            int avant = meilleur[w - p];
            if (avant != IMPOSSIBLE && avant + v > meilleur[w]) meilleur[w] = avant + v;
        }
    }

    cout << meilleur[wMax] << "\n";
    return 0;
}
