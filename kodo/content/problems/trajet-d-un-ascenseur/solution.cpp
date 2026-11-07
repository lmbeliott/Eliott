#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int etage = 0, distance = 0, plus_haut = 0, changements = 0;
    int dernier = 0;   // sens du dernier déplacement : 1 monte, -1 descend, 0 pas encore bougé
    for (int i = 0; i < n; i++) {
        int c, sens;
        cin >> c;
        if (c > etage) {
            distance = distance + c - etage;
            sens = 1;
        } else if (c < etage) {
            distance = distance + etage - c;
            sens = -1;
        } else {
            sens = 0;
        }
        if (sens != 0) {
            if (dernier != 0) {
                if (sens != dernier) {
                    changements = changements + 1;
                }
            }
            dernier = sens;
        }
        etage = c;
        if (etage > plus_haut) {
            plus_haut = etage;
        }
    }
    cout << distance << "\n" << plus_haut << "\n" << changements << "\n";
    return 0;
}
