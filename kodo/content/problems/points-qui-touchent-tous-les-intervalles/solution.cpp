#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> periodes(n);   // (fin, début) pour trier par fin
    for (int i = 0; i < n; i++) {
        cin >> periodes[i].second >> periodes[i].first;
    }
    sort(periodes.begin(), periodes.end());
    int controles = 0;
    int dernier = -1;                     // minute du dernier contrôle placé
    for (auto& p : periodes) {
        if (p.second > dernier) {         // période pas encore touchée
            controles++;
            dernier = p.first;
        }
    }
    cout << controles << "\n";
    return 0;
}
