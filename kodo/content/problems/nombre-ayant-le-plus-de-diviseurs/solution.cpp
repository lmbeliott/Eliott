#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int meilleur = 0;         // l'entier retenu
    int meilleur_nb = 0;      // son nombre de diviseurs
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        int nb = 0;           // remis à 0 pour chaque entier
        int d = 1;
        while (d * d <= x) {
            if (x % d == 0) {
                if (d * d == x) {
                    nb = nb + 1;   // d et x / d sont le même diviseur
                } else {
                    nb = nb + 2;   // d et x / d
                }
            }
            d = d + 1;
        }
        if (nb > meilleur_nb || (nb == meilleur_nb && x < meilleur)) {
            meilleur = x;
            meilleur_nb = nb;
        }
    }
    cout << meilleur << " " << meilleur_nb << "\n";
    return 0;
}
