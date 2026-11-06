#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int, string>> resultats;
    for (int i = 0; i < n; i++) {
        string prenom;
        int temps;
        cin >> prenom >> temps;
        // On met le temps en premier : le tri se fera d'abord sur lui.
        resultats.push_back({temps, prenom});
    }

    sort(resultats.begin(), resultats.end());

    for (int i = 0; i < 3; i++) {
        cout << resultats[i].second << "\n";
    }
    return 0;
}
