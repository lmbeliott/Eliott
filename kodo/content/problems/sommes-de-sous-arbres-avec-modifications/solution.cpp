#include <iostream>
#include <vector>
using namespace std;

int n;
vector<long long> arbre;  // arbre de Fenwick sur les positions du parcours

void ajoute(int i, long long x) {
    for (; i <= n; i += i & -i) arbre[i] += x;
}

long long prefixe(int i) {
    long long s = 0;
    for (; i > 0; i -= i & -i) s += arbre[i];
    return s;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> n >> q;
    vector<long long> valeur(n + 1);
    for (int v = 1; v <= n; v++) cin >> valeur[v];
    vector<vector<int>> enfants(n + 1);
    for (int v = 2; v <= n; v++) {
        int p;
        cin >> p;
        enfants[p].push_back(v);
    }

    // Parcours en profondeur sans récursion : le sous-arbre de v occupe exactement
    // les positions debut[v] .. fin[v] de l'ordre de visite.
    vector<int> debut(n + 1), fin(n + 1), pile = {1};
    int compteur = 0;
    while (!pile.empty()) {
        int v = pile.back();
        pile.pop_back();
        if (v > 0) {
            debut[v] = ++compteur;
            pile.push_back(-v);  // marqueur : on repassera par v après son sous-arbre
            for (int e : enfants[v]) pile.push_back(e);
        } else {
            fin[-v] = compteur;
        }
    }

    arbre.assign(n + 1, 0);
    for (int v = 1; v <= n; v++) ajoute(debut[v], valeur[v]);

    for (int i = 0; i < q; i++) {
        int t, v;
        cin >> t >> v;
        if (t == 1) {
            long long x;
            cin >> x;
            ajoute(debut[v], x - valeur[v]);  // on ajoute la différence
            valeur[v] = x;
        } else {
            cout << prefixe(fin[v]) - prefixe(debut[v] - 1) << "\n";
        }
    }
    return 0;
}
