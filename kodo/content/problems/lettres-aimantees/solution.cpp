#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    string boite, mot;
    cin >> boite >> mot;

    // compte[k] = nombre de fois où la k-ième lettre de l'alphabet apparaît.
    vector<int> dans_boite(26, 0), dans_mot(26, 0);
    for (char c : boite) dans_boite[c - 'a']++;
    for (char c : mot) dans_mot[c - 'a']++;

    // Chaque lettre du mot limite le nombre de panneaux possibles.
    int panneaux = boite.size();
    for (int k = 0; k < 26; k++) {
        if (dans_mot[k] > 0) {
            panneaux = min(panneaux, dans_boite[k] / dans_mot[k]);
        }
    }

    cout << panneaux << "\n";
    return 0;
}
