#include <iostream>
using namespace std;

int main() {
    int a, b, h;
    cin >> a >> b >> h;

    // Jour 1 : la cordée monte de a mètres.
    int jour = 1;
    int hauteur = a;

    // Tant que le sommet n'est pas atteint, on passe la nuit puis on remonte.
    while (hauteur < h) {
        hauteur = hauteur - b;  // la nuit, on redescend
        jour = jour + 1;        // nouveau jour
        hauteur = hauteur + a;  // on remonte
    }
    cout << jour << "\n";
    return 0;
}
