#include <iostream>
#include <vector>
#include <algorithm>
#include <utility>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<int, int>> creneaux(n);   // (fin, début)
    for (int i = 0; i < n; i++) {
        int debut, duree;
        cin >> debut >> duree;
        creneaux[i] = {debut + duree, debut};
    }

    // on examine les créneaux par heure de fin croissante
    sort(creneaux.begin(), creneaux.end());
    int acceptes = 0;
    int mur_libre_a = 0;  // moment où le mur se libère
    for (const auto& c : creneaux) {
        if (c.second >= mur_libre_a) {
            acceptes++;
            mur_libre_a = c.first;
        }
    }
    cout << acceptes << "\n";
    return 0;
}
