#include <iostream>
#include <string>
using namespace std;

int main() {
    string p;
    cin >> p;
    int q;
    cin >> q;

    for (int k = 0; k < q; k++) {
        string mot;
        cin >> mot;
        // j = nombre de lettres du mot déjà trouvées, dans l'ordre.
        int j = 0;
        for (char c : p) {
            // Dès que la lettre attendue apparaît, on la prend.
            if (j < (int)mot.size() && c == mot[j]) {
                j++;
            }
        }
        if (j == (int)mot.size()) {
            cout << "OUI\n";
        } else {
            cout << "NON\n";
        }
    }
    return 0;
}
