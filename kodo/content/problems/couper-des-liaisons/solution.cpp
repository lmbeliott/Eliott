#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>
using namespace std;

vector<int> parent, taille;
int plusGrande = 1;

int trouver(int x) {
    int racine = x;
    while (parent[racine] != racine) racine = parent[racine];
    while (parent[x] != racine) {
        int suivant = parent[x];
        parent[x] = racine;
        x = suivant;
    }
    return racine;
}

void unir(int a, int b) {
    a = trouver(a);
    b = trouver(b);
    if (a == b) return;
    if (taille[a] < taille[b]) swap(a, b);
    parent[b] = a;
    taille[a] += taille[b];
    plusGrande = max(plusGrande, taille[a]);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q;
    cin >> n >> m >> q;
    vector<int> a(m), b(m), coupures(q);
    for (int i = 0; i < m; i++) cin >> a[i] >> b[i];
    for (int& e : coupures) {
        cin >> e;
        e--;
    }
    parent.resize(n + 1);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n + 1, 1);

    // état final : toutes les liaisons sauf celles qui seront coupées
    vector<bool> coupee(m, false);
    for (int e : coupures) coupee[e] = true;
    for (int e = 0; e < m; e++)
        if (!coupee[e]) unir(a[e], b[e]);

    // on remonte le temps : couper la liaison i, c'est l'ajouter quand on va à l'envers
    vector<int> reponse(q);
    for (int i = q - 1; i >= 0; i--) {
        reponse[i] = plusGrande;
        unir(a[coupures[i]], b[coupures[i]]);
    }
    for (int i = 0; i < q; i++) cout << reponse[i] << (i + 1 == q ? "\n" : " ");
    return 0;
}
