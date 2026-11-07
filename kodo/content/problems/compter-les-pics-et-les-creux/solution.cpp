#include <iostream>
using namespace std;

int main() {
    int n, avant, milieu;
    cin >> n >> avant >> milieu;
    int pics = 0, creux = 0;
    for (int i = 0; i < n - 2; i++) {
        int apres;
        cin >> apres;
        // On examine milieu, qui a maintenant ses deux voisins.
        if (milieu > avant && milieu > apres) {
            pics = pics + 1;
        }
        if (milieu < avant && milieu < apres) {
            creux = creux + 1;
        }
        avant = milieu;
        milieu = apres;
    }
    cout << pics << " " << creux << "\n";
    return 0;
}
