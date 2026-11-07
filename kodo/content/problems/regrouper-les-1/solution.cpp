#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> liste(n);
    for (int i = 0; i < n; i++) {
        cin >> liste[i];
    }

    // Nombre total de 1.
    int total = 0;
    for (int x : liste) {
        total = total + x;
    }

    // Chaque 0 passe par-dessus les 1 de gauche ou ceux de droite :
    // il choisit le côté qui en a le moins.
    long long echanges = 0;
    int avant = 0;
    for (int x : liste) {
        if (x == 1) {
            avant = avant + 1;
        } else {
            echanges = echanges + min(avant, total - avant);
        }
    }

    cout << echanges << "\n";
    return 0;
}
