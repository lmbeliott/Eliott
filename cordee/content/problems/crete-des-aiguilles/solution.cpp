#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

// Arbre de segments (maximum) : feuilles aux indices taille .. 2*taille - 1,
// les fils du nœud k sont 2k et 2k + 1. Les feuilles en trop valent 0.
int taille = 1;
vector<int> arbre;

void modifie(int i, int v) {  // le sommet d'indice i (à partir de 0) prend l'altitude v
    int k = taille + i;
    arbre[k] = v;
    for (k /= 2; k >= 1; k /= 2) arbre[k] = max(arbre[2 * k], arbre[2 * k + 1]);
}

int premier(int i, int h) {  // premier indice j >= i d'altitude >= h, ou -1
    int k = taille + i;
    // Remontée : on saute vers la droite les blocs dont le maximum est trop petit.
    while (arbre[k] < h) {
        while (k % 2 == 1) k /= 2;  // fils droit : on remonte
        if (k == 0) return -1;      // on est sorti par la droite de l'arbre
        k += 1;                     // bloc voisin, juste à droite
    }
    // Descente : le fils gauche s'il convient, sinon le droit.
    while (k < taille) k = (arbre[2 * k] >= h) ? 2 * k : 2 * k + 1;
    return k - taille;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    while (taille < n) taille *= 2;
    arbre.assign(2 * taille, 0);
    for (int i = 0; i < n; i++) cin >> arbre[taille + i];
    for (int k = taille - 1; k >= 1; k--) arbre[k] = max(arbre[2 * k], arbre[2 * k + 1]);

    for (int t = 0; t < q; t++) {
        char op;
        int a, b;
        cin >> op >> a >> b;
        if (op == 'M') {
            modifie(a - 1, b);
        } else {
            int j = premier(a - 1, b);
            cout << (j >= 0 ? j + 1 : -1) << "\n";
        }
    }
    return 0;
}
