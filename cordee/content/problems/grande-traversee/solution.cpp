#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// nombre minimal de jours si on ne marche jamais plus de `limite` km par jour
// (on suppose limite >= le plus long tronçon)
int jours_necessaires(const vector<int>& troncons, int limite) {
    int jours = 1;
    int aujourd_hui = 0;
    for (int longueur : troncons) {
        if (aujourd_hui + longueur > limite) {
            jours++;              // on dort au refuge et on repart demain
            aujourd_hui = longueur;
        } else {
            aujourd_hui += longueur;
        }
    }
    return jours;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<int> troncons(n);
    int plus_long = 0, total = 0;
    for (int i = 0; i < n; i++) {
        cin >> troncons[i];
        plus_long = max(plus_long, troncons[i]);
        total += troncons[i];
    }

    int trop_petit = plus_long - 1; // impossible : un tronçon ne rentre pas
    int suffisant = total;          // tout en un seul jour
    while (suffisant - trop_petit > 1) {
        int milieu = (trop_petit + suffisant) / 2;
        if (jours_necessaires(troncons, milieu) <= k) suffisant = milieu;
        else trop_petit = milieu;
    }
    cout << suffisant << "\n";
    return 0;
}
