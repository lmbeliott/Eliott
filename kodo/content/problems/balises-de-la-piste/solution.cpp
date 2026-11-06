#include <iostream>
#include <string>
using namespace std;

int main() {
    string piste;
    cin >> piste;
    int q;
    cin >> q;

    for (int k = 0; k < q; k++) {
        string mot;
        cin >> mot;
        // j = nombre de lettres du mot déjà trouvées, dans l'ordre.
        int j = 0;
        for (char balise : piste) {
            // Dès qu'une balise porte la lettre attendue, on la prend.
            if (j < (int)mot.size() && balise == mot[j]) {
                j++;
            }
        }
        if (j == (int)mot.size()) {
            cout << "oui\n";
        } else {
            cout << "non\n";
        }
    }
    return 0;
}
