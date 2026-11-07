#include <iostream>
using namespace std;

int main() {
    int l1, c1, l2, c2, l3, c3;
    cin >> l1 >> c1 >> l2 >> c2 >> l3 >> c3;

    // Le déplacement à faire, et la position de l'obstacle vue depuis la dame.
    int dl = l2 - l1;
    int dc = c2 - c1;
    int ol = l3 - l1;
    int oc = c3 - c1;

    // Les lignes et les colonnes de l'obstacle sont-elles entre la dame et la case ?
    bool ligneEntre = (l1 < l3 && l3 < l2) || (l2 < l3 && l3 < l1);
    bool colonneEntre = (c1 < c3 && c3 < c2) || (c2 < c3 && c3 < c1);

    bool possible;
    if (dl == 0) {
        // Le long d'une ligne.
        possible = !(ol == 0 && colonneEntre);
    } else if (dc == 0) {
        // Le long d'une colonne.
        possible = !(oc == 0 && ligneEntre);
    } else if (dl == dc) {
        // Diagonale : ligne et colonne changent dans le même sens.
        possible = !(ol == oc && ligneEntre);
    } else if (dl == -dc) {
        // Diagonale : ligne et colonne changent en sens contraires.
        possible = !(ol == -oc && ligneEntre);
    } else {
        // La case n'est dans aucune direction de la dame.
        possible = false;
    }

    if (possible) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
