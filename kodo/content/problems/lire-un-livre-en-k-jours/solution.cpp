#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// nombre minimal de jours si on ne lit jamais plus de `limite` pages par jour
// (on suppose limite >= le plus long chapitre)
int jours_necessaires(const vector<int>& chapitres, int limite) {
    int jours = 1;
    int aujourd_hui = 0;
    for (int pages : chapitres) {
        if (aujourd_hui + pages > limite) {
            jours++;              // on s'arrête là et on reprend le lendemain
            aujourd_hui = pages;
        } else {
            aujourd_hui += pages;
        }
    }
    return jours;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<int> chapitres(n);
    int plus_long = 0, total = 0;
    for (int i = 0; i < n; i++) {
        cin >> chapitres[i];
        plus_long = max(plus_long, chapitres[i]);
        total += chapitres[i];
    }

    int trop_petit = plus_long - 1; // impossible : un chapitre ne rentre pas
    int suffisant = total;          // tout en un seul jour
    while (suffisant - trop_petit > 1) {
        int milieu = (trop_petit + suffisant) / 2;
        if (jours_necessaires(chapitres, milieu) <= k) suffisant = milieu;
        else trop_petit = milieu;
    }
    cout << suffisant << "\n";
    return 0;
}
