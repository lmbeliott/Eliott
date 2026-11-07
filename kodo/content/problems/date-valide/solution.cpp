#include <iostream>
using namespace std;

int main() {
    int j, m, a;
    cin >> j >> m >> a;
    bool bissextile = (a % 4 == 0 && a % 100 != 0) || a % 400 == 0;
    // Nombre de jours du mois m.
    int jours_du_mois;
    if (m == 2) {
        if (bissextile) {
            jours_du_mois = 29;
        } else {
            jours_du_mois = 28;
        }
    } else if (m == 4 || m == 6 || m == 9 || m == 11) {
        jours_du_mois = 30;
    } else {
        jours_du_mois = 31;
    }
    if (m >= 1 && m <= 12 && j >= 1 && j <= jours_du_mois) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
