#include <iostream>
#include <cstdlib>
using namespace std;

int anneau(int n) {
    // Le carré de côté 2k + 1 centré sur 1 contient les nombres de 1 à (2k + 1)².
    // n est sur l'anneau k : le plus petit k tel que (2k + 1)² ≥ n.
    int k = 0;
    while ((2 * k + 1) * (2 * k + 1) < n) {
        k++;
    }
    return k;
}

int abscisse(int n) {
    // Colonne de n : 0 pour la case de 1, positive vers la droite.
    int k = anneau(n);
    if (k == 0) return 0;
    int m = n - (2 * k - 1) * (2 * k - 1);   // rang de n sur son anneau : de 1 à 8k
    if (m <= 2 * k) {           // côté droit, en montant
        return k;
    } else if (m <= 4 * k) {    // côté du haut, vers la gauche
        return k - (m - 2 * k);
    } else if (m <= 6 * k) {    // côté gauche, en descendant
        return -k;
    } else {                    // côté du bas, vers la droite
        return -k + (m - 6 * k);
    }
}

int ordonnee(int n) {
    // Ligne de n : 0 pour la case de 1, positive vers le haut.
    int k = anneau(n);
    if (k == 0) return 0;
    int m = n - (2 * k - 1) * (2 * k - 1);
    if (m <= 2 * k) {
        return -k + m;
    } else if (m <= 4 * k) {
        return k;
    } else if (m <= 6 * k) {
        return k - (m - 4 * k);
    } else {
        return -k;
    }
}

int distance(int a, int b) {
    return abs(abscisse(a) - abscisse(b)) + abs(ordonnee(a) - ordonnee(b));
}

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int a, b;
        cin >> a >> b;
        cout << distance(a, b) << "\n";
    }
    return 0;
}
