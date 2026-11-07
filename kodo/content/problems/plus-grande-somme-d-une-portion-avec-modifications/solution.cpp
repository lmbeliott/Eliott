#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

const long long MOINS_INFINI = -1000000000000000LL;

// Informations sur un intervalle : somme totale, meilleur préfixe, meilleur suffixe,
// meilleure portion (non vides).
struct Noeud {
    long long somme, pref, suff, best;
};

const Noeud NEUTRE = {0, MOINS_INFINI, MOINS_INFINI, MOINS_INFINI};

// Intervalle g suivi de l'intervalle d.
Noeud combine(const Noeud& g, const Noeud& d) {
    return {g.somme + d.somme, max(g.pref, g.somme + d.pref), max(d.suff, d.somme + g.suff),
            max({g.best, d.best, g.suff + d.pref})};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    int taille = 1;
    while (taille < n) taille *= 2;
    vector<Noeud> arbre(2 * taille, NEUTRE);  // les feuilles en trop restent neutres
    for (int i = 0; i < n; i++) {
        long long v;
        cin >> v;
        arbre[taille + i] = {v, v, v, v};
    }
    for (int k = taille - 1; k >= 1; k--) arbre[k] = combine(arbre[2 * k], arbre[2 * k + 1]);

    for (int i = 0; i < q; i++) {
        int t, x, y;
        cin >> t >> x >> y;
        if (t == 1) {
            // Modification de la case x : on change la feuille puis on remonte.
            int k = taille + x - 1;
            arbre[k] = {y, y, y, y};
            for (k /= 2; k >= 1; k /= 2) arbre[k] = combine(arbre[2 * k], arbre[2 * k + 1]);
        } else {
            // Question sur [x, y] : on combine les nœuds de gauche à droite.
            Noeud gauche = NEUTRE, droite = NEUTRE;
            for (int l = taille + x - 1, r = taille + y; l < r; l /= 2, r /= 2) {
                if (l & 1) gauche = combine(gauche, arbre[l++]);
                if (r & 1) droite = combine(arbre[--r], droite);
            }
            cout << combine(gauche, droite).best << "\n";
        }
    }
    return 0;
}
