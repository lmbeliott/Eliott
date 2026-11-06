#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    int identiques = 0;

    for (int k = 0; k < n; k++) {
        string mot;
        cin >> mot;
        // On construit le mot à l'envers, de la dernière lettre à la première.
        string envers = "";
        for (int i = (int)mot.size() - 1; i >= 0; i--) {
            envers = envers + mot[i];
        }
        cout << envers << "\n";
        if (envers == mot) {
            identiques++;
        }
    }

    cout << identiques << "\n";
    return 0;
}
