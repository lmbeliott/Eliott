#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> resultats;
    for (int i = 0; i < n; i++) {
        int dossard, temps;
        cin >> dossard >> temps;
        // On met le temps en premier : le tri se fera d'abord sur lui.
        resultats.push_back({temps, dossard});
    }

    sort(resultats.begin(), resultats.end());

    for (int i = 0; i < 3; i++) {
        cout << resultats[i].second << "\n";
    }
    return 0;
}
