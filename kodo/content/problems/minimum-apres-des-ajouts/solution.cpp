#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

const long long INFINI = 1LL << 62;
int taille;
// Nœud k : fils 2k et 2k + 1 ; les feuilles sont aux indices taille à 2 × taille - 1.
// mini[k] et nb[k] : minimum de l'intervalle du nœud et nombre de cases qui l'atteignent,
// ajouts compris. ajout[k] : valeur ajoutée à tout l'intervalle, pas encore transmise aux fils.
vector<long long> mini, ajout;
vector<int> nb;

// Combine deux couples (minimum, nombre).
pair<long long, int> combine(long long m1, int c1, long long m2, int c2) {
    if (m1 < m2) return {m1, c1};
    if (m2 < m1) return {m2, c2};
    return {m1, c1 + c2};
}

void recalcule(int k) {
    auto [m, c] = combine(mini[2 * k], nb[2 * k], mini[2 * k + 1], nb[2 * k + 1]);
    mini[k] = m + ajout[k];
    nb[k] = c;
}

// Ajoute v aux cases de [l, r] ∩ [debut, fin], intervalle du nœud k.
void modifie(int k, int debut, int fin, int l, int r, long long v) {
    if (r < debut || fin < l) return;
    if (l <= debut && fin <= r) {
        mini[k] += v;  // tout le nœud est couvert : on s'arrête là
        ajout[k] += v;
        return;
    }
    int milieu = (debut + fin) / 2;
    modifie(2 * k, debut, milieu, l, r, v);
    modifie(2 * k + 1, milieu + 1, fin, l, r, v);
    recalcule(k);
}

// (minimum, nombre) sur [l, r] ∩ [debut, fin], sans les ajouts des ancêtres de k.
pair<long long, int> interroge(int k, int debut, int fin, int l, int r) {
    if (r < debut || fin < l) return {INFINI, 0};
    if (l <= debut && fin <= r) return {mini[k], nb[k]};
    int milieu = (debut + fin) / 2;
    auto [m1, c1] = interroge(2 * k, debut, milieu, l, r);
    auto [m2, c2] = interroge(2 * k + 1, milieu + 1, fin, l, r);
    auto [m, c] = combine(m1, c1, m2, c2);
    return {m + ajout[k], c};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    taille = 1;
    while (taille < n) taille *= 2;
    mini.assign(2 * taille, 0);
    ajout.assign(2 * taille, 0);
    nb.assign(2 * taille, 0);
    for (int i = 0; i < taille; i++) {
        nb[taille + i] = 1;
        if (i >= n) mini[taille + i] = INFINI;  // cases en trop : jamais minimales
    }
    for (int k = taille - 1; k >= 1; k--) recalcule(k);

    for (int i = 0; i < q; i++) {
        string type;
        int l, r;
        cin >> type >> l >> r;
        if (type == "+") {
            long long v;
            cin >> v;
            modifie(1, 1, taille, l, r, v);
        } else {
            auto [m, c] = interroge(1, 1, taille, l, r);
            cout << m << " " << c << "\n";
        }
    }
    return 0;
}
