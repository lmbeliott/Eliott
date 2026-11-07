#include <iostream>
using namespace std;

int main() {
    int precedente;
    cin >> precedente;           // la première mesure : un plateau de longueur 1
    int longueur = 1;
    int meilleure_longueur = 1;
    int meilleure_valeur = precedente;
    int x;
    cin >> x;
    while (x != -1) {
        if (x == precedente) {
            longueur = longueur + 1;   // le plateau en cours s'allonge
        } else {
            longueur = 1;              // un nouveau plateau commence
        }
        if (longueur > meilleure_longueur) {
            meilleure_longueur = longueur;
            meilleure_valeur = x;
        }
        precedente = x;
        cin >> x;
    }
    cout << meilleure_longueur << " " << meilleure_valeur << "\n";
    return 0;
}
