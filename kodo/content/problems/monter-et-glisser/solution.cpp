#include <iostream>
using namespace std;

int main() {
    int a, b, h;
    cin >> a >> b >> h;

    // Jour 1 : l'escargot monte de a centimètres.
    int jour = 1;
    int hauteur = a;

    // Tant qu'il n'est pas en haut, il passe la nuit puis remonte.
    while (hauteur < h) {
        hauteur = hauteur - b;  // la nuit, il redescend
        jour = jour + 1;        // nouveau jour
        hauteur = hauteur + a;  // il remonte
    }
    cout << jour << "\n";
    return 0;
}
